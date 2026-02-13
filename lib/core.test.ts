import { describe, it, expect, beforeEach } from 'vitest';
import { createRuntime } from './core';
import { createVanillaStore } from './store';
import { FieldSchema } from '../types';

/**
 * Unit Tests for Formx Runtime Engine
 * Focus: Safe Evaluation Mode (No `new Function`) & Dependency Graph
 */
describe('RuntimeEngine (Safe Mode)', () => {
  
  // Helper to quickly setup engine with schema and initial state
  const setupEngine = (schema: FieldSchema[], initialState: any = {}) => {
    const store = createVanillaStore(initialState);
    const engine = createRuntime({ schema, store });
    return { engine, store };
  };

  describe('Basic Arithmetic Operations', () => {
    it('should handle simple addition', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'result', type: 'NUMBER', label: 'Res', expression: 'a + b' }
      ];
      const { engine, store } = setupEngine(schema, { a: 10, b: 5, result: 0 });
      
      // Trigger calculation
      engine.setValue('a', 20);
      
      expect(store.getState().result).toBe(25);
    });

    it('should handle subtraction', () => {
      const schema: FieldSchema[] = [
        { key: 'x', type: 'NUMBER', label: 'X' },
        { key: 'y', type: 'NUMBER', label: 'Y' },
        { key: 'diff', type: 'NUMBER', label: 'Diff', expression: 'x - y' }
      ];
      const { engine, store } = setupEngine(schema, { x: 100, y: 30, diff: 0 });
      
      engine.setValue('y', 40);
      expect(store.getState().diff).toBe(60);
    });

    it('should handle multiplication', () => {
      const schema: FieldSchema[] = [
        { key: 'price', type: 'NUMBER', label: 'Price' },
        { key: 'qty', type: 'NUMBER', label: 'Qty' },
        { key: 'total', type: 'NUMBER', label: 'Total', expression: 'price * qty' }
      ];
      const { engine, store } = setupEngine(schema, { price: 10, qty: 5, total: 0 });
      
      engine.setValue('price', 12);
      expect(store.getState().total).toBe(60);
    });

    it('should handle division', () => {
      const schema: FieldSchema[] = [
        { key: 'total', type: 'NUMBER', label: 'Total' },
        { key: 'count', type: 'NUMBER', label: 'Count' },
        { key: 'avg', type: 'NUMBER', label: 'Avg', expression: 'total / count' }
      ];
      const { engine, store } = setupEngine(schema, { total: 100, count: 4, avg: 0 });
      
      engine.setValue('count', 5);
      expect(store.getState().avg).toBe(20);
    });

    it('should handle decimals', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a * 1.5' }
      ];
      const { engine, store } = setupEngine(schema, { a: 10, res: 0 });
      
      engine.setValue('a', 3);
      expect(store.getState().res).toBe(4.5);
    });
  });

  describe('Order of Operations (Precedence)', () => {
    it('should prioritize multiplication over addition', () => {
      // 10 + 2 * 5 should be 20, not 60
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'c', type: 'NUMBER', label: 'C' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a + b * c' }
      ];
      const { engine, store } = setupEngine(schema, { a: 10, b: 2, c: 5, res: 0 });
      
      // Trigger update
      engine.setValue('c', 6); // 10 + 2 * 6 = 22
      expect(store.getState().res).toBe(22);
    });

    it('should prioritize parentheses', () => {
      // (10 + 2) * 5 should be 60
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'c', type: 'NUMBER', label: 'C' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: '(a + b) * c' }
      ];
      const { engine, store } = setupEngine(schema, { a: 10, b: 2, c: 5, res: 0 });
      
      engine.setValue('c', 6); // (10 + 2) * 6 = 72
      expect(store.getState().res).toBe(72);
    });
    
    it('should handle nested parentheses', () => {
       // ((2 + 3) * 2) + 1 = 11
       const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: '((a + 3) * 2) + 1' }
      ];
      const { engine, store } = setupEngine(schema, { a: 0, res: 0 });
      
      engine.setValue('a', 2);
      expect(store.getState().res).toBe(11);
    });
  });

  describe('Aggregation (SUM)', () => {
    const listSchema: FieldSchema[] = [
      {
        key: 'items',
        type: 'CARD_LIST',
        label: 'Items',
        card: {
          sections: [
            {
              fields: [
                 { key: 'price', type: 'NUMBER', label: 'Price' },
                 { key: 'qty', type: 'NUMBER', label: 'Qty' },
                 { key: 'amount', type: 'NUMBER', label: 'Amt', expression: 'price * qty' }
              ]
            }
          ]
        }
      },
      {
        key: 'grand_total',
        type: 'NUMBER',
        label: 'Total',
        expression: 'SUM(items.amount)'
      }
    ];

    it('should calculate row amount correctly', () => {
      const { engine, store } = setupEngine(listSchema, {
        items: [{ price: 10, qty: 2, amount: 0 }],
        grand_total: 0
      });

      // Update row 0 price
      engine.setValue('items.0.price', 20);
      
      // Row amount should update: 20 * 2 = 40
      expect(store.getState().items[0].amount).toBe(40);
    });

    it('should aggregate total from multiple rows', () => {
       const { engine, store } = setupEngine(listSchema, {
        items: [
          { price: 10, qty: 1, amount: 10 },
          { price: 20, qty: 2, amount: 40 }
        ],
        grand_total: 50 // Initial state matches
      });

      // Update row 0: price 10 -> 100. New row amount: 100.
      // Expected Total: 100 + 40 = 140.
      engine.setValue('items.0.price', 100);

      expect(store.getState().items[0].amount).toBe(100);
      expect(store.getState().grand_total).toBe(140);
    });

    it('should update total when adding a row', () => {
      const { engine, store } = setupEngine(listSchema, {
        items: [
          { price: 10, qty: 1, amount: 10 }
        ],
        grand_total: 10
      });

      const currentItems = store.getState().items;
      // Add new item
      engine.setValue('items', [
        ...currentItems,
        { price: 5, qty: 4, amount: 0 } // Init amount 0, engine should calc it if triggered?
      ]);

      // NOTE: Simply adding a row to store via setValue doesn't auto-trigger row-level calculation for the *new* row 
      // unless the engine has a mechanism to init new rows. 
      // In this basic version, we might need to trigger a field update or ensure data is reactive.
      // However, SUM(items.amount) depends on `items`. 
      // If we passed amount: 20 manually, SUM should pick it up.
      
      // Let's manually trigger a calc on the new row for this test, 
      // or set the value with the correct amount first.
      
      // To test the graph dependency: `items` changed -> `grand_total` depends on `items`.
      // The SUM function iterates `items`.
      
      // Let's set it with 0 amount first.
      expect(store.getState().grand_total).toBe(10); // Calculation might happen on next tick or immediate?
      
      // Trigger an update inside the new row to force recalcs
      engine.setValue('items.1.amount', 20); // Manually setting computed for this test context or
      // Better: Update price of new row
      engine.setValue('items.1.price', 5); // Trigger dependency flow
      
      // items.1.price -> items.1.amount (5*4=20) -> items (changed) -> grand_total (10+20=30)
      expect(store.getState().items[1].amount).toBe(20);
      expect(store.getState().grand_total).toBe(30);
    });
  });

  describe('Edge Cases', () => {
     it('should handle negative numbers in expressions', () => {
       const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a * -1' }
      ];
      const { engine, store } = setupEngine(schema, { a: 10, res: 0 });
      
      // 10 * -1
      engine.setValue('a', 10);
      expect(store.getState().res).toBe(-10);
     });
     
     it('should default missing variables to 0', () => {
       const schema: FieldSchema[] = [
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'unknown_var + 10' }
      ];
      const { engine, store } = setupEngine(schema, { res: 0 });
      
      const schema2: FieldSchema[] = [
          { key: 'a', type: 'NUMBER', label: 'A' },
          { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a + 5' }
      ];
      const { engine: engine2, store: store2 } = setupEngine(schema2, { res: 0 });
      
      engine2.setValue('a', undefined);
      expect(store2.getState().res).toBe(5);
     });

     it('should handle null values as 0', () => {
       const schema: FieldSchema[] = [
          { key: 'a', type: 'NUMBER', label: 'A' },
          { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a + 5' }
      ];
      const { store } = setupEngine(schema, { a: null, res: 0 });
      expect(store.getState().res).toBe(5);
     });

     it('should handle NaN values as 0', () => {
       const schema: FieldSchema[] = [
          { key: 'a', type: 'NUMBER', label: 'A' },
          { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a + 5' }
      ];
      const { store } = setupEngine(schema, { a: NaN, res: 0 });
      expect(store.getState().res).toBe(5);
     });

     it('should handle NA string values as 0', () => {
       const schema: FieldSchema[] = [
          { key: 'a', type: 'NUMBER', label: 'A' },
          { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a + 5' }
      ];
      const { store } = setupEngine(schema, { a: 'NA', res: 0 });
      expect(store.getState().res).toBe(5);
     });
  });

  describe('Math Functions (v2.0)', () => {
    it('should handle Math.pow', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.pow(a, b)' }
      ];
      const { store } = setupEngine(schema, { a: 2, b: 3, res: 0 });
      expect(store.getState().res).toBe(8);
    });

    it('should handle Math.round', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.round(a)' }
      ];
      const { store } = setupEngine(schema, { a: 3.7, res: 0 });
      expect(store.getState().res).toBe(4);
    });

    it('should handle Math.floor', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.floor(a)' }
      ];
      const { store } = setupEngine(schema, { a: 3.9, res: 0 });
      expect(store.getState().res).toBe(3);
    });

    it('should handle Math.ceil', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.ceil(a)' }
      ];
      const { store } = setupEngine(schema, { a: 3.1, res: 0 });
      expect(store.getState().res).toBe(4);
    });

    it('should handle Math.abs', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.abs(a)' }
      ];
      const { store } = setupEngine(schema, { a: -5, res: 0 });
      expect(store.getState().res).toBe(5);
    });

    it('should handle Math.max', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.max(a, b)' }
      ];
      const { store } = setupEngine(schema, { a: 10, b: 20, res: 0 });
      expect(store.getState().res).toBe(20);
    });

    it('should handle Math.min', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'Math.min(a, b)' }
      ];
      const { store } = setupEngine(schema, { a: 10, b: 20, res: 0 });
      expect(store.getState().res).toBe(10);
    });
  });

  describe('Comparison Operators (v2.0)', () => {
    it('should handle > operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a > b' }
      ];
      const { store } = setupEngine(schema, { a: 10, b: 5, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle < operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a < b' }
      ];
      const { store } = setupEngine(schema, { a: 5, b: 10, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle >= operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a >= b' }
      ];
      const { store } = setupEngine(schema, { a: 10, b: 10, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle <= operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a <= b' }
      ];
      const { store } = setupEngine(schema, { a: 5, b: 5, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle == operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a == b' }
      ];
      const { store } = setupEngine(schema, { a: 5, b: 5, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle != operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a != b' }
      ];
      const { store } = setupEngine(schema, { a: 5, b: 10, res: false });
      expect(store.getState().res).toBe(true);
    });
  });

  describe('Logical Operators (v2.0)', () => {
    it('should handle && operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'BOOLEAN', label: 'A' },
        { key: 'b', type: 'BOOLEAN', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a && b' }
      ];
      const { store } = setupEngine(schema, { a: true, b: true, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle || operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'BOOLEAN', label: 'A' },
        { key: 'b', type: 'BOOLEAN', label: 'B' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: 'a || b' }
      ];
      const { store } = setupEngine(schema, { a: false, b: true, res: false });
      expect(store.getState().res).toBe(true);
    });

    it('should handle ! operator', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'BOOLEAN', label: 'A' },
        { key: 'res', type: 'BOOLEAN', label: 'Res', expression: '!a' }
      ];
      const { store } = setupEngine(schema, { a: true, res: false });
      expect(store.getState().res).toBe(false);
    });
  });

  describe('IF Function (v2.0)', () => {
    it('should return true branch when condition is true', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'IF(a > 10, 100, 0)' }
      ];
      const { store } = setupEngine(schema, { a: 15, res: 0 });
      expect(store.getState().res).toBe(100);
    });

    it('should return false branch when condition is false', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'IF(a > 10, 100, 0)' }
      ];
      const { store } = setupEngine(schema, { a: 5, res: 0 });
      expect(store.getState().res).toBe(0);
    });

    it('should handle nested IF', () => {
      const schema: FieldSchema[] = [
        { key: 'score', type: 'NUMBER', label: 'Score' },
        { key: 'grade', type: 'TEXT', label: 'Grade', expression: 'IF(score >= 90, "A", IF(score >= 80, "B", "C"))' }
      ];
      const { store } = setupEngine(schema, { score: 85, grade: '' });
      expect(store.getState().grade).toBe('B');
    });
  });

  describe('Additional Operators (v2.0)', () => {
    it('should handle modulo operator %', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a % b' }
      ];
      const { store } = setupEngine(schema, { a: 10, b: 3, res: 0 });
      expect(store.getState().res).toBe(1);
    });

    it('should handle power operator ^', () => {
      const schema: FieldSchema[] = [
        { key: 'a', type: 'NUMBER', label: 'A' },
        { key: 'b', type: 'NUMBER', label: 'B' },
        { key: 'res', type: 'NUMBER', label: 'Res', expression: 'a ^ b' }
      ];
      const { store } = setupEngine(schema, { a: 2, b: 3, res: 0 });
      expect(store.getState().res).toBe(8);
    });
  });

});