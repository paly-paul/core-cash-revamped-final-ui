export interface NavItem {
  key: string
  label: string
  icon: string
  badge?: number
}

export interface NavSection {
  section: string
  items: NavItem[]
}

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

export interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

export interface ModalConfig {
  title?: string
  content: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export interface ApprovalItem {
  id: string
  title: string
  description: string
  amount: number
  category: string
  entity: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  approverRole: string
  rejectionReason: string | null
}

export interface Account {
  id: string
  account_number: string
  name: string
  bank: string
  currency: string
  entity: string
  balance: number
  available_balance: number
  min_threshold: number
  od_limit: number | null
  restricted_flag: boolean
  status: 'Active' | 'Inactive'
  account_type: 'Operating' | 'Investment' | 'Loan'
  refresh_freq: 'Daily' | 'Weekly' | 'Manual'
  feed_type: 'bank' | 'manual'
  hours_stale: number | null
  days_stale: number | null
  feed_missing: boolean
  od_utilised: boolean
  status_lbl: string
}

export interface TrendDataPoint {
  date: string
  cash_runway_days: number
  liquidity_risk_score: number
}
