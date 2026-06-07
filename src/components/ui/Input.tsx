import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  const id = useId();
  const [show, setShow] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword && show ? 'text' : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        )}

        <input
          id={id}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          className={`w-full rounded-lg bg-zinc-950 border text-sm text-zinc-100 placeholder-zinc-600
            focus:outline-none focus:ring-1 transition-colors
            ${Icon ? 'pl-9' : 'pl-3'} ${isPassword ? 'pr-10' : 'pr-3'} py-2.5
            ${error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
              : 'border-zinc-800 hover:border-zinc-700 focus:border-blue-500 focus:ring-blue-500/40'}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
};
