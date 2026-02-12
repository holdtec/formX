import { FieldSchema, RuntimeStore, RuntimeEngineOptions } from '../types';
import { DependencyGraph } from './graph';

/**
 * THE CORE KERNEL (v1.3 - Optimization & Safety Guards)
 * 
 * Features:
 * - Safe Evaluation (No new Function)
 * - DAG Dependency Tracking
 * - Cycle Detection
 * - Max Recursion Protection (Stack Overflow Prevention)
 * - Floating Point Epsilon Check (Oscillation Prevention)
 */
export class RuntimeEngine {
  private schema: Map<string, FieldSchema>;
  private store: RuntimeStore;
  private graph: DependencyGraph;
  private parentMap: Map<string, string>; 
  
  // Safety Guards
  private recursionDepth: number = 0;
  private readonly MAX_RECURSION_DEPTH = 50; // Hard limit to prevent stack overflow

  constructor(options: RuntimeEngineOptions) {
    this.store = options.store;
    this.schema = new Map();
    this.graph = new DependencyGraph();
    this.parentMap = new Map();

    this.initialize(options.schema);
  }

  private initialize(schema: FieldSchema[]) {
    this.registerFields(schema);
    const cycle = this.graph.detectCycle();
    if (cycle) {
      console.error(`[Core] ❌ Circular Dependency Detected: ${cycle.join(' -> ')}`);
    } else {
      console.log(`[Core] ✅ Dependency Graph Built.`);
    }
    this.evaluateAllExpressions(schema);
  }

  private evaluateAllExpressions(fields: FieldSchema[], parentKey: string | null = null) {
    fields.forEach(field => {
      if (field.expression) {
        if (parentKey) {
          const list = this.store.getState()[parentKey] || [];
          list.forEach((_: any, rowIndex: number) => {
            const targetPath = `${parentKey}.${rowIndex}.${field.key}`;
            this.evaluateField(targetPath, field.expression!, { 
              scope: 'ROW', 
              rowIndex, 
              listKey: parentKey 
            }, true);
          });
        } else {
          this.evaluateField(field.key, field.expression, { scope: 'GLOBAL' }, true);
        }
      }
      if (field.type === 'CARD_LIST' && field.card) {
        field.card.sections.forEach(section => {
          this.evaluateAllExpressions(section.fields, field.key);
        });
      }
    });
  }

  private registerFields(fields: FieldSchema[], parentKey: string | null = null) {
    fields.forEach(field => {
      this.schema.set(field.key, field);
      this.graph.addNode(field.key);
      
      if (parentKey) {
        this.parentMap.set(field.key, parentKey);
      }

      if (field.expression) {
        const dependencies = this.parseDependencies(field.expression);
        dependencies.forEach(dep => {
          const genericDep = dep.includes('.') ? dep.split('.').pop()! : dep;
          this.graph.addDependency(genericDep, field.key);
        });
      }

      if (field.type === 'CARD_LIST' && field.card) {
        field.card.sections.forEach(section => {
          this.registerFields(section.fields, field.key); 
        });
      }
    });
  }

  private parseDependencies(expression: string): string[] {
    const aggMatches = expression.match(/SUM\((.*?)\)/g);
    const aggDeps: string[] = [];
    if (aggMatches) {
        aggMatches.forEach(m => {
            const inside = m.match(/SUM\((.*?)\)/)?.[1];
            if (inside) aggDeps.push(inside);
        });
    }

    const cleanExpr = expression.replace(/SUM\((.*?)\)/g, ''); 
    const matches: string[] = cleanExpr.match(/[a-zA-Z_][a-zA-Z0-9_.]*/g) || [];
    const keywords = new Set(['Math', 'parseInt', 'parseFloat', 'Number', 'String', 'round', 'ceil', 'floor', 'max', 'min', 'SUM']);
    
    const standardDeps = matches.filter(m => !keywords.has(m) && isNaN(Number(m)) && !m.includes('.'));

    return [...aggDeps, ...standardDeps];
  }

  /**
   * Core Update Method
   * Includes 3 layers of protection against infinite loops:
   * 1. Dirty Check with Epsilon (prevents oscillation)
   * 2. Max Recursion Depth (prevents stack overflow)
   * 3. Static Cycle Detection (in initialize)
   */
  public setValue(path: string, value: any) {
    // GUARD 1: Max Recursion Depth
    if (this.recursionDepth > this.MAX_RECURSION_DEPTH) {
      console.warn(`[Core] ⚠️ Max recursion depth (${this.MAX_RECURSION_DEPTH}) exceeded. Breaking update loop for path: ${path}`);
      return; 
    }

    const currentValue = this.getDeepValue(this.store.getState(), path);
    
    // GUARD 2: Dirty Check & Epsilon
    // Optimized to handle floating point precision issues (0.1 + 0.2 !== 0.3)
    if (this.isValueEqual(currentValue, value)) {
      return;
    }

    try {
      this.recursionDepth++;
      
      this.store.batch(() => {
        this.store.setValue(path, value);
        this.triggerRecalculation(path);
      });
      
    } finally {
      this.recursionDepth--;
    }
  }

