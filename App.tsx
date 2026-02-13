import React, { useState } from 'react';
import { 
  Box, Layers, Cpu, Database, LayoutGrid, Code, CheckCircle2, 
  AlertTriangle, ArrowRight, GitMerge, ShieldCheck, Play, Terminal, 
  BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Copy, GripVertical,
  FileJson, Route, Calculator, Package, Wrench, Zap, Lock, FileCode, Eye,
  Smartphone, ShoppingBag, Minus, CheckSquare, Square, Menu, Anchor, Lightbulb,
  Table, List, Braces, MousePointerClick, Home, Share2, Sparkles, Github
} from 'lucide-react';

import { TabButton, DropdownTab } from './components/Shared';
import { LandingPageView } from './views/LandingPageView';
import { CoreRequirementsView } from './views/CoreRequirementsView';
import { UiSpecsView } from './views/UiSpecsView';
import { PlanView } from './views/PlanView';
import { DocsView } from './views/DocsView';
import { KernelDemoView } from './views/KernelDemoView';
import { FormxReactDemoView } from './views/FormxReactDemoView';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'core' | 'ui' | 'plan' | 'demo' | 'docs' | 'react-demo'>('home');

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
            <DropdownTab 
              label="演示" 
              icon={<Play className="w-4 h-4" />} 
              active={activeTab} 
              onClick={setActiveTab}
              items={[
                { id: 'react-demo', label: 'React 组件', icon: <Package className="w-4 h-4" /> },
                { id: 'demo', label: '内核演示', icon: <Cpu className="w-4 h-4" /> }
              ]}
            />
            <TabButton id="docs" label="文档" icon={<BookOpen className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            <div className="hidden lg:flex space-x-1">
              <div className="w-px h-5 bg-slate-200 mx-2 hidden md:block"></div>
              <TabButton id="core" label="核心需求" icon={<Code className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
              <TabButton id="ui" label="UI 规范" icon={<LayoutGrid className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
              <TabButton id="plan" label="计划" icon={<GitMerge className="w-4 h-4" />} active={activeTab} onClick={setActiveTab} />
            </div>
            <div className="w-px h-5 bg-slate-200 mx-2 hidden md:block"></div>
            <a 
              href="https://github.com/holdtec/formX.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
        {activeTab === 'home' && <LandingPageView onNavigate={setActiveTab} />}
        {activeTab === 'core' && <CoreRequirementsView />}
        {activeTab === 'ui' && <UiSpecsView />}
        {activeTab === 'plan' && <PlanView />}
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'demo' && <KernelDemoView />}
        {activeTab === 'react-demo' && <FormxReactDemoView />}
      </main>
      
      {activeTab === 'home' && (
        <footer className="bg-white border-t border-slate-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4 text-slate-900 font-bold text-lg">
               <Cpu className="w-5 h-5 text-indigo-600" />
               <span>formx</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              © 2026-{new Date().getFullYear()} @enginx organization. Open source under MIT License.
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
               <a href="https://github.com/holdtec/formX.git" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors"><Github className="w-5 h-5"/></a>
               <a href="https://holdtec.github.io/formX/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors"><BookOpen className="w-5 h-5"/></a>
               <a href="#" className="hover:text-slate-600 transition-colors"><Share2 className="w-5 h-5"/></a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}