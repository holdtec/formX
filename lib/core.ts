
import { FieldSchema, RuntimeStore, RuntimeEngineOptions } from '../types';

/**
 * THE CORE KERNEL (Updated for Nested Data & Card Model)
 */
export class RuntimeEngine {
  private schema: Map<string, FieldSchema>;
  private store: RuntimeStore;
  
  // 依赖映射 now needs to be smarter. 
  // Simple map: "items.price" (generic) -> ["items.amount", "grand_total"]
  private dependencies: Map<string, string[]>;

  constructor(options: RuntimeEngineOptions) {
    this.store = options.store;
    this.schema = new Map();
    this.dependencies = new Map();

    this.initialize(options.schema);
  }

  private initialize(schema: FieldSchema[]) {
    // Flatten logic needs to handle CARD_LIST nesting recursively
    // For this demo, we just register top-level and card-level dependencies manually
    
    schema.forEach(field => {
      this.schema.set(field.key, field);
      
      // MOCK DEPENDENCY REGISTRY
      // 在真实实现中，这里会通过 AST 解析 field.expression
      
      if (field.type === 'CARD_LIST' && field.card) {
        field.card.sections.forEach(section => {
          section.fields.forEach(subField => {
             // 注册子字段依赖关系 (Mock)
             if (subField.key === 'amount') {
                // amount 依赖于 price 和 quantity
                this.registerDependency('price', 'amount');
                this.registerDependency('quantity', 'amount');
             }
          });
        });
        
        // 注册聚合依赖 (Mock)
        // grand_total 依赖于 items 列表中的 amount 变化
        this.registerDependency('amount', 'grand_total');
        this.registerDependency('items', 'grand_total'); // 增删行也会触发
      }
    });
  }

  private registerDependency(source: string, target: string) {
     if (!this.dependencies.has(source)) {
       this.dependencies.set(source, []);
     }
     this.dependencies.get(source)?.push(target);
  }

  /**
   * Set value using a path string (e.g., "project_name" or "items.0.price")
   */
  public setValue(path: string, value: any) {
    console.log(`[Core] Update: ${path} =`, value);

    this.store.batch(() => {
      this.store.setValue(path, value);
      this.triggerRecalculation(path);
    });
  }

  public getStore(): RuntimeStore {
    return this.store;
  }

  /**
   * Internal Calculation Engine (Mocked Logic for Demo)
   */
  private triggerRecalculation(changedPath: string) {
    // 1. Parse Path: "items.0.price" -> key="price", index=0
    const parts = changedPath.split('.');
    const key = parts[parts.length - 1]; // "price"
    const index = parts.length > 1 ? parseInt(parts[1]) : -1; // 0

    const state = this.store.getState();
    const dependents = this.dependencies.get(key) || [];

    dependents.forEach(targetKey => {
      // 场景 A: 行内计算 (Row-Scope Calculation)
      // price 变了 -> 计算同一行的 amount
      if (targetKey === 'amount' && index !== -1) {
         const items = [...(state.items || [])];
         const item = items[index];
         if (item) {
           const newVal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
           console.log(`[Core] Row Calc: items.${index}.amount = ${newVal}`);
           this.store.setValue(`items.${index}.amount`, newVal);
           
           // 级联触发：amount 变了，可能触发 grand_total
           this.triggerRecalculation(`items.${index}.amount`);
         }
      }

      // 场景 B: 聚合计算 (Aggregation)
      // amount 变了 -> 计算 grand_total
      if (targetKey === 'grand_total') {
         const items = state.items || [];
         const total = items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
         console.log(`[Core] Aggregation: grand_total = ${total}`);
         this.store.setValue('grand_total', total);
      }
    });
  }
}

export function createRuntime(options: RuntimeEngineOptions): RuntimeEngine {
  return new RuntimeEngine(options);
}
