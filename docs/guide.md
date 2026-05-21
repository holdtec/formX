# @enginx/formx-core 开发者集成与使用指南

`@enginx/formx-core` 是一个 **Schema 驱动**、**可插拔**、**框架无关** 的复杂表单/单据计算运行时引擎（Cell Runtime）。它将表单交互视为一个“有向无环图的计算问题”，旨在解决复杂联动、嵌套列表聚合计算（如明细表合计）、多端逻辑复用等痛点。

---

## 1. 核心架构设计

`formx-core` 遵循经典的 **无头（Headless）架构** 与 **单向数据流** 设计：

```
┌───────────────────────────────────────────────┐
│              Blueprint Schema                 │ (配置声明: 字段类型、校验、联动计算表达式)
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│            RuntimeEngine (内核)               │ ◄───────┐
│   - DependencyGraph (依赖拓扑排序)             │         │
│   - Safe Evaluation (不依赖 eval 的语法解析器)   │         │
│   - Recursion & Float Guards                  │         │ 1. setValue(path, value)
└───────────────────────┬───────────────────────┘         │    (用户修改/触发事件)
                        │                                 │
                        ▼ (2. 拓扑级联计算，更新状态)       │
┌───────────────────────────────────────────────┐         │
│                 RuntimeStore                  │         │
│       (状态存储容器，支持 Vanilla/Zustand 等)   ├─────────┘
└───────────────────────┬───────────────────────┘
                        │
                        ▼ (3. 状态订阅，精准更新)
┌───────────────────────────────────────────────┐
│                UI Render Layer                │ (哑渲染层: React / Vue / 小程序)
└───────────────────────────────────────────────┘
```

---

## 2. 库的编译与打包

在需要离线分发或提取编译产物时，可对库进行本地打包：

```bash
# 切换到包目录下
cd packages/formx

# 执行打包命令
npm run build:lib
# 或者使用 pnpm
pnpm run build:lib
```

**编译产物分析：**
打包后会生成 `dist-lib/` 目录，其中包含：
*   `formx-core.js` (ESModule 格式，用于现代 bundler 或浏览器直接 `import`)
*   `formx-core.cjs` (CommonJS 格式，用于 Node.js 环境或旧版打包工具)
*   `formx-core.js.map` / `formx-core.cjs.map` (SourceMap 调试地图)
*   `lib/index.d.ts` 等类型声明目录 (完整的 TypeScript 类型定义支持)

---

## 3. 集成与引用方法

`@enginx/formx-core` 支持以下三种主流引用方式：

### 方式 A：标准 NPM 引用 (推荐)

在能够连接私有 NPM 源或该库已发布至包管理平台时使用：

```bash
npm install @enginx/formx-core
# 或
pnpm add @enginx/formx-core
```

**代码引用：**
```typescript
import { createRuntime, createVanillaStore } from '@enginx/formx-core';
```

---

### 方式 B：本地离线文件引用 (Monorepo 或本地开发)

无需发布 NPM 包，在其他本地项目（或同仓库下的其他 package）中直接引用 `formx-core` 的编译目录。

编辑你项目的 `package.json`：
```json
{
  "dependencies": {
    "@enginx/formx-core": "file:../path/to/genesis-financial-os/packages/formx/dist-lib"
  }
}
```
保存后，在项目根目录执行 `npm install` 或 `pnpm install`。包管理器会在 `node_modules` 中创建一个软链接指向编译产物，代码引用方式与标准 NPM 完全一致。

---

### 方式 C：纯离线静态拷贝引用 (无 NPM 环境 / 传统项目 / 微信小程序)

在不支持包管理器、或者网络绝对隔离的环境下，可以直接将编译产物拷贝到项目目录中。

#### 1. 浏览器 ESM 引入
将 `dist-lib/formx-core.js` 复制到项目的静态资源目录中（如 `/static/js/formx-core.js`）：
```html
<script type="module">
  import { createRuntime, createVanillaStore } from './static/js/formx-core.js';
  
  const store = createVanillaStore({ a: 1 });
  // ...
</script>
```

#### 2. 微信小程序引入
由于微信小程序不支持直接引用 `node_modules` 且不支持 `eval`（Formx 默认的安全模式完美避开了 `eval`/`new Function`），可以将 `dist-lib/formx-core.js` 拷贝至小程序的 `utils/` 文件夹下，重命名为 `formx-core.js`，然后直接引用：

```javascript
// 小程序中引用 (ESM 方式)
import { createRuntime, createVanillaStore } from '../../utils/formx-core.js';

Page({
  onLoad() {
    this.store = createVanillaStore({ price: 10, qty: 5 });
    this.engine = createRuntime({
      schema: [
        { key: 'price', type: 'NUMBER', label: '单价' },
        { key: 'qty', type: 'NUMBER', label: '数量' },
        { key: 'total', type: 'NUMBER', label: '总价', expression: 'price * qty' }
      ],
      store: this.store
    });
    console.log(this.store.getState().total); // 50
  }
});
```

---

