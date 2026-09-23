# Core Cash Agent Phase 1 MVP - Frontend User Stories
## Next.js | React | UI/UX Components

---

## **EPIC 1: Data Ingestion & Upload Interface**

### **FE-001: File Upload Dashboard**

**As a** Treasury Team Member  
**I want to** upload bank balance, AR, AP, and manual assumption files in a single unified interface  
**So that** I can quickly feed cash data into the system without complex configuration

**Acceptance Criteria:**
- Dashboard displays 4 upload cards: "Bank Balances", "AR Data", "AP Data", "Manual Assumptions"
- Each card supports CSV and Excel file uploads via drag-and-drop or file picker
- Show file size limits (suggest 10MB per file for MVP)
- Display upload progress bar with file name and percentage
- Show success/error notification with timestamp
- Uploaded files are tracked with upload timestamp and source name
- User can see a "Recent Uploads" section showing last 5 uploaded files
- Each upload can be tagged with a date or forecast version (optional)

**Technical Notes:**
- Use Next.js API routes for file upload handling
- Store file metadata in database (filename, size, upload time, user, status)
- Implement virus scanning on server-side
- Max 10 concurrent uploads

**Priority:** P0 - Critical Path

---

### **FE-002: File Upload Preview & Validation**

**As a** Treasury Team Member  
**I want to** preview uploaded files and see validation errors before processing  
**So that** I can catch data issues early and correct them

**Acceptance Criteria:**
- After file upload, show a preview modal with first 10 rows of data
- Display column headers with data type detected (text, number, date)
- Show validation status: ✓ Valid / ⚠ Warnings / ✗ Errors
- List missing mandatory fields with red highlight
- List optional fields that can improve accuracy
- Show count of rows that will be processed
- Allow user to download a template for each file type
- "Cancel Upload" and "Proceed to Mapping" buttons

**Technical Notes:**
- Client-side validation first (column count, headers)
- Server-side parsing preview (return first 10 rows after parse)
- Show data type inference results

**Priority:** P0 - Critical Path

---

### **FE-003: Column Mapping Interface**

**As a** Finance Administrator  
**I want to** configure which columns in my upload files map to the system's data model  
**So that** the system correctly interprets the data regardless of file format variation

**Acceptance Criteria:**
- Show uploaded file columns on left side
- Show required system fields on right side (Account ID, Bank Name, Currency, Balance Amount, etc.)
- Support drag-and-drop mapping or dropdown selection
- Highlight mandatory fields with asterisk
- Show field descriptions (tooltips) on hover
- Allow "Unmapped Field" selection if column is not needed
- Show a "Save Mapping Template" option (for reuse on future uploads)
- Validate that all mandatory fields are mapped before saving
- Display sample data in both columns to verify mapping accuracy

**Technical Notes:**
- Lazy-load field descriptions from backend
- Store mapping templates in database (keyed by upload file type + user)
- Implement mapping validation logic on frontend before submission

**Priority:** P0 - Critical Path

---

### **FE-004: Account Master Configuration**

**As a** Finance Administrator  
**I want to** configure and maintain a master list of accounts with entity, currency, restriction status and thresholds  
**So that** the system accurately groups cash by entity and applies correct business rules

**Acceptance Criteria:**
- Create a "Account Master" page with table view of all configured accounts
- Display columns: Account Number, Bank Name, Legal Entity, Currency, Restricted (Yes/No), Min Balance Threshold, Status
- "Add Account" button opens a form with fields:
  - Account ID/Number (required)
  - Bank Name (required, dropdown with common banks)
  - Legal Entity (required, dropdown)
  - Currency (required, dropdown)
  - Include in Cash Position (toggle, default Yes)
  - Restricted Flag (toggle, default No)
  - Minimum Balance Threshold (optional, numeric)
  - Expected Reporting Frequency (dropdown: Daily/Weekly/Monthly)
  - Account Status (Active/Inactive/Closed)
- Bulk import account master from CSV
- Edit existing accounts inline or in modal
- Soft delete accounts (mark inactive vs hard delete)
- Search and filter by entity, bank, currency

**Technical Notes:**
- Use DataGrid component (e.g., AG Grid or TanStack Table) for performance
- Implement debounced search
- Cache account master in frontend state (refresh on upload)

**Priority:** P0 - Critical Path

---

## **EPIC 2: Dashboard & Cash Position Display**

### **FE-005: Daily Cash Position Dashboard**

**As a** CFO / Treasury Manager  
**I want to** see a consolidated daily cash position across all entities, banks, accounts and currencies  
**So that** I have a real-time, single view of where cash is sitting

**Acceptance Criteria:**
- Display "As of" date prominently at top
- Show 4 key metric cards:
  - Total Cash (by currency)
  - Usable Cash (by currency)
  - Restricted Cash (if any)
  - Overall Confidence status (High/Medium/Low)
- Main cash summary table showing:
  - Total Cash by Currency (e.g., USD 5.2M, EUR 1.1M)
  - Usable Cash by Currency
  - Cash by Legal Entity (breakdown)
  - Cash by Bank (breakdown)
  - Cash by Account (detailed)
- Each row shows: Entity | Bank | Account | Currency | Balance | Confidence | Exceptions
- Color-code confidence: Green (High) / Yellow (Medium) / Red (Low)
- Exception indicators with hover tooltip showing detail (e.g., "Stale balance", "Below threshold")
- "Data source" link showing upload file and timestamp
- Refresh button to re-run Agent 1

**Technical Notes:**
- Implement real-time updates via WebSocket if forecast is being regenerated
- Use hierarchical drill-down tables (collapsible rows)
- Cache dashboard data with 5-minute TTL initially

**Priority:** P0 - Critical Path

---

### **FE-006: Cash Position Exception Alerts**

**As a** Treasury Team Member  
**I want to** see highlighted exceptions and data quality warnings on the cash position view  
**So that** I can immediately identify data issues or operational concerns

**Acceptance Criteria:**
- Display exception panel on right side of dashboard with sections:
  - Data Warnings (stale data, missing balance, unmapped account)
  - Business Warnings (negative balance, below-threshold balance)
  - Quality Indicators (unclear balance type)
- Each exception shows:
  - Icon (warning/error)
  - Account/Entity name
  - Exception type
  - Brief description
  - Confidence level
- Sort exceptions by severity (high to low)
- Allow user to dismiss individual exceptions (mark as reviewed)
- Show exception count badge
- Download exception report as CSV

**Technical Notes:**
- Exception data comes from Agent 1 output
- Implement exception filtering/grouping toggles

**Priority:** P1 - Important

---

## **EPIC 3: Forecast Display & Analysis**

### **FE-007: 7/30/60-Day Forecast Dashboard**

**As a** CFO / Treasury Manager  
**I want to** see projected cash position for the next 7, 30, and 60 days with breakdown by inflows and outflows  
**So that** I can plan liquidity and funding needs in advance

**Acceptance Criteria:**
- Display forecast in card/tab format: "7-Day", "30-Day", "60-Day"
- For each forecast period show:
  - Opening Cash
  - Expected Inflows (total + top 3 items)
  - Expected Outflows (total + top 3 items)
  - Forecast Closing Cash
  - Variance Trend (arrow: ↑ improving / ↓ declining / → flat)
- Visualization options:
  - Line chart: Opening → Closing cash over time
  - Bar chart: Inflows vs Outflows by period
  - Waterfall chart: Opening + Inflows - Outflows = Closing
- Show lowest projected cash point and timing
- Forecast confidence indicator (High/Medium/Low) with color coding
- Display forecast warnings as alert box (projected negative, low cash, high dependency)
- "Edit Assumptions" button opens manual assumptions panel

**Technical Notes:**
- Use Recharts or Chart.js for visualizations
- Lazy-load large forecasts (pagination for detailed breakdown)
- Cache forecast chart data

**Priority:** P0 - Critical Path

---

### **FE-008: Forecast Breakdown by Entity & Currency**

**As a** Treasury Analyst  
**I want to** see forecast segmented by legal entity and currency  
**So that** I can identify entity-specific or currency-specific liquidity issues

**Acceptance Criteria:**
- Add filter dropdowns: "Entity" (multi-select) and "Currency" (multi-select)
- Forecast updates based on selected filters
- Show forecast summary table:
  - Entity | Currency | Opening | Inflows | Outflows | Closing | Confidence | Warnings
- Highlight rows with projected shortfall or low cash
- Comparative view: side-by-side comparison of multiple entities or currencies
- Drill-down capability: Click entity to see account-level breakdown

**Technical Notes:**
- Implement client-side filtering initially
- Memoize filter selections in component state

**Priority:** P1 - Important

---

### **FE-009: Manual Forecast Assumptions Input**

**As a** Treasury Manager  
**I want to** add manual forecast assumptions (payroll, taxes, rent, etc.) when not captured in AR/AP  
**So that** the forecast reflects all expected cash movements

**Acceptance Criteria:**
- "Add Assumption" button opens a form with fields:
  - Entity (required, dropdown)
  - Currency (required, dropdown)
  - Forecast Date (required, date picker)
  - Amount (required, numeric)
  - Direction (required, Inflow/Outflow radio)
  - Category (required, dropdown: Payroll/Tax/Rent/Loan/Insurance/Capex/Intercompany/Other Receipt/Other Payment)
  - Description (optional, text)
  - Confidence (High/Medium/Low, default Medium)
  - Frequency (One-time/Recurring - for MVP, one-time only)
- Submit button saves assumption and updates forecast
- Show "Assumptions" section in forecast view listing all manual inputs
- Allow edit/delete of assumptions
- Bulk import assumptions from CSV template
- Clear indication that assumptions are editable/removable

**Technical Notes:**
- Create modal or side-panel form component
- Validate date is within forecast horizon (7-60 days)
- Store assumptions in database associated with forecast version

**Priority:** P0 - Critical Path

---

## **EPIC 4: Liquidity Risk & Recommendations**

### **FE-010: Liquidity Status Card**

**As a** CFO  
**I want to** see an at-a-glance liquidity status indicator with severity level  
**So that** I immediately know if there's a critical issue requiring attention

**Acceptance Criteria:**
- Prominent status card showing:
  - Status Label: "Normal" / "Surplus" / "Attention Required" / "Critical Shortage"
  - Color: Green / Blue / Yellow / Red
  - Severity level badge (if applicable)
  - Key insight: "You have X days of cash at current burn rate" or "Surplus of $X available"
  - Shortage/Surplus amount (if applicable)
  - Projected timing (e.g., "In 21 days")
- Icon indicating trend direction
- Clickable to expand to full liquidity analysis panel

**Technical Notes:**
- Data from Agent 3 output
- Implement as reusable card component

**Priority:** P0 - Critical Path

---

### **FE-011: Directional Recommendation View**

**As a** Treasury Manager  
**I want to** see directional recommendations for treasury actions based on liquidity analysis  
**So that** I know what to review or consider next

**Acceptance Criteria:**
- Display recommendation panel below liquidity status
- Show recommendation text in natural language (from Agent 3)
- Structure: "Based on [cash position + forecast], consider reviewing [action type]"
- Action types: Transfer / Sweep / Collection Follow-up / Funding / Payment Timing / Escalation
- Display supporting rationale (key drivers)
- Show confidence level (High/Medium/Low)
- "Mark as Reviewed" checkbox to track acknowledgment
- "View Details" button expands to show supporting data

**Technical Notes:**
- Recommendation comes from Agent 3 LLM output
- Store review status in database with timestamp and user

**Priority:** P1 - Important

---

### **FE-012: Liquidity Risk Details Panel**

