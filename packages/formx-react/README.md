# @enginx/formx-react

基于 React 和 TypeScript 构建的灵活、Schema 驱动的动态表单系统。这是 `@enginx/formx-core` 引擎的 React 绑定层。

## 特性

- **Schema 驱动**: 通过 JSON Schema 定义表单结构和行为
- **自动计算**: 支持 DAG 依赖追踪的表达式自动计算
- **卡片列表**: 支持复杂的嵌套表格数据结构
- **类型安全**: 完整的 TypeScript 类型支持
- **高性能**: 精确更新机制，仅重渲染受影响的字段
- **可扩展**: 支持自定义字段组件和渲染器

## 安装

```bash
npm install @enginx/formx-react @enginx/formx-core
```

## 快速开始

### 1. 定义 Schema

```typescript
import { FieldSchema } from '@enginx/formx-core';

const schema: FieldSchema[] = [
  { key: 'price', type: 'NUMBER', label: '单价' },
  { key: 'quantity', type: 'NUMBER', label: '数量' },
  { 
    key: 'total', 
    type: 'MONETARY', 
    label: '总价',
    read_only: true,
    expression: 'price * quantity'
  }
];
```

### 2. 创建表单组件

```tsx
import { FormProvider, FormField, useFieldValue } from '@enginx/formx-react';

function MyForm() {
  return (
    <FormProvider 
      schema={schema} 
      initialValues={{ price: 100, quantity: 2 }}
      onChange={(values) => console.log(values)}
    >
      <FormField fieldKey="price" />
      <FormField fieldKey="quantity" />
      <FormField fieldKey="total" />
    </FormProvider>
  );
}
```

## 核心 API

### FormProvider

表单上下文提供者，必须在表单组件的最外层使用。

```tsx
interface FormProviderProps {
  schema: FieldSchema[];           // 表单 Schema 定义
  initialValues?: Record<string, any>; // 初始值
  engine?: FormEngine;             // 可选的自定义引擎实例
  onChange?: (values: Record<string, any>) => void; // 值变化回调
  children: React.ReactNode;
}
```

### FormField

字段渲染组件，根据 Schema 中的 type 自动选择渲染器。

```tsx
interface FormFieldProps {
  fieldKey: string;        // 字段 key
  label?: string;          // 覆盖 Schema 中的 label
  placeholder?: string;    // 占位符
  disabled?: boolean;      // 禁用状态
  className?: string;      // CSS 类名
  style?: React.CSSProperties; // 内联样式
  render?: (props: FieldRenderProps) => React.ReactNode; // 自定义渲染
  component?: React.ComponentType<FieldRenderProps>; // 自定义组件
  path?: string;           // 嵌套路径 (如 "items.0.price")
}
```

### FormCardList

卡片列表组件，用于渲染嵌套的表格数据。

```tsx
interface FormCardListProps {
  fieldKey: string;        // 列表字段 key
  renderItem?: (props: CardItemProps) => React.ReactNode; // 自定义卡片渲染
  itemClassName?: string;
  containerClassName?: string;
}
```

### Hooks

#### useField

获取字段值和操作方法。

```tsx
const { value, onChange, onBlur, disabled, readOnly, field } = useField('price');
```

#### useFieldValue

仅获取字段值（性能优化版本）。

```tsx
const total = useFieldValue('total');
```

#### useFieldSetter

仅获取字段设置方法。

```tsx
const setPrice = useFieldSetter('price');
setPrice(100);
```

#### useListField

操作列表字段。

```tsx
const { items, addItem, removeItem, updateItem, moveItem } = useListField('items');
```

#### useFormEngine

获取表单引擎实例。

```tsx
const engine = useFormEngine();
const state = engine.getStore().getState();
```

## 支持的字段类型

| 类型 | 说明 | 渲染组件 |
|------|------|----------|
| TEXT | 文本 | `<input type="text" />` |
| NUMBER | 数字 | `<input type="number" />` |
| MONETARY | 货币 | `<input type="number" step="0.01" />` |
| BOOLEAN | 布尔 | `<input type="checkbox" />` |
| ENUM | 枚举 | `<select>` |
| DIMENSION | 维度 | `<input type="number" />` |
| CARD_LIST | 卡片列表 | FormCardList |
| HIDDEN | 隐藏 | 不渲染 |

## 自定义字段组件

```tsx
import { createFieldComponent, FieldRenderProps } from '@enginx/formx-react';

function CustomDatePicker({ value, onChange, disabled }: FieldRenderProps) {
  return (
    <input 
      type="date" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

createFieldComponent('DATE', CustomDatePicker);
```

## 表达式计算

Schema 中的 `expression` 字段支持自动计算。Formx v2.0 采用 **Shunting-yard 算法** 解析表达式，安全高效。

### 支持的运算符

- **算术运算**: `+`, `-`, `*`, `/`, `%`, `^`
- **比较运算**: `>`, `<`, `>=`, `<=`, `==`, `!=`
- **逻辑运算**: `&&`, `||`, `!`

### 支持的函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `Math.pow(a, b)` | 幂运算 | `Math.pow(1.05, years)` |
| `Math.round(x)` | 四舍五入 | `Math.round(total)` |
| `Math.floor(x)` | 向下取整 | `Math.floor(price)` |
| `Math.ceil(x)` | 向上取整 | `Math.ceil(ratio)` |
| `Math.abs(x)` | 绝对值 | `Math.abs(diff)` |
| `Math.max(a, b)` | 最大值 | `Math.max(a, b)` |
| `Math.min(a, b)` | 最小值 | `Math.min(a, b)` |
| `IF(cond, t, f)` | 条件函数 | `IF(level == "VIP", 0.8, 1)` |
| `SUM(list.field)` | 聚合求和 | `SUM(items.amount)` |

### 示例

```typescript
const schema: FieldSchema[] = [
  // 基础计算
  { key: 'total', type: 'MONETARY', expression: 'price * quantity' },
  
  // 复利计算
  { 
    key: 'final_amount', 
    type: 'MONETARY', 
    expression: 'principal * Math.pow(1 + rate/100, years)' 
  },
  
  // 条件折扣
  { 
    key: 'discount', 
    type: 'NUMBER', 
    expression: 'IF(amount > 10000, 10, IF(amount > 5000, 5, 0))' 
  },
  
  // 聚合计算
  { key: 'subtotal', type: 'MONETARY', expression: 'SUM(items.amount)' },
  { key: 'tax', type: 'MONETARY', expression: 'subtotal * 0.13' },
  { key: 'grand_total', type: 'MONETARY', expression: 'subtotal + tax' }
];
```

## 目录结构

```
packages/formx-react/
├── src/
│   ├── components/       # UI 组件
│   │   ├── FormField.tsx
│   │   └── FormCardList.tsx
│   ├── context/          # React Context
│   │   └── FormProvider.tsx
│   ├── hooks/            # React Hooks
│   │   └── useField.ts
│   ├── types/            # 类型定义
│   │   └── index.ts
│   └── index.ts          # 入口文件
├── dist/                 # 构建产物
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## License

MIT
