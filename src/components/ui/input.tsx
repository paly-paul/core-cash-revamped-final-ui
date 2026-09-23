import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-semibold text-[var(--t2)]">{label}</label>
      )}
      <input
        className={cn(
          'bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] px-[11px] py-[7px]',
          'text-[var(--t1)] text-[12.5px] font-[var(--ui)] outline-none transition-all duration-150 w-full',
          'placeholder:text-[var(--tm)]',
          'focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(0,87,217,0.1)]',
          error && 'border-[var(--red)]',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-[var(--red)]">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[var(--tm)]">{helperText}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-semibold text-[var(--t2)]">{label}</label>
      )}
      <textarea
        className={cn(
          'bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] px-[11px] py-[7px]',
          'text-[var(--t1)] text-[12px] font-[var(--ui)] outline-none transition-all duration-150 w-full resize-none',
          'placeholder:text-[var(--tm)]',
          'focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(0,87,217,0.1)]',
          error && 'border-[var(--red)]',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-[var(--red)]">{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-semibold text-[var(--t2)]">{label}</label>
      )}
      <select
        className={cn(
          'bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] px-[11px] py-[7px]',
          'text-[var(--t1)] text-[12.5px] font-[var(--ui)] outline-none transition-all duration-150 w-full',
          'appearance-none',
          'focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(0,87,217,0.1)]',
          error && 'border-[var(--red)]',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239AA3B5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: '28px',
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-[var(--red)]">{error}</p>}
    </div>
  )
}