**As a** Analyst  
**I want to** see detailed breakdown of what liquidity risks are identified  
**So that** I understand the drivers behind the risk classification

**Acceptance Criteria:**
- Tabbed panel showing:
  - Risk Summary (classification: Normal/Surplus/Attention/Critical)
  - Projected Shortfall Details (if applicable):
    - Minimum Cash Point
    - Timing of Shortfall
    - Duration of Shortfall
    - Shortage Amount
  - Surplus Details (if applicable):
    - Surplus Amount
    - Available for Investment
    - Recommended Actions
  - Threshold Comparison:
    - Minimum Cash Threshold (if configured)
    - Current vs Threshold
    - Forecast vs Threshold
  - Concentration Risk (if applicable):
    - Large single transaction
    - High dependency on one customer/vendor
  - Data Quality Issues:
    - Missing AR/AP data
    - Stale balances
- Each section shows confidence indicator
- "Configuration" link to adjust thresholds

**Technical Notes:**
- Data from Agent 3 logic output
- Implement responsive panels with collapse/expand

**Priority:** P1 - Important

---

## **EPIC 5: Variance Analysis**

### **FE-013: Forecast vs Actual Variance Dashboard**

**As a** Treasury Analyst  
**I want to** compare forecast cash position to actual cash position and understand why they differed  
**So that** I can improve future forecasts and understand cash movement drivers

**Acceptance Criteria:**
- Main variance metrics displayed:
  - Total Cash Variance (Actual - Forecast)
  - Inflow Variance (Actual Inflows - Forecast Inflows)
  - Outflow Variance (Actual Outflows - Forecast Outflows)
  - Each shows amount and direction (↑ favorable / ↓ unfavorable)
- Waterfall chart: Forecast Closing Cash → Variance Items → Actual Closing Cash
- Variance by entity (table or dropdown)
- Variance by currency (table or dropdown)
- "Top Variance Drivers" section listing top 5-10 by impact
- Each driver shows:
  - Category (Delayed Collection, Early Payment, Bank Fee, etc.)
  - Amount
  - Reason
  - Confidence
  - Source evidence (transaction reference if available)

**Technical Notes:**
- Data from Agent 4 output
- Use Recharts waterfall chart
- Cache variance analysis results

**Priority:** P1 - Important

---

### **FE-014: Variance Item Details**

**As a** Analyst  
**I want to** drill into individual variance items to see the matching evidence  
**So that** I can validate the explanation and understand forecast accuracy

**Acceptance Criteria:**
- Click on variance item to open detail modal showing:
  - Variance Category (e.g., "Delayed Collection")
  - Forecast Detail (Item, Amount, Expected Date)
  - Actual Transaction (Transaction ref, Amount, Actual Date)
  - Variance Reason (text explanation)
  - Timing Tolerance Applied (Yes/No, ±3 days by default)
  - Confidence Level (High/Medium/Low)
  - Source Evidence (invoice ref, counterparty name, bank description)
  - Data Caveats (e.g., "Matched by amount and date; not by invoice reference")
- "Mark as Verified" checkbox to track review

**Technical Notes:**
- Data from Agent 4 detailed output
- Implement modal with scrollable content

**Priority:** P2 - Nice to Have

---

## **EPIC 6: CFO Summary & Executive Reporting**

### **FE-015: Executive CFO Summary View**

**As a** CFO  
**I want to** see a concise executive summary of cash position, forecast, risks and required actions  
**So that** I can quickly brief management and make decisions

**Acceptance Criteria:**
- Summary report header:
  - Report Date & Time
  - Forecast Version
  - Overall Confidence
  - Management Attention Required (Yes/No flag)
- Sections in order:
  1. Executive Summary (1-2 sentence overview)
  2. Cash Position (current balances by currency, key changes)
  3. Forecast Outlook (7/30/60-day projection, key trends)
  4. Liquidity Risk / Opportunity (status, recommendation)
  5. Variance Explanation (top drivers from prior period)
  6. Review Actions (required approvals, escalations)
  7. Data Caveats (missing data, stale data, assumptions)
  8. Source References (file versions, run IDs)