## 4. 核心 API 说明与全量使用示例

下面展示一个包含**普通字段、计算公式、嵌套列表、变参函数、聚合计算及事务批处理**的完整示例：

```typescript
import { createRuntime, createVanillaStore } from '@enginx/formx-core';
import { FieldSchema } from './types'; // 根据实际路径导入类型

// ==========================================
// 1. 声明 Schema 定义元数据
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
  
  // 嵌套的卡片列表（明细表项目）
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
            // 行内联动计算
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

  // 跨层级聚合计算 (SUM 会提取 items 中所有行的 amount 字段进行累加)
  {
    key: 'subTotal',
    type: 'MONETARY',
    label: '明细总金额',
    expression: 'SUM(items.amount)'
  },

  // 变参函数与最终金额计算 (支持 Math.max/Math.min 传入任意数量的参数进行比对)
  {
    key: 'finalAmount',
    type: 'MONETARY',
    label: '应付最终金额',
    expression: 'Math.max(subTotal * actualDiscount, 0)'
  }
];

// ==========================================
// 2. 初始化数据仓库 (Store) 与 引擎 (Runtime)
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
// 3. 订阅数据状态变化 (用于驱动 UI 更新)
// ==========================================
const unsubscribe = store.subscribe((changedPaths) => {
  console.log('数据变动路径:', changedPaths);
  console.log('当前最新状态:', store.getState());
});

// ==========================================
// 4. 触发计算联动
// ==========================================

console.log('--- 场景一: 修改普通字段触发联动 ---');
// 修改客户级别为 VIP，应自动计算出 actualDiscount 为 0.75 (VIP 享受折扣，且不超过限制)，从而 finalAmount = 400 * 0.75 = 300
engine.setValue('customerLevel', 'VIP');

console.log('--- 场景二: 修改子表行内数据触发级联拓扑计算 ---');
// 修改 items 第一行的数量。 
// 依赖链路: items.0.qty(修改) ➜ items.0.amount(行金额重算) ➜ subTotal(子表求和) ➜ finalAmount(最终折后金额)
// 拓扑排序能保证中间的各个依赖节点仅被计算一次，避免发生“毛刺重绘”现象。
engine.setValue('items.0.qty', 5); 
// 结果：
// items.0.amount 变为 500 (100 * 5)
// subTotal 变为 700 (500 + 200)
// finalAmount 变为 525 (700 * 0.75)

console.log('--- 场景三: 批量事务更新 (Batching) ---');
// 连续修改多个数据时，如果直接依次 setValue 可能会引发多次 UI 渲染。
// 通过 store.batch 包装，内部的所有变更通知将被缓存去重，只会在 block 结束后向 UI 层发送单次通知。
store.batch(() => {
  engine.setValue('baseDiscount', 0.6); // 实际折扣将变成 0.6
  engine.setValue('items.1.price', 10);  // items.1.amount 变成 40，subTotal 变成 540
});
// 此时订阅函数只会触发一次，最终 finalAmount 变成 324 (540 * 0.6)

// 卸载订阅器
unsubscribe();
```

---

## 5. 计算公式与语法说明

`formx-core` 自研的表达式解析器支持以下语法，安全级别高且兼容微信小程序：

### 运算符支持
| 运算符 | 类别 | 示例 | 备注 |
| :--- | :--- | :--- | :--- |
| `+ - * / % ^` | 算术运算 | `a * b - c % d ^ e` | `^` 表示幂次方 |
| `> < >= <= == !=`| 比较运算 | `a >= 100 && b != 0` | 返回 `true` 或 `false` |
| `&& \|\| !` | 逻辑运算 | `!(a && b) \|\| c` | 逻辑与、或、非 |
| `,` | 参数分隔符 | `Math.max(a, b, c)` | 用于向函数传递多个参数 |

### 内置函数支持
| 函数 | 参数说明 | 行为 |
| :--- | :--- | :--- |
| `IF(cond, trueVal, falseVal)` | `cond`: 布尔表达式；后面为分支值 | 当条件为真返回 `trueVal`，否则返回 `falseVal` (支持多层级嵌套) |
| `Math.max(a, b, ...)` | 支持传入**任意数量**的数值或**单个数组成员** | 返回其中的最大值。例：`Math.max(1, 5, 2)` 或 `Math.max(items.amount)` |
| `Math.min(a, b, ...)` | 支持传入**任意数量**的数值或**单个数组成员** | 返回其中的最小值。例：`Math.min(a, b)` 或 `Math.min(items.price)` |
| `SUM(list.field)` | 传入列表子属性，如 `items.amount` | 自动提取子列表中对应列的数值进行累加求和 |
| `Math.pow(base, exp)` | 底数及指数 | 幂运算 |
| `Math.round(x)` | 数值 | 四舍五入 |
| `Math.floor(x)` | 数值 | 向下取整 |
| `Math.ceil(x)` | 数值 | 向上取整 |
| `Math.abs(x)` | 数值 | 绝对值 |
| `Math.sqrt(x)` | 数值 | 平方根 |
