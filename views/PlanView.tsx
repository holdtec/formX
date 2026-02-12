import React from 'react';
import { Zap, CheckSquare, Square } from 'lucide-react';

const Phase = ({ number, title, tasks, status, description }: any) => {
  const isCurrent = status === 'current';
  
  return (
    <div className={`relative pl-12 pb-12 last:pb-0 group ${status === 'pending' ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
      {/* Indicator Line/Dot */}
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold z-10 transition-colors duration-300 ${
        status === 'done'
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : isCurrent 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
            : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
      }`}>
        {status === 'done' ? <CheckSquare className="w-4 h-4" /> : (isCurrent ? <Zap className="w-4 h-4 fill-current" /> : number)}
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
          {status === 'done' && (
            <span className="flex-shrink-0 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200">
              已完成
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

export const PlanView = () => (
   <div className="space-y-8">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">实施路线图</h2>
        <p className="text-sm text-slate-500 mt-1">项目进入 Phase 3，UI 组件库与交互增强开发中。</p>
      </div>
      <div className="hidden sm:flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
         <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
         <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">当前进度: Phase 3</span>
      </div>
    </div>

    <div className="relative mt-8">
      <div className="absolute top-2 bottom-0 left-4 w-0.5 bg-slate-100"></div>
      
      <Phase 
        number="1" 
        title="核心内核 (Core Kernel)" 
        status="done"
        description="构建最基础的运行时环境，实现数据与视图分离，确立 Card 模型接口规范。"
        tasks={[
          { label: "Schema 类型定义 (Card Model)", completed: true },
          { label: "Runtime Store 接口定义", completed: true },
          { label: "基础 React 适配器", completed: true },
          { label: "移动端 (Vant) 适配演示", completed: true },
          { label: "基础依赖联动 (Mock)", completed: true },
          { label: "深度依赖解析算法 (DAG)", completed: true },
        ]}
      />
      <Phase 
        number="2" 
        title="计算引擎 (Computation)" 
        status="done"
        description="引入依赖图算法，解决复杂的联动计算问题，支持聚合与安全表达式。"
        tasks={[
          { label: "AST 表达式解析器 (Safe Mode)", completed: true },
          { label: "DAG 拓扑排序算法", completed: true },
          { label: "Scoped Evaluation (Row vs Global)", completed: true },
          { label: "Aggregation (SUM) 支持", completed: true },
          { label: "循环依赖检测", completed: true },
          { label: "脏值检测与增量更新", completed: true },
        ]}
      />
      <Phase 
        number="3" 
        title="高级 UI (Advanced UI)" 
        status="current"
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