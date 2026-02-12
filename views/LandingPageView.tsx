import React from 'react';
import { Sparkles, Code, LayoutGrid, Zap, GitMerge, Smartphone, Package, AlertTriangle, CheckCircle2, ArrowRight, Cpu, Play, BookOpen, Github } from 'lucide-react';

const FeatureCard = ({ icon, color, title, desc }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
     <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
     </div>
     <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
     <p className="text-sm text-slate-500 leading-relaxed">
        {desc}
     </p>
  </div>
);

export const LandingPageView = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
  return (
    <div className="space-y-24 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="text-center pt-16 pb-12 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>
         
         <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 animate-bounce-slow">
            <Sparkles className="w-3 h-3 mr-2" />
            v1.0.0-beta is now available
         </div>
         
         <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            复杂表单的 <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Headless 计算大脑</span>
         </h1>
         
         <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
            告别面条式代码。Formx 将业务逻辑与 UI 彻底解耦，提供一套 Schema 驱动、自动依赖追踪的标准化运行时，让企业级表单开发像搭积木一样简单。
         </p>
         
         <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => onNavigate('demo')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all hover:scale-105 flex items-center justify-center"
            >
               <Play className="w-5 h-5 mr-2 fill-current" />
               查看 Live Demo
            </button>
            <button 
              onClick={() => onNavigate('docs')}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-lg shadow-sm transition-all hover:border-slate-300 flex items-center justify-center"
            >
               <BookOpen className="w-5 h-5 mr-2" />
               阅读文档
            </button>
            <a 
              href="https://github.com/holdtec/formX.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all hover:scale-105 flex items-center justify-center"
            >
               <Github className="w-5 h-5 mr-2" />
               GitHub
            </a>
         </div>
         
         {/* Tech Stack Badges */}
         <div className="mt-12 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500"><Code className="w-4 h-4"/><span>TypeScript</span></div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500"><LayoutGrid className="w-4 h-4"/><span>React/Vue</span></div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500"><Zap className="w-4 h-4"/><span>Zero Dep</span></div>
         </div>
      </section>

      {/* Value Props Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <FeatureCard 
            icon={<GitMerge className="w-6 h-6 text-white" />}
            color="bg-blue-500"
            title="智能依赖图 (DAG)"
            desc="内置有向无环图算法。只需定义 A = B + C，引擎自动处理计算顺序，从此告别 useEffect 级联地狱。"
         />
         <FeatureCard 
            icon={<Smartphone className="w-6 h-6 text-white" />}
            color="bg-purple-500"
            title="一套逻辑，多端运行"
            desc="核心逻辑纯 JS 实现。编写一次 Schema，即可同时驱动 React Web 后台、Vue H5 商城和小程序。"
         />
         <FeatureCard 
            icon={<Package className="w-6 h-6 text-white" />}
            color="bg-emerald-500"
            title="Card 模型架构"
            desc="专为复杂的嵌套数据结构设计（如订单明细、动态配置）。支持 List -> Card -> Section -> Field 无限层级。"
         />
         <FeatureCard 
            icon={<Zap className="w-6 h-6 text-white" />}
            color="bg-amber-500"
            title="毫秒级精确更新"
            desc="基于 Proxy 与订阅模式，精确到字段级的更新粒度。即使表格有 1000 行数据，输入依然丝滑流畅。"
         />
      </section>

      {/* Code Comparison */}
      <section className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
         <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* The Old Way */}
            <div className="p-8">
               <div className="flex items-center space-x-2 mb-6 opacity-50">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-red-400 uppercase tracking-wider text-sm">The Old Way (React)</h3>
               </div>
               <pre className="font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto">
{`// ❌ 逻辑散落在组件各处
const [price, setPrice] = useState(0);
const [qty, setQty] = useState(0);
const [total, setTotal] = useState(0);

// 👎 手动管理依赖，容易漏写
useEffect(() => {
  setTotal(price * qty);
}, [price, qty]); // 如果漏了依赖？

// 👎 甚至需要在渲染时处理逻辑
return (
  <input 
    onChange={e => {
       setPrice(e.target.value);
       // 或者是这样命令式调用？
       recalcTotal(); 
    }} 
  />
)`}
               </pre>
            </div>

            {/* The Formx Way */}
            <div className="p-8 bg-slate-900/50">
               <div className="flex items-center space-x-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-sm">The formx Way</h3>
               </div>
               <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
{`// ✅ 逻辑内聚在 Schema 中
const schema = [
  { key: 'price', type: 'NUMBER' },
  { key: 'qty', type: 'NUMBER' },
  { 
    key: 'total', 
    type: 'MONETARY',
    read_only: true,
    // ✨ 声明式依赖，引擎自动构建 DAG
    expression: 'price * qty' 
  }
];

// UI 组件只负责渲染，0 业务逻辑
<Field path="total" />`}
               </pre>
            </div>
         </div>
      </section>

      {/* Architecture Teaser */}
      <section className="flex flex-col lg:flex-row items-center gap-12 py-12">
          <div className="flex-1 space-y-6">
             <div className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
               Architecture
             </div>
             <h2 className="text-3xl font-bold text-slate-900">分层架构，各司其职</h2>
             <p className="text-lg text-slate-600">
                Formx 严格遵循 MVVM 模式，将 Schema 定义、运行时计算和 UI 渲染彻底分离。
                这种设计不仅提高了代码的可维护性，还让“更换 UI 库”变得前所未有的简单。
             </p>
             <ul className="space-y-4">
                <li className="flex items-start">
                   <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                   <div>
                      <strong className="text-slate-900">Schema Layer:</strong> 纯 JSON 定义，可远程下发，支持动态表单。
                   </div>
                </li>
                <li className="flex items-start">
                   <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                   <div>
                      <strong className="text-slate-900">Runtime Layer:</strong> 包含 Store、DAG 计算引擎和校验器。
                   </div>
                </li>
                <li className="flex items-start">
                   <CheckCircle2 className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                   <div>
                      <strong className="text-slate-900">UI Adapter:</strong> 极薄的适配层，支持 React, Vue, Svelte 等。
                   </div>
                </li>
             </ul>
             <div className="pt-4">
                <button onClick={() => onNavigate('docs')} className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center">
                   深入了解架构设计 <ArrowRight className="w-4 h-4 ml-2" />
                </button>
             </div>
          </div>
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0"></div>
             <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                   <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg font-mono text-sm">Blueprint Schema</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-slate-300"/></div>
                <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-xl text-center">
                   <Cpu className="w-8 h-8 mx-auto mb-2 text-indigo-200"/>
                   <div className="font-bold text-lg">Runtime Engine</div>
                   <div className="text-xs text-indigo-200 mt-1">Dependency Graph & State</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="rotate-90 text-slate-300"/></div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white border-2 border-slate-200 p-4 rounded-lg text-center text-slate-600 font-bold text-sm">React UI</div>
                   <div className="bg-white border-2 border-slate-200 p-4 rounded-lg text-center text-slate-600 font-bold text-sm">Vue UI</div>
                </div>
             </div>
          </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">准备好重构你的复杂业务了吗？</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">
               加入 formx 生态，体验逻辑与视图分离带来的极致开发效率。
            </p>
            <button 
               onClick={() => onNavigate('docs')}
               className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
               立即开始集成
            </button>
         </div>
      </section>

    </div>
  );
};