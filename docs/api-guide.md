# ⚙️ 核心 API 与全量示例

## 1. Schema 元数据协议说明

`formx-core` 是基于 JSON Schema 配置驱动的。表单结构由 `FieldSchema[]` 数组定义。核心字段契约如下：

| 属性名 | 类型 | 是否必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `key` | `string` | 是 | 字段唯一标识，支持点路径（如 `items.0.price` 读写） |
| `type` | `string` | 是 | 数据类型，支持 `NUMBER`、`TEXT`、`BOOLEAN`、`MONETARY`、`CARD_LIST`、`ENUM` |
| `label` | `string` | 是 | 字段标签名称 |
| `expression`| `string` | 否 | 计算公式。配置了该字段后，其值将转为由引擎计算并设为只读 |
| `read_only` | `boolean`| 否 | 是否只读，默认 false |
| `card` | `object` | 否 | 当 `type` 为 `CARD_LIST` 时必填，声明明细卡片的 sections 和行内 fields 字段 |

---

## 2. 完整 API 使用实例

以下脚本展示了普通数据变动、条件 IF 计算、列表聚合重算、以及批量事务优化的全套流转：

```typescript
import { createRuntime, createVanillaStore } from '@enginx/formx-core';
import { FieldSchema } from './types';

// ==========================================
// 1. 声明 Form Schema 元数据
// ==========================================
const schema: FieldSchema[] = [
  // 基础输入字段
  { key: 'customerLevel', type: 'ENUM', label: '客户级别' },
  { key: 'baseDiscount', type: 'NUMBER', label: '基础折扣比例' },
  
  // 复杂的条件表达式 (支持多层 IF 条件嵌套)
  { 
    key: 'actualDiscount', 
    type: 'NUMBER', 
    label: '实际折扣', 
    read_only: true,
    expression: 'IF(customerLevel == "VIP", Math.min(baseDiscount, 0.8), 1.0)' 
  },
  
  // 嵌套的明细列表
  {
    key: 'items',
    type: 'CARD_LIST',
    label: '商品明细',
    card: {
      sections: [
        {
          fields: [
            { key: 'price', type: 'NUMBER', label: '商品单价' },
            { key: 'qty', type: 'NUMBER', label: '商品数量' },
            { 
              key: 'amount', 
              type: 'MONETARY', 
              label: '行金额', 
              expression: 'price * qty' 
            }
          ]
        }
      ]
    }
  },

  // 跨层级聚合计算 (SUM 会自动提取 items 内所有行的 amount 字段累加)
  {
    key: 'subTotal',
    type: 'MONETARY',
    label: '明细总金额',
    expression: 'SUM(items.amount)'
  },

  // 变参函数与最终金额计算
  {
    key: 'finalAmount',
    type: 'MONETARY',
    label: '应付最终金额',
    expression: 'Math.max(subTotal * actualDiscount, 0)'
  }
];

// ==========================================
// 2. 初始化数据仓库与运行内核
// ==========================================
const initialData = {
  customerLevel: 'NORMAL',
  baseDiscount: 0.75,
  items: [
    { price: 100, qty: 2, amount: 200 },
    { price: 50, qty: 4, amount: 200 }
  ],
  subTotal: 400,
  actualDiscount: 1.0,
  finalAmount: 400
};

const store = createVanillaStore(initialData);
const engine = createRuntime({ schema, store });

// ==========================================
// 3. 订阅数据状态变化 (驱动 UI 层精准刷新)
// ==========================================
const unsubscribe = store.subscribe((changedPaths) => {
  console.log('变更的数据路径:', changedPaths);
  console.log('当前最新状态:', store.getState());
});

// ==========================================
// 4. 触发计算更新
// ==========================================

// 场景一: 修改普通字段，自动触发 actualDiscount 和 finalAmount 重算
engine.setValue('customerLevel', 'VIP');

// 场景二: 修改子表行内数据，级联向上拓扑排序重算
engine.setValue('items.0.qty', 5); 
// items.0.amount (500) ➜ subTotal (700) ➜ finalAmount (525)

// 场景三: 批量更新（合并渲染）
store.batch(() => {
  engine.setValue('baseDiscount', 0.6); 
  engine.setValue('items.1.price', 10);  
});
// 该代码段虽然修改了两个字段并连锁引起了 4 个联动节点重算，但 Listener 最终只会被触发 1 次！

unsubscribe();
```

---

## 3. 大表单性能优化与最佳实践

当表单包含数千行数据且联动依赖链极长时，直接对整个页面执行重绘会带来显著卡顿。应遵循以下优化建议：

1. **利用 `changedPaths` 实行精准订阅**：
   在 `store.subscribe` 的回调中，可以通过 `changedPaths` 精确捕获到哪个字段或哪一行的哪个属性发生了变动，实现局部刷新，而不是对整个表单组件执行重新渲染。
   ```typescript
   store.subscribe((changedPaths) => {
     if (changedPaths.some(p => p.startsWith('items.'))) {
       // 仅局部刷新子表组件
     }
   });
   ```
2. **尽量将列表行内计算限制在行内**：
   表达式如 `price * qty` 仅仅依赖同一行的字段，这会只触发受影响那一行的单次拓扑重算，计算复杂度为 $O(1)$，对全局没有任何性能压力。
3. **谨慎使用跨行跨表全局聚合**：
   类似 `SUM(items.amount)` 的操作在 `items` 长度为数千时，每次子表变更都会遍历整张子表。建议配合 `store.batch` 批量添加或批量修改数据，将多次迭代压缩为一次计算。
