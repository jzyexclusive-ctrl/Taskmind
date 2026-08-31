import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2.5';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-md shadow-indigo-500/20',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-md shadow-rose-500/20',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  );
};