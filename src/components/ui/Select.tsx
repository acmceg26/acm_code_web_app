import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  icon: Icon,
  error,
  options,
  placeholder,
  className = '',
  value,
  ...props
}) => {
  const id = useId();
  const isEmpty = value === '' || value === undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        )}

        <select
          id={id}
          value={value}
          aria-invalid={error ? true : undefined}
          className={`w-full appearance-none rounded-lg bg-zinc-950 border text-sm
            focus:outline-none focus:ring-1 transition-colors cursor-pointer
            ${Icon ? 'pl-9' : 'pl-3'} pr-9 py-2.5
            ${isEmpty ? 'text-zinc-600' : 'text-zinc-100'}
            ${error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
              : 'border-zinc-800 hover:border-zinc-700 focus:border-blue-500 focus:ring-blue-500/40'}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-zinc-100 bg-zinc-950">
              {o.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
};
