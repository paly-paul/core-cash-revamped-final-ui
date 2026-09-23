import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'send' | 'warn'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const variantClasses = {
  primary: 'bg-[var(--blue)] text-white font-semibold hover:bg-[#004BBD]',
  secondary: 'bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:text-[var(--t1)] hover:border-[var(--blue)] hover:bg-[var(--blue-lt)]',
  ghost: 'bg-transparent text-[var(--t2)] border border-transparent hover:text-[var(--t1)] hover:bg-[var(--hov)]',
  icon: 'w-8 h-8 border border-[var(--b1)] bg-[var(--sur)] text-[var(--t2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lt)] p-0 justify-center',
  send: 'w-[34px] h-[34px] bg-[var(--blue)] text-white border-none rounded-[var(--rsm)] justify-center p-0 flex-shrink-0',
  warn: 'bg-[var(--amber-lt)] text-[var(--amber)] border border-[var(--amber-bd)] hover:bg-[var(--amber)] hover:text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-[11px]',
  md: 'px-3.5 py-[7px] text-[12px]',
  lg: 'px-4 py-2.5 text-[13px]',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--rsm)] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap font-[var(--ui)]',
        variantClasses[variant],
        variant !== 'icon' && variant !== 'send' && sizeClasses[size],
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="spinning text-sm">↻</span>}
      {children}
    </button>
  )
}
