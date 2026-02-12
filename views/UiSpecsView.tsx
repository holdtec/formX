import React from 'react';
import { LayoutGrid, MousePointerClick } from 'lucide-react';
import { RequirementCard, RequirementItem } from '../components/Shared';

export const UiSpecsView = () => (
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
