import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[var(--green-lt)] text-[var(--green)] border border-[var(--green-bd)]',
  warning: 'bg-[var(--amber-lt)] text-[var(--amber)] border border-[var(--amber-bd)]',
  error: 'bg-[var(--red-lt)] text-[var(--red)] border border-[var(--red-bd)]',
  info: 'bg-[var(--info-lt)] text-[var(--info)] border border-[var(--info-bd)]',
  primary: 'bg-[var(--blue-lt)] text-[var(--blue)] border border-[var(--blue-bd)]',
  neutral: 'bg-[var(--elv)] text-[var(--tm)] border border-[var(--b0)]',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-[10px] text-[10px] font-bold whitespace-nowrap',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Approval status badges
export function ApprovalBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const classes = {
    pending: 'text-[var(--amber)] bg-[var(--amber-lt)] border border-[var(--amber-bd)]',
    approved: 'text-[var(--green)] bg-[var(--green-lt)] border border-[var(--green-bd)]',
    rejected: 'text-[var(--red)] bg-[var(--red-lt)] border border-[var(--red-bd)]',
  }
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-[10px]', classes[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Status pill (for metrics: high/medium/low)
export function StatusPill({
  variant,
  children,
}: {
  variant: 'high' | 'medium' | 'low'
  children: React.ReactNode
}) {
  const classes = {
    high: 'bg-[var(--green-lt)] text-[var(--green)] border border-[var(--green-bd)]',
    medium: 'bg-[var(--amber-lt)] text-[var(--amber)] border border-[var(--amber-bd)]',
    low: 'bg-[var(--red-lt)] text-[var(--red)] border border-[var(--red-bd)]',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-[10px] text-[10px] font-semibold', classes[variant])}>
      {children}
    </span>
  )
}
