import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { 
  Box, Layers, Cpu, Database, LayoutGrid, Code, CheckCircle2, 
  AlertTriangle, ArrowRight, GitMerge, ShieldCheck, Play, Terminal, 
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Copy, GripVertical,
  FileJson, Route, Calculator, Package, Wrench, Zap, Lock, FileCode, Eye,
  Smartphone, ShoppingBag, Minus, CheckSquare, Square, Menu, Anchor, Lightbulb,
  Table, List, Braces, MousePointerClick, Home, Share2, Sparkles, Github
} from 'lucide-react';
import { createRuntime, RuntimeEngine } from './lib/core';
import { createVanillaStore } from './lib/store';
import type { FieldSchema } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'architecture' | 'core' | 'ui' | 'plan' | 'demo' | 'docs'>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className={`bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-200 ${activeTab === 'home' ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">formx</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase hidden sm:block">Logic Engine <span className="text-indigo-600 opacity-60">@enginx</span></p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 pl-4">
            <TabButton id="home" label="首页" icon={<Home className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            <div className="w-px h-5 bg-slate-200 mx-2 hidden md:block"></div>
            <TabButton id="architecture" label="架构" icon={<Layers className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            <TabButton id="demo" label="演示" icon={<Play className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} highlight />
            <TabButton id="docs" label="文档" icon={<BookOpen className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            {/* Secondary tabs hidden on mobile or shown in dropdown in real app, keeping simple here */}
            <div className="hidden lg:flex space-x-1">
              <TabButton id="core" label="核心需求" icon={<Code className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
              <TabButton id="ui" label="UI 规范" icon={<LayoutGrid className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
              <TabButton id="plan" label="计划" icon={<GitMerge className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        {activeTab === 'home' && <LandingPageView onNavigate={setActiveTab} />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'core' && <CoreRequirementsView />}
        {activeTab === 'ui' && <UiSpecsView />}
        {activeTab === 'plan' && <PlanView />}
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'demo' && <KernelDemoView />}
      </main>
      
      {activeTab === 'home' && (
        <footer className="bg-white border-t border-slate-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4 text-slate-900 font-bold text-lg">
               <Cpu className="w-5 h-5 text-indigo-600" />
               <span>formx</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              © 2024 @enginx organization. Open source under MIT License.
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
               <a href="#" className="hover:text-slate-600 transition-colors"><Github className="w-5 h-5"/></a>
               <a href="#" className="hover:text-slate-600 transition-colors"><Share2 className="w-5 h-5"/></a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// --- LANDING PAGE ---

const LandingPageView = ({ onNavigate }: { onNavigate: (tab: any) => void }) => {
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
                <button onClick={() => onNavigate('architecture')} className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center">
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

// ... existing components ...

// --- DEMO IMPLEMENTATION (CARD MODEL) ---

// 1. Define Schema (Card List Structure)
const DEMO_SCHEMA: FieldSchema[] = [
  {
    key: 'project_name',
    type: 'TEXT',
    label: '项目名称',
    span: 12,
    ui: { placeholder: '输入项目名称...' }
  },
  {
    key: 'items',
    type: 'CARD_LIST', // 核心差异：不再是 Table，而是 CARD_LIST
    label: '采购明细',
    card: {
      title_expression: "'商品: ' + (item_name || '未命名')",
      layout: 'GRID',
      actions: ['delete', 'copy'],
      sections: [
        {
          title: '基础信息',
          fields: [
            { key: 'item_name', type: 'TEXT', label: '商品名称', span: 8 },
            { key: 'category', type: 'ENUM', label: '分类', span: 4, ui: { badge: 'Type' } }
          ]
        },
        {
          title: '金额计算',
          fields: [
            { key: 'price', type: 'MONETARY', label: '单价', span: 4 },
            { key: 'quantity', type: 'NUMBER', label: '数量', span: 4 },
            { key: 'amount', type: 'MONETARY', label: '小计', span: 4, read_only: true, expression: 'price * quantity', ui: { description: '行内自动计算' } }
          ]
        }
      ]
    }
  },
  {
    key: 'grand_total',
    type: 'MONETARY',
    label: '总金额 (聚合)',
    read_only: true,
    span: 12,
    ui: { description: 'Items 变化时自动 SUM', badge: 'Total' }
  }
];

// 2. React Adapter Components
const KernelDemoView = () => {
  const [viewMode, setViewMode] = useState<'preview' | 'mobile' | 'code'>('preview');

  const { engine } = useMemo(() => {
    const store = createVanillaStore({
      project_name: 'Q3 数据中心采购',
      items: [
        { item_name: '高性能服务器', category: 'HW', price: 12000, quantity: 2, amount: 24000 },
        { item_name: '千兆交换机', category: 'NET', price: 2500, quantity: 5, amount: 12500 }
      ],
      grand_total: 36500
    });
    
    const engine = createRuntime({ schema: DEMO_SCHEMA, store: store });
    return { engine };
  }, []);

  const state = useSyncExternalStore(
    (cb) => engine.getStore().subscribe(() => cb()),
    () => engine.getStore().getState()
  );

  const addItem = () => {
    const currentItems = state.items || [];
    const newItem = { item_name: '', category: '', price: 0, quantity: 1, amount: 0 };
    engine.setValue('items', [...currentItems, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = [...state.items];
    newItems.splice(index, 1);
    engine.setValue('items', newItems);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* UI Layer */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2 text-indigo-600" />
              Card Engine UI (React)
            </h3>
            
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button 
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors ${viewMode === 'preview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Eye className="w-3 h-3 mr-1.5" /> Web
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors ${viewMode === 'mobile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Smartphone className="w-3 h-3 mr-1.5" /> Mobile
              </button>
              <button 
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors ${viewMode === 'code' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <FileCode className="w-3 h-3 mr-1.5" /> 源码
              </button>
            </div>
          </div>
          
          <div className={`flex-1 ${viewMode === 'code' ? 'bg-slate-900' : 'bg-slate-100'} overflow-auto`}>
            {viewMode === 'preview' && (
              <div className="p-6 space-y-8">
                {/* Top Level Fields */}
                <div className="grid grid-cols-12 gap-4">
                   {DEMO_SCHEMA.filter(f => f.type !== 'CARD_LIST').map(field => (
                      <div key={field.key} className={`col-span-${field.span}`}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                        <input
                          disabled={field.read_only}
                          value={state[field.key] || ''}
                          onChange={e => engine.setValue(field.key, e.target.value)}
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white transition-colors"
                        />
                      </div>
                   ))}
                </div>

                {/* Card List Renderer */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">采购清单 (Record Cards)</h4>
                    <button onClick={addItem} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md flex items-center transition-colors shadow-sm">
                      <Plus className="w-3 h-3 mr-1" /> 添加条目
                    </button>
                  </div>

                  <div className="space-y-4">
                    {state.items.map((item: any, index: number) => {
                      const cardConfig = DEMO_SCHEMA.find(f => f.key === 'items')?.card;
                      if (!cardConfig) return null;

                      return (
                        <div key={index} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-2 duration-300">
                          {/* Card Header */}
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-lg">
                             <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                                <span className="font-semibold text-sm text-slate-700">
                                  #{index + 1} {item.item_name || '新商品'}
                                </span>
                             </div>
                             <div className="flex items-center space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-slate-200 rounded"><Copy className="w-3 h-3 text-slate-500"/></button>
                                <button onClick={() => removeItem(index)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-3 h-3"/></button>
                                <button className="p-1 hover:bg-slate-200 rounded"><ChevronDown className="w-3 h-3 text-slate-500"/></button>
                             </div>
                          </div>

                          {/* Card Body (Sections) */}
                          <div className="p-4 space-y-6">
                            {cardConfig.sections.map((section, sIdx) => (
                              <div key={sIdx}>
                                 <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 border-b border-slate-100 pb-1">{section.title}</h5>
                                 <div className="grid grid-cols-12 gap-3">
                                    {section.fields.map(field => {
                                      const path = `items.${index}.${field.key}`;
                                      return (
                                        <div key={field.key} className={`col-span-${field.span}`}>
                                          <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                                          <div className="relative">
                                            <input
                                              type={field.type === 'NUMBER' || field.type === 'MONETARY' ? 'number' : 'text'}
                                              value={item[field.key] || ''}
                                              disabled={field.read_only}
                                              onChange={(e) => {
                                                const val = field.type === 'NUMBER' || field.type === 'MONETARY' 
                                                  ? parseFloat(e.target.value) 
                                                  : e.target.value;
                                                engine.setValue(path, val);
                                              }}
                                              className={`block w-full rounded border-0 py-1.5 px-2 text-sm shadow-sm ring-1 ring-inset transition-all ${
                                                field.read_only 
                                                  ? 'bg-slate-50 text-slate-500 ring-slate-200' 
                                                  : 'text-slate-900 ring-slate-300 focus:ring-indigo-600'
                                              }`}
                                            />
                                            {field.ui?.badge && (
                                               <span className="absolute right-2 top-1.5 text-[10px] bg-slate-100 text-slate-500 px-1 rounded">{field.ui.badge}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                 </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Card Footer (Summary) */}
                          <div className="px-4 py-2 bg-indigo-50/30 border-t border-indigo-100 rounded-b-lg flex justify-end items-center">
                            <span className="text-xs text-indigo-600 font-medium mr-2">行小计:</span>
                            <span className="text-sm font-bold text-indigo-700">{item.amount?.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'mobile' && (
               <div className="h-full flex justify-center py-6 bg-slate-200">
                  <div className="w-[375px] h-full bg-[#f7f8fa] shadow-2xl rounded-3xl overflow-hidden flex flex-col border-[6px] border-slate-800 relative">
                     {/* Notch */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                     
                     {/* Mobile Header */}
                     <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
                        <div className="text-lg font-bold text-slate-800">购物车</div>
                        <div className="text-xs text-slate-500">编辑</div>
                     </div>

                     {/* Mobile Content */}
                     <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                           <div className="text-xs text-slate-500 mb-2">项目信息</div>
                           <input 
                              className="w-full text-sm font-medium border-b border-slate-100 pb-2 focus:outline-none focus:border-indigo-500"
                              value={state.project_name}
                              onChange={e => engine.setValue('project_name', e.target.value)}
                           />
                        </div>

                        {/* Vant-style Cell Group */}
                        <div className="space-y-2">
                           {state.items.map((item: any, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-3 shadow-sm flex gap-3">
                                 {/* Icon Area */}
                                 <div className="w-20 h-20 bg-slate-100 rounded-md shrink-0 flex items-center justify-center text-slate-300">
                                    <ShoppingBag className="w-8 h-8" />
                                 </div>
                                 
                                 {/* Content Area */}
                                 <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                       <div className="space-y-1">
                                          <div className="font-medium text-sm text-slate-800 line-clamp-2">{item.item_name || '未命名商品'}</div>
                                          <span className="inline-block bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded">
                                             {item.category || '默认'}
                                          </span>
                                       </div>
                                       <button onClick={() => removeItem(index)} className="text-slate-300 hover:text-red-500">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-2">
                                       <div>
                                          <span className="text-xs text-red-500 font-bold">¥</span>
                                          <span className="text-lg text-red-600 font-bold">{item.price}</span>
                                       </div>
                                       
                                       {/* Stepper */}
                                       <div className="flex items-center border border-slate-200 rounded-full overflow-hidden h-7">
                                          <button 
                                             className="w-7 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                                             onClick={() => engine.setValue(`items.${index}.quantity`, Math.max(0, (item.quantity || 0) - 1))}
                                          >
                                             <Minus className="w-3 h-3 text-slate-600" />
                                          </button>
                                          <input 
                                             className="w-10 h-full text-center text-xs font-medium border-x border-slate-200 focus:outline-none"
                                             value={item.quantity}
                                             type="number"
                                             onChange={(e) => engine.setValue(`items.${index}.quantity`, parseFloat(e.target.value))}
                                          />
                                          <button 
                                             className="w-7 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                                             onClick={() => engine.setValue(`items.${index}.quantity`, (item.quantity || 0) + 1)}
                                          >
                                             <Plus className="w-3 h-3 text-slate-600" />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        
                        <button 
                           onClick={addItem}
                           className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                           <Plus className="w-4 h-4" /> 添加商品
                        </button>

                        {/* Spacer for bottom bar */}
                        <div className="h-16"></div>
                     </div>

                     {/* Mobile Footer (Submit Bar) */}
                     <div className="bg-white border-t border-slate-100 p-2 flex justify-between items-center absolute bottom-0 left-0 right-0 z-10 pb-6 px-4">
                        <div className="flex items-end gap-1">
                           <span className="text-xs text-slate-500 mb-1">合计:</span>
                           <span className="text-sm text-red-500 font-bold mb-1">¥</span>
                           <span className="text-xl text-red-600 font-bold">{state.grand_total?.toLocaleString()}</span>
                        </div>
                        <button className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform">
                           提交订单
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {viewMode === 'code' && (
                <div className="p-4 space-y-6">
                   <CodeSnippet 
                     title="CardListRenderer.tsx" 
                     description="容器组件，负责迭代数据并渲染单个卡片"
                     code={`export const CardListRenderer = ({ path, schema }) => {
  // 1. 订阅该路径下的数组数据
  const items = useStoreSelector(path) || [];

  return (
    <div className="space-y-4">
      {items.map((_, index) => (
        <SingleCard 
          key={index}
          index={index}
          basePath={path} // e.g. "items"
          config={schema.card}
        />
      ))}
      <AddButton onClick={() => engine.insertRow(path)} />
    </div>
  );
}`} 
                   />

                   <CodeSnippet 
                     title="SingleCard.tsx" 
                     description="核心组件，负责渲染 Header, Sections 和 Footer"
                     code={`export const SingleCard = ({ index, basePath, config }) => {
  const rowPath = \`\${basePath}.\${index}\`; // e.g. "items.0"
  
  // 订阅当前行数据以计算动态标题
  const rowData = useStoreSelector(rowPath);
  const title = useExpression(config.title_expression, rowData);

  return (
    <div className="card">
      <CardHeader title={title} actions={config.actions} />
      
      <div className="card-body p-4">
        {config.sections.map(section => (
          <div key={section.title} className="mb-4">
            <h4>{section.title}</h4>
            <div className="grid grid-cols-12 gap-3">
              {section.fields.map(field => (
                <FieldRenderer
                  key={field.key}
                  path={\`\${rowPath}.\${field.key}\`} // e.g. "items.0.price"
                  schema={field}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`} 
                   />

                   <CodeSnippet 
                     title="FieldRenderer.tsx" 
                     description="原子组件，通过 Path 直接绑定 Store"
                     code={`export const FieldRenderer = ({ path, schema }) => {
  // 1. 订阅精确路径的值
  const value = useStoreSelector(path);
  
  // 2. 变更直接调用 Engine
  const handleChange = (val) => {
    engine.setValue(path, val); 
  };

  if (schema.read_only) {
    return <ReadOnlyDisplay value={value} />;
  }

  switch (schema.type) {
    case 'MONETARY': 
      return <MoneyInput value={value} onChange={handleChange} />;
    case 'ENUM':
      return <Select options={schema.options} value={value} onChange={handleChange} />;
    default:
      return <TextInput value={value} onChange={handleChange} />;
  }
}`} 
                   />
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Panels */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        
        {/* State Monitor */}
        <div className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-700 flex flex-col text-slate-300 font-mono text-xs h-96">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
             <h3 className="font-bold text-white flex items-center"><Database className="w-4 h-4 mr-2 text-emerald-500"/>Store State</h3>
             <span className="text-[10px] text-slate-500">Live JSON</span>
          </div>
          <div className="overflow-auto flex-1">
             <pre>{JSON.stringify(state, null, 2)}</pre>
          </div>
        </div>

        {/* Calculation Log Simulation */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1">
           <h3 className="font-bold text-slate-800 flex items-center mb-4"><Cpu className="w-4 h-4 mr-2 text-indigo-600"/>计算逻辑说明</h3>
           <ul className="space-y-3 text-xs text-slate-600">
             <li className="flex gap-2">
               <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">Row Scope</span>
               <span>当修改 Price 或 Qty 时，引擎解析路径 <code>items.1.price</code>，定位到当前卡片，仅重算该卡片的 Amount。</span>
             </li>
             <li className="flex gap-2">
               <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono">Aggregation</span>
               <span>Amount 变化后，引擎检测到 <code>grand_total</code> 依赖于 <code>items[*].amount</code>，触发全列表 SUM 聚合。</span>
             </li>
             <li className="flex gap-2">
               <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono">UI Adapter</span>
               <span>UI 层通过 `map` 渲染 Card List。每个 Input 绑定具体的 Path。Card 组件自身无状态，完全由 Store 驱动。</span>
             </li>
           </ul>
        </div>

      </div>
    </div>
  );
};