  /**
   * Helper: Loose equality check for numbers to handle floating point issues.
   */
  private isValueEqual(a: any, b: any): boolean {
     if (typeof a === 'number' && typeof b === 'number') {
        // Allow for tiny floating point differences (epsilon)
        return Math.abs(a - b) < Number.EPSILON * 1000;
     }
     // Strict equality for other types
     return a === b;
  }

  public getStore(): RuntimeStore {
    return this.store;
  }

  private triggerRecalculation(changedPath: string) {
    const parts = changedPath.split('.');
    const key = parts[parts.length - 1]; 
    const isListRow = parts.length > 1 && !isNaN(Number(parts[1]));
    const rowIndex = isListRow ? parseInt(parts[1]) : -1;
    const parentKey = isListRow ? parts[0] : null;

    const dependents = this.graph.getDirectDependents(key);

    dependents.forEach(targetKey => {
      const field = this.schema.get(targetKey);
      if (!field || !field.expression) return;

      const targetParent = this.parentMap.get(targetKey);
      
      if (isListRow && parentKey === targetParent) {
          const targetPath = `${parentKey}.${rowIndex}.${targetKey}`;
          this.evaluateField(targetPath, field.expression, { 
              scope: 'ROW', 
              rowIndex, 
              listKey: parentKey 
          });
      }
      else if (!targetParent) {
          this.evaluateField(targetKey, field.expression, { scope: 'GLOBAL' });
      }
    });
  }

  private evaluateField(targetPath: string, expression: string, context: { scope: 'ROW' | 'GLOBAL', rowIndex?: number, listKey?: string }, forceUpdate: boolean = false) {
      try {
          const state = this.store.getState();
          let result: any = null;

          if (expression.startsWith('SUM(')) {
              const match = expression.match(/SUM\((.*?)\)/);
              if (match) {
                  const fullPath = match[1]; 
                  const [listKey, fieldKey] = fullPath.split('.');
                  const list = state[listKey] || [];
                  result = list.reduce((sum: number, item: any) => {
                      const val = parseFloat(item[fieldKey]);
                      return sum + (isNaN(val) ? 0 : val);
                  }, 0);
              }
          } 
          else {
              let evalContext: any = {};
              if (context.scope === 'ROW' && context.listKey && context.rowIndex !== undefined) {
                  const list = state[context.listKey] || [];
                  evalContext = list[context.rowIndex] || {};
              } else {
                  evalContext = state;
              }

              // --- Safe Evaluation ---
              result = this.evaluateSafe(expression, evalContext);
          }

          if (result !== null && result !== undefined && !isNaN(result)) {
             const currentValue = this.getDeepValue(state, targetPath);
             if (forceUpdate || !this.isValueEqual(currentValue, result)) {
               this.store.setValue(targetPath, result);
               this.triggerRecalculation(targetPath);
             }
          }

      } catch (e) {
         // console.error(`[Core] Eval Error at ${targetPath}:`, e);
      }
  }

  /**
   * Safe Expression Evaluator
   * Supports: + - * / ( ) and variable access
   * Replaces `new Function` for MiniProgram compatibility.
   */
  private evaluateSafe(expr: string, context: any): number {
    const parsedExpr = expr.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
       const val = context[match];
       if (val === undefined || val === null || (typeof val === 'number' && isNaN(val))) {
          return '0';
       }
       if (typeof val === 'string') {
         const num = parseFloat(val);
         if (isNaN(num)) return '0';
         return String(num);
       }
       return String(val);
    });

    try {
       return this.computeBasicMath(parsedExpr);
    } catch(e) {
       return 0;
    }
  }

  // A very simple recursive parser for +, -, *, / and parentheses
  private computeBasicMath(expr: string): number {
      // Remove spaces
      expr = expr.replace(/\s+/g, '');

      // Handle Parentheses recursively
      while (expr.includes('(')) {
          expr = expr.replace(/\(([^()]+)\)/g, (_, inner) => String(this.computeBasicMath(inner)));
      }

      // Handle * and /
      const mulDivRegex = /(-?\d+(?:\.\d+)?)([\*\/])(-?\d+(?:\.\d+)?)/;
      while (mulDivRegex.test(expr)) {
          expr = expr.replace(mulDivRegex, (_, a, op, b) => {
              const n1 = parseFloat(a);
              const n2 = parseFloat(b);
              if (op === '*') return String(n1 * n2);
              if (op === '/') return String(n1 / n2);
              return '0';
          });
      }

      // Handle + and -
      const addSubRegex = /(-?\d+(?:\.\d+)?)([\+\-])(-?\d+(?:\.\d+)?)/;
      while (addSubRegex.test(expr)) {
          if (/^-?\d+(?:\.\d+)?$/.test(expr)) break;

          expr = expr.replace(addSubRegex, (_, a, op, b) => {
              const n1 = parseFloat(a);
              const n2 = parseFloat(b);
              if (op === '+') return String(n1 + n2);
              if (op === '-') return String(n1 - n2);
              return '0';
          });
      }

      return parseFloat(expr);
  }

  private getDeepValue(obj: any, path: string) {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}

export function createRuntime(options: RuntimeEngineOptions): RuntimeEngine {
  return new RuntimeEngine(options);
}