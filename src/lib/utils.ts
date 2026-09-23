import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = '£', decimals = 0): string {
  const absVal = Math.abs(value)
  let formatted: string
  if (absVal >= 1_000_000) {
    formatted = `${(value / 1_000_000).toFixed(1)}M`
  } else if (absVal >= 1_000) {
    formatted = `${(value / 1_000).toFixed(0)}K`
  } else {
    formatted = value.toFixed(decimals)
  }
  return `${currency}${formatted}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function riskColor(score: number): 'green' | 'amber' | 'red' {
  if (score <= 40) return 'green'
  if (score <= 70) return 'amber'
  return 'red'
}

export function riskScoreColor(score: number): 'green' | 'amber' | 'red' {
  if (score <= 3) return 'green'
  if (score <= 6) return 'amber'
  return 'red'
}

export function statusBadgeClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-[var(--green-lt)] text-[var(--green)] border border-[var(--green-bd)]'
    case 'rejected': return 'bg-[var(--red-lt)] text-[var(--red)] border border-[var(--red-bd)]'
    case 'pending': return 'bg-[var(--amber-lt)] text-[var(--amber)] border border-[var(--amber-bd)]'
    case 'active': return 'bg-[var(--green-lt)] text-[var(--green)] border border-[var(--green-bd)]'
    case 'inactive': return 'bg-[var(--elv)] text-[var(--tm)] border border-[var(--b0)]'
    default: return 'bg-[var(--elv)] text-[var(--tm)] border border-[var(--b0)]'
  }
}
