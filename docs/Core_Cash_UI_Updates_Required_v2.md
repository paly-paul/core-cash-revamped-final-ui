# Core Cash — UI Updates Required (Based on Finalised Business Logic v2.0)

**Version**: 1.0
**Date**: 21 August 2026
**Purpose**: Specifies every UI change required across all 6 pages and global components as a result of the client review and business logic finalisation (v2.0). This is the implementation reference for the frontend engineer rebuilding or updating Core Cash against the approved logic.
**Audience**: Frontend engineer, UI/UX designer
**Reference documents**: `financial-business-logic-v2.md`, `ai-prd-v2.md`, `api-contract-v2.md`

---

## How to Read This Document

Each section describes:
- **What exists** — current state in the HTML prototype or Next.js scaffold
- **What changes** — exactly what must be updated
- **Why** — the business logic decision driving the change
- **Data field** — what the UI should bind to in the API response

Changes are tagged:
- 🔴 **Breaking** — existing component must be rebuilt or significantly restructured
- 🟡 **Update** — existing component modified (label, threshold, logic, field)
- 🟢 **New** — net-new component or page not in the current prototype
- ⚠️ **Hold** — do not build yet; blocked on an open decision

---

## GLOBAL CHANGES (Apply Across All Pages)

---

### G.1 — Status Colour Threshold: 70% 🟡

**What exists**: Status = Yellow when `balance >= min_threshold × 0.80`.

**What changes**: Update all status colour logic globally:
```
Green  : balance >= min_threshold
Yellow : balance >= min_threshold × 0.70
Red    : balance < min_threshold × 0.70
```

**Affected components**:
- Dashboard — Account Breakdown Table (status badge per row)
- Dashboard — Liquidity Status Card
- Dashboard — Active Breaches list
- Forecast — Entity Forecast Table (status column)
- CFO Summary — Forecast Outlook table (Risk column)

**Data field**: `account.status` in API response is pre-computed. Bind directly — do not recompute in the frontend. Verify the backend is returning `"Green"`, `"Yellow"`, `"Red"` at 70% boundary.

---

### G.2 — "Concentration Risk" Label → "AR Concentration Risk" 🟡

**What exists**: Label reads "Concentration Risk" in the Dashboard risk section and CFO Summary.

**What changes**: Every instance of "Concentration Risk" is renamed to **"AR Concentration Risk"** — in headers, tooltips, alert text, narrative copy, badge labels, and export reports.

**Search and replace scope**: Dashboard Section 1.7, CFO Summary risk narrative, Daily Briefing narrative, any tooltip mentioning "concentration."

---

### G.3 — Unexplained Variance Display 🟢

**What exists**: Variance breakdown assumes drivers sum to total. No "Unexplained Variance" row exists.

**What changes**: Add an **Unexplained Variance** row at the bottom of the variance drivers breakdown table. This row is:
- Visible when `unexplained_variance_usd !== 0`
- Hidden (or shows $0 / "Fully explained") when `unexplained_variance_usd === 0`
- Styled distinctly — amber text, no fill colour, italicised label: *"Unexplained Variance — manual investigation recommended"*
- Never suppressed or hidden regardless of the amount

**Data fields**:
- `unexplained_variance_usd` — amount to display
- `unexplained_variance_note` — tooltip or inline text explaining what couldn't be attributed

**Applies to**: Forecast page variance breakdown (Section 2.6), CFO Summary variance section (Section 4.7).

---

### G.4 — No Manual Edit Controls on AR / AP Data 🟡

**What exists**: AR and AP may have edit affordances (pencil icons, inline edit rows) in the prototype.

**What changes**: Remove all edit, delete, and manual add controls from any AR or AP data display. These tables are read-only displays of uploaded data. The only user action permitted is uploading a new file.

**What stays**: The upload button and file replacement flow remain. Table display of current AR/AP data remains (read-only).

**Applies to**: Uploads page (Section 3.1), any AR/AP table on Dashboard or Forecast.

---

## PAGE 1: DASHBOARD

---

### 1.1 — Top Metrics Row: Five Distinct Cash Figures 🔴

**What exists**: The header shows Total Cash, 7-Day Forecast, and a single "Usable" figure. OD is not shown separately.

**What changes**: Restructure the top metrics row to show **five distinct figures**, each labelled separately:

| Metric | Label | Value | Source Field |
|---|---|---|---|
| Total Cash | "Total Cash" | Sum of all closing balances, USD | `total_cash_usd` |
| Available Cash | "Available Cash" | Bank-reported available balance, USD | `available_cash_usd` |
| Restricted Cash | "Restricted Cash" | Balances on restricted accounts, USD | `restricted_cash_usd` |
| Usable Cash | "Usable Cash" | Available − Restricted | `usable_cash_usd` |
| OD Limit | "OD Limit" | Total overdraft facility available, USD | `od_limit_total_usd` |

**Display rules**:
- Usable Cash is the **primary** figure — largest font, highest visual weight
- OD Limit is displayed as a secondary supporting figure: "$2.0M available" with a subtle border or separator
- **Never** show a combined "Usable + OD" figure. These must always be visually and numerically distinct.
- If `od_limit_total_usd = 0` or null: hide the OD Limit metric card entirely

**Tooltip on OD Limit**: "Overdraft facility available. This is not cash — it is a credit line. Not included in Usable Cash."

---

### 1.1 — FX Rate Warning Banner 🟢

**What exists**: No FX rate warning state exists in the prototype.

**What changes**: Add a **warning banner** that appears at the top of the Dashboard (and propagates to all pages) when `fx_rates_warning: true` in the API response.

