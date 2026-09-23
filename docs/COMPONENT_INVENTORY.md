# Component Inventory

**For:** Core Cash SPA → Next.js Tailwind CSS Migration

Maps all UI patterns and components found in `corecash-spa-v7.html` to their Next.js component structure.

---

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Design tokens + shared styles
│   └── [pageRoute]/
│       ├── page.tsx                  # Page route component
│       └── _components/              # Page-specific components
├── components/
│   ├── ui/                           # Primitive UI elements
│   ├── common/                       # Reusable complex components
│   └── forms/                        # Shared form structures
└── lib/
    ├── utils.ts                      # cn() helper, utilities
    └── constants.ts                  # Routes, navigation, page metadata
```

---

## Primitive UI Components (`src/components/ui/`)

These are low-level, reusable building blocks with minimal dependencies.

### Button (`src/components/ui/button.tsx`)
**HTML Classes Used:**
- `.btn` (base)
- `.btn-p` (primary/solid)
- `.btn-s` (secondary/outline)
- `.btn-g` (ghost)
- `.btn-icon` (icon-only)
- `.btn-send` (chat send button)

**Variants:**
- `primary` — solid blue, hover darkens
- `secondary` — outline with border
- `ghost` — transparent, hover background
- `icon` — small square for icon buttons
- `send` — blue solid for chat/form submission

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'send'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}
```

### Badge (`src/components/ui/badge.tsx`)
**HTML Classes Used:**
- `.badge` (base)
- `.bg` (green badge)
- `.ba` (amber badge)
- `.br` (red badge)
- `.bb` (blue badge)
- `.bm` (muted/grey badge)
- `.bi` (info badge)

**Variants:**
```typescript
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral'
```

**Props:**
```typescript
interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}
```

### Card (`src/components/ui/card.tsx`)
**HTML Classes Used:**
- `.scard` (section card — used in Liquidity Risk)
- `.mcard` (metric card)
- `.card` (generic card)

**Variants:**
- `default` — white surface, subtle shadow, rounded
- `elevated` — elevated shadow (modals, dropdowns)
- `metric` — KPI tile (square-ish, centered content)

**Props:**
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'metric'
  className?: string
  children: React.ReactNode
}
```

### Input (`src/components/ui/input.tsx`)
**HTML Elements:**
- `<input type="text">` (text, email, number)
- `<textarea>` (multi-line)
- `<select>` (dropdown)

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  className?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}
```

### Modal (`src/components/ui/modal.tsx`)
**HTML Classes Used:**
- `.moverlay` (overlay backdrop)
- `.modal` (modal dialog)
- `.mhdr` (modal header)
- `.mbody` (modal body)
- `.mftr` (modal footer)

**Sections:**
- Header with close button
- Body (scrollable)
- Footer with action buttons

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}
```

### Toast (Notification) (`src/components/ui/toast.tsx`)
**HTML Classes Used:**
- `.toast` (base toast)
- `.toast.ok` (success — green left border)
- `.toast.wa` (warning — amber left border)
- `.toast.er` (error — red left border)

**Props:**
```typescript
interface ToastProps {
  id: string
  title: string
  message?: string
  type: 'success' | 'warning' | 'error' | 'info'
  duration?: number // ms before auto-dismiss
  onClose: (id: string) => void
}
```

### Status Pill (`src/components/ui/status-pill.tsx`)
**HTML Classes Used:**
- `.li-pill` (metrics panel)
- `.rc-status-pill` (report cover)

**Variants:** green, amber, blue

**Props:**
```typescript
interface StatusPillProps {
  variant: 'success' | 'warning' | 'info'
  icon?: React.ReactNode
  children: string | number
}
```

### Table Components (`src/components/ui/table.tsx`)
**HTML Elements:** `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`

**Styling Classes:**
- `.atable` (wrapper)
- `.total-row` (bold row for totals)
- `.risk-g-bg`, `.risk-y-bg`, `.risk-r-bg` (risk cell backgrounds)

---

## Complex Reusable Components (`src/components/common/`)

These combine multiple primitives and manage local state or side effects.

### Sidebar (`src/components/common/sidebar.tsx`)
**HTML Classes Used:**
- `.sidebar`
- `.sb-item` (navigation item)
- `.sb-section` (section group)
- `.sb-toggle` (collapse toggle)
- `.nav-tip` (tooltip on collapse)

**Features:**
- Navigation items with active state
- Sections with labels
- Collapse toggle
- Data feed status footer (optional)

**Props:**
```typescript
interface NavItem {
  key: string          // page key (e.g., 'dashboard')
  label: string        // display label
  icon: React.ReactNode
  section?: string     // section grouping
}

