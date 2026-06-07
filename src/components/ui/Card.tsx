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
      className={`glass-panel rounded-xl p-6 transition-colors duration-200 border border-zinc-800
        ${onClick ? 'cursor-pointer' : ''}
        ${hoverable ? 'hover:border-zinc-700' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
};
