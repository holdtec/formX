import { FieldSchema, RuntimeStore, RuntimeEngineOptions } from '../types';
import { DependencyGraph } from './graph';

/**
 * THE CORE KERNEL (v2.0 - AST/Token Based Engine)
 * 
 * Upgrade Log:
 * - Replaced Regex-based evaluator with Shunting-yard Algorithm.
 * - Added support for Logical Operators (>, <, ==, &&, ||).
 * - Added support for Excel-like functions (IF, MAX, MIN, ROUND).
 * - maintained Safe Evaluation (No new Function).
 */

// --- Tokenizer & Parser Types ---

type TokenType = 'NUMBER' | 'STRING' | 'VARIABLE' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'FUNCTION';

interface Token {
  type: TokenType;
  value: string;
}

class _ArgsList {
  constructor(public args: any[]) {}
}

const PRECEDENCE: Record<string, number> = {
  ',': 0,
  '||': 1,
  '&&': 2,
  '==': 3, '!=': 3,
  '<': 4, '>': 4, '<=': 4, '>=': 4,
  '+': 5, '-': 5,
  '*': 6, '/': 6, '%': 6,
  '^': 7,
  'u-': 8,
  '!': 9
};

const RIGHT_ASSOCIATIVE = new Set(['^', 'u-', '!']);

export class RuntimeEngine {
  private schema: Map<string, FieldSchema>;
  private store: RuntimeStore;
  private graph: DependencyGraph;
  private parentMap: Map<string, string>; 
  