- Each section is concise (2-4 sentences) and data-backed
- Color-coded severity indicators
- "Print" and "Email" buttons (email sends link, no auto-send in MVP)
- "Export as PDF" button

**Technical Notes:**
- Data from Agent 5 output
- Use template-based rendering (CSS print styles)
- Implement PDF export via react-pdf or similar

**Priority:** P0 - Critical Path

---

### **FE-016: Summary Report Export Options**

**As a** CFO  
**I want to** export the summary in multiple formats for distribution  
**So that** I can share with management and archive for audit

**Acceptance Criteria:**
- Export buttons:
  - "Download as PDF" - formatted report
  - "Download as Email Draft" - pre-formatted HTML for email
  - "Download as Excel" - structured data in Excel
- Each export includes:
  - Header with report date, forecast version, confidence
  - All sections from FE-015
  - Source references and audit trail
- PDF export includes logo/branding
- Excel export includes separate sheets for Summary, Details, Source Data

**Technical Notes:**
- Use libraries like jsPDF or Puppeteer for PDF generation
- Implement backend API for PDF generation (headless browser)
- Support scheduled report generation (defer to Phase 2)

**Priority:** P1 - Important

---

## **EPIC 7: Source Traceability & Audit**

### **FE-017: Data Source Traceability UI**

**As a** Controller / Auditor  
**I want to** trace every number back to its source file and know when data was uploaded  
**So that** I can audit and verify data integrity

**Acceptance Criteria:**
- Every dashboard view includes a "Data Sources" section showing:
  - Cash Position: Bank Balance File (name, upload date, row count)
  - Forecast: AR File, AP File, Manual Assumptions (each with upload date)
  - Run IDs for each agent execution
- "View Source" link for each data element opens detail showing:
  - Original file name
  - Upload timestamp and user
  - Number of rows processed
  - Parser used
  - Validation result
  - Any data transformation applied
- "Download Source File" button to retrieve original uploaded file
- Agent execution audit trail showing:
  - Start/end time
  - Processing status (Success/Warning/Error)
  - Assumptions used
  - Confidence assignments

**Technical Notes:**
- Store full audit trail in database
- Include file hashes for integrity verification
- Implement expandable "Data Lineage" view

**Priority:** P2 - Nice to Have

---

### **FE-018: Audit Trail & Change History**

**As a** Auditor  
**I want to** see a complete history of who accessed data, made changes and when  
**So that** I can verify system integrity for compliance

**Acceptance Criteria:**
- "Audit Log" page accessible to admins showing:
  - Timestamp
  - User
  - Action (File Uploaded, Mapping Changed, Assumption Added, etc.)
  - Entity/Account affected
  - Before/After values (for edits)
  - Source IP (if available)
- Filter by user, action type, date range
- Export audit log as CSV
- Immutable log (no deletions, only new records)

**Technical Notes:**
- Log all user actions server-side
- Use database event/trigger logging
- Retention policy: Keep for 24 months minimum

**Priority:** P2 - Nice to Have

---

## **EPIC 8: Navigation & UI Framework**

### **FE-019: Main Application Shell & Navigation**

**As a** User  
**I want to** navigate between different views (Dashboard, Uploads, Account Master, Reports) easily  
**So that** I can access the right information quickly

**Acceptance Criteria:**
- Top navigation bar with:
  - Application logo and name
  - Primary nav items: Dashboard | Uploads | Account Master | Reports | Audit Log | Settings
  - User menu (Profile, Logout)
  - Notification bell (for errors/alerts)
- Left sidebar (collapsible) showing:
  - Date/forecast version selector
  - Quick stats (Total Cash, Liquidity Status)
  - Recent uploads
  - Shortcuts to main functions
- Breadcrumb navigation showing current page
- Responsive design (mobile, tablet, desktop)
- Dark mode toggle (optional for MVP)

