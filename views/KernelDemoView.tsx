import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { LayoutGrid, Eye, Smartphone, FileCode, Plus, GripVertical, Copy, Trash2, ChevronDown, ShoppingBag, Minus, Database, Cpu, ShieldCheck } from 'lucide-react';
import { createRuntime } from '../lib/core';
import { createVanillaStore } from '../lib/store';
import type { FieldSchema } from '../types';

// 1. Define Schema (Updated with Real Aggregation Expression)
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
    type: 'CARD_LIST',
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
            // Dependency: price, quantity -> amount
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
    // Dependency: items.amount -> grand_total
    expression: 'SUM(items.amount)',
    ui: { description: '基于 items.amount 聚合', badge: 'Auto Sum' }
  }
];

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

export const KernelDemoView = () => {
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
    
    // Engine now uses the Real DAG implementation
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
           <h3 className="font-bold text-slate-800 flex items-center mb-4"><Cpu className="w-4 h-4 mr-2 text-indigo-600"/>计算逻辑说明 (DAG V1.2 - Safe Mode)</h3>
           <ul className="space-y-3 text-xs text-slate-600">
             <li className="flex gap-2">
               <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono shrink-0">Safe Eval</span>
               <span>
                  Replaced <code>new Function()</code> with a recursive descent parser.
                  Fully compatible with WeChat MiniPrograms and strict CSP environments.
               </span>
             </li>
             <li className="flex gap-2">
               <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono shrink-0">Recursion</span>
               <span>
                  Updating <code>items.0.price</code> triggers dependency check. Graph says: <code>price</code> → <code>amount</code>.
                  Engine calculates <code>items.0.amount</code> using safe math.
               </span>
             </li>
             <li className="flex gap-2">
               <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono shrink-0">Aggregation</span>
               <span>
                  Engine parses <code>SUM(items.amount)</code>. It sums up all rows in `items` and updates `grand_total`.
               </span>
             </li>
           </ul>
        </div>

      </div>
    </div>
  );
};