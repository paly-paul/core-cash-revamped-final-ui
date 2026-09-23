export const PAGE_ROUTES = {
  DASHBOARD: 'dashboard',
  CFO_SUMMARY: 'cfo-summary',
  BRIEFING: 'briefing',
  CASH_POSITION: 'cash-position',
  FORECAST: 'forecast',
  UPLOADS: 'uploads',
  TRENDS: 'trends',
  SETTINGS: 'settings',
  FX_ADMIN: 'fx-admin',
  PERMISSIONS: 'permissions',
  INVESTMENT_POLICY: 'investment-policy',
  LIQUIDITY_RISK: 'liquidity-risk',
  ACCOUNT_MASTER: 'account-master',
} as const

export type PageKey = typeof PAGE_ROUTES[keyof typeof PAGE_ROUTES]

export const NAVIGATION_STRUCTURE = [
  {
    section: 'Overview',
    items: [
      { key: PAGE_ROUTES.DASHBOARD, label: 'Dashboard', icon: '⬡' },
      { key: PAGE_ROUTES.BRIEFING, label: 'Daily Briefing', icon: '📋' },
      { key: PAGE_ROUTES.CFO_SUMMARY, label: 'CFO Summary', icon: '⊞' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { key: PAGE_ROUTES.CASH_POSITION, label: 'Cash Position', icon: '📊' },
      { key: PAGE_ROUTES.FORECAST, label: 'Forecast', icon: '◈' },
      { key: PAGE_ROUTES.UPLOADS, label: 'Uploads', icon: '⇪' },
      { key: PAGE_ROUTES.TRENDS, label: 'Trends & History', icon: '↗' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { key: PAGE_ROUTES.SETTINGS, label: 'Settings & Config', icon: '⚙' },
      { key: PAGE_ROUTES.FX_ADMIN, label: 'FX Rate Admin', icon: '$' },
      { key: PAGE_ROUTES.PERMISSIONS, label: 'Permissions', icon: '🔐' },
      { key: PAGE_ROUTES.INVESTMENT_POLICY, label: 'Investment Policy', icon: '📄' },
      { key: PAGE_ROUTES.LIQUIDITY_RISK, label: 'Liquidity Risk', icon: '⚡' },
      { key: PAGE_ROUTES.ACCOUNT_MASTER, label: 'Account Master', icon: '🏦' },
    ],
  },
]

export const TOPBAR_STATS = {
  reportDate: '23 Sep 2026',
  forecastVersion: 'v2.4',
  confidence: '87%',
  usableCash: '£9.04M',
}

export const CURRENT_USER = {
  name: 'Jane Doe',
  email: 'jane@acmecorp.com',
  role: 'Finance Lead',
  initials: 'JD',
  department: 'Treasury',
  approvalLimit: 10_000_000,
}

export const TREND_7D = [
  { date: '2026-09-17', cash_runway_days: 45, liquidity_risk_score: 35 },
  { date: '2026-09-18', cash_runway_days: 42, liquidity_risk_score: 38 },
  { date: '2026-09-19', cash_runway_days: 41, liquidity_risk_score: 42 },
  { date: '2026-09-20', cash_runway_days: 39, liquidity_risk_score: 48 },
  { date: '2026-09-21', cash_runway_days: 38, liquidity_risk_score: 51 },
  { date: '2026-09-22', cash_runway_days: 36, liquidity_risk_score: 55 },
  { date: '2026-09-23', cash_runway_days: 35, liquidity_risk_score: 58 },
]

export const APPROVAL_ITEMS = [
  {
    id: 'inv-001',
    title: 'Short-Term Investment — Money Market',
    description: 'Invest $5M in short-term money market instrument (3-month T-bill)',
    amount: 5_000_000,
    category: 'Investment',
    entity: 'Acme US Inc',
    status: 'pending' as const,
    submittedAt: '2026-09-23T10:30:00Z',
    approverRole: 'Finance Director',
    rejectionReason: null,
  },
  {
    id: 'inv-002',
    title: 'FX Hedge — EUR/USD Forward Contract',
    description: 'Enter €2M 30-day forward at rate 1.082 to hedge EUR receivables',
    amount: 2_164_000,
    category: 'FX Hedge',
    entity: 'Acme EU GmbH',
    status: 'pending' as const,
    submittedAt: '2026-09-23T09:15:00Z',
    approverRole: 'Treasury Manager',
    rejectionReason: null,
  },
  {
    id: 'inv-003',
    title: 'Inter-Company Loan — UK to EU',
    description: 'Transfer £1.5M from Acme UK Ltd to Acme EU GmbH to cover shortfall',
    amount: 1_500_000,
    category: 'Intercompany',
    entity: 'Acme UK Ltd',
    status: 'approved' as const,
    submittedAt: '2026-09-22T14:00:00Z',
    approverRole: 'CFO',
    rejectionReason: null,
  },
  {
    id: 'inv-004',
    title: 'Payroll Run — UK September',
    description: 'Release September payroll for UK entity — £1.24M',
    amount: 1_240_000,
    category: 'Payroll',
    entity: 'Acme UK Ltd',
    status: 'pending' as const,
    submittedAt: '2026-09-23T08:00:00Z',
    approverRole: 'Finance Lead',
    rejectionReason: null,
  },
]