**Technical Notes:**
- Use Next.js Layout components
- Implement Context API for global state (selected date, forecast version)
- Responsive design with TailwindCSS or similar

**Priority:** P0 - Critical Path

---

### **FE-020: Responsive Design & Mobile Optimization**

**As a** Treasury Team Member  
**I want to** access the system on mobile and tablet devices  
**So that** I can check cash position on the go

**Acceptance Criteria:**
- Mobile view (< 768px):
  - Stack layout vertically
  - Collapse sidebar into hamburger menu
  - Simplified dashboard (key metrics only)
  - Scrollable tables with horizontal swipe
  - Touch-friendly buttons and inputs (min 44px)
- Tablet view (768px - 1024px):
  - Two-column layout option
  - Smaller visualizations
  - Responsive tables
- Desktop view (> 1024px):
  - Full feature set
- All data remains accurate across breakpoints
- Performance optimized for mobile networks

**Technical Notes:**
- Use mobile-first CSS approach
- Test on real devices and browser DevTools
- Optimize image sizes for mobile
- Lazy-load large tables and charts

**Priority:** P1 - Important

---

## **EPIC 9: Settings & Administration**

### **FE-021: User Settings & Preferences**

**As a** User  
**I want to** configure personal preferences (date format, currency display, timezone)  
**So that** the system matches my local settings

**Acceptance Criteria:**
- Settings page with sections:
  - Display Preferences:
    - Date Format (MM/DD/YYYY, DD/MM/YYYY, etc.)
    - Currency Display (with symbol, ISO code, separate decimals)
    - Timezone (for reporting dates/times)
    - Number Format (comma or period for thousands)
  - Email Preferences:
    - Email for alerts (configure later in Phase 2)
    - Report frequency (configure later in Phase 2)
  - Data Privacy:
    - Consent for sample data usage
- Save preferences locally (browser) and in database
- Apply preferences across all pages

**Technical Notes:**
- Use localStorage for client-side preference caching
- Store in database for persistence across devices

**Priority:** P2 - Nice to Have

---

### **FE-022: Admin Configuration Panel**

**As a** Finance Administrator  
**I want to** configure system-level settings (minimum cash threshold, large outflow threshold)  
**So that** the system applies correct business rules for liquidity analysis

**Acceptance Criteria:**
- Admin Settings page (restricted to Admins):
  - Liquidity Configuration:
    - Default Minimum Cash Buffer (numeric, optional)
    - Surplus Cash Threshold (numeric, optional)
    - Large Outflow Threshold (numeric, optional)
    - Concentration Risk Threshold (numeric, optional)
  - Forecast Configuration:
    - Default Forecast Horizon (7/30/60 days, multi-select)
    - Timing Tolerance for variance (days, default ±3)
  - Data Configuration:
    - Stale Data Warning (days, default 2)
    - Max File Size (MB)
  - Save and Apply to Future Runs

**Technical Notes:**
- Role-based access control (RBAC) for admin features
- Implement Settings validation on form
- Store in database with version history

**Priority:** P1 - Important

---

## **EPIC 10: Error Handling & User Feedback**

### **FE-023: Error & Exception Handling UI**

**As a** User  
**I want to** see clear error messages and know what to do when something fails  
**So that** I can fix the issue or contact support

**Acceptance Criteria:**
- Error notifications show:
  - Clear error message (user-friendly, not technical)
  - Timestamp
  - Error details (toggle to show technical info)
  - Suggested action ("Retry", "Download Template", "Contact Support")
  - Support link/email
- Toast notifications for temporary errors (file upload failed, etc.)
- Full error page for critical failures with troubleshooting steps
- Error tracking: Capture errors with user context for debugging

**Technical Notes:**
- Implement global error boundary in React
- Log errors to monitoring service (e.g., Sentry)
- Use structured error responses from API

**Priority:** P1 - Important

---

### **FE-024: Loading States & Progress Indicators**

**As a** User  
**I want to** see progress when processing large files or running agents  
**So that** I know the system is working and don't think it's frozen