const CodeSnippet = ({ title, description, code }: { title: string, description: string, code: string }) => (
  <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 shadow-lg">
    <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
      <div>
        <span className="text-xs font-bold text-slate-200 block">{title}</span>
        <span className="text-[10px] text-slate-400">{description}</span>
      </div>
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
      </div>
    </div>
    <div className="p-4 overflow-x-auto custom-scrollbar">
      <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
        {code}
      </pre>
    </div>
  </div>
);

// --- DOCS VIEW COMPONENT ---

const DocsView = () => {
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
               <DocNavItem id="start" label="快速上手 (Quick Start)" active={activeDocTab} onClick={setActiveDocTab} icon={<Play className="w-4 h-4"/>} />
               <DocNavItem id="arch" label="架构详解 (Architecture)" active={activeDocTab} onClick={setActiveDocTab} icon={<Layers className="w-4 h-4"/>} />
               <DocNavItem id="headless" label="Headless 实践" active={activeDocTab} onClick={setActiveDocTab} icon={<Smartphone className="w-4 h-4"/>} />
               <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</div>
               <DocNavItem id="api" label="API 参考" active={activeDocTab} onClick={setActiveDocTab} icon={<Braces className="w-4 h-4"/>} />
               <DocNavItem id="schema" label="Schema 定义" active={activeDocTab} onClick={setActiveDocTab} icon={<FileJson className="w-4 h-4"/>} />
            </nav>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px]"> {/* Changed p-8 to p-6 */}
         {activeDocTab === 'intro' && <DocIntro onNavigate={setActiveDocTab} />}
         {activeDocTab === 'start' && <DocQuickStart />}
         {activeDocTab === 'arch' && <DocArchitecture />}
         {activeDocTab === 'headless' && <DocHeadless onNavigate={setActiveDocTab} />}
         {activeDocTab === 'api' && <DocApiReference />}
         {activeDocTab === 'schema' && <DocSchemaReference />}
      </div>
    </div>
  );
};

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

