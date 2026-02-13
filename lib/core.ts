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

const PRECEDENCE: Record<string, number> = {
  '||': 1,
  '&&': 2,
  '==': 3, '!=': 3,
  '<': 4, '>': 4, '<=': 4, '>=': 4,
  '+': 5, '-': 5,
  '*': 6, '/': 6, '%': 6,
  '^': 7,
  '!': 8, // Unary NOT
  'u-': 9 // Unary minus (internal representation)
};

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
    // Initial evaluation disabled to prevent override of initial store values unless explicitly requested
    // this.evaluateAllExpressions(schema);
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

    const dependents = this.graph.getDirectDependents(key);

    dependents.forEach(targetKey => {
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

          // Special Handling for Aggregate Functions at the top level (Simple parsing for v1)
          // Ideally, SUM() should be a function in the parser, but it requires Array context.
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
                  evalContext = { ...state, ...list[context.rowIndex] }; // Mix global state with row state
              } else {
                  evalContext = state;
              }

              result = this.evaluateExpression(expression, evalContext);
          }

          if (result !== null && result !== undefined) {
             const currentValue = this.getDeepValue(state, targetPath);
             // Type check to avoid overwriting numbers with NaNs
             if (typeof result === 'number' && isNaN(result)) return;

             if (forceUpdate || !this.isValueEqual(currentValue, result)) {
               this.store.setValue(targetPath, result);
               // Chain reaction
               this.triggerRecalculation(targetPath);
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
      if ('+-*/%^!><'.includes(char)) {
        tokens.push({ type: 'OPERATOR', value: char });
        i++;
        continue;
      }

      // Parentheses & Comma
      if (char === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue; }
      if (char === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue; }
      if (char === ',') { tokens.push({ type: 'COMMA', value: ',' }); i++; continue; }

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
      else if (token.type === 'COMMA') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
          outputQueue.push(operatorStack.pop()!);
        }
      }
      else if (token.type === 'OPERATOR') {
        // Handle Unary Minus: If '-' is at start or follows an operator/LPAREN
        let isUnary = false;
        if (token.value === '-') {
          const prev = tokens[index - 1];
          if (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN' || prev.type === 'COMMA') {
            isUnary = true;
          }
        }
        
        const currentOpValue = isUnary ? 'u-' : token.value;
        const currentPrec = PRECEDENCE[currentOpValue] || 0;

        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === 'LPAREN') break;
          
          const topPrec = PRECEDENCE[top.value] || 0;
          // Associativity: standard math is Left-to-Right (except exponentiation)
          // If precedence of top is >= current, pop.
          if (topPrec >= currentPrec) {
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
        let val = context[token.value];
        // Special case: handle "Math.PI" etc if user uses it as variable
        if (token.value.startsWith('Math.')) {
           const prop = token.value.split('.')[1];
           val = (Math as any)[prop];
        }
        // treat undefined/null as 0 for math safety, unless it's strictly logic
        if (val === undefined || val === null) val = 0;
        // Try parsing string number if possible
        if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
            val = parseFloat(val);
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
            case '==': stack.push(a == b); break; // loose equality for "5" == 5
            case '!=': stack.push(a != b); break;
            case '&&': stack.push(a && b); break;
            case '||': stack.push(a || b); break;
          }
        }
      }
      else if (token.type === 'FUNCTION') {
        // We don't strictly know arg count from RPN, 
        // but for standard functions we know.
        // A generic solution would track arg count in the stack, but simple map works for v1.
        const funcName = token.value.toUpperCase().replace('MATH.', '');
        
        // Helper to pop N args
        const popArgs = (n: number) => {
            const args = [];
            for(let i=0; i<n; i++) args.unshift(stack.pop());
            return args;
        };

        switch (funcName) {
            case 'MAX': {
                // MAX is variadic. In RPN variadic is hard without marking. 
                // For this implementation, let's assume binary or use specific logic.
                // A cheat for RPN variadic functions is checking stack depth or special markers.
                // To keep it safe/simple for now, we assume 2 arguments for MAX/MIN or array.
                // Or better: The tokenizer sees `MAX(a, b, c)`.
                // Standard RPN implies operator arity.
                // Let's implement fixed arity common functions for now.
                const b = stack.pop();
                const a = stack.pop(); 
                stack.push(Math.max(a, b)); 
                break;
            }
            case 'MIN': {
                const b = stack.pop();
                const a = stack.pop(); 
                stack.push(Math.min(a, b)); 
                break;
            }
            case 'POW': {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(Math.pow(a, b));
                break;
            }
            case 'ROUND': {
                const a = stack.pop();
                stack.push(Math.round(a));
                break;
            }
            case 'FLOOR': {
                const a = stack.pop();
                stack.push(Math.floor(a));
                break;
            }
            case 'CEIL': {
                const a = stack.pop();
                stack.push(Math.ceil(a));
                break;
            }
            case 'ABS': {
                const a = stack.pop();
                stack.push(Math.abs(a));
                break;
            }
            case 'IF': {
                // IF(condition, trueVal, falseVal)
                const falseVal = stack.pop();
                const trueVal = stack.pop();
                const condition = stack.pop();
                stack.push(condition ? trueVal : falseVal);
                break;
            }
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
