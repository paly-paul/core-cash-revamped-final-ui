# Pages Structure Reference

**For:** Core Cash SPA → Next.js Tailwind CSS Migration

Maps all 13 pages in `corecash-spa-v7.html` with their routes, layouts, features, and interactive elements.

---

## Application Architecture

### Routing & Navigation
- **Route Key:** Each page identified by `PAGE_ROUTES.<KEY>` constant
- **Navigation Function:** `navigate(pageKey)` in JS—triggers page load, sidebar active state, chat panel initialization
- **Storage:** `PAGES_MAIN[pageKey]` contains HTML content, `PAGES_ASIDE[pageKey]` contains optional chat panel
- **Initialization:** `PAGE_INITS[pageKey]` contains JS code to run on page load

### Layout Structure
Every page inherits this three-column grid layout:
```
[Topbar spanning all columns]
[Sidebar] [Main Content] [Chat Panel / Aside]
```

- **Topbar** (54px height): Logo, app stats (Report Date, Forecast Version, Confidence, Usable Cash), user avatar
- **Sidebar** (220px, collapsible to 52px): Navigation items grouped by section (Overview, Operations, Settings)
- **Main Content** (flexible): Page-specific content, scrollable
- **Aside / Chat Panel** (356px): Optional AI chat interface or data agent panel (present on all 13 pages)

---

## Pages Overview

### 1. Dashboard
**Route Key:** `dashboard`
**Navigation Label:** Dashboard (emoji: ⬡)
**Section:** Overview
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Hero Metrics Row:** 4 metric tiles in 4-column grid
  - Cash Position (currency value)
  - Liquidity Position (days + status pill)
  - Cash Runway (days + status pill)
  - Forecast Accuracy (percentage + status pill)
- **Cash Position Section:** Line chart showing 30-day historical trend
- **FX Impact Section:** FX banner alert (dismissible), FX exposure metrics
- **Forecast Section:** Multi-line chart (projected cash, confidence band)

#### Key Components
- `MetricTile`: Card-based KPI display with currency/percentage/days formatting
- `LineChart`: Interactive chart rendering historical or forecast data
- `StatusPill`: Green/amber/red indicator badges
- `FxBanner`: Dismissible sticky alert for FX rate changes

#### Interactions
- Chart hover tooltips
- Metric tile hover effects
- FX banner dismiss (sessionStorage retention)
- Navigate to Forecast on chart click (optional)

#### JavaScript Initialization
```javascript
PAGE_INITS["dashboard"] = "maybeShowFxBanner();"
```

---

### 2. Daily Briefing
**Route Key:** `briefing`
**Navigation Label:** Daily Briefing (emoji: 📋)
**Section:** Overview
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Executive Summary Card:** Key points of the day, formatted as bullet list
- **Cash Position Snapshot:** Current balance, previous day comparison, variance %
- **Top Alerts Section:** List of critical actions/risks requiring attention
- **Approvals Pending:** Approval workflow items with status badges
- **Markets Overview:** Current FX rates, interest rates display

#### Key Components
- `SummaryCard`: Text content container
- `MetricComparison`: Side-by-side current vs. previous with variance
- `AlertList`: Scrollable list of alert items with severity badges
- `ApprovalForm`: Approve/Reject buttons with rejection reason textarea
- `MetricsTable`: Multi-column data table

#### Interactions
- Approve/Reject actions (modal confirmation, async operation)
- Alert dismiss (hidden from view but retained in data)
- Market rate refresh (click icon to fetch latest)

