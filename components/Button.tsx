"use client";
import clsx from 'clsx';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';

type ButtonProps = PropsWithChildren<{
  variant?: Variant;
  className?: string;
}> & ButtonHTMLAttributes<HTMLButtonElement>;

export function buttonClasses(variant: Variant = 'primary', disabled = false) {
  const base = 'px-4 py-3 rounded-xl border-[3px] font-bold shadow-retro transition-transform duration-150 ease-in-out active:translate-y-[1px] hover:scale-[1.02]';
  const variants: Record<Variant, string> = {
    primary: 'bg-primary text-white border-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white border-white hover:bg-secondary/90',
    outline: 'bg-transparent text-white border-white hover:bg-white/10',
  };
  return clsx(base, variants[variant], disabled && 'opacity-70 cursor-not-allowed scale-100');
}

export function Button({ variant = 'primary', className, disabled, children, ...rest }: ButtonProps) {
  return (
    <button {...rest} disabled={disabled} className={clsx(buttonClasses(variant, !!disabled), className)}>
      {children}
    </button>
  );
}
