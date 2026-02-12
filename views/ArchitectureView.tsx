import React from 'react';
import { FileJson, ArrowRight, Cpu, LayoutGrid, ShieldCheck } from 'lucide-react';

export const ArchitectureView = () => (
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
