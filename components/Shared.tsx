import React from 'react';

export const TabButton = ({ id, label, icon, active, onClick, highlight }: any) => (
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

export const RequirementCard = ({ title, icon, description, children }: any) => (
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

export const RequirementItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <div className="mt-1 mr-2 flex-shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
    </div>
    <span>{children}</span>
  </li>
);
