import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 border border-slate-800/80 
        ${onClick ? 'cursor-pointer' : ''} 
        ${hoverable ? 'hover:scale-[1.01] hover:border-slate-700/80 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/[0.03]' : ''} 
        ${className}`}
    >
      {children}
    </div>
  );
};