**Banner design**:
- Amber background, amber border
- Icon: clock or warning triangle
- Text: "FX rates not updated for today — figures shown using [prior_date] rates. Contact your FX admin."
- Dismissible for the session (re-appears on page refresh until today's rate is entered)
- Persists across all pages until resolved — not page-specific

**Data field**: `fx_rates_warning` (boolean), `fx_rates_date` (string — prior date used).

---

### 1.1 — Data Confidence Indicator: Three-Level Badge 🟡

**What exists**: Confidence is shown as a single badge with binary High/Low states.

**What changes**: Update to show **three levels**: High (green), Medium (amber), Low (red).

**Badge mapping**:
- `"High"` → green pill, text: "High Confidence"
- `"Medium"` → amber pill, text: "Medium Confidence"  
- `"Low"` → red pill, text: "Low Confidence"

**Tooltip on Medium**: "One or more feeds are 24–48 hours stale, or one expected feed is missing."
**Tooltip on Low**: "One or more feeds are older than 48 hours, or multiple expected feeds are missing."
**Tooltip on High**: "All feeds refreshed within 24 hours."

**Applies to**: Dashboard header confidence indicator, Account Breakdown Table confidence column (per-row), CFO Summary cover.

---

### 1.2 — Liquidity Status Card: Shortfall Logic Update 🟡

**What exists**: Status = "Attention" when any account `opening_balance < min_threshold` in the 7-day forecast.

**What changes**: Update trigger to **projected closing usable cash < min_threshold**:
```
Attention = any day in 7-day forecast where:
  projected_closing_usable_cash < min_threshold (account or entity level)
```

**Status hierarchy** (highest wins):
1. Critical — active balance breach (`current_balance < min_threshold`)
2. Attention (Forecast Shortfall) — projected breach in 7-day window
3. Attention (AR Concentration) — top 3 > 70% of AR
4. Attention (Stale Feed) — any bank feed >48h stale
5. Normal — none of the above

**No UI structure change required** — only the trigger logic and tooltip copy changes.

**Tooltip copy update**: Change "forecast shortfall" tooltip from "Opening balance falls below minimum in next 7 days" to "Projected closing cash falls below minimum threshold on [date(s)]."

---

### 1.3 — Cash Breakdown: Add Entity View (Option C) 🔴

**What exists**: One section showing cash by currency (USD / GBP / EUR breakdown with share %).

**What changes**: Add a **second view** showing cash by entity in USD equivalent. Implement as:
- Two tabs or a toggle: "By Currency" | "By Entity"
- Default tab: "By Currency" (existing view retained)
- "By Entity" tab: table/bar chart showing each entity's usable cash in USD equivalent

**By Entity view content**:

| Entity | Usable Cash (USD) | Share (%) |
|---|---|---|
| US HQ | $7.2M | 56.8% |
| UK Operations | $3.4M | 26.8% |
| EU Entity | $1.6M | 12.6% |
| Unallocated | $0.5M | 3.9% |

**Data fields**: `entities[].entity_name`, `entities[].usable_cash_usd` from `/cash-position/current`.

---

### 1.4 — Account Breakdown Table: Entity Column + OD Display 🔴

**What exists**: Columns are Account Name | Bank | Currency | Current Balance | Min Threshold | Status | Confidence. No entity column. No OD display.

**What changes**:

**1. Add Entity column** as the first (leftmost) column:

| **Entity** | Account Name | Bank | Currency | Current Balance | Min Threshold | Status | Confidence |

Accounts remain grouped by entity (collapsible row per entity). The entity column makes the entity visible at the individual account row level when all rows are expanded.

**Entity row** (group header):
- Shows entity name + total usable cash for that entity in USD equivalent
- Collapsible — chevron on the left

**2. "Current Balance" column now shows `available_balance`** (not `closing_balance`):
- Previously: `Statement.closing_balance`
- Now: `Statement.available_balance`
- Tooltip: "Bank-reported available balance after uncleared and pending items."

**3. OD display per account**:
- If `od_utilised = true`: show balance in red with an "OD" badge next to it
  - Example: "-$50,000 🔴 OD"
  - Tooltip: "Account is in overdraft. OD facility: $500K. Utilised: $50K. Remaining: $450K."
- If `od_limit` is set but balance is positive: show a small grey "OD: $500K" sub-label under the balance
- If `od_limit` is null: no OD display

**4. Status uses 70% threshold** (see G.1).

**Data fields**:
- `entities[].accounts[].available_balance`
- `entities[].accounts[].od_limit`
- `entities[].accounts[].od_utilised`
- `entities[].accounts[].od_headroom`
- `entities[].accounts[].status`
- `entities[].accounts[].confidence`

---

### 1.5 — AI Recommendation Card: Language + Investment + Approval 🔴

**What exists**: Recommendations use execution-based language ("Transfer EUR 200K"). No investment recommendations. Approval owner is hardcoded.

**What changes**:

**1. Language — all `what` fields use evaluative verbs only**:
- Permitted: Evaluate / Consider / Review / Propose / Escalate
- Prohibited: Transfer / Execute / Send / Move / Initiate
- Frontend should not sanitise this — the backend enforces it. If execution language appears, flag as a backend bug.

**2. Investment recommendation card type** (new):
- When `type: "Investment"` in recommendation response: render with a distinct secondary colour treatment (e.g., blue-tinted card vs. amber for funding)
- Copy pattern: "Evaluate investment of surplus USD $X per uploaded investment SOP — before [cut-off time] [entity] cut-off"
- If no investment SOP uploaded: show a dimmed "Surplus flagged" notice, not a full recommendation card

**3. Approval owner** now references DOA policy:
- Replace hardcoded "Finance Director" with `control.approval_owner` from the API response
- Example: "Finance Director (per DOA policy)"

**4. Approval workflow UI**:
- Every recommendation card must show two action buttons: **[Approve]** and [Reject]
- On Approve: confirm modal — "Confirm: have you actioned this recommendation outside the system?" → Yes → `POST /recommendations/:id/approve`
- On Reject: reason text field → `POST /recommendations/:id/reject`
- `approval_status` badge: Pending (amber) / Approved (green) / Rejected (grey) / Completed (blue)
- No recommendation card ever shows as auto-completed

**5. Recommendation count cap**: Maximum 10 cards rendered. If `recommendation_count > 10`, show a "10 of [N] recommendations shown" footer note (this should not occur given backend cap, but defensive UI is good practice).

**Data fields**:
- `recommendations[].type`
- `recommendations[].why`, `.what`, `.when`, `.control`
- `recommendations[].approval_status`
- `control.approval_owner`
- `control.human_approval_required`

---

### 1.6 — Liquidity Risk Section: Revised Score + AR Concentration Label 🟡

**What exists**: Risk score uses old weights. Label says "Concentration Risk."

**What changes**:

**1. Risk score display** — no UI structure change; only the number displayed will be different (backend change). Ensure the score band colours match the revised scale:
- 1–3: Low — green badge
- 4–6: Medium — amber badge  
- 7–10: High — red badge

**2. Score breakdown tooltip** (if implemented): Update to show new weight labels:
```
Base: 1
Active Breaches: +2 per breach (max 6)
Stale Feed: +1
AR Concentration Risk: +1
Forecast Shortfall: +2
Total: capped at 10
```

**3. "Concentration Risk" → "AR Concentration Risk"** (see G.2).

**4. Active Breaches table column order** (update if different):
Entity | Account Name | Min Threshold | Current Balance | Shortfall | Currency

**5. AR Concentration Risk section**:
- When `ar_concentration_risk.breached: false`: show metric with green status
- When `ar_concentration_risk.breached: true`: show amber/red alert, trigger Attention status
- When `ar_concentration_risk.high_single_counterparty: true`: add secondary flag "Single counterparty exceeds 40% of AR"
- Top 3 counterparty list: always visible, not just when breached

---

## PAGE 2: FORECAST

---

### 2.1 — Remove Forecast Confidence Indicator ⚠️ (Deferred)

**What exists**: There may be a Forecast Confidence metric or placeholder in the prototype.

**What changes**: Do not build a Forecast Confidence indicator. It is deferred to Phase 2. If a placeholder exists, remove it. The existing Data Confidence indicator (from Page 1 feed freshness) is the only confidence metric in MVP.

---

### 2.2 — Opening Cash: Blocked State 🔴 ⚠️

**What exists**: Chart and summary metrics show an Opening Cash figure.

**What changes**: Until the opening balance logic is confirmed, the Forecast page must show a **graceful blocked state** when the `/forecast` endpoint returns HTTP 503:

**Blocked state design**:
- Replace chart area with a neutral placeholder card
- Text: "Forecast temporarily unavailable — opening balance calculation is being finalised. Check back soon."
- Style: grey background, info icon, no error colouring (this is a known intentional state, not a system failure)
- All other Dashboard sections remain functional

This state must not look like an error. It is a known planned gap in the build.

---

### 2.3 — Entity Forecast Table: Base Currency + 70% Threshold 🟡

**What exists**: All values displayed in USD. Status uses 80% threshold.

**What changes**:
- Display each entity's row in its **base currency** (e.g., UK Operations in GBP, EU Entity in EUR)
- Currency symbol and ISO code shown alongside each figure: "£3,420,000 GBP"
- Consolidated total row at the bottom remains in USD equivalent — label it "**Consolidated Total (USD)**"
- Status column uses 70% threshold (see G.1)
- Default sort: descending by Opening balance; user can click column headers to re-sort

**Data fields**: `entities[].base_currency`, `entities[].opening_local`, `entities[].inflows_local`, `entities[].outflows_local`, `entities[].closing_local`, `entities[].status`.

---

### 2.4 — Significant Outflow Flag on Chart 🟢

**What exists**: No outflow significance flag on the forecast chart.

**What changes**: Add a visual flag on the forecast chart for any day where a single outflow exceeds **10% of Usable Cash**.

**Design**:
- Small downward arrow or exclamation marker on the bar/line chart at the flagged date
- Amber colour
- Tooltip on hover: "[Category] outflow of $X on [date] — [X.X]% of usable cash. Review before cut-off."
- Categories shown in tooltip: Loan Repayment / Tax / Capex / Large AP (if tagged)

**Data field**: `significant_outflows[]` array in forecast response:
- `significant_outflows[].date`
- `significant_outflows[].amount_usd`
- `significant_outflows[].pct_of_usable_cash`
- `significant_outflows[].category`
- `significant_outflows[].description`

---

### 2.5 — Manual Assumptions Editor: Full Rebuild 🔴

**What exists**: Assumptions editor has High/Medium/Low dropdown for confidence. May have a file upload option for assumptions.

**What changes** (multiple):

**1. Remove file upload** — assumptions are UI entry only. If an upload zone for assumptions exists anywhere, remove it.

**2. Replace confidence dropdown with numeric percentage input**:
- Input: 0–100 number field, labelled "Confidence (%)"
- Inline helper: "Assumptions below 50% are excluded from the forecast"
- Real-time display: as user types, show inclusion status immediately
  - ≥50%: green tick + "Included in forecast"
  - <50%: grey X + "Excluded from forecast"

**3. Add Category field** (mandatory dropdown):
```
Payroll / Tax / Investment / Loan Repayment / Capex / Operating / Other
```
This field drives the Major Outflow Alert categorisation on the Daily Briefing and forecast chart flags.

**4. Add Direction field** (mandatory radio/toggle):
- Inflow / Outflow — mutually exclusive

**5. Assumptions list**: Show all assumptions, including excluded ones, with a clear visual distinction:
- Included: normal row, confidence % in green
- Excluded: dimmed row, confidence % in grey, italic label "Excluded — below 50% threshold"

**6. Edit behaviour note** (for UX): When a user edits an assumption, the change is immediate. There is no "undo" — prior values are in the audit log only. Consider adding a brief confirmation: "Assumption updated. Prior value ($100K) recorded in audit log."

**7. No AP/AR linkage fields** — do not build any "Override AR item" or "Link to AP invoice" functionality. Manual assumptions are net-new items only.

**Data fields**:
- POST/PUT: `entity_id`, `currency`, `direction`, `amount`, `date`, `category`, `description`, `confidence_pct`
- GET response: `included_in_forecast` (boolean, pre-computed by backend)

---

### 2.6 — Variance Analysis: New Metrics + Unexplained Variance 🔴

**What exists**: Variance display shows a single variance figure and a basic drivers list. Drivers forced to sum to total.

**What changes**:

**1. Add four variance metric cards**:

| Metric | Label | Value | Colour rule |
|---|---|---|---|
| Total Variance | "Total Variance" | `total_variance_usd` | Positive = green; Negative = red |
| Variance Direction | "Direction" | `variance_direction` ("Favorable" / "Unfavorable") | Favorable = green; Unfavorable = red |
| Variance % | "Variance %" | `variance_pct` + "%" | ±5% = green; else amber/red |
| Forecast Accuracy | "Forecast Accuracy" | `forecast_accuracy_pct` + "%" | ≥80% = green; ≥60% = amber; <60% = red |

**2. Tolerance indicator**: Show ±5% tolerance as a reference line or annotation near Variance % metric. Tooltip: "Forecast accuracy is measured against a ±5% tolerance band."

**3. Variance drivers breakdown table**: 
- Each driver row: Driver Name | Amount | Category | Detail
- Add a `one_off_flag` indicator: if `one_off_flag: true`, show a grey "One-off" badge on that row
- Tooltip on One-off badge: "Exceeds 3× the 30-day average daily outflow — classified as non-recurring."

**4. Unexplained Variance row** (see G.3):
- Shown at bottom of drivers table when `unexplained_variance_usd !== 0`
- Style: amber italic text, no fill, "🔍 Unexplained Variance — manual investigation recommended"
- Amount displayed in same format as other drivers

---

## PAGE 3: UPLOADS

---

### 3.1 — Remove Manual Assumptions Upload Zone 🔴

**What exists**: A file upload zone for "Manual Assumptions" exists on the Uploads page.

**What changes**: **Remove this upload zone entirely.** Manual assumptions are now entered via the Forecast page UI editor (Section 2.5 above). No file upload for assumptions in MVP.

Replace the space with either:
- A shortcut card: "Manage Assumptions → Go to Forecast Page" (links to `/forecast` with the assumptions panel open)
- Or simply close the gap in the layout

---

### 3.2 — Bank Balance Upload: Updated Accepted Formats + Validation 🟡

**What exists**: Upload zone accepts CSV only. Validation rules use old column set.

**What changes**:

**1. Accepted formats** (update the file type indicator on the upload zone):
- CSV (primary)
- BAI2 (.txt or .bai)
- camt.053 (.xml)
- MT940 (.txt or .sta)
- PDF: show as "Coming soon" greyed-out chip — do not enable until sample files reviewed

**2. Required columns validation feedback** (update error messages to reflect new required columns):

| Column | If missing: show error |
|---|---|
| Entity Name | "Entity Name is required — map this column before uploading" |
| Account Number | "Account Number is required" |
| Bank | "Bank is required" |
| Currency | "Currency is required (USD, GBP, or EUR)" |
| Closing Balance | "Closing Balance is required — use the bank-reported end-of-day closing balance" |
| Statement Date | "Statement Date is required" |

**3. Negative balance handling** (new validation feedback, not an error):
- If any row has a negative Closing Balance: show info toast: "Negative balance detected on [account] — treated as overdraft utilisation. Review in Account Master."
- Do not block the upload or flag as an error.

**4. Unmapped account feedback** (update existing error state):
- Old: "Upload failed — [N] unrecognised accounts"
- New: "Upload accepted — [N] accounts not in Account Master. These are included with Low Confidence. Map them in Account Master to resolve."
- Provide a direct link to Account Master from this message.

---

### 3.3 — AR and AP Upload: Updated Required Columns 🟡

**What exists**: AR and AP uploads have existing required column sets without Entity Name or Currency.

**What changes**: Update required columns validation for both:

**AR required columns** (add to validation):
- Entity Name *(new)*
- Currency *(new)*
- Due Date *(already present — confirm labelling as "Due Date" not "Expected Date")*

**AP required columns** (add to validation):
- Entity Name *(new)*
- Currency *(new)*
- Due Date *(already present — confirm labelling)*

Update the column mapping UI to show these as required (red asterisk) rather than optional.

**AP Upload note**: After a successful AP upload, the system triggers a forecast re-run. Show a toast: "AP data uploaded. Forecast is being recalculated — refresh in a moment."

---

### 3.4 — Account Master Table: OD Limit Field 🟡

**What exists**: Account Master table shows: Account Number | Account Name | Bank | Entity | Currency | Restricted Flag | Min Threshold | Refresh Frequency | Status | Include in Cash Position.

**What changes**: Add **OD Limit** column between Min Threshold and Refresh Frequency:

| ... | Min Threshold | **OD Limit** | Refresh Frequency | ... |

**OD Limit field behaviour**:
- Input: numeric, optional (blank = no OD facility)
- Placeholder: "No OD" when null
- Validation: must be ≥ 0 if entered
- Tooltip: "Overdraft facility for this account. Displayed separately on Dashboard — not included in Usable Cash."
- If OD Limit is set and the account currently has a negative balance: show a small alert icon in the OD Limit cell — "OD in use"

---

### 3.5 — FX Rate Admin Screen: New Component 🟢

**What exists**: No FX rate admin screen exists in the prototype.

**What changes**: Build a new **FX Rate Admin Screen**. Location in navigation at design team's discretion (Uploads page tab, or Settings section).

**Screen components**:

**Rate entry panel**:
- Two entry fields:
  - "GBP → USD Rate" (number input, 4 decimal places)
  - "EUR → USD Rate" (number input, 4 decimal places)
- "Save Rates" button
- Last-updated display: "Last updated: [timestamp] by [user name]"
- If today's rate not yet entered: amber banner at top — "Today's FX rates have not been entered. Figures currently use [prior date] rates."
- On save: green success toast — "FX rates saved for [today's date]. All calculations updated."

**Rate history table** (below entry panel):

| Date | GBP → USD | EUR → USD | Entered By | Time |
|---|---|---|---|---|

Show last 7 days. Descending order (most recent first). Read-only.

**Access control**: This screen is visible and editable only for users with `role: fx_admin` or `role: admin`. All other users see a read-only view of current rates with no entry fields.

---

## PAGE 4: CFO SUMMARY

---

### 4.1 — Live Insights Panel: Refresh Rate + Cash Runway 🟡

**What exists**: Auto-refresh every 60 seconds. Cash Runway uses historical outflows only.

**What changes**:

**1. Refresh interval**: Change from 60 seconds to **60 minutes**.
- Update the countdown timer display: "Refreshing in 58 min" (if a countdown is shown)
- Or replace countdown with "Last updated: [timestamp]"
- Add a **"Refresh Now" button** with a loading state (spinner during refresh)

**2. Cash Runway metric**:
- Update tooltip to reflect blended calculation: "Days of Usable Cash remaining based on blended 30-day historical outflows and 30-day forward forecast outflows (50/50 weighted)."
- Add a sub-label when one-offs are excluded: "Excludes [date] one-off outflow of $X"
- Data field: `cash_runway_days`, `cash_runway_note`

**3. Four Live Insights metrics to display** (confirm all are present):
- Cash Runway (Days) — `cash_runway_days`
- Liquidity Risk Score — `liquidity_risk_score`
- Variance % — `variance_pct`
- Forecast Accuracy % — `forecast_accuracy_pct`

---

### 4.2 — Cash Position Section: MTD Change (Replace YTD) 🟡

**What exists**: Cash Position table shows a "YTD Change" column.

**What changes**: Replace "YTD Change" column with **"MTD Change"**:

| Entity | USD Equivalent | **MTD Change** | Trend |
|---|---|---|---|

- **MTD Change** = Current balance − balance on 1st of current month (USD equivalent)
- Positive MTD: green, upward arrow prefix (↑ $340K)
- Negative MTD: red, downward arrow prefix (↓ $120K)
- Zero MTD: grey, flat dash (— $0)
- **Trend** column: Up / Flat / Down (based on MTD direction — retained from current design)

**Data field**: `cash_position[].mtd_change_usd`.

---

### 4.3 — OD Limit in Report Cover 🟢

**What exists**: Report cover shows Total Cash and Usable Cash summary stats.

**What changes**: Add **OD Limit** as a separate summary stat in the report cover:

```
Total Cash:     $12.84M
Available Cash: $12.84M
Usable Cash:    $9.44M   ← primary figure, bold
OD Limit:       $2.00M   ← secondary figure, lighter weight, labelled "Credit facility"
```

These must never be merged. The display format must make it clear that OD Limit is a separate credit facility, not cash.

**Data field**: `cover.od_limit_total_usd`.

---

### 4.4 — Forecast Outlook: 70% Threshold 🟡

**What exists**: Risk = Yellow when forecast closing ≥ 80% of min_threshold.

**What changes**: Risk colour uses 70% threshold (see G.1). No structural change — only threshold value.

**Verify**: The `risk` field in `/cfo-summary/report` `forecast_outlook[]` is pre-computed by backend. No frontend recalculation needed.

---

### 4.5 — Actions Required Section: Evaluative Language + DOA Approval Owner 🟡

**What exists**: Recommendation cards may show execution-based `what` text. Approval owner hardcoded.

**What changes**:
- Bind `control.approval_owner` dynamically from API (replaces hardcoded "Finance Director")
- No frontend language sanitisation — evaluative language is enforced by backend. If execution verbs appear, it is a backend defect.
- Approval status badges and workflow buttons: apply same changes as Dashboard Section 1.5 above

---

## PAGE 5: DAILY BRIEFING

---

### 5.1 — Major Outflow Alert in "Ahead of Us" Section 🟢

**What exists**: "Ahead of Us" entries are prose only with no structured outflow alert.

**What changes**: When `major_outflow_alert` is present in an "Ahead of Us" entry, render a **structured alert callout** within the prose entry for that day:

**Alert design** (inline within the day's text block):
- Amber left-border accent (matches warning style from rest of UI)
- Alert header: "⚠ Major Outflow — [Category]"
- Body lines:
  - Amount: "$1.2M (12.7% of Usable Cash)"
  - Entity: "US HQ"
  - Action: "[action text from API]"
- Keep it compact — this is inside a prose section, not a full card

**Rule**: This alert only appears when `major_outflow_alert !== null`. When null, the day entry is pure prose with no alert component.

**Data field**: `ahead_of_us[].major_outflow_alert`:
- `.category`
- `.amount_usd`
- `.pct_of_usable_cash`
- `.entity`
- `.action`

---

### 5.2 — Treasury Continuity Precedent Callout 🟢

**What exists**: No precedent callout exists in the prototype.

**What changes**: Within "Behind Us" day entries, when `precedent_callout !== null`, render an optional callout:

**Callout design** (inline within the day's prose block):
- Subtle blue-left-border accent (differentiated from the amber alert on Ahead of Us)
- Italic text style
- Prefix icon: 📋 or a history/clock icon
- Text: the `precedent_callout` string from the API
- Example: *"Last time EU Entity was below minimum (Feb 2026), the team funded €180K from UK Operations — resolved in 2 business days."*

**Rule**: When `precedent_callout === null`, nothing is rendered — the day entry is pure prose.

**Important**: Daily Briefing must remain **prose-only in structure**. These callouts are inline annotations within prose entries, not separate cards or metric components. The prose character of the page must be preserved.

---

### 5.3 — Preserve Prose-Only Structure 🔴 (Guard Rail)

**What exists / what must not change**: The Daily Briefing is a prose-text page. This is a non-negotiable product rule.

**Guard rails for frontend**:
- No metric cards on this page
- No status badges on this page (except within the inline Major Outflow Alert)
- No tables on this page
- No navigation-style sub-sections or tabs
- No "expand for more" data panels
- The only structured elements permitted: the two inline annotations defined in 5.1 and 5.2 above

If a design review requests "adding data" to the Daily Briefing in a structured format, this must be escalated to the product lead — it requires a product rule change, not a design decision.

---

## PAGE 6: TRENDS & HISTORY

### 6.1 — Entire Page: Deferred to Phase 2 🔴

**What exists**: Full 9-section Trends & History page in the HTML prototype.

**What changes**: Do not implement this page in MVP. The Next.js route can exist as a placeholder:
- Render a simple holding screen: "Trends & History will be available after 3–6 months of live data. Check back in Phase 2."
- Nav link remains visible but routes to this placeholder — do not hide the nav item
- No API calls for trends endpoints

---

## NEW PAGES / COMPONENTS

---

### N.1 — FX Rate Admin Screen 🟢

Covered in Section 3.5. Summary:
- Route: within Uploads page as a new tab, or a `/settings/fx-rates` route — design team to decide
- Visible to all users (rate display); editable by `fx_admin` / `admin` only
- Two entry fields (GBP→USD, EUR→USD) + Save + history table
- Missing rate banner

---

### N.2 — Investment Policy Admin Screen 🟢 ⚠️

**Status**: Build skeleton now; do not wire to investment recommendation logic until amit j provides cut-off values and policy document.

**Route**: `/settings/investment-policy` or within Uploads page

**Screen components**:
- Active policy display: Version, uploaded by, uploaded date, document link
- "Upload New Policy" button (replaces active policy; prior version deactivated)
- Entity-level cut-off time configuration:

| Entity | Cut-off Time | Time Zone | Investment Account |
|---|---|---|---|
| US HQ | [time input] | EST | [account dropdown] |
| UK Operations | [time input] | GMT | [account dropdown] |
| EU Entity | [time input] | CET | [account dropdown] |

- Save button per row (or Save All)
- Access: admin only

**Placeholder state** (before policy uploaded):
- Text: "No investment policy uploaded. Investment recommendations are suppressed until a policy is configured. Upload your investment SOP to enable."
- Upload button prominent

---

## CHATBOT (AI CHAT PANEL)

---

### C.1 — Scope Clarification: Retrieval Only 🟡

**What exists**: Chat panel exists in prototype with open-ended input.

**What changes**:
- No structural UI change needed
- Update placeholder text in the chat input: "Ask about your cash position, forecast, risk, or recommendations..."
- Suggested prompt chips (optional): "What's today's cash position?", "Are we at risk of a shortfall?", "Summarise today's recommendations", "What happened to cash this week?"
- **Scope the response**: if backend returns an out-of-scope response, the UI should not need to handle this — backend scope enforcement handles it. However, if the chatbot returns a "I can't answer that in MVP" response from the API, render it gracefully as a normal text message, not an error state.

---

## SUMMARY: UI CHANGE COUNT BY PAGE

| Page | Breaking 🔴 | Update 🟡 | New 🟢 | Hold ⚠️ | Total |
|---|---|---|---|---|---|
| Global | 1 | 3 | 1 | — | 5 |
| Dashboard | 3 | 3 | 1 | — | 7 |
| Forecast | 2 | 2 | 1 | 1 | 6 |
| Uploads | 1 | 3 | 1 | — | 5 |
| CFO Summary | — | 4 | 1 | — | 5 |
| Daily Briefing | 1 | — | 2 | — | 3 |
| Trends & History | 1 | — | — | — | 1 |
| New Screens | — | — | 2 | 1 | 3 |
| Chatbot | — | 1 | — | — | 1 |
| **Total** | **9** | **16** | **9** | **2** | **36** |

---

## BUILD PRIORITY ORDER

Recommended sequence based on dependencies and value:

**Phase A — Foundations (build first, unblock everything else)**
1. G.1 — Status threshold global update (70%)
2. G.2 — AR Concentration Risk label
3. 1.1 — Top metrics row restructure (5 figures)
4. 1.4 — Account Breakdown Table (entity column + OD + available_balance)
5. 3.4 — Account Master OD Limit field
6. 3.5 — FX Rate Admin Screen

**Phase B — Core Data Pages**
7. 1.3 — Currency + Entity breakdown (Option C toggle)
8. 1.5 — Recommendation card (evaluative language, investment type, DOA owner, approval workflow)
9. 1.6 — Risk score + AR Concentration label
10. 2.5 — Manual Assumptions Editor rebuild
11. 2.6 — Variance analysis (new metrics + Unexplained Variance)
12. 3.1 — Bank Balance upload (formats + validation)
13. 3.3 — AR/AP upload required columns

**Phase C — Reporting + Briefing**
14. 4.2 — CFO Summary MTD change
15. 4.1 — Live Insights refresh + Cash Runway
16. 4.3 — OD Limit in report cover
17. 5.1 — Major Outflow Alert in Daily Briefing
18. 5.2 — Treasury Continuity precedent callout
19. G.3 — Unexplained Variance row (cross-page)

**Phase D — New Screens + Held Items**
20. N.2 — Investment Policy Admin Screen (skeleton)
21. 1.1 — FX Rate Warning Banner
22. 2.2 — Forecast blocked state (holds until opening balance resolved)
23. 3.1 — PDF upload formats (holds until sample files reviewed)
24. 6.1 — Trends & History placeholder

---

## ITEMS THAT MUST NOT BE BUILT

The following were considered and explicitly excluded from MVP scope. Do not implement:

| Item | Reason |
|---|---|
| Manual Assumptions file upload (CSV) | Replaced by UI entry; no file upload for assumptions |
| AR or AP manual edit controls | Upload-only; no inline editing |
| PDF parsers for uploads | Pending sample file assessment |
| Excel (.xlsx) upload support | Pending QuickBooks sample test |
| Forecast Confidence metric | Deferred to Phase 2 |
| Trends & History page (full) | Deferred to Phase 2 — needs 3–6 months of live data |
| "Override AR item" / "Link to AP invoice" in assumptions | Not required — assumptions are net-new items only |
| Combined Usable Cash + OD Limit figure | Must always be separate; never merged |
| Auto-approve workflow for recommendations | Human approval always required; no auto-complete |
| YTD change in CFO Summary | Replaced by MTD |
| Execution-language recommendation buttons | No "Transfer now" or "Execute" buttons of any kind |

---

**Document prepared**: 21 August 2026
**Version**: 1.0
**Next review**: After frontend engineer reviews and flags implementation questions