**Acceptance Criteria:**
- File upload: Show progress bar with percentage and file size
- Agent processing: Show "Running Agent 1: Daily Cash Position..." with spinner
- Dashboard load: Show skeleton loaders for cards before data arrives
- Long operations: Show estimated time remaining if available
- Cancel button for operations that can be stopped
- Prevent duplicate submissions (disable button during processing)

**Technical Notes:**
- Use WebSocket or Server-Sent Events for real-time progress updates (Phase 2)
- For MVP, polling API for status updates is acceptable
- Implement debouncing on cancel button

**Priority:** P1 - Important

---

## **EPIC 11: Search, Filter & Drill-Down**

### **FE-025: Global Search & Filter**

**As a** User  
**I want to** search and filter cash data by entity, bank, account, date  
**So that** I can quickly find specific information

**Acceptance Criteria:**
- Global search box in navigation (search account names, entities, banks)
- Filter dropdowns on dashboard:
  - Date/As-of Date
  - Legal Entity (multi-select)
  - Bank (multi-select)
  - Currency (multi-select)
  - Confidence Level
  - Include Restricted Accounts (toggle)
- Filter state persists in URL (shareable URLs)
- Clear filters button resets to default
- Search results show match highlighting
- Debounced search (500ms delay before querying)

**Technical Notes:**
- Implement filter state in URL search params
- Client-side filtering for small datasets
- Server-side filtering for large datasets

**Priority:** P1 - Important

---

## **EPIC 12: Help & Documentation**

### **FE-026: In-App Help & Tooltips**

**As a** New User  
**I want to** understand what each field and metric means  
**So that** I can use the system effectively without memorizing the manual

**Acceptance Criteria:**
- Tooltips on all key terms (hover shows definition):
  - "Usable Cash" - Cash available for operations (excluding restricted)
  - "Forecast Confidence" - How reliable is this forecast based on data quality
  - "Variance" - Difference between forecast and actual
- Help icon (?) on complex sections opening contextual help
- Field descriptions visible below form inputs during data entry
- In-app tour/wizard for first-time users (interactive walkthrough)
- FAQ section in Help menu
- Link to full documentation

**Technical Notes:**
- Implement as Popover/Tooltip component
- Store help content in JSON/database for easy updates
- Lazy-load documentation content

**Priority:** P2 - Nice to Have

---

## **PRIORITY SUMMARY - FRONTEND USER STORIES**

### **Phase 1 MVP Must-Have (P0):**
- FE-001: File Upload Dashboard
- FE-002: File Upload Preview & Validation
- FE-003: Column Mapping Interface
- FE-004: Account Master Configuration
- FE-005: Daily Cash Position Dashboard
- FE-007: 7/30/60-Day Forecast Dashboard
- FE-009: Manual Forecast Assumptions Input
- FE-010: Liquidity Status Card
- FE-015: Executive CFO Summary View
- FE-019: Main Application Shell & Navigation

### **Phase 1 MVP Important (P1):**
- FE-006: Cash Position Exception Alerts
- FE-008: Forecast Breakdown by Entity & Currency
- FE-011: Directional Recommendation View
- FE-012: Liquidity Risk Details Panel
- FE-013: Forecast vs Actual Variance Dashboard
- FE-016: Summary Report Export Options
- FE-020: Responsive Design & Mobile Optimization
- FE-022: Admin Configuration Panel
- FE-023: Error & Exception Handling UI
- FE-024: Loading States & Progress Indicators
- FE-025: Global Search & Filter

### **Phase 1 MVP Nice-to-Have (P2):**
- FE-014: Variance Item Details
- FE-017: Data Source Traceability UI
- FE-018: Audit Trail & Change History
- FE-021: User Settings & Preferences
- FE-026: In-App Help & Tooltips

---

**Total Frontend User Stories: 26**  
**Estimated Development Effort: 8-10 weeks for full P0 + P1 implementation**
