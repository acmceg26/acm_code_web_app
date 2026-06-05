import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  badge?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-slate-800 bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md border-indigo-500/20' : ''} ${className}`}>
      <button
        type="button"
        className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-slate-200 hover:bg-slate-900/60 transition-colors duration-150"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <span className="truncate">{title}</span>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
        />
      </button>
      
      {/* Content wrapper with conditional heights */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] border-t border-slate-800' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="p-5 bg-slate-950/20">
          {children}
        </div>
      </div>
    </div>
  );
};
