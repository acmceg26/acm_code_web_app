import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  className = '',
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer select-none group ${className}`} htmlFor={id}>
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 
          ${checked 
            ? 'bg-blue-600 border-blue-500'
            : 'border-zinc-700 bg-zinc-900 group-hover:border-blue-500/50'
          }`}
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-white animate-fade-in-up"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className={`ml-3 text-sm transition-colors duration-200 ${checked ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
          {label}
        </span>
      )}
    </label>
  );
};