  // Safety Guards
  private recursionDepth: number = 0;
  private readonly MAX_RECURSION_DEPTH = 50; 

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
    // Initial evaluation for fields with expressions
    this.evaluateAllExpressions(schema);
  }

  private evaluateAllExpressions(schema: FieldSchema[]) {
    const inDegree = new Map<string, number>();
    this.graph.getAllNodes().forEach(node => inDegree.set(node, 0));
    
    this.graph.getAllNodes().forEach(node => {
      const dependents = this.graph.getDirectDependents(node);
      dependents.forEach(dep => {
        inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
      });
    });

    const queue: string[] = [];
    inDegree.forEach((degree, node) => {
      if (degree === 0) queue.push(node);
    });

    const order: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);
      const dependents = this.graph.getDirectDependents(current);
      dependents.forEach(dep => {
        const degree = (inDegree.get(dep) || 0) - 1;
        inDegree.set(dep, degree);
        if (degree === 0) queue.push(dep);
      });
    }

    order.forEach(key => {
      const field = this.schema.get(key);
      if (field && field.expression) {
        const parentKey = this.parentMap.get(key);
        if (parentKey) {
            const listData = this.store.getState()[parentKey] || [];
            listData.forEach((_: any, rowIndex: number) => {
                const targetPath = `${parentKey}.${rowIndex}.${key}`;
                this.evaluateField(targetPath, field.expression!, { scope: 'ROW', rowIndex, listKey: parentKey }, true);
            });
        } else {
            this.evaluateField(key, field.expression!, { scope: 'GLOBAL' }, true);
        }
      }
    });
  }

  // --- Dependency Graph Construction ---

  private registerFields(fields: FieldSchema[], parentKey: string | null = null) {
    fields.forEach(field => {
      this.schema.set(field.key, field);
      this.graph.addNode(field.key);
      
      if (parentKey) {
        this.parentMap.set(field.key, parentKey);
      }

      if (field.expression) {
        const dependencies = this.extractVariables(field.expression);
        dependencies.forEach(dep => {
          // Handle relative paths or simple keys
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

  // --- Core Update Logic ---

  public setValue(path: string, value: any) {
    // GUARD 1: Recursion Limit
    if (this.recursionDepth > this.MAX_RECURSION_DEPTH) {
      console.warn(`[Core] ⚠️ Max recursion depth (${this.MAX_RECURSION_DEPTH}) exceeded. Breaking update loop for path: ${path}`);
      return; 
    }

    const currentValue = this.getDeepValue(this.store.getState(), path);
    
    // GUARD 2: Epsilon Check
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

  private triggerRecalculation(changedPath: string) {
    const parts = changedPath.split('.');
    const key = parts[parts.length - 1]; 
    const isListRow = parts.length > 1 && !isNaN(Number(parts[1]));
    const rowIndex = isListRow ? parseInt(parts[1]) : -1;
    const parentKey = isListRow ? parts[0] : null;

    const order = this.graph.getExecutionOrder(key);

    order.forEach(targetKey => {
      const field = this.schema.get(targetKey);
      if (!field || !field.expression) return;

      const targetParent = this.parentMap.get(targetKey);
      
      // Case 1: Row-level dependency (e.g., price -> amount in same row)
      if (isListRow && parentKey === targetParent) {
          const targetPath = `${parentKey}.${rowIndex}.${targetKey}`;
          this.evaluateField(targetPath, field.expression, { 
              scope: 'ROW', 
              rowIndex, 
              listKey: parentKey 
          });
      }
      // Case 2: Global or Aggregate dependency (e.g., items.amount -> grand_total)
      else if (!targetParent) {
          this.evaluateField(targetKey, field.expression, { scope: 'GLOBAL' });
      }
    });
  }

  private evaluateField(targetPath: string, expression: string, context: { scope: 'ROW' | 'GLOBAL', rowIndex?: number, listKey?: string }, forceUpdate: boolean = false) {
      try {
          const state = this.store.getState();
          let result: any = null;

          let evalContext: any = {};
          if (context.scope === 'ROW' && context.listKey && context.rowIndex !== undefined) {
              const list = state[context.listKey] || [];
              evalContext = { ...state, ...list[context.rowIndex] }; // Mix global state with row state
          } else {
              evalContext = state;
          }

          result = this.evaluateExpression(expression, evalContext);

          if (result !== null && result !== undefined) {
             const currentValue = this.getDeepValue(state, targetPath);
             // Type check to avoid overwriting numbers with NaNs
             if (typeof result === 'number' && isNaN(result)) return;

             if (forceUpdate || !this.isValueEqual(currentValue, result)) {
               this.store.setValue(targetPath, result);
             }
          }

      } catch (e) {
          console.error(`[Core] Eval Error at ${targetPath}:`, e);
      }
  }

  // --- Advanced Expression Engine (Shunting-yard) ---

  private evaluateExpression(expr: string, context: any): any {
    const tokens = this.tokenize(expr);
    const rpn = this.shuntingYard(tokens);
    return this.executeRPN(rpn, context);
  }

  private tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    
    while (i < expr.length) {
      const char = expr[i];

      // Whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(expr[i + 1]))) {
        let numStr = '';
        while (i < expr.length && (/[0-9.]/.test(expr[i]))) {
          numStr += expr[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr });
        continue;
      }

      // Strings (Single or Double quotes)
      if (char === '"' || char === "'") {
        const quote = char;
        i++;
        let str = '';
        while (i < expr.length && expr[i] !== quote) {
          str += expr[i];
          i++;
        }
        i++; // skip closing quote
        tokens.push({ type: 'STRING', value: str });
        continue;
      }

      // Operators (Multi-char first)
      if (['>=', '<=', '==', '!=', '&&', '||'].includes(expr.substr(i, 2))) {
        tokens.push({ type: 'OPERATOR', value: expr.substr(i, 2) });
        i += 2;
        continue;
      }
      if ('+-*/%^!><,'.includes(char)) {
        tokens.push({ type: 'OPERATOR', value: char });
        i++;
        continue;
      }

      // Parentheses
      if (char === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue; }
      if (char === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue; }

      // Identifiers (Variables or Functions)
      if (/[a-zA-Z_$]/.test(char)) {
        let ident = '';
        while (i < expr.length && /[a-zA-Z0-9_$.]/.test(expr[i])) {
          ident += expr[i];
          i++;
        }
        // Check if it's a known function or context variable
        // We'll decide in the parser/evaluator, but here we can check for '(' ahead to label as FUNCTION
        // Simple lookahead
        let j = i;
        while (j < expr.length && /\s/.test(expr[j])) j++;
        if (expr[j] === '(') {
           tokens.push({ type: 'FUNCTION', value: ident });
        } else {
           tokens.push({ type: 'VARIABLE', value: ident });
        }
        continue;
      }

      // Unknown character
      i++;
    }
    return tokens;
  }

  private shuntingYard(tokens: Token[]): Token[] {
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    tokens.forEach((token, index) => {
      if (token.type === 'NUMBER' || token.type === 'STRING' || token.type === 'VARIABLE') {
        outputQueue.push(token);
      } 
      else if (token.type === 'FUNCTION') {
        operatorStack.push(token);
      }
      else if (token.type === 'OPERATOR') {
        // Handle Unary Minus: If '-' is at start or follows an operator/LPAREN
        let isUnary = false;
        if (token.value === '-') {
          const prev = tokens[index - 1];
          if (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN') {
            isUnary = true;
          }
        }
        
        const currentOpValue = isUnary ? 'u-' : token.value;
        const currentPrec = PRECEDENCE[currentOpValue] || 0;
        const isRightAssoc = RIGHT_ASSOCIATIVE.has(currentOpValue);

        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === 'LPAREN') break;
          
          const topPrec = PRECEDENCE[top.value] || 0;
          // For right-associative operators, only pop if top has higher precedence
          // For left-associative operators, pop if top has >= precedence
          const shouldPop = isRightAssoc ? (topPrec > currentPrec) : (topPrec >= currentPrec);
          if (shouldPop) {
             outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        }
        operatorStack.push({ type: 'OPERATOR', value: currentOpValue });
      }
      else if (token.type === 'LPAREN') {
        operatorStack.push(token);
      }
      else if (token.type === 'RPAREN') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.pop(); // Pop LPAREN
        // If token at top of stack is a function, pop it to queue
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
          outputQueue.push(operatorStack.pop()!);
        }
      }
    });

    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop()!);
    }

    return outputQueue;
  }

  private executeRPN(rpn: Token[], context: any): any {
    const stack: any[] = [];

    for (const token of rpn) {
      if (token.type === 'NUMBER') {
        stack.push(parseFloat(token.value));
      } 
      else if (token.type === 'STRING') {
        stack.push(token.value);
      }
      else if (token.type === 'VARIABLE') {
        let val: any;
        if (token.value.startsWith('Math.')) {
           const prop = token.value.split('.')[1];
           val = (Math as any)[prop];
        } else if (token.value.includes('.')) {
          const parts = token.value.split('.');
          const listName = parts[0];
          const fieldName = parts[1];
          if (Array.isArray(context[listName])) {
            val = context[listName].map((item: any) => {
              const num = parseFloat(item[fieldName]);
              return isNaN(num) ? 0 : num;
            });
          } else {
            val = this.getDeepValue(context, token.value);
          }
        } else {
          val = context[token.value];
        }
        
        if (!Array.isArray(val) && typeof val !== 'function') {
           if (val === undefined || val === null) val = 0;
           if (typeof val === 'number' && isNaN(val)) val = 0;
           if (typeof val === 'string') {
             const trimmed = val.trim();
             if (trimmed === '' || trimmed === 'NA' || trimmed === 'N/A' || isNaN(Number(trimmed))) {
               val = 0;
             } else {
               val = parseFloat(trimmed);
             }
           }
        }
        stack.push(val);
      }
      else if (token.type === 'OPERATOR') {
        if (token.value === 'u-') {
          const a = stack.pop();
          stack.push(-a);
        } else if (token.value === '!') {
          const a = stack.pop();
          stack.push(!a);
        } else {
          const b = stack.pop();
          const a = stack.pop();
          switch (token.value) {
            case ',': 
               if (a instanceof _ArgsList) {
                  a.args.push(b);
                  stack.push(a);
               } else {
                  stack.push(new _ArgsList([a, b]));
               }
               break;
            case '+': stack.push(a + b); break;
            case '-': stack.push(a - b); break;
            case '*': stack.push(a * b); break;
            case '/': stack.push(b === 0 ? 0 : a / b); break;
            case '%': stack.push(a % b); break;
            case '^': stack.push(Math.pow(a, b)); break;
            case '>': stack.push(a > b); break;
            case '<': stack.push(a < b); break;
            case '>=': stack.push(a >= b); break;
            case '<=': stack.push(a <= b); break;
            case '==': stack.push(a == b); break;
            case '!=': stack.push(a != b); break;
            case '&&': stack.push(a && b); break;
            case '||': stack.push(a || b); break;
          }
        }
      }
      else if (token.type === 'FUNCTION') {
        const funcName = token.value.toUpperCase().replace('MATH.', '');
        
        let args: any[] = [];
        const top = stack.pop();
        if (top instanceof _ArgsList) {
            args = top.args;
        } else if (top !== undefined) {
            args = [top];
        }

        switch (funcName) {
            case 'MAX': 
                if (args.length === 1 && Array.isArray(args[0])) {
                    stack.push(Math.max(...args[0]));
                } else {
                    stack.push(Math.max(...args));
                }
                break;
            case 'MIN':
                if (args.length === 1 && Array.isArray(args[0])) {
                    stack.push(Math.min(...args[0]));
                } else {
                    stack.push(Math.min(...args));
                }
                break;
            case 'SUM': {
                let sum = 0;
                const items = (args.length === 1 && Array.isArray(args[0])) ? args[0] : args;
                for (const num of items) {
                   sum += (typeof num === 'number' && !isNaN(num)) ? num : 0;
                }
                stack.push(sum);
                break;
            }
            case 'POW': stack.push(Math.pow(args[0], args[1])); break;
            case 'ROUND': stack.push(Math.round(args[0])); break;
            case 'FLOOR': stack.push(Math.floor(args[0])); break;
            case 'CEIL': stack.push(Math.ceil(args[0])); break;
            case 'ABS': stack.push(Math.abs(args[0])); break;
            case 'SQRT': stack.push(Math.sqrt(args[0])); break;
            case 'IF': stack.push(args[0] ? args[1] : args[2]); break;
            default:
                console.warn(`[Core] Unknown function: ${funcName}`);
                stack.push(0);
        }
      }
    }

    return stack[0];
  }

  // --- Utils ---

  private extractVariables(expr: string): string[] {
    const tokens = this.tokenize(expr);
    return tokens
      .filter(t => t.type === 'VARIABLE' && !t.value.startsWith('Math.'))
      .map(t => t.value);
  }

  private getDeepValue(obj: any, path: string) {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  private isValueEqual(a: any, b: any): boolean {
     if (typeof a === 'number' && typeof b === 'number') {
        return Math.abs(a - b) < Number.EPSILON * 1000;
     }
     return a === b;
  }

  public getStore(): RuntimeStore {
    return this.store;
  }
}

export function createRuntime(options: RuntimeEngineOptions): RuntimeEngine {
  return new RuntimeEngine(options);
}
