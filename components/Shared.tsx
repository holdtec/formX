import React, { useState, useRef, useEffect } from 'react';

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

export const DropdownTab = ({ label, icon, items, active, onClick }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isActive = items.some((item: any) => active === item.id);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <div ref={dropdownRef}>
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            isActive 
              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          {icon}
          <span>{label}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
          style={{ top: position.top, left: position.left, width: '180px' }}
        >
          {items.map((item: any) => (
            <button
              key={item.id}
              onClick={() => {
                onClick(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                active === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

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
