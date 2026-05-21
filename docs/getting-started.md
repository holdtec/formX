# 🚀 快速上手与集成指南

## 1. 安装方式

### 方式 A：标准 NPM / PNPM 依赖 (推荐)

在联网环境或内部私有包管理平台中，可以直接安装依赖：

```bash
# 使用 npm
npm install @enginx/formx-core

# 使用 pnpm
pnpm add @enginx/formx-core

# 使用 yarn
yarn add @enginx/formx-core
```

**在代码中引用：**
```typescript
import { createRuntime, createVanillaStore } from '@enginx/formx-core';
```

---

### 方式 B：Monorepo 或本地调试引用 (本地文件依赖)

如果您在多包仓库（Monorepo）中开发，或者想离线调试，可以直接在 `package.json` 中配置本地文件路径：

1. 进入 `packages/formx` 目录执行打包：
   ```bash
   pnpm run build:lib
   ```
2. 在您的项目 `package.json` 中指向该打包产物目录：
   ```json
   {
     "dependencies": {
       "@enginx/formx-core": "file:../path/to/genesis-financial-os/packages/formx/dist-lib"
     }
   }
   ```
3. 在项目根目录执行 `pnpm install` 或 `npm install`。包管理器会创建一个软链接，使用方式与标准 NPM 无异。

---

### 方式 C：静态文件直接拷贝引用 (无包管理器环境 / 传统 Web / 微信小程序)

在不支持包管理器、网络彻底物理隔离、或者在无法使用复杂构建的大型传统系统、微信小程序中，可以直接将编译产物拷贝使用。

#### 1. 编译库代码
在本地通过以下命令构建：
```bash
npm run build:lib
```
系统会在 `packages/formx/dist-lib` 下输出 ESM 格式的 `formx-core.js` 与 CommonJS 格式的 `formx-core.cjs`。

#### 2. 传统 Web ESM 引用
将 `formx-core.js` 拷贝至静态资源目录（如 `/static/js/formx-core.js`）：
```html
<script type="module">
  import { createRuntime, createVanillaStore } from './static/js/formx-core.js';
  
  const store = createVanillaStore({ a: 1 });
  // ...
</script>
```

#### 3. 微信小程序引用
微信小程序不支持直接引用 `node_modules` 且环境不支持 `eval`（Formx 默认的安全模式避开了 `eval`/`new Function`），可以将 `dist-lib/formx-core.js` 拷贝至小程序的 `utils/` 文件夹下，重命名为 `formx-core.js`：

```javascript
// 小程序 Page / Component 引入
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
    
    console.log(this.store.getState().total); // 输出 50
  }
});
```

---

## 2. 本地打包构建细节

核心库打包配置文件为 `vite.lib.config.ts`。构建流程如下：

```bash
pnpm run build:lib
```

生成的 `dist-lib/` 目录结构分析：
*   `formx-core.js`：现代 ESModule 导出，支持 Tree-shaking 优化，适合 Webpack 5, Vite, Rollup 以及现代浏览器直接引入。
*   `formx-core.cjs`：CommonJS 导出，支持旧版 Webpack 构建和 Node.js 后端环境直接 require。
*   `lib/` 目录：包含对应 TS 类型的自动声明文件 (`.d.ts`)。

由于核心库打包时将 `react` 与 `react-dom` 做了 External（外部化）处理，所以打包产物极其轻量（无任何多余体积悬挂）。