#### JavaScript Initialization
```javascript
PAGE_INITS["briefing"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 3. CFO Summary
**Route Key:** `cfo-summary`
**Navigation Label:** CFO Summary (emoji: ⊞)
**Section:** Overview
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **FX Rate Banner:** Dismissible alert for FX changes (sticky at top)
- **Live AI Insights Panel:** 
  - 4 metric tiles: Cash Runway, Liquidity Risk Score, Variance %, Forecast Accuracy
  - 7-day trend row: Dual sparkline charts (Cash Runway Days + Liquidity Risk Score)
  - Metric hover tooltips with drill-down info
- **Report Sections (7 total):**
  1. Executive Summary — key findings and recommendations
  2. Cash Position — MTD table (by account/currency)
  3. Forecast Outlook — upcoming cash flows and risks
  4. Actions Required — approval items (4 rows with approve/reject workflow)
  5. Variance Explanation — MTD vs. forecast variance analysis
  6. Data Caveats — data quality notes and limitations
  7. Source References — data sources and timestamps

#### Key Components
- `FxBanner`: Dismissible sticky alert
- `LiveInsightsPanel`: 4-metric tile grid + sparkline trend row
- `Sparkline`: SVG line chart (7-day data: EOD snapshots)
- `ReportSection`: Titled container for each section (header + body)
- `MetricsTable`: Multi-column table for Cash Position breakdown
- `ApprovalForm`: Approve/Reject workflow with rejection reason modal
- `StatusBadge`: Pending/Approved/Rejected status indicator

#### Interactions
- FX banner dismiss (sessionStorage)
- Sparkline hover (highlight point + show value)
- Metric tile hover (show tooltip drill-down)
- Approve/Reject actions with modal confirmation
- Section collapse/expand (optional, currently all expanded)

#### Data
- **TREND_7D Array:** 7 objects, each with `date`, `cash_runway_days`, `liquidity_risk_score`
- **Approval Items:** 4-5 treasury actions with id, title, status, approver info

#### JavaScript Initialization
```javascript
PAGE_INITS["cfo-summary"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area'); if(typeof initSparklines==='function') initSparklines();"
```

#### Sparkline Functions
```javascript
function drawSparkline(canvasId, data, yMax)     // Renders 7-day line chart to canvas
function initSparklines()                          // Initializes all sparklines on page load
function riskColor(score)                          // Returns color: green/amber/red based on risk score
```

---

### 4. Cash Position
**Route Key:** `cash-position`
**Navigation Label:** Cash Position (emoji: 📊)
**Section:** Operations
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Position Summary Cards:** Current total, by currency, by location
- **Detailed Breakdown Table:** Account-by-account view
  - Columns: Account Name, Currency, Balance, MTD Avg, MTD High, MTD Low, 7d Trend (sparkline)
  - Row grouping by currency/region (optional)
- **Variance Section:** Actual vs. forecast variance with drill-down
- **Liquidity Risk Heatmap:** Account risk matrix (green/amber/red cells)

#### Key Components
- `MetricTile`: Summary cards at top
- `DataTable`: Multi-column, sortable table
- `Sparkline`: 7-day trend per account
- `RiskMatrix`: Grid of cells with risk color coding
- `VarianceCard`: Comparison view

#### Interactions
- Table sort (click column header)
- Table filter by currency/region
- Drill-down on account (optional modal or navigation to Account Master)
- Variance detail hover (show calculation basis)

#### JavaScript Initialization
```javascript
PAGE_INITS["cash-position"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 5. Forecast
**Route Key:** `forecast`
**Navigation Label:** Forecast (emoji: ◈)
**Section:** Operations
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Chart Type Toggle:** Button group (Daily, Weekly, 13-Week, Rolling View options)
- **Main Forecast Chart:** Multi-line chart
  - Primary: Projected cash position (blue line)
  - Secondary: Confidence band (shaded area, blue light)
  - Optional overlay: Historical actual cash (grey dashed)
- **Forecast Drivers Table:** List of major items impacting forecast
  - Columns: Date, Description, Amount, Category, Confidence %
  - Sortable and filterable
- **Forecast Accuracy Metrics:** Historical accuracy vs. actual
- **Scenario Analysis (optional):** Slider inputs for sensitivity testing

#### Key Components
- `ChartTypeToggle`: Button group for view selection
- `InteractiveChart`: D3 or Recharts visualization
- `DataTable`: Forecast drivers list
- `ConfidenceBand`: Shaded area in chart
- `MetricsPanel`: Accuracy display

#### Interactions
- Toggle chart type (daily → weekly → 13-week)
- Chart zoom/pan (optional)
- Hover tooltip showing value at date
- Table filter by category
- Drill-down on driver item

#### JavaScript Initialization
```javascript
PAGE_INITS["forecast"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 6. Uploads
**Route Key:** `uploads`
**Navigation Label:** Uploads (emoji: ⇪)
**Section:** Operations
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Upload Form:** File input, submission button
  - Drag-and-drop zone (optional)
  - File type restrictions (CSV, Excel, etc.)
- **Recent Uploads Table:** History of uploaded files
  - Columns: Filename, Date Uploaded, Status (Processing/Success/Error), Size, Actions (Download/Delete)
- **Upload Errors Section:** List of files with validation errors (if any)
- **Data Mapping Modal:** Configure field mappings for uploaded data (optional)

#### Key Components
- `FileUploadZone`: Drag-drop file input
- `DataTable`: Upload history
- `StatusBadge`: Processing/Success/Error status
- `Modal`: Data mapping configuration
- `ErrorAlert`: Validation error display

#### Interactions
- File drag-drop or click to select
- File submit (async upload, polling for status)
- Download uploaded file (original or processed)
- Delete upload record
- View error details (modal or expandable row)

#### JavaScript Initialization
```javascript
PAGE_INITS["uploads"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 7. Trends & History
**Route Key:** `trends`
**Navigation Label:** Trends & History (emoji: ↗)
**Section:** Operations
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Time Period Selector:** Radio buttons or dropdown (30d, 90d, 1yr, Custom)
- **Historical Chart:** Multi-line chart showing:
  - Cash position over time (primary)
  - Forecast accuracy trend (secondary)
  - Major events marked on chart (vertical dashed lines)
- **Trend Metrics:** Summary of trends
  - Volatility %, Trend direction, Min/Max/Avg cash
- **Seasonal Analysis (optional):** Comparison of same periods across years

#### Key Components
- `TimeRangeSelector`: Period selection control
- `InteractiveChart`: Historical trends
- `MetricsPanel`: Volatility, direction, min/max/avg
- `EventMarker`: Vertical lines and labels for major events

#### Interactions
- Select time period (chart updates)
- Chart hover/tooltip
- Event marker click (show details modal)
- Export data as CSV

#### JavaScript Initialization
```javascript
PAGE_INITS["trends"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 8. Settings & Configuration
**Route Key:** `settings`
**Navigation Label:** Settings & Config (emoji: ⚙)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Company Settings Card:** Name, currency base, timezone, fiscal year start
- **Data Source Configuration:** Connection settings for bank/ERP systems
  - Data feed status (Connected/Disconnected)
  - Last sync timestamp
- **Report Preferences:** Report frequency, distribution list, template customization
- **User Settings:** Display preferences, theme (light/dark), language

#### Key Components
- `SettingsCard`: Grouped form inputs
- `FormInput`: Text field, dropdown, radio, checkbox
- `DataFeedStatus`: Connected/Disconnected indicator + sync time
- `SaveButton`: Submit with success toast feedback

#### Interactions
- Edit settings (form validation)
- Save changes (async POST, success/error toast)
- Reset data feed connection
- Download configuration export

#### JavaScript Initialization
```javascript
PAGE_INITS["settings"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 9. FX Rate Admin
**Route Key:** `fx-admin`
**Navigation Label:** FX Rate Admin (emoji: $)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Current FX Rates Table:** 
  - Columns: Currency Pair, Rate, Last Updated, Source, Actions (Edit/Lock)
- **Rate Upload Form:** Upload manual FX rates (CSV)
- **Rate Lock Panel:** Lock rates for specific dates (optional)
- **Rate History:** 30-day FX rate trend chart per currency pair

#### Key Components
- `DataTable`: Current rates list
- `FileUploadZone`: Rate upload
- `RateLockPanel`: Date picker + rate lock form
- `Chart`: 30-day trend per pair
- `EditableCells`: Inline rate editing

#### Interactions
- Edit rate (inline or modal)
- Lock rate for date range
- Upload batch rates (CSV)
- View rate history chart (hover for details)
- Approve/reject user-submitted rates

#### JavaScript Initialization
```javascript
PAGE_INITS["fx-admin"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 10. Permissions & Access Control
**Route Key:** `permissions`
**Navigation Label:** Permissions (emoji: 🔐)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **User List Table:**
  - Columns: Name, Email, Role, Department, Approval Limit ($), Actions (Edit/Deactivate)
- **Role Configuration:** Predefined roles (Admin, Finance Lead, Analyst, Viewer) with permissions matrix
- **Approval Workflow:** Define approval thresholds by treasury action type
- **Audit Log:** Recent permission changes, logins, data access

#### Key Components
- `UserTable`: User list with inline actions
- `PermissionsMatrix`: Role × Function grid (checkboxes)
- `ApprovalThresholdForm`: Configure amounts per action type
- `AuditLog`: Scrollable log entries with timestamp

#### Interactions
- Edit user role (dropdown, save)
- Activate/deactivate user
- Configure role permissions (checkbox matrix)
- Set approval thresholds per role
- View audit log details (modal)

#### JavaScript Initialization
```javascript
PAGE_INITS["permissions"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 11. Investment Policy
**Route Key:** `investment-policy`
**Navigation Label:** Investment Policy (emoji: 📄)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Policy Document Display:** Embedded document or PDF viewer
- **Policy Rules Table:** List of investment constraints
  - Columns: Asset Class, Min %, Max %, Risk Rating, Approved Counterparties
- **Compliance Status:** Current portfolio allocation vs. policy limits
  - Visual bar charts showing compliance for each constraint
- **Policy Version History:** Previous versions with change log

#### Key Components
- `DocumentViewer`: PDF or embedded document
- `DataTable`: Policy rules list
- `ComplianceBar`: Min/Max range bar with current value indicator
- `VersionHistory`: Changelog with dates and changes

#### Interactions
- Download policy document
- Edit policy rule (modal form)
- Add new rule (form)
- View compliance detail (drill-down)
- View version history (diff or full text)

#### JavaScript Initialization
```javascript
PAGE_INITS["investment-policy"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 12. Liquidity Risk
**Route Key:** `liquidity-risk`
**Navigation Label:** Liquidity Risk (emoji: ⚡)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Liquidity Risk Score Card:** Overall risk assessment (0-100 scale, color-coded)
- **Risk Breakdown Chart:** Pie chart showing risk by category (Funding, Market, Operational, Other)
- **Risk Thresholds Panel:** Current thresholds and alert levels
  - Columns: Metric, Current, Threshold (Green/Amber/Red)
- **Risk Mitigation Actions:** Table of action items to reduce risk
- **Section Cards (vertical layout):** 
  - Each card labeled with section name (e.g., "Funding Risk")
  - Contains sub-metrics and trend indicator

#### Key Components
- `RiskScoreCard`: Large central display with numeric score
- `PieChart`: Risk category breakdown
- `ThresholdsTable`: Metric × Threshold grid
- `SectionCard` (`.scard`): Vertical cards for risk category detail
- `TrendIndicator`: Up/down arrow with percentage change

#### Interactions
- Hover on risk score (show calculation details)
- Click pie chart segment (filter thresholds by category)
- Edit threshold (modal form, async save)
- View mitigation action details (modal or drill-down)

#### JavaScript Initialization
```javascript
PAGE_INITS["liquidity-risk"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

### 13. Account Master
**Route Key:** `account-master`
**Navigation Label:** Account Master (emoji: 🏦)
**Section:** Settings
**Chat Panel:** Yes (Data Agent)

#### Layout & Features
- **Account Search/Filter:** Search by account name, number, or bank
- **Account List Table:** All configured bank/ERP accounts
  - Columns: Account Number, Name, Bank, Currency, Balance, Status (Active/Inactive), Type, Actions
- **Add Account Form:** Modal to create new account
  - Fields: Account Number, Account Name, Bank, Currency, Type (Operating/Investment/Loan), GL Mapping
- **Account Detail Modal:** Full edit form on double-click row
  - Includes: Account metadata, balance history, linked GL codes, data feed settings

#### Key Components
- `SearchInput`: Account name/number filter
- `DataTable`: Account list, sortable, selectable rows
- `Modal`: Add/Edit account form
- `FormInput`: Text, dropdown, checkbox fields
- `StatusBadge`: Active/Inactive indicator

#### Interactions
- Search/filter accounts (client-side or API)
- Click row to open detail modal
- Add new account (form validation, async POST)
- Edit account (inline or modal)
- Deactivate/activate account (toggle with confirmation)
- View balance history (chart or table in modal)

#### JavaScript Initialization
```javascript
PAGE_INITS["account-master"] = "maybeShowFxBanner(); initChat('.chat-inp','chat-area');"
```

---

## Chat Panel (Aside / PAGES_ASIDE)

All 13 pages include an optional chat panel on the right side (356px width).

### Layout
- **Header:** "Data Agent" label + live pulse indicator (green dot with animation)
- **Message Area:** Scrollable container for conversation history
  - Agent messages: Light background, left-aligned, with subtle border
  - User messages: Blue background, right-aligned
  - Timestamps below each message
- **Input Area:** Textarea for message input + Send button
- **Disclaimer:** Small text footer (e.g., "Responses are AI-generated. Always verify with your team.")

### Components
- `ChatPanel`: Container component
- `MessageBubble`: Individual message with role styling
- `ChatInput`: Textarea + send button row
- `PulseIndicator`: Animated green dot

### Interactions
- Type message in textarea (auto-expand up to max-height)
- Click Send or press Shift+Enter
- Clear conversation history (button in header)
- Export conversation (download as JSON or PDF)

### JavaScript Initialization
```javascript
function initChat(inputSelector, containerSelector) {
  // Attach event listeners: input focus, send button click, enter key
  // Manage message history array
  // Update message display
}
```

---

## Shared Interactive Patterns

### Approval Workflows
**Used In:** Daily Briefing, CFO Summary, and action rows throughout

**Flow:**
1. User clicks "Approve" or "Reject" button
2. If Reject: textarea appears below for rejection reason
3. Modal confirmation appears (optional)
4. On confirm: async POST to backend (approval recorded)
5. Status badge updates (Pending → Approved/Rejected)
6. Toast notification displays success/error

**Functions:**
```javascript
function approveRec(id)           // Trigger approve flow
function confirmApprove(id)       // Modal confirmation
function showReject(id)           // Show reject reason textarea
function rejectRec(id, reason)    // Submit rejection
```

### Modal Management
**Modal Components Used On:**
- Approval confirmation
- Edit forms (Settings, Account Master, FX Admin)
- Detail drill-downs
- Error/alert messages

**Modal Structure:**
```
.moverlay (backdrop, semi-transparent)
  .modal (card)
    .mhdr (header with close button)
    .mbody (content, scrollable)
    .mftr (footer with action buttons)
```

**Functions:**
```javascript
function openModal(title, content, actions)
function closeModal()
function confirmModal(title, message, onConfirm)
```

### Toast Notifications
**Types:** Success (green), Warning (amber), Error (red), Info (blue)
**Display:** Top-right corner, stacked vertically
**Auto-dismiss:** 4-5 seconds
**User Dismiss:** Click X button

**Functions:**
```javascript
function toast(title, message, type = 'info')
function showToast(config)  // {title, message, type, duration}
```

### FX Banner
**Display:** Sticky at top of main content (after topbar)
**Content:** "FX rates have changed" alert with dismiss button
**Persistence:** SessionStorage (remembers dismiss until page reload)

**Functions:**
```javascript
function maybeShowFxBanner()  // Show if not recently dismissed
function dismissFxBanner()     // Hide and store in sessionStorage
```

---

## Shared Utilities & Constants

### Navigation
```javascript
const PAGE_ROUTES = {
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
}

function navigate(pageKey) {
  // Update currentPage
  // Render PAGES_MAIN[pageKey] HTML
  // Update sidebar active state
  // Run PAGE_INITS[pageKey] JS
  // Render PAGES_ASIDE[pageKey] (chat panel)
  // Scroll main content to top
}
```

### Formatting Utilities
```javascript
function formatCurrency(value)     // $1,234.56
function formatPercentage(value)   // 12.3%
function formatDate(date)          // MM/DD/YYYY
function formatTime(time)          // HH:MM AM/PM

function riskColor(score)          // Green (0-40), Amber (40-70), Red (70-100)
function statusBadge(status)       // Returns CSS class for status
```

### DOM Helpers
```javascript
function toggleSidebar()
function scrollToTop()
function closeAllModals()
function clearAllToasts()
```

---

## Data Structure Examples

### Page-Specific Data (injected into JS)

#### CFO Summary - TREND_7D
```javascript
const TREND_7D = [
  { date: '2026-09-17', cash_runway_days: 45, liquidity_risk_score: 35 },
  { date: '2026-09-18', cash_runway_days: 42, liquidity_risk_score: 38 },
  { date: '2026-09-19', cash_runway_days: 41, liquidity_risk_score: 42 },
  { date: '2026-09-20', cash_runway_days: 39, liquidity_risk_score: 48 },
  { date: '2026-09-21', cash_runway_days: 38, liquidity_risk_score: 51 },
  { date: '2026-09-22', cash_runway_days: 36, liquidity_risk_score: 55 },
  { date: '2026-09-23', cash_runway_days: 35, liquidity_risk_score: 58 },
]
```

#### Approval Items
```javascript
const APPROVAL_ITEMS = [
  {
    id: 'inv-001',
    title: 'Treasury Action Item 1',
    description: 'Invest $5M in short-term instrument',
    amount: 5000000,
    status: 'pending',  // pending, approved, rejected
    submittedAt: '2026-09-23T10:30:00Z',
    approverRole: 'Finance Director',
    rejectionReason: null,
  },
  // ... more items
]
```

#### User Data
```javascript
const CURRENT_USER = {
  name: 'Jane Doe',
  email: 'jane@company.com',
  role: 'Finance Lead',
  initials: 'JD',
  department: 'Treasury',
  approvalLimit: 10000000,
}
```

---

## Implementation Notes for Next.js Conversion

1. **Page Routes:** Convert to Next.js route structure:
   - `src/app/[pageRoute]/page.tsx` for each page key
   - Or use a `[...slug]/page.tsx` catch-all with dynamic rendering

2. **Shared Layout:** Implement as wrapper component (`src/components/common/layout.tsx`)
   - Topbar, Sidebar, Chat Panel always present
   - Page content injected into main area

3. **State Management:**
   - Current page: React Context or URL param
   - Sidebar collapsed: Context + localStorage
   - Chat messages: Context or component state
   - Modal/toast queue: Context or Zustand

4. **Component Extraction:**
   - `src/components/ui/` for primitives (Button, Badge, Card, etc.)
   - `src/components/common/` for complex reusables (Sidebar, Topbar, ChatPanel, etc.)
   - `src/app/[pageRoute]/_components/` for page-specific components
   - `src/components/forms/` for shared form patterns

5. **Styling:**
   - Use Tailwind CSS classes (configured with design tokens in `tailwind.config.ts`)
   - CSS variables in `globals.css` for design tokens
   - Page-specific CSS in component modules as needed
   - Avoid CSS cascade conflicts via component scoping

6. **Chat Panel Integration:**
   - `useChat` hook for message history and send logic
   - Optional real-time streaming (SSE or WebSocket) for AI responses
   - Message persistence in localStorage or backend

7. **Data Fetching:**
   - Client-side: `useFetch()` hook or `fetch()` in `useEffect`
   - Server-side: Next.js API routes or external backend
   - Mock data for initial development (as in current HTML)

8. **Testing Strategy:**
   - Unit tests for utility functions (formatCurrency, riskColor, etc.)
   - Component tests for interactive patterns (approval, modals, toasts)
   - E2E tests for full page flows (navigation, approval workflow, upload)
   - Build and test page-by-page, then integration test the full app

---

## File Organization for Next.js

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (Topbar, Sidebar, Chat, Main)
│   ├── globals.css                   # Design tokens, shared styles
│   ├── page.tsx                      # Redirect to /dashboard or landing
│   └── [pageRoute]/
│       ├── page.tsx                  # Page router component
│       └── _components/              # Page-specific components
│           ├── metric-tile.tsx
│           ├── chart.tsx
│           └── ... (other page-specific)
├── components/
│   ├── ui/                           # Primitives
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (others)
│   ├── common/                       # Complex reusables
│   │   ├── layout.tsx
│   │   ├── topbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── chat-panel.tsx
│   │   └── ... (others)
│   └── forms/                        # Shared form patterns
│       ├── approval-form.tsx
│       └── ... (others)
├── lib/
│   ├── utils.ts                      # Helper functions, cn() utility
│   ├── constants.ts                  # Routes, navigation structure
│   └── types.ts                      # TypeScript interfaces
├── context/
│   ├── navigation.tsx                # Current page, navigate function
│   ├── ui.tsx                        # Modal, toast state
│   └── chat.tsx                      # Chat messages, send logic
└── hooks/
    ├── useNavigation.ts
    ├── useModal.ts
    ├── useToast.ts
    └── useChat.ts
```

