import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  variant?: 'default' | 'elevated' | 'metric'
  className?: string
  children: React.ReactNode
}

export function Card({ variant = 'default', className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)]',
        variant === 'default' && 'shadow-[var(--shc)]',
        variant === 'elevated' && 'shadow-[var(--she)]',
        variant === 'metric' && 'shadow-[var(--shc)] flex flex-col gap-1.5 p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Section card with header and body
interface SectionCardProps {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, actions, children, className }: SectionCardProps) {
  return (
    <div className={cn('bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] shadow-[var(--shc)] overflow-visible', className)}>
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--b0)] bg-[var(--elv)] rounded-t-[var(--rmd)]">
        <span className="text-[12px] font-bold text-[var(--t1)]">{title}</span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// Metric card
interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
  delta?: string
  deltaDir?: 'up' | 'down' | 'flat'
  color?: 'blue' | 'green' | 'amber' | 'red' | 'info'
  isPrimary?: boolean
  children?: React.ReactNode
  className?: string
}

const colorTopBar: Record<string, string> = {
  blue: 'before:bg-[var(--blue)]',
  green: 'before:bg-[var(--green)]',
  amber: 'before:bg-[var(--amber)]',
  red: 'before:bg-[var(--red)]',
  info: 'before:bg-[var(--info)]',
}

export function MetricCard({
  label,
  value,
  subValue,
  delta,
  deltaDir,
  color,
  isPrimary,
  children,
  className,
}: MetricCardProps) {
  const deltaClasses = {
    up: 'text-[var(--green)]',
    down: 'text-[var(--red)]',
    flat: 'text-[var(--tm)]',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden flex flex-col gap-1.5 p-4 rounded-[var(--rmd)] border shadow-[var(--shc)]',
        'before:content-[""] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px]',
        isPrimary
          ? 'border-2 border-[var(--blue)] bg-[var(--blue-lt)] before:bg-[var(--blue)]'
          : 'bg-[var(--sur)] border-[var(--b0)]',
        color && colorTopBar[color],
        className
      )}
    >
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--tm)]">{label}</div>
      <div
        className={cn(
          'font-[var(--mono)] text-[22px] font-semibold tracking-[-0.02em] leading-[1.1] text-[var(--t1)]',
          isPrimary && 'text-[28px] text-[var(--blue)]'
        )}
      >
        {value}
      </div>
      {delta && (
        <div className={cn('text-[11px] font-[var(--mono)] font-medium', deltaDir && deltaClasses[deltaDir])}>
          {delta}
        </div>
      )}
      {subValue && (
        <div className="text-[10px] text-[var(--tm)] border-t border-[var(--b0)] pt-[7px] mt-0.5">
          {subValue}
        </div>
      )}
      {children}
    </div>
  )
}

// Table wrapper card
export function TableCard({
  title,
  actions,
  children,
  className,
}: {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] overflow-hidden shadow-[var(--shc)]', className)}>
      {title && (
        <div className="px-4 py-[11px] flex items-center justify-between border-b border-[var(--b0)] bg-[var(--elv)]">
          <span className="text-[12px] font-bold text-[var(--t1)]">{title}</span>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