interface SidebarProps {
  items: NavItem[]
  currentPage: string
  onNavigate: (key: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}
```

### Topbar (`src/components/common/topbar.tsx`)
**HTML Classes Used:**
- `.topbar`
- `.logo`, `.logo-mark`
- `.tb-stat` (stat column)
- `.tb-right` (right-side user/avatar area)

**Sections:**
- Logo/brand (clickable to dashboard)
- Stats display (Report Date, Forecast Version, Confidence, Usable Cash)
- Right area (user role, avatar, buttons)

**Props:**
```typescript
interface TopbarProps {
  stats?: Record<string, string | number>
  userRole?: string
  userInitials?: string
  onLogoClick?: () => void
}
```

### Chat Panel / AI Panel (`src/components/common/chat-panel.tsx`)
**HTML Classes Used:**
- `.ai-panel`
- `.panel-hdr`
- `.chat-msgs`
- `.cmsg` (message container)
- `.cbubble` (message bubble)
- `.chat-inp-wrap`, `.chat-inp`, `.btn-send`

**Features:**
- Message history display
- Message input textarea
- Send button
- Distinction between agent and user messages

**Props:**
```typescript
interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
}

interface ChatPanelProps {
  title?: string
  messages?: Message[]
  isLoading?: boolean
  onSendMessage?: (content: string) => void
  badge?: { label: string; variant: string }
}
```

### Modal Manager (`src/components/common/modal-manager.tsx`)
**Features:**
- Global modal state
- Generic modal dialog
- Confirmation modal (approve/reject flows)
- Multiple modals in queue

**Context/Hook:**
```typescript
interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  actions?: { label: string; onClick: () => void; variant: string }[]
}

export const useModal = () => {
  // Returns { openModal, closeModal, isOpen, ... }
}
```

### Toast Manager (`src/components/common/toast-manager.tsx`)
**Features:**
- Toast queue (multiple toasts can display)
- Auto-dismiss after duration
- Stacked layout (top-right)

**Context/Hook:**
```typescript
export const useToast = () => {
  return {
    toast: (title: string, message?: string, type?: 'success' | 'warning' | 'error') => void
    showToast: (config: ToastConfig) => void
  }
}
```

### Layout (`src/components/common/layout.tsx`)
**HTML Structure:**
- Grid layout: topbar + sidebar + main + aside
- Responsive: sidebar collapses on mobile

**Props:**
```typescript
interface LayoutProps {
  sidebarCollapsed?: boolean
  children: React.ReactNode
  aside?: React.ReactNode  // Chat panel on right
}
```

### FX Banner (`src/components/common/fx-banner.tsx`)
**HTML Classes Used:**
- `.fx-banner`
- `.fx-banner-title`, `.fx-banner-body`

**Features:**
- Dismissible alert banner
- Sticky at top of main content
- Reappears on page reload (optional via sessionStorage)

**Props:**
```typescript
interface FxBannerProps {
  visible: boolean
  onDismiss: () => void
  title: string
  message: string
}
```

---

## Form Components (`src/components/forms/`)

Structured form patterns reused across pages.

### Approval Workflow Form (`src/components/forms/approval-form.tsx`)
**HTML Classes Used:**
- `.rapproval` (approval row)
- `.btn btn-p` (approve button)
- `.btn btn-s` (reject button)
- `.reject-panel` (reject reason textarea)
- `.astat-pending`, `.astat-approved`, `.astat-rejected` (status badges)

**Features:**
- Approve/Reject buttons
- Reject reason textarea (shown on click)
- Status badge (pending/approved/rejected)
- Timestamp display

**Props:**
```typescript
interface ApprovalFormProps {
  itemId: string
  status: 'pending' | 'approved' | 'rejected'
  approvedAt?: string
  rejectionReason?: string
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
  isLoading?: boolean
}
```

### Data Input Grid (`src/components/forms/data-input-grid.tsx`)
**HTML Classes Used:**
- `.var-grid`, `.vmetric` (variance metrics grid)
- `.thresh-grid`, `.thresh-item` (threshold input grid)

**Features:**
- Multi-column input layout
- Labels + value displays
- Optional edit mode

---

## Page-Specific Component Examples

### Dashboard Metric Tile (`src/app/dashboard/_components/metric-tile.tsx`)
**HTML Classes Used:**
- `.mcard` or `.card`
- `.mcard-val`, `.mcard-lbl`, `.mcard-sub`

### CFO Summary Live Insights (`src/app/cfo-summary/_components/live-insights-panel.tsx`)
**HTML Classes Used:**
- `.li-panel`
- `.li-hdr`, `.li-refresh`
- `.li-metrics` (4-column grid)
- `.li-metric`, `.li-val`, `.li-lbl`, `.li-pill`, `.li-tooltip`
- `.li-trend`, `.li-sparklines` (7-day trend row)

### Forecast Chart Toggle (`src/app/forecast/_components/chart-type-toggle.tsx`)
**HTML Classes Used:**
- `.ct-group` (button group)
- `.ct-btn` (toggle button)

### Action Row (`src/app/cfo-summary/_components/action-row.tsx`)
**HTML Classes Used:**
- `.action-row`
- `.action-num`, `.action-body`, `.action-what`
- `.action-meta`, `.action-meta-item` (4-column grid)
- `.action-right` (approval buttons)

---

## Shared Utilities / Helpers

### `src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Other utilities
export function formatCurrency(value: number): string
export function formatPercentage(value: number, decimals?: number): string
export function formatDate(date: Date | string): string
export const riskColor = (score: number): string // green/amber/red based on score
export const statusBadge = (status: string): string // CSS class for status
```

### `src/lib/constants.ts`
```typescript
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
```

---

## State Management

### Navigation State (React Context)
```typescript
// src/context/navigation.tsx
interface NavigationContextType {
  currentPage: string
  navigate: (pageKey: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useNavigation = (): NavigationContextType => { ... }
```

### UI State (Zustand or Context)
```typescript
// src/store/ui.ts (if using Zustand) or src/context/ui.tsx (if using Context)
interface UIState {
  isModalOpen: boolean
  toastQueue: Toast[]
  openModal: (config: ModalConfig) => void
  closeModal: () => void
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
}
```

---

## Component Dependency Graph

```
Layout
├── Sidebar
│   ├── Button (close, collapse)
│   └── Navigation Items
├── Topbar
│   ├── Logo (Button)
│   ├── Stats Display
│   └── User Avatar
├── Main Content (Page Router)
│   └── Page-Specific Components
└── Chat Panel (Aside)
    ├── Messages
    └── Input (Textarea + Button)

Shared Modals & Toasts
├── Modal Manager
│   └── Modal (generic, approval, etc.)
└── Toast Manager
    └── Toast (notification)

Forms
├── Approval Form
│   └── Button (approve/reject)
├── Input Fields
└── Data Input Grids

Pages (each with _components/*)
├── Dashboard → Metric Tile, Chart Components
├── CFO Summary → Live Insights, Action Row, Sparklines
├── Liquidity Risk → Section Card, Chart
└── ... (other pages)
```

---

## Notes for Implementation

1. **Design Tokens:** All colors/spacing use CSS variables defined in `globals.css`
2. **Tailwind Merge:** Use `cn()` helper to combine Tailwind classes safely
3. **Page-Specific Components:** Keep in `_components/` folder to avoid import confusion
4. **Shared State:** Use React Context for navigation; consider Zustand for UI state
5. **Responsive:** The original HTML uses CSS grid with responsive columns — replicate with Tailwind's grid utilities
6. **Animations:** Keep keyframes in `globals.css`, apply via Tailwind animation classes
7. **SVG Icons:** Replace emoji/text icons with proper SVG components (Lucide, Heroicons, etc.)

