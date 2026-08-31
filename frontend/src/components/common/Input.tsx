import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';