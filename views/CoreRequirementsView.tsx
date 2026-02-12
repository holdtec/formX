import React from 'react';
import { GitMerge, Package, Zap } from 'lucide-react';
import { RequirementCard, RequirementItem } from '../components/Shared';

export const CoreRequirementsView = () => (
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
