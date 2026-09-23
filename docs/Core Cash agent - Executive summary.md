

## Core Fintech
AI powered Finance - Reimagined at the CORE
## Core Cash Agent
## Executive Summary
Agentic AI Cash & Liquidity Decision Layer for Corporate Clients
## Strategic Positioning
Not a TMS replacement. A TMS-agnostic agentic AI intelligence layer that reads data, validates it, explains liquidity risk, and
recommends the next best treasury action with human approval.
## Banks
## →
## ERP
## →
## TMS
## →
## Excel
## →
## Aggregators
## →
## Policy
## →
Agentic AI
## 7/30/60
Forecast horizon
## Read-only
MVP risk posture
TMS-agnostic
Works with or without TMS
90 days
Pilot-ready milestone
Core Fintech | Internal & ConfidentialPage 1 of 4

What the product should do
The value is not another dashboard - it is explainable treasury decision support.
## Core Cash Agent
From cash data to treasury action
- See cash today
Consolidated balances by entity, bank, account
and currency with stale-data and missing-file
warnings.
- Forecast short-term liquidity
7/30/60-day forecast using AR, AP, recurring
flows, historical patterns and assumptions.
- Explain variance
Why actual cash moved differently: delayed
collections, early payments, taxes, bank fees or
timing differences.
- Recommend action
Suggest transfer, sweep, collection follow-up,
funding, payment timing or escalation with
rationale.
- Create executive summary
Daily CFO-ready narrative: cash position, risks,
decisions needed and action owners.
- Preserve continuity
Reduces person-dependency with process
memory, checklists, decision history and
approval notes.
Every recommendation must answer
Why?What?
When?Control?
Human approval remains central. The agent recommends,
explains and drafts - treasury approves.
Core Fintech | Internal & ConfidentialPage 2 of 4

How to build it without becoming a TMS
Use a source-agnostic architecture: standard parsers first, direct bank APIs later by demand.
Bank files
## →
## ERP/TMS
## →
## Excel
## →
## Aggregator
## →
Validated data
model
## →
## AI
recommendations
Build before clients
- CSV / Excel mapper
- BAI2 parser
- camt.053 / camt.052 parser
- MT940 parser
- SFTP + PGP-ready framework
- Validation and audit trail
- Account/entity/currency mapping
Need client/bank later
- Actual account authorization
- Bank production credentials
- Client account mapping
- Real test files
- Production file/API schedule
- Legal/security approvals
- Go-live monitoring
Do not overbuild first
- No full TMS replacement
- No payment factory in MVP
- No autonomous fund movement
- No 15 direct bank APIs upfront
- No SWIFT/bureau dependency first
- No hard dependency on Plaid alone
Practical conclusion: 70% of the platform foundation can be prepared before a client. Live bank access remains client-specific.
Core Fintech | Internal & ConfidentialPage 3 of 4

Approval ask and 90-day execution plan
A focused MVP can prove product value quickly while keeping risk controlled.
Recommended approval
Build Core Cash Agent as a TMS-agnostic AI cash and liquidity decision layer.
MVP scope
Cash visibility, 7/30/60-day forecast, variance explanation, liquidity alerts, CFO narrative and
recommended actions.
## Weeks 1-3
Data model + demo
dataset
Cash balance, transaction, account,
entity, currency and source audit
model.
## Weeks 4-6
Connectors + parsers
CSV/Excel, BAI2 and camt.053
ingestion with validation and
mapping.
## Weeks 7-9
Forecast + risk logic
7/30/60 forecast, threshold alerts
and variance explanation.
## Weeks 10-12
Agent outputs + pilot
readiness
Daily cash summary, action note,
executive narrative and pilot
checklist.
Success criteria for approval gate
Working demo with real-like data • forecast and variance logic • validated parser output • management-ready action note • readiness for first client pilot
Final thought: many companies already have cash data somewhere. The gap is reliable, explainable decision support - what treasury
should do next.
Core Fintech | Internal & ConfidentialPage 4 of 4