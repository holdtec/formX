import React, { useState } from 'react';
import { BookOpen, Lightbulb, Play, Layers, Smartphone, Braces, FileJson, Share2, AlertTriangle, CheckCircle2, ArrowRight, FileCode, Menu, Package, Anchor, Database, Cpu, LayoutGrid, Eye, Calculator, ShieldCheck, List, Coins, Type, Box, Zap, Lock, GitMerge, Scale, XCircle, Check, HelpCircle, X } from 'lucide-react';

const DocNavItem = ({ id, label, icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active === id 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const DocIntro = ({ onNavigate }: any) => (
  <div className="space-y-6 max-w-3xl">
    <div className="border-b border-slate-100 pb-6">
       <h2 className="text-3xl font-bold text-slate-900 mb-4">核心理念 (Philosophy)</h2>
       <p className="text-lg text-slate-600 leading-relaxed">
          在构建复杂的企业级应用（如 ERP、CRM、WMS）时，表单不仅仅是 UI 输入框的集合，它们是<b>业务逻辑的载体</b>。
       </p>
    </div>

    <div className="grid grid-cols-2 gap-6 my-8">
       <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center text-red-600">
             <AlertTriangle className="w-4 h-4 mr-2"/> 传统做法的痛点
          </h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
             <li>业务逻辑散落在 UI 组件 (useEffect) 中</li>
             <li>很难复用逻辑到 Mobile 或小程序端</li>
             <li>字段联动导致 UI 频繁无效重绘</li>
             <li>复杂的嵌套数据（如明细表）难以维护</li>
          </ul>
       </div>
       <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
          <h4 className="font-bold text-slate-800 mb-2 flex items-center text-indigo-600">
             <CheckCircle2 className="w-4 h-4 mr-2"/> formx 的解决方案
          </h4>
          <ul className="text-sm text-slate-700 space-y-2 list-disc pl-4">
             <li><b>Headless:</b> UI 与逻辑完全解耦</li>
             <li><b>Schema Driven:</b> 声明式定义业务规则</li>
             <li><b>Performance:</b> 精确的依赖追踪更新</li>
             <li><b>Card Model:</b> 专为复杂的嵌套数据结构设计</li>
          </ul>
       </div>
    </div>

    <p className="text-slate-600">
       formx 将表单视为一个“计算问题”而非“渲染问题”。我们提供了一个纯逻辑内核，你可以用任何 UI 库（React, Vue, Svelte）来渲染它。
    </p>

    <div className="pt-6">
       <button onClick={() => onNavigate('start')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold flex items-center transition-colors">
          开始 5 分钟快速上手 <ArrowRight className="w-4 h-4 ml-2"/>
       </button>
    </div>
  </div>
);

const DocWhyFormx = () => (
   <div className="space-y-10 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 mb-4">技术选型对比指南</h2>
         <p className="text-slate-600 leading-relaxed">
            Formx 并非为了取代所有表单库而生。它专注于解决<b>“复杂逻辑治理”</b>与<b>“多端统一”</b>的问题。
            以下对比将帮助你判断 Formx 是否适合你的项目。
         </p>
      </div>

      {/* Comparison Table */}
      <section>
         <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Scale className="w-5 h-5 mr-2 text-indigo-600"/> 主流方案横向对比</h3>
         <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
               <thead className="bg-slate-50">
                  <tr>
                     <th className="px-4 py-3 text-left font-bold text-slate-700 w-32">维度</th>
                     <th className="px-4 py-3 text-left font-bold text-slate-900 w-40 bg-indigo-50/50 border-b border-indigo-100">Formx</th>
                     <th className="px-4 py-3 text-left font-bold text-slate-700 w-40">Formily</th>
                     <th className="px-4 py-3 text-left font-bold text-slate-700">React Hook Form</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">核心定位</td>
                     <td className="px-4 py-3 text-indigo-700 font-bold bg-indigo-50/30">逻辑计算引擎</td>
                     <td className="px-4 py-3 text-slate-600">全能表单方案</td>
                     <td className="px-4 py-3 text-slate-600">UI 状态管理</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">驱动模式</td>
                     <td className="px-4 py-3 text-indigo-700 font-bold bg-indigo-50/30">Schema Driven</td>
                     <td className="px-4 py-3 text-slate-600">Schema Driven</td>
                     <td className="px-4 py-3 text-slate-600">Code / JSX</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">联动实现</td>
                     <td className="px-4 py-3 text-slate-600">DAG 自动追踪</td>
                     <td className="px-4 py-3 text-slate-600">Reactive (MobX)</td>
                     <td className="px-4 py-3 text-slate-600">Manual (useEffect)</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">小程序兼容</td>
                     <td className="px-4 py-3 text-emerald-600 font-bold bg-indigo-50/30">⭐⭐⭐ (原生)</td>
                     <td className="px-4 py-3 text-amber-500">⭐ (困难)</td>
                     <td className="px-4 py-3 text-emerald-600">⭐⭐⭐</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">包体积</td>
                     <td className="px-4 py-3 text-emerald-600 font-bold bg-indigo-50/30">Tiny (&lt;5KB)</td>
                     <td className="px-4 py-3 text-red-500">Heavy</td>
                     <td className="px-4 py-3 text-emerald-600">Light</td>
                  </tr>
                  <tr>
                     <td className="px-4 py-3 font-medium text-slate-600">学习曲线</td>
                     <td className="px-4 py-3 text-slate-600 bg-indigo-50/30">中等</td>
                     <td className="px-4 py-3 text-slate-600">极陡峭</td>
                     <td className="px-4 py-3 text-slate-600">低</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </section>

      {/* Scenarios Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center text-lg">
               <CheckCircle2 className="w-5 h-5 mr-2" /> 强烈推荐使用 Formx
            </h3>
            <ul className="space-y-3">
               <li className="flex items-start text-sm text-emerald-900">
                  <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>复杂 B 端单据：</b> 字段超过 50 个，存在大量嵌套表格（明细表）和跨字段联动。</span>
               </li>
               <li className="flex items-start text-sm text-emerald-900">
                  <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>多端业务统一：</b> 要求 Web、App、小程序逻辑完全一致，不想写三套 <code>computed</code> 代码。</span>
               </li>
               <li className="flex items-start text-sm text-emerald-900">
                  <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>低代码/配置化平台：</b> 需要后端下发 JSON 来动态渲染表单，并包含计算逻辑。</span>
               </li>
               <li className="flex items-start text-sm text-emerald-900">
                  <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>财务/计费系统：</b> 涉及复杂的金额计算、汇率转换、合计汇总。</span>
               </li>
            </ul>
         </div>

         <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center text-lg">
               <XCircle className="w-5 h-5 mr-2" /> 建议使用其他方案
            </h3>
            <ul className="space-y-3">
               <li className="flex items-start text-sm text-slate-600">
                  <X className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>简单登录/注册页：</b> 只有 2-3 个字段，逻辑简单。用 <code>React Hook Form</code> 更快。</span>
               </li>
               <li className="flex items-start text-sm text-slate-600">
                  <X className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>重度 UI 定制：</b> 表单主要是为了炫酷的动画效果，逻辑很弱。</span>
               </li>
               <li className="flex items-start text-sm text-slate-600">
                  <X className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-60"/>
                  <span><b>极其依赖 JSX 灵活性：</b> 如果你非常讨厌写 JSON 配置，喜欢在 JSX 里写 <code>{'{val > 10 && <Input />}'}</code>。</span>
               </li>
            </ul>
         </div>
      </section>

      {/* Deep Dive: The Logic Trap */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
         <h3 className="font-bold text-slate-800 mb-3 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-600"/> 
            深度解析：为什么 <code>useEffect</code> 不是好主意？
         </h3>
         <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            在 React 中，开发者习惯用 <code>useEffect</code> 处理联动。但在复杂表单中，这会导致<b>“瀑布流更新”</b>和<b>“幽灵依赖”</b>。
         </p>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded border border-red-100">
               <div className="text-xs font-bold text-red-800 mb-1">❌ useEffect 模式</div>
               <pre className="text-[10px] font-mono text-red-700 overflow-x-auto p-2 bg-white rounded">
{`useEffect(() => {
  setTotal(price * qty);
}, [price, qty]); 
// 容易漏依赖，
// 且每次渲染都会运行检查`}
               </pre>
            </div>
            <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
               <div className="text-xs font-bold text-emerald-800 mb-1">✅ Formx 模式</div>
               <pre className="text-[10px] font-mono text-emerald-700 overflow-x-auto p-2 bg-white rounded">
{`// 引擎在初始化时建立拓扑图
// price 变化 -> 直接触发 total 更新
// 不依赖 React 渲染周期
expression: 'price * qty'`}
               </pre>
            </div>
         </div>
         <p className="text-sm text-slate-500 mt-4">
            Formx 的核心价值在于将<b>逻辑控制权</b>从 UI 框架（React/Vue）手中收回，交给专门的 DAG 引擎处理。这使得逻辑变得可预测、可测试、可移植。
         </p>
      </section>
   </div>
);

const DocQuickStart = () => (
   <div className="space-y-8 max-w-3xl">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">快速上手</h2>
         <p className="text-slate-500">将 formx 集成到你的项目中。</p>
      </div>

      <section className="bg-blue-50 border border-blue-100 rounded-xl p-5">
         <h3 className="font-bold text-blue-800 mb-3 flex items-center">
            <FileCode className="w-4 h-4 mr-2"/>
            源码依赖说明 (Dependencies)
         </h3>
         <p className="text-sm text-blue-700 mb-3 leading-relaxed">
            formx 的架构设计确保了核心逻辑的纯净性。在生产环境接入前，请了解以下依赖关系：
         </p>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
               <div className="font-bold text-xs text-slate-500 mb-1 uppercase tracking-wider">@enginx/formx-core</div>
               <div className="text-sm font-bold text-slate-800">Zero Dependency</div>
               <div className="text-xs text-slate-500 mt-1">核心引擎零依赖，纯 TypeScript 实现。体积 &lt; 5KB (Gzipped)。</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
               <div className="font-bold text-xs text-slate-500 mb-1 uppercase tracking-wider">@enginx/formx-react</div>
               <div className="text-sm font-bold text-slate-800">React 18+</div>
               <div className="text-xs text-slate-500 mt-1">仅依赖 React Hooks (useSyncExternalStore)。不绑定样式库。</div>
            </div>
         </div>
      </section>

      <section>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Menu className="w-4 h-4 mr-2"/> 两种集成方式</h3>
          
          <div className="space-y-8">
              {/* NPM Package Integration */}
              <div>
                  <h4 className="font-bold text-indigo-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2"/> 方式一：作为 NPM 包引入 (推荐 React 项目)
                  </h4>
                  <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">1. 安装依赖</h5>
                          <div className="bg-slate-900 rounded-lg p-3 text-white font-mono text-xs relative group">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-slate-400 hover:text-white"><Share2 className="w-3 h-3"/></button>
                              </div>
                              npm install @enginx/formx-core @enginx/formx-react zod
                          </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">2. 定义 Schema</h5>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`const schema = [
  { key: 'price', type: 'NUMBER', label: '单价' },
  { key: 'quantity', type: 'NUMBER', label: '数量' },
  { 
    key: 'total', 
    type: 'MONETARY', 
    label: '总价',
    read_only: true,
    expression: 'price * quantity'
  }
];`}</pre>
                          </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">3. 初始化引擎</h5>
                          <div className="mb-2 flex items-center space-x-2">
                             <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Safe Mode On</span>
                             <span className="text-xs text-slate-500">引擎初始化时会自动构建 DAG 并进行循环依赖检测。</span>
                          </div>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`import { createRuntime, createVanillaStore } from '@enginx/formx-core'; // 从 NPM 包导入

const initialData = { price: 10, quantity: 2, total: 20 };
// 对于 React 项目，@enginx/formx-react 包可能提供更优化的 Store 实现
const store = createVanillaStore(initialData); // 或者 createReactStore(initialData)

// createRuntime 会自动开启 Safe Mode (无 eval) 和死循环防护
export const engine = createRuntime({ schema, store });`}</pre>
                          </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">4. UI 绑定 (React)</h5>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`import { useSyncExternalStore } from 'react'; // React 内置 Hook

const MyComponent = () => {
  // 手动订阅 Store 状态
  const price = useSyncExternalStore(
    (cb) => engine.getStore().subscribe(cb), 
    () => engine.getStore().getState().price
  );

  return (
    <input 
      type="number"
      value={price || ''} 
      onChange={e => engine.setValue('price', parseFloat(e.target.value))} 
    />
  );
};
// @enginx/formx-react 包可能会提供更便捷的 useFieldValue Hook 来简化此过程。`}</pre>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Direct Source Copy Integration */}
              <div>
                  <h4 className="font-bold text-emerald-700 mb-3 flex items-center">
                      <Anchor className="w-4 h-4 mr-2"/> 方式二：直接复制源码 (适用 Monorepo, Vue, 小程序)
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                      <code>@enginx/formx-core</code> 是一个纯 TypeScript 库，不含任何框架依赖。
                      你可以直接将以下文件复制到你的项目源码中。
                      这适用于需要对源码进行定制、避免 NPM 依赖，或集成到非 React 环境（如 Vue 3, 小程序）的场景。
                  </p>
                  <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">1. 复制核心文件</h5>
                          <div className="bg-slate-900 rounded-lg p-3 text-white font-mono text-xs relative group">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-slate-400 hover:text-white"><Share2 className="w-3 h-3"/></button>
                              </div>
                              <p className="text-slate-500 mb-2">// 将以下文件复制到你的项目中，例如 `src/enginx/` 目录下</p>
                              <div className="space-y-1">
                                <p className="flex items-center"><span className="text-indigo-400 w-24">Core Engine:</span> <code>src/enginx/core.ts</code></p>
                                <p className="flex items-center"><span className="text-indigo-400 w-24">Algorithms:</span> <code>src/enginx/graph.ts</code></p>
                                <p className="flex items-center"><span className="text-indigo-400 w-24">State:</span> <code>src/enginx/store.ts</code></p>
                                <p className="flex items-center"><span className="text-indigo-400 w-24">Types:</span> <code>src/enginx/types.ts</code></p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">2. 初始化引擎 (Vue / 小程序示例)</h5>
                          <p className="text-sm text-slate-600 mb-3">
                              核心引擎的实例化方式不变，但 <code>RuntimeStore</code> 的具体实现会根据你的框架而异。
                          </p>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`// --- Vue 3 示例 (假设你实现了 createVueStore) ---
import { createRuntime } from '@/enginx/core'; // 从复制的源码导入
import { createVueStore } from './vue-store-adapter'; // 自定义 Vue 响应式 Store (例如基于 ref/reactive)

const initialData = { price: 10, quantity: 2, total: 20 };
const store = createVueStore(initialData); 
export const engine = createRuntime({ schema, store });

// --- 小程序示例 (假设你实现了 createMiniprogramStore) ---
// import { createRuntime } from '@/enginx/core';
// import { createMiniprogramStore } from './miniprogram-store-adapter'; // 自定义小程序 Store (例如适配 setData)
// 
// // 在 Page/Component 实例的 created/attached 生命周期中
// const initialData = { price: 10, quantity: 2, total: 20 };
// const store = createMiniprogramStore(this, initialData); // 传入 page/component 实例
// const engine = createRuntime({ schema, store });
`}</pre>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
   </div>
);

const DocExpressions = () => (
   <div className="space-y-8 max-w-3xl">
      <div>
         <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">公式与计算手册</h2>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded border border-emerald-200 uppercase">Phase 2 Ready</span>
         </div>
         <p className="text-slate-600 leading-relaxed">
            Formx 内置了一个轻量级、安全的计算引擎。通过 <code>expression</code> 属性，你可以定义字段间的联动逻辑。
         </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
         <div className="flex items-start">
            <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0"/>
            <div>
               <h4 className="font-bold text-amber-800 text-sm">Safe Evaluation Mode (安全模式)</h4>
               <p className="text-sm text-amber-700 mt-1">
                  为了兼容小程序等不允许使用 <code>new Function</code> 或 <code>eval</code> 的环境，Formx v1.2+ 
                  <b>默认开启安全模式</b>。这意味着你只能使用<b>受支持的语法子集</b>。
               </p>
            </div>
         </div>
      </div>

      <section className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">运行模式说明</h3>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-2">如何开启 Safe Mode?</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  <b>默认开启。</b> 无需任何配置。
              </p>
              <h4 className="font-bold text-sm text-slate-800 mb-2">为什么需要 Safe Mode?</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  微信小程序、支付宝小程序以及许多企业级安全环境 (CSP) 禁止使用 <code>new Function</code> 和 <code>eval</code> 执行动态代码。
                  为了确保核心内核 (Core Kernel) 能够一套代码多端运行，我们内置了一个递归下降解析器来处理表达式。
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mt-2">
                  <span className="px-2 py-1 bg-emerald-100 rounded border border-emerald-200">Zero Configuration</span>
                  <span className="px-2 py-1 bg-emerald-100 rounded border border-emerald-200">MiniProgram Ready</span>
              </div>
          </div>
      </section>

      <section className="space-y-6">
         <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">支持的语法</h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-indigo-500"/> 算术运算
               </h4>
               <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                     <code>+</code> <span>加法</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                     <code>-</code> <span>减法</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                     <code>*</code> <span>乘法</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                     <code>/</code> <span>除法</span>
                  </li>
                  <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                     <code>( )</code> <span>括号优先级</span>
                  </li>
               </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center">
                  <Database className="w-4 h-4 mr-2 text-purple-500"/> 变量引用
               </h4>
               <p className="text-sm text-slate-600 mb-4">
                  直接使用字段的 <code>key</code> 作为变量名。引擎会自动解析依赖。
               </p>
               <div className="space-y-3">
                  <div>
                     <div className="text-xs font-bold text-slate-500 mb-1">同级引用:</div>
                     <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700">
                        price * quantity
                     </div>
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-500 mb-1">聚合函数:</div>
                     <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700">
                        SUM(items.amount)
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   </div>
);

const DocArchitecture = () => (
   <div className="space-y-8 max-w-3xl">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 mb-4">架构设计</h2>
         <p className="text-slate-600">formx 采用经典的 <b>Model-View-ViewModel (MVVM)</b> 变体架构，核心原则是状态与计算下沉。</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
         <div className="flex items-center space-x-4 w-full justify-center">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center w-32">
               <FileJson className="w-6 h-6 mx-auto text-indigo-600 mb-2"/>
               <div className="font-bold text-xs text-indigo-900">Schema</div>
               <div className="text-[10px] text-indigo-400">定义元数据</div>
            </div>
            <div className="text-slate-300"><ArrowRight/></div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center w-32 shadow-lg">
               <Cpu className="w-6 h-6 mx-auto text-emerald-400 mb-2"/>
               <div className="font-bold text-xs text-white">Engine</div>
               <div className="text-[10px] text-slate-400">计算与依赖</div>
            </div>
            <div className="text-slate-300"><ArrowRight/></div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center w-32">
               <Database className="w-6 h-6 mx-auto text-slate-600 mb-2"/>
               <div className="font-bold text-xs text-slate-900">Store</div>
               <div className="text-[10px] text-slate-500">单一事实来源</div>
            </div>
         </div>
         <div className="w-full border-t border-slate-100 my-4"></div>
         <div className="flex items-center space-x-4 w-full justify-center">
            <div className="text-slate-400 text-xs">↑ 订阅更新</div>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-slate-300 text-center w-64">
               <LayoutGrid className="w-6 h-6 mx-auto text-purple-600 mb-2"/>
               <div className="font-bold text-xs text-slate-900">UI Layer (React/Vue/Mobile)</div>
               <div className="text-[10px] text-slate-500">纯展示组件</div>
            </div>
            <div className="text-slate-400 text-xs">↓ Action 触发</div>
         </div>
      </div>

      {/* Core Principles Section */}
      <div className="mt-8 pt-8 border-t border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600"/> 核心原则
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>严禁耦合：</strong> Schema 层绝不引用 Runtime 或 UI 代码。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>状态隔离：</strong> UI 组件不持有业务状态，只负责渲染 store 中的数据。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>Schema 驱动：</strong> 所有的业务逻辑（显隐、禁用、计算）必须在 Schema 中声明。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>可插拔：</strong> Cell 组件通过 Registry 注册，支持插件化扩展。
            </div>
         </div>
      </div>

      {/* Safety & Optimization Section */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm mt-8">
         <h3 className="font-bold text-red-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2"/> 安全与防死循环机制
         </h3>
         <p className="text-sm text-red-700 mb-4 leading-relaxed">
            在响应式系统中，<code>setValue</code> 触发的联动很容易导致无限递归（如 A 依赖 B，B 依赖 A）。Formx 内置了三道防线来确保系统稳定性：
         </p>
         <ul className="space-y-3">
            <li className="flex gap-3 bg-white p-3 rounded border border-red-100">
               <div className="mt-1"><Zap className="w-4 h-4 text-amber-500"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Dirty Check & Epsilon</h4>
                  <p className="text-xs text-slate-600 mt-1">
                     在更新值之前，引擎会对比新旧值。针对 JS 浮点数问题（如 0.1 + 0.2），我们引入了 <code>Number.EPSILON</code> 容差对比，防止因微小精度差异导致的震荡循环。
                  </p>
               </div>
            </li>
            <li className="flex gap-3 bg-white p-3 rounded border border-red-100">
               <div className="mt-1"><ShieldCheck className="w-4 h-4 text-emerald-500"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Max Recursion Guard</h4>
                  <p className="text-xs text-slate-600 mt-1">
                     内置熔断机制。如果单次操作引发的联动深度超过 50 层，引擎会自动终止计算并抛出警告，防止堆栈溢出导致浏览器崩溃。
                  </p>
               </div>
            </li>
            <li className="flex gap-3 bg-white p-3 rounded border border-red-100">
               <div className="mt-1"><GitMerge className="w-4 h-4 text-indigo-500"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Static Cycle Detection</h4>
                  <p className="text-xs text-slate-600 mt-1">
                     在引擎初始化阶段，DAG 算法会自动扫描 Schema。如果发现 A -&gt; B -&gt; A 这样的闭环依赖，会在控制台输出错误路径。
                  </p>
               </div>
            </li>
         </ul>
      </div>

      <div className="space-y-4 mt-8">
         <h3 className="font-bold text-slate-900">核心组件职责：</h3>
         <ul className="space-y-3">
            <li className="flex gap-3">
               <div className="mt-1"><Database className="w-4 h-4 text-slate-500"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Store Adapter</h4>
                  <p className="text-sm text-slate-600">纯粹的数据仓库。可以基于 Zustand, Redux 或 Context 实现。Engine 不持有数据，只操作 Store。</p>
               </div>
            </li>
            <li className="flex gap-3">
               <div className="mt-1"><Cpu className="w-4 h-4 text-emerald-600"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Runtime Engine</h4>
                  <p className="text-sm text-slate-600">大脑。负责解析 Schema，构建依赖图 (DAG)，处理 <code>setValue</code> 并自动触发关联字段的重算。</p>
               </div>
            </li>
            <li className="flex gap-3">
               <div className="mt-1"><LayoutGrid className="w-4 h-4 text-purple-600"/></div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">UI Layer</h4>
                  <p className="text-sm text-slate-600">哑组件。只负责 <code>subscribe(path)</code> 并渲染。不包含任何 <code>if (a &gt; b)</code> 这样的业务逻辑。</p>
               </div>
            </li>
         </ul>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Braces className="w-5 h-5 mr-2 text-indigo-600"/> 核心模块详解
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center mr-3">
                     <FileJson className="w-4 h-4 text-indigo-600"/>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">types.ts</h4>
                     <span className="text-xs text-slate-400">Schema 定义层</span>
                  </div>
               </div>
               <p className="text-xs text-slate-600 mb-2">定义核心接口：</p>
               <ul className="text-xs text-slate-500 space-y-1">
                  <li><code className="text-indigo-600">FieldSchema</code> - 字段定义，支持 expression</li>
                  <li><code className="text-indigo-600">CardConfig</code> - 卡片列表配置</li>
                  <li><code className="text-indigo-600">RuntimeStore</code> - 状态存储接口</li>
               </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center mr-3">
                     <Database className="w-4 h-4 text-emerald-600"/>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">store.ts</h4>
                     <span className="text-xs text-slate-400">状态存储</span>
                  </div>
               </div>
               <p className="text-xs text-slate-600 mb-2">核心能力：</p>
               <ul className="text-xs text-slate-500 space-y-1">
                  <li>深度路径访问 <code>items.0.price</code></li>
                  <li>不可变更新 (JSON 深拷贝)</li>
                  <li>变更订阅机制</li>
               </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                     <GitMerge className="w-4 h-4 text-purple-600"/>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">graph.ts</h4>
                     <span className="text-xs text-slate-400">依赖图 (DAG)</span>
                  </div>
               </div>
               <p className="text-xs text-slate-600 mb-2">算法实现：</p>
               <ul className="text-xs text-slate-500 space-y-1">
                  <li><code>addDependency</code> - 注册依赖关系</li>
                  <li><code>getExecutionOrder</code> - Kahn 拓扑排序</li>
                  <li><code>detectCycle</code> - DFS 循环检测</li>
               </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
               <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center mr-3">
                     <Cpu className="w-4 h-4 text-amber-600"/>
                  </div>
                  <div>
                     <h4 className="font-bold text-sm text-slate-800">core.ts</h4>
                     <span className="text-xs text-slate-400">运行时引擎</span>
                  </div>
               </div>
               <p className="text-xs text-slate-600 mb-2">核心功能：</p>
               <ul className="text-xs text-slate-500 space-y-1">
                  <li>安全表达式求值 (无 eval)</li>
                  <li>级联更新触发</li>
                  <li>递归深度熔断保护</li>
               </ul>
            </div>
         </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-amber-500"/> 核心计算流程
         </h3>
         
         <div className="bg-slate-900 rounded-xl p-5 text-white font-mono text-xs overflow-x-auto">
            <div className="text-slate-400 mb-2">// setValue 触发级联计算流程</div>
            <div className="space-y-1">
               <div className="flex items-center">
                  <span className="text-emerald-400 w-24">setValue()</span>
                  <span className="text-slate-300">→ 用户更新字段值</span>
               </div>
               <div className="flex items-center ml-4">
                  <span className="text-amber-400 w-20">↓</span>
               </div>
               <div className="flex items-center">
                  <span className="text-indigo-400 w-24">脏检查</span>
                  <span className="text-slate-300">→ 值相同则跳过 (Epsilon 容差)</span>
               </div>
               <div className="flex items-center ml-4">
                  <span className="text-amber-400 w-20">↓</span>
               </div>
               <div className="flex items-center">
                  <span className="text-indigo-400 w-24">更新 Store</span>
                  <span className="text-slate-300">→ 不可变更新</span>
               </div>
               <div className="flex items-center ml-4">
                  <span className="text-amber-400 w-20">↓</span>
               </div>
               <div className="flex items-center">
                  <span className="text-purple-400 w-24">查找依赖</span>
                  <span className="text-slate-300">→ graph.getDirectDependents()</span>
               </div>
               <div className="flex items-center ml-4">
                  <span className="text-amber-400 w-20">↓</span>
               </div>
               <div className="flex items-center">
                  <span className="text-cyan-400 w-24">表达式求值</span>
                  <span className="text-slate-300">→ evaluateSafe() 无 eval</span>
               </div>
               <div className="flex items-center ml-4">
                  <span className="text-amber-400 w-20">↓</span>
               </div>
               <div className="flex items-center">
                  <span className="text-emerald-400 w-24">级联更新</span>
                  <span className="text-slate-300">→ 递归触发 (最大深度 50)</span>
               </div>
            </div>
         </div>

         <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-bold text-sm text-blue-800 mb-2 flex items-center">
               <ShieldCheck className="w-4 h-4 mr-2"/> 无效值处理
            </h4>
            <p className="text-xs text-blue-700 mb-2">
               表达式求值时，引擎会自动处理无效值，确保计算不会报错：
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs">
               <div className="bg-white p-2 rounded border border-blue-100 text-center">
                  <code className="text-slate-600">null</code>
                  <div className="text-emerald-600 mt-1">→ 0</div>
               </div>
               <div className="bg-white p-2 rounded border border-blue-100 text-center">
                  <code className="text-slate-600">undefined</code>
                  <div className="text-emerald-600 mt-1">→ 0</div>
               </div>
               <div className="bg-white p-2 rounded border border-blue-100 text-center">
                  <code className="text-slate-600">NaN</code>
                  <div className="text-emerald-600 mt-1">→ 0</div>
               </div>
               <div className="bg-white p-2 rounded border border-blue-100 text-center">
                  <code className="text-slate-600">"NA"</code>
                  <div className="text-emerald-600 mt-1">→ 0</div>
               </div>
            </div>
         </div>
      </div>
   </div>
);

const DocHeadless = ({ onNavigate }: any) => (
   <div className="space-y-8 max-w-3xl">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">Headless UI 模式</h2>
         <p className="text-slate-600">
            一套逻辑，多端渲染。这是 Headless 架构带来的最大红利。
         </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center mb-3 text-indigo-700">
               <Eye className="w-5 h-5 mr-2"/>
               <span className="font-bold text-sm">Web 端 (AntD / Tailwind)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
               适合桌面端操作。使用 Grid 布局，高密度信息展示，鼠标交互。
            </p>
            <div className="h-20 bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center text-xs text-slate-400">
               [Web Table / Grid]
            </div>
         </div>
         <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
             <div className="flex items-center mb-3 text-indigo-700">
               <Smartphone className="w-5 h-5 mr-2"/>
               <span className="font-bold text-sm">Mobile 端 (Vant / Ionic)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
               适合手机操作。使用 Card 布局，大按钮，触摸交互，步进器。
            </p>
            <div className="h-20 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-xs text-slate-400">
               [Mobile Cards]
            </div>
         </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start">
         <Lightbulb className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 shrink-0"/>
         <div className="text-sm text-yellow-800">
            <p className="font-bold mb-1">关键点：Core 不感知 UI</p>
            <p>
               Engine 只在乎 <code>setValue('items.0.quantity', 5)</code>。它不在乎你是通过 PC 的键盘输入的，还是通过手机上的“+”按钮点击的。
               这保证了业务逻辑在不同端的一致性。
            </p>
         </div>
      </div>
      
      <div className="pt-2">
         <p className="text-sm text-slate-500 mb-3">查看我们的演示，体验同一套 Schema 如何驱动 Web 和 Mobile 两种截然不同的界面：</p>
         <button onClick={() => { /* Hacky way to switch main tab */ 
            onNavigate('demo');
         }} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
            <Play className="w-4 h-4 mr-2"/> 前往 Live Demo
         </button>
      </div>
   </div>
);

const DocApiReference = () => (
   <div className="space-y-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900">API 参考</h2>

      <div className="space-y-6">
         {/* createRuntime */}
         <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center">
               <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded mr-3">Function</span>
               <code className="text-sm font-bold text-slate-800">createRuntime(options)</code>
            </div>
            <div className="p-4 space-y-4">
               <p className="text-sm text-slate-600">创建一个新的 Runtime Engine 实例。</p>
               <h5 className="text-xs font-bold text-slate-500 uppercase">Parameters</h5>
               <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex"><code className="w-32 shrink-0 text-slate-800">schema</code> <span className="text-slate-500">FieldSchema[] - 表单定义数组</span></li>
                  <li className="flex"><code className="w-32 shrink-0 text-slate-800">store</code> <span className="text-slate-500">RuntimeStore - 状态管理适配器</span></li>
                  <li className="flex"><code className="w-32 shrink-0 text-slate-800">functions?</code> <span className="text-slate-500">Record&lt;string, Function&gt; - 自定义函数注册</span></li>
               </ul>
            </div>
         </div>

         {/* RuntimeEngine Class */}
         <div className="border border-slate-200 rounded-lg overflow-hidden">
             <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center">
               <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded mr-3">Class</span>
               <code className="text-sm font-bold text-slate-800">RuntimeEngine</code>
            </div>
            <div className="p-4 space-y-4">
               <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center mb-1">
                     <code className="text-sm font-bold text-indigo-600 mr-2">setValue(path, value)</code>
                  </div>
                  <p className="text-xs text-slate-600">更新指定路径的值，并触发依赖计算。</p>
               </div>
               <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center mb-1">
                     <code className="text-sm font-bold text-indigo-600 mr-2">getStore()</code>
                  </div>
                  <p className="text-xs text-slate-600">获取底层的 Store 实例。</p>
               </div>
            </div>
         </div>
      </div>
   </div>
);

const DocSchemaReference = () => (
   <div className="space-y-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900">Schema 定义</h2>
      <p className="text-slate-600"><code>FieldSchema</code> 是描述表单字段的核心数据结构。</p>

      {/* Main Field Properties */}
      <div className="overflow-hidden border border-slate-200 rounded-lg mb-8">
         <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-bold text-slate-700 text-sm">基础属性 (Properties)</div>
         <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white">
               <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 w-32">属性</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700 w-32">类型</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-700">说明</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
               <tr>
                  <td className="px-4 py-3 font-mono text-indigo-600">key</td>
                  <td className="px-4 py-3 text-slate-500">string</td>
                  <td className="px-4 py-3 text-slate-600">字段唯一标识。用于生成 Path。</td>
               </tr>
               <tr>
                  <td className="px-4 py-3 font-mono text-indigo-600">type</td>
                  <td className="px-4 py-3 text-slate-500">Enum</td>
                  <td className="px-4 py-3 text-slate-600">字段类型，决定渲染方式和行为。见下文详解。</td>
               </tr>
               <tr>
                  <td className="px-4 py-3 font-mono text-indigo-600">expression</td>
                  <td className="px-4 py-3 text-slate-500">string</td>
                  <td className="px-4 py-3 text-slate-600">计算表达式，如 <code>price * quantity</code>。</td>
               </tr>
               <tr>
                  <td className="px-4 py-3 font-mono text-indigo-600">card</td>
                  <td className="px-4 py-3 text-slate-500">Object</td>
                  <td className="px-4 py-3 text-slate-600">当 type 为 CARD_LIST 时的嵌套配置。包含 sections 和 actions。</td>
               </tr>
            </tbody>
         </table>
      </div>

      {/* Type Definitions Details */}
      <div>
         <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">字段类型 (Type) 详解</h3>
         <div className="space-y-4">
            {/* TEXT */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><Type className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">TEXT</span>
                  <span className="text-sm font-bold text-slate-700">基础文本</span>
               </div>
               <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                  用于普通的单行或多行文本输入。值类型为 <code>string</code>。
               </p>
            </div>
            {/* NUMBER */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><Calculator className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">NUMBER</span>
                  <span className="text-sm font-bold text-slate-700">数值</span>
               </div>
               <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                  原生数字输入。值类型为 <code>number</code>。
                  <br/>限制：参与 <code>expression</code> 计算时会自动转为 float。
               </p>
            </div>
             {/* MONETARY */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><Coins className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">MONETARY</span>
                  <span className="text-sm font-bold text-slate-700">金额</span>
               </div>
               <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                  专用的金额类型。通常 UI 层会处理千分位展示和精度（默认为 2 位小数）。
                  <br/>在计算引擎中，它与 NUMBER 行为一致，但在 UI 渲染层会触发特定的格式化逻辑。
               </p>
            </div>
            {/* ENUM */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><List className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">ENUM</span>
                  <span className="text-sm font-bold text-slate-700">枚举/选项</span>
               </div>
               <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                  用于下拉选择或单选。
                  <br/>注意：目前 Schema 定义中尚未标准化 <code>options</code> 字段，建议通过 <code>ui.options</code> 或扩展字段传入。
               </p>
            </div>
            {/* CARD_LIST */}
             <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><Layers className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">CARD_LIST</span>
                  <span className="text-sm font-bold text-slate-700">卡片列表（明细表）</span>
               </div>
               <div className="ml-8 text-xs text-slate-600 space-y-2">
                 <p>核心容器类型，用于处理一对多关系（如订单明细）。值类型为 <code>Array&lt;Object&gt;</code>。</p>
                 <ul className="list-disc pl-4 space-y-1 text-slate-500">
                   <li>必须配置 <code>card</code> 属性来定义子表单结构。</li>
                   <li>支持聚合计算，如 <code>SUM(items.amount)</code>。</li>
                   <li>内部字段支持相对路径依赖。</li>
                 </ul>
               </div>
            </div>
             {/* DIMENSION */}
             <div className="border border-slate-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
               <div className="flex items-center mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded mr-2 text-slate-500"><Box className="w-3 h-3"/></span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2 text-xs">DIMENSION</span>
                  <span className="text-sm font-bold text-slate-700">维度选择 (Phase 3)</span>
               </div>
               <p className="text-xs text-slate-600 ml-8 leading-relaxed">
                  用于复杂的对象选择（如选择“客户”、“商品”）。
                  <br/>区别于 ENUM，DIMENSION 的值通常是一个对象 <code>{`{ id, name, ... }`}</code> 而非简单字符串。适用于大数据量的远程搜索场景。
               </p>
            </div>
         </div>
      </div>
   </div>
);

export const DocsView = () => {
  const [activeDocTab, setActiveDocTab] = useState('intro');

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] animate-in fade-in duration-300">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0">
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 px-3 flex items-center text-sm uppercase tracking-wide">
               <BookOpen className="w-4 h-4 mr-2 text-indigo-600"/> 用户文档
            </h3>
            <nav className="space-y-1">
               <DocNavItem id="intro" label="核心理念 (Philosophy)" active={activeDocTab} onClick={setActiveDocTab} icon={<Lightbulb className="w-4 h-4"/>} />
               <DocNavItem id="why" label="选型对比 (Why Formx?)" active={activeDocTab} onClick={setActiveDocTab} icon={<HelpCircle className="w-4 h-4"/>} />
               <DocNavItem id="start" label="快速上手 (Quick Start)" active={activeDocTab} onClick={setActiveDocTab} icon={<Play className="w-4 h-4"/>} />
               <DocNavItem id="expr" label="公式与计算 (Formulas)" active={activeDocTab} onClick={setActiveDocTab} icon={<Calculator className="w-4 h-4"/>} />
               <DocNavItem id="arch" label="架构详解 (Architecture)" active={activeDocTab} onClick={setActiveDocTab} icon={<Layers className="w-4 h-4"/>} />
               <DocNavItem id="headless" label="Headless 实践" active={activeDocTab} onClick={setActiveDocTab} icon={<Smartphone className="w-4 h-4"/>} />
               <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</div>
               <DocNavItem id="api" label="API 参考" active={activeDocTab} onClick={setActiveDocTab} icon={<Braces className="w-4 h-4"/>} />
               <DocNavItem id="schema" label="Schema 定义" active={activeDocTab} onClick={setActiveDocTab} icon={<FileJson className="w-4 h-4"/>} />
               <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">External</div>
               <a 
                 href="https://holdtec.github.io/formX/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
               >
                 <Share2 className="w-4 h-4"/>
                 <span>完整文档站点</span>
               </a>
            </nav>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px]"> 
         {activeDocTab === 'intro' && <DocIntro onNavigate={setActiveDocTab} />}
         {activeDocTab === 'why' && <DocWhyFormx />}
         {activeDocTab === 'start' && <DocQuickStart />}
         {activeDocTab === 'expr' && <DocExpressions />}
         {activeDocTab === 'arch' && <DocArchitecture />}
         {activeDocTab === 'headless' && <DocHeadless onNavigate={setActiveDocTab} />}
         {activeDocTab === 'api' && <DocApiReference />}
         {activeDocTab === 'schema' && <DocSchemaReference />}
      </div>
    </div>
  );
};