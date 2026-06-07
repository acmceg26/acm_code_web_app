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
    <div className={`border bg-zinc-900/30 rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-zinc-700' : 'border-zinc-800'} ${className}`}>
      <button
        type="button"
        className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-zinc-200 hover:bg-zinc-900/60 transition-colors duration-150"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <span className="truncate">{title}</span>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`}
        />
      </button>
      
      {/* Content wrapper with conditional heights */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] border-t border-zinc-800' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="p-5 bg-zinc-950/20">
          {children}
        </div>
      </div>
    </div>
  );
};