// --- DOC CONTENT SECTIONS ---

const DocIntro = ({ onNavigate }: any) => (
  <div className="space-y-6 max-w-3xl">
    <div className="border-b border-slate-100 pb-6">
       <h2 className="text-3xl font-bold text-slate-900 mb-4">为什么需要 formx?</h2>
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
             <li><b>Card Model:</b> 专为复杂嵌套数据设计</li>
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
                                  <button className="text-slate-400 hover:text-white"><Copy className="w-3 h-3"/></button>
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
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`import { createRuntime, createVanillaStore } from '@enginx/formx-core'; // 从 NPM 包导入

const initialData = { price: 10, quantity: 2, total: 20 };
// 对于 React 项目，@enginx/formx-react 包可能提供更优化的 Store 实现
const store = createVanillaStore(initialData); // 或者 createReactStore(initialData)
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
                      你可以直接将 <code>lib/core.ts</code>, <code>lib/store.ts</code> 和 <code>types.ts</code> 文件复制到你的项目源码中。
                      这适用于需要对源码进行定制、避免 NPM 依赖，或集成到非 React 环境（如 Vue 3, 小程序）的场景。
                  </p>
                  <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">1. 复制核心文件</h5>
                          <div className="bg-slate-900 rounded-lg p-3 text-white font-mono text-xs relative group">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="text-slate-400 hover:text-white"><Copy className="w-3 h-3"/></button>
                              </div>
                              <p>// 将以下文件复制到你的项目中，例如 `src/enginx/` 目录下</p>
                              <p><code>src/enginx/core.ts</code></p>
                              <p><code>src/enginx/store.ts</code></p>
                              <p><code>src/enginx/types.ts</code></p>
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

                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h5 className="font-bold text-sm text-slate-800 mb-2">3. UI 绑定 (Vue 3 示例)</h5>
                          <p className="text-sm text-slate-600 mb-3">
                              你将需要手动将 <code>RuntimeStore</code> 中的数据映射到 UI，并通过 <code>engine.setValue()</code> 触发更新。
                          </p>
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 overflow-x-auto">
                              <pre className="text-xs font-mono text-slate-700">{`// Vue 3 Component 示例 (src/components/MyForm.vue)
<template>
  <label>单价:</label>
  <input type="number" :value="price" @input="updatePrice($event.target.value)" />
  <p>总价: {{ total }}</p>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { engine } from '@/enginx/engine-instance'; // 你的引擎实例路径

const price = ref(engine.getStore().getState().price);
const total = ref(engine.getStore().getState().total);

const updatePrice = (val: string) => {
  engine.setValue('price', parseFloat(val));
};

onMounted(() => {
  // 订阅 Store 变更，并更新 Vue 响应式数据
  const unsubscribe = engine.getStore().subscribe(() => {
    price.value = engine.getStore().getState().price;
    total.value = engine.getStore().getState().total;
  });
  onUnmounted(unsubscribe);
});
</script>
`}</pre>
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

      <div className="space-y-4">
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

      <div className="overflow-hidden border border-slate-200 rounded-lg">
         <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
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
                  <td className="px-4 py-3 text-slate-600">TEXT, NUMBER, BOOLEAN, MONETARY, CARD_LIST...</td>
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
   </div>
);

const PlanView = () => (
   <div className="space-y-8">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">实施路线图</h2>
        <p className="text-sm text-slate-500 mt-1">项目处于早期核心构建阶段，正集中攻克运行时内核。</p>
      </div>
      <div className="hidden sm:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
         <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
         <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">当前进度: Phase 1</span>
      </div>
    </div>

    <div className="relative mt-8">
      <div className="absolute top-2 bottom-0 left-4 w-0.5 bg-slate-100"></div>
      
      <Phase 
        number="1" 
        title="核心内核 (Core Kernel)" 
        status="current"
        description="构建最基础的运行时环境，实现数据与视图分离，确立 Card 模型接口规范。"
        tasks={[
          { label: "Schema 类型定义 (Card Model)", completed: true },
          { label: "Runtime Store 接口定义", completed: true },
          { label: "基础 React 适配器", completed: true },
          { label: "移动端 (Vant) 适配演示", completed: true },
          { label: "基础依赖联动 (Mock)", completed: true },
          { label: "深度依赖解析算法 (DAG)", completed: false },
        ]}
      />
      <Phase 
        number="2" 
        title="计算引擎 (Computation)" 
        status="pending"
        description="引入依赖图算法，解决复杂的联动计算问题，确保无冗余重绘。"
        tasks={[
          { label: "AST 表达式解析器", completed: false },
          { label: "DAG 拓扑排序算法", completed: false },
          { label: "循环依赖检测", completed: false },
          { label: "异步函数计算支持", completed: false },
          { label: "脏值检测与增量更新", completed: false },
        ]}
      />
      <Phase 
        number="3" 
        title="高级 UI (Advanced UI)" 
        status="pending"
        description="丰富 UI 组件库，支持复杂的交互场景和高性能的大数据量渲染。"
        tasks={[
          { label: "Monetary 金额专用 Cell", completed: false },
          { label: "Dimension 维度选择 Cell", completed: false },
          { label: "虚拟滚动 (Virtual Scroll)", completed: false },
          { label: "插槽系统 (Slot System)", completed: false },
        ]}
      />
      <Phase 
        number="4" 
        title="生态系统 (Ecosystem)" 
        status="pending"
        description="开放扩展能力，支持第三方业务插件注入，适配更多前端框架。"
        tasks={[
          { label: "插件注册机制", completed: false },
          { label: "外部函数注入", completed: false },
          { label: "Vue 3 适配器", completed: false },
        ]}
      />
    </div>
   </div>
);

const Phase = ({ number, title, tasks, status, description }: any) => {
  const isCurrent = status === 'current';
  
  return (
    <div className={`relative pl-12 pb-12 last:pb-0 group ${status === 'pending' ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
      {/* Indicator Line/Dot */}
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold z-10 transition-colors duration-300 ${
        isCurrent 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
          : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
      }`}>
        {isCurrent ? <Zap className="w-4 h-4 fill-current" /> : number}
      </div>

      {/* Content Card */}
      <div className={`p-6 rounded-xl border transition-all duration-300 ${
        isCurrent 
          ? 'bg-white border-indigo-500 shadow-lg ring-1 ring-indigo-500/20' 
          : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-md'
      }`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className={`font-bold text-lg ${isCurrent ? 'text-indigo-900' : 'text-slate-700'}`}>
              Phase {number}: {title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
          {isCurrent && (
            <span className="flex-shrink-0 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-200">
              开发中
            </span>
          )}
        </div>
        
        {/* Task List Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {tasks.map((task: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-2.5 text-sm group/task">
              {task.completed ? (
                <div className="flex-shrink-0 text-indigo-600">
                  <CheckSquare className="w-4 h-4" />
                </div>
              ) : (
                <div className="flex-shrink-0 text-slate-300 group-hover/task:text-slate-400 transition-colors">
                  <Square className="w-4 h-4" />
                </div>
              )}
              <span className={`transition-colors ${task.completed ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helpers
const TabButton = ({ id, label, icon, active, onClick, highlight }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
      active === id 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : highlight 
          ? 'text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const RequirementCard = ({ title, icon, description, children }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold text-slate-900 text-lg flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
      {children}
    </div>
  </div>
);

const RequirementItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <div className="mt-1 mr-2 flex-shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
    </div>
    <span>{children}</span>
  </li>
);

const CoreRequirementsView = () => (
  <div className="space-y-6">
    <RequirementCard 
      title="1. 智能计算大脑 (像 Excel 一样思考)" 
      icon={<GitMerge className="w-5 h-5 text-indigo-600" />}
      description="告别手动写一堆 useEffect。引擎自动分析数据依赖，数据变了，结果自动算出来。"
    >
      <ul className="space-y-2 mt-4 text-sm text-slate-600">
        <RequirementItem><strong>自动关联：</strong> 定义 <code>A = B + C</code>，当 B 或 C 变化时，A 自动更新。</RequirementItem>
        <RequirementItem><strong>防止死循环：</strong> 如果不小心写了 A 依赖 B，B 又依赖 A，引擎会立刻报错，防止页面卡死。</RequirementItem>
        <RequirementItem><strong>顺序智能：</strong> 哪怕依赖关系再复杂，引擎也能自动理清计算顺序（拓扑排序）。</RequirementItem>
      </ul>
    </RequirementCard>

    <RequirementCard 
      title="2. 独立卡片模型 (每个都是小宇宙)" 
      icon={<Package className="w-5 h-5 text-purple-600" />}
      description="不再是一张平铺的大表格。每一行数据都是一个独立的“卡片”，拥有自己的计算逻辑。"
    >
      <ul className="space-y-2 mt-4 text-sm text-slate-600">
        <RequirementItem><strong>独立作用域：</strong> 卡片内的公式（如 `数量 * 单价`）只影响当前卡片，互不干扰。</RequirementItem>
        <RequirementItem><strong>无限嵌套：</strong> 卡片里可以再套表格，表格里再套卡片，完美支持复杂的业务单据。</RequirementItem>
        <RequirementItem><strong>结构化布局：</strong> 支持 Header、Body、Footer 分区，不再受限于 Grid 行列。</RequirementItem>
      </ul>
    </RequirementCard>

    <RequirementCard 
      title="3. 极致性能与安全 (不卡顿，不崩溃)" 
      icon={<Zap className="w-5 h-5 text-amber-500" />}
      description="只做必要的计算，只渲染必要的地方。即使有 1000 行数据，操作依然丝滑。"
    >
       <ul className="space-y-2 mt-4 text-sm text-slate-600">
        <RequirementItem><strong>精准更新：：</strong> 改了一个字，引擎只通知相关的组件重绘，不会刷新整个页面。</RequirementItem>
        <RequirementItem><strong>安全沙箱：</strong> 所有的表达式都在沙箱里执行，业务代码写错了也不会导致整个系统崩溃。</RequirementItem>
        <RequirementItem><strong>虚拟滚动：：</strong> 天然支持大数据量列表，只渲染屏幕内可见的卡片。</RequirementItem>
      </ul>
    </RequirementCard>
  </div>
);

// --- NEW COMPONENTS ---

const ArchitectureView = () => (
  <div className="space-y-8 animate-in fade-in duration-300">
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">总体架构设计</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <FileJson className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">1. Blueprint Schema Layer</h3>
          <p className="text-sm text-slate-500">定义字段、行为、UI 元数据，与具体实现解耦。</p>
        </div>
        
        <div className="flex flex-col items-center justify-center">
           <ArrowRight className="w-8 h-8 text-slate-300 rotate-90 md:rotate-0 my-4 md:my-0" />
        </div>

        <div className="p-6 bg-slate-900 rounded-lg border border-slate-800 shadow-xl">
          <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
             <Cpu className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">2. Runtime Engine Layer</h3>
          <p className="text-sm text-slate-400">状态管理、依赖图 (DAG)、计算引擎、校验逻辑。</p>
        </div>

        <div className="flex flex-col items-center justify-center">
           <ArrowRight className="w-8 h-8 text-slate-300 rotate-90 md:rotate-0 my-4 md:my-0" />
        </div>

        <div className="p-6 bg-white rounded-lg border-2 border-dashed border-slate-300">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <LayoutGrid className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">3. Cell Render Layer</h3>
          <p className="text-sm text-slate-500">具体渲染与交互逻辑 (React/Vue/Mobile)，UI 适配层。</p>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-100">
         <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600"/> 核心原则
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>严禁耦合：：</strong> Schema 层绝不引用 Runtime 或 UI 代码。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>状态隔离：：</strong> UI 组件不持有业务状态，只负责渲染 store 中的数据。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>Schema 驱动：：</strong> 所有的业务逻辑（显隐、禁用、计算）必须在 Schema 中声明。
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">
               <strong>可插拔：：</strong> Cell 组件通过 Registry 注册，支持插件化扩展。
            </div>
         </div>
      </div>
    </div>
  </div>
);

const UiSpecsView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Specification Card 1 */}
       <RequirementCard 
         title="Card 布局规范" 
         icon={<LayoutGrid className="w-5 h-5 text-indigo-600" />}
         description="移动端优先的卡片式设计，支持复杂的嵌套结构。"
       >
          <ul className="space-y-3 mt-4 text-sm text-slate-600">
             <RequirementItem><strong>Header:</strong> 支持动态标题（Expression）、状态标签、操作菜单。</RequirementItem>
             <RequirementItem><strong>Sections:</strong> 内部支持多个分组 (Section)，可折叠。</RequirementItem>
             <RequirementItem><strong>Grid System:</strong> 内部字段使用 12 栅格布局 (Span 1-12)。</RequirementItem>
             <RequirementItem><strong>Footer:</strong> 汇总信息展示区。</RequirementItem>
          </ul>
       </RequirementCard>

       {/* Specification Card 2 */}
       <RequirementCard 
         title="Cell 组件交互规范" 
         icon={<MousePointerClick className="w-5 h-5 text-purple-600" />}
         description="标准化所有输入单元的交互行为。"
       >
          <ul className="space-y-3 mt-4 text-sm text-slate-600">
             <RequirementItem><strong>Monetary:</strong> 专用金额输入，支持精度控制、货币符号。</RequirementItem>
             <RequirementItem><strong>Dimension:</strong> 维度选择，支持搜索、多选、Tag 展示。</RequirementItem>
             <RequirementItem><strong>Slot:</strong> 前后缀插槽 (Prefix/Suffix)，支持 Icon 或 文字。</RequirementItem>
             <RequirementItem><strong>Validation:</strong> 实时错误提示 (Error Message)。</RequirementItem>
          </ul>
       </RequirementCard>
    </div>

    {/* Visual Example */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
       <h3 className="font-bold text-slate-900 mb-4">UI 结构示意图</h3>
       <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex justify-center bg-slate-50">
          <div className="w-[320px] bg-white shadow-xl rounded-lg border border-slate-200 overflow-hidden">
             <div className="bg-indigo-600 h-2 w-full"></div>
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
             </div>
             <div className="p-4 space-y-4">
                <div className="space-y-2">
                   <div className="w-16 h-3 bg-slate-100 rounded"></div>
                   <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                      <div className="w-12 h-3 bg-slate-100 rounded"></div>
                      <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded"></div>
                   </div>
                   <div className="space-y-2">
                      <div className="w-12 h-3 bg-slate-100 rounded"></div>
                      <div className="w-full h-8 bg-slate-50 border border-slate-200 rounded"></div>
                   </div>
                </div>
             </div>
             <div className="bg-slate-50 p-3 text-center text-xs text-slate-400 border-t border-slate-100">
                Footer Summary Area
             </div>
          </div>
       </div>
    </div>
  </div>
);