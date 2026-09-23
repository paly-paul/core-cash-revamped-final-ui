'use client'

import React, { useState } from 'react'
import { SectionCard } from '@/components/ui/card'
import { Badge, StatusPill } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { ApprovalForm } from '@/components/forms/approval-form'
import { APPROVAL_ITEMS, TREND_7D } from '@/lib/constants'
import type { ApprovalItem } from '@/lib/types'

// Mini sparkline SVG component
function Sparkline({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 120
  const h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x},${y}`
  })
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * (h - 6) - 3
        return (
          <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3 : 0} fill={color} />
        )
      })}
    </svg>
  )
}

export default function CfoSummaryPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(APPROVAL_ITEMS)

  const handleApprove = async (id: string) => {
    await new Promise(r => setTimeout(r, 600))
    setApprovals(prev => prev.map(it => it.id === id ? { ...it, status: 'approved' as const } : it))
  }

  const handleReject = async (id: string, reason: string) => {
    await new Promise(r => setTimeout(r, 600))
    setApprovals(prev => prev.map(it => it.id === id ? { ...it, status: 'rejected' as const, rejectionReason: reason } : it))
  }

  const runwayData = TREND_7D.map(d => d.cash_runway_days)
  const riskData = TREND_7D.map(d => d.liquidity_risk_score)

  return (
    <>
      <FxBanner />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">CFO Summary</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">23 SEP 2026 · WEEKLY REPORT</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] hover:bg-[var(--blue-lt)] cursor-pointer">
            ↓ Download PDF
          </button>
          <button className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">
            ✉ Send Report
          </button>
        </div>
      </div>

      {/* Report cover */}
      <div className="bg-gradient-to-br from-[#0057D9] to-[#003FA0] rounded-[var(--rlg)] px-8 py-7 text-white shadow-[var(--she)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.12em] uppercase opacity-70 mb-2">Treasury Intelligence Platform</div>
            <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-1">CFO Cash & Treasury Report</h2>
            <p className="text-[13px] opacity-80">Week ending 23 September 2026 · Acme Corporation Group</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-[var(--rmd)] px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-[#34D399] pulse-dot" />
              <span className="text-[12px] font-semibold">Normal</span>
            </div>
            <span className="text-[11px] opacity-60 font-[var(--mono)]">Report v2.4 · Confidence 87%</span>
          </div>
        </div>
      </div>

      {/* Live AI Insights Panel */}
      <SectionCard
        title="Live AI Insights"
        actions={
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--green)] pulse-dot" />
            <span className="text-[11px] text-[var(--tm)]">Live · Updated 09:00 UTC</span>
            <button className="text-[11px] text-[var(--blue)] cursor-pointer bg-transparent border-none font-medium hover:underline">↺ Refresh</button>
          </div>
        }
      >
        {/* 4 metric tiles */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <InsightTile label="Cash Runway" value="35 days" pill={<StatusPill variant="medium">● Medium</StatusPill>} tooltip="Days until usable cash falls below minimum threshold at current burn rate" />
          <InsightTile label="Liquidity Risk" value="4 / 10" pill={<StatusPill variant="medium">● Medium</StatusPill>} tooltip="Composite risk score: threshold breaches, stale feeds, AR concentration, forecast shortfall" />
          <InsightTile label="MTD Variance" value="−£0.62M" pill={<StatusPill variant="medium">● −6.4%</StatusPill>} tooltip="Month-to-date actual cash vs. forecast. Negative = below forecast." />
          <InsightTile label="Forecast Accuracy" value="87%" pill={<StatusPill variant="high">● High</StatusPill>} tooltip="30-day rolling average of forecast accuracy across all entities." />
        </div>

        {/* 7-day sparklines */}
        <div className="grid grid-cols-2 gap-4 border-t border-[var(--b0)] pt-4">
          <div>
            <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1">Cash Runway — 7-Day Trend</div>
            <div className="flex items-end gap-3">
              <Sparkline data={runwayData} color="var(--amber)" />
              <div>
                <div className="font-[var(--mono)] text-[17px] font-semibold text-[var(--t1)]">{runwayData[runwayData.length - 1]} days</div>
                <div className="text-[10px] text-[var(--red)]">▼ {runwayData[0] - runwayData[runwayData.length - 1]} days in 7d</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1">Liquidity Risk Score — 7-Day Trend</div>
            <div className="flex items-end gap-3">
              <Sparkline data={riskData} color="var(--red)" />
              <div>
                <div className="font-[var(--mono)] text-[17px] font-semibold text-[var(--t1)]">{riskData[riskData.length - 1]}</div>
                <div className="text-[10px] text-[var(--red)]">▲ +{riskData[riskData.length - 1] - riskData[0]} pts in 7d</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 1: Executive Summary */}
      <ReportSection title="1. Executive Summary">
        <p className="text-[12.5px] text-[var(--t2)] leading-[1.75] mb-3">
          For the week ending 23 September 2026, Acme Corporation Group maintained adequate liquidity
          across all three operating entities. Consolidated usable cash stands at £9.04M, representing
          a decrease of £0.62M versus the opening forecast of £9.66M — a variance of −6.4%.
        </p>
        <p className="text-[12.5px] text-[var(--t2)] leading-[1.75] mb-3">
          Key developments this week:
        </p>
        <ul className="list-none flex flex-col gap-1.5">
          {[
            'Acme EU GmbH EUR position approaching minimum threshold — monitoring required',
            'GBP/USD rate increased +0.34%, positively impacting consolidated USD equivalent position',
            'September UK payroll (£1.24M) pending approval — must be actioned by 12:00 UTC',
            'Forecast accuracy improved to 87% (30-day rolling), up from 85% last week',
          ].map((item, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] text-[var(--t2)]">
              <span className="text-[var(--blue)] mt-0.5 flex-shrink-0">→</span>
              {item}
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Section 2: Cash Position */}
      <ReportSection title="2. Cash Position — MTD">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Entity', 'Currency', 'Opening', 'Inflows', 'Outflows', 'Closing', 'USD Equiv', 'Status'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { entity: 'Acme UK Ltd', currency: 'GBP', open: '£4,620K', inf: '+£1,440K', out: '−£1,240K', close: '£4,820K', usd: '$6,090K', ok: true },
              { entity: 'Acme EU GmbH', currency: 'EUR', open: '€2,200K', inf: '+€480K', out: '−€520K', close: '€2,160K', usd: '$2,337K', ok: false },
              { entity: 'Acme US Inc', currency: 'USD', open: '$2,980K', inf: '+$820K', out: '−$590K', close: '$3,010K', usd: '$3,010K', ok: true },
            ].map((row, i) => (
              <tr key={i} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] ${!row.ok ? 'bg-[var(--amber-lt)]' : ''}`}>
                <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{row.entity}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.currency}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.open}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--green)]">{row.inf}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--red)]">{row.out}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] font-semibold text-[var(--t1)]">{row.close}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.usd}</td>
                <td className="px-[14px] py-[9px]">
                  {row.ok ? <Badge variant="success">● Normal</Badge> : <Badge variant="warning">⚠ Monitor</Badge>}
                </td>
              </tr>
            ))}
            <tr className="bg-[var(--elv)] font-bold">
              <td className="px-[14px] py-[9px] text-[12px] font-bold text-[var(--t1)]" colSpan={6}>Consolidated Total</td>
              <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] font-bold text-[var(--t1)]">$11,437K</td>
              <td className="px-[14px] py-[9px]"><Badge variant="success">Normal</Badge></td>
            </tr>
          </tbody>
        </table>
      </ReportSection>

      {/* Section 3: Actions Required */}
      <ReportSection title="4. Actions Required">
        <div className="flex flex-col gap-3">
          {approvals.map((item, i) => (
            <ActionRow key={item.id} number={i + 1} item={item} onApprove={handleApprove} onReject={handleReject} />
          ))}
        </div>
      </ReportSection>

      {/* Section 5: Variance Explanation */}
      <ReportSection title="5. Variance Explanation">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <VMetric label="Actual Closing" value="£9.04M" cls="vm-neg" />
          <VMetric label="Forecast Closing" value="£9.66M" cls="" />
          <VMetric label="Variance" value="−£0.62M" note="−6.4%" cls="vm-warn" />
        </div>
        <p className="text-[12.5px] text-[var(--t2)] leading-[1.75] mb-3">
          The primary drivers of the negative variance this period:
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Driver', 'Category', 'Amount', 'Direction'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { driver: 'EUR AP settlement — timing difference', cat: 'AP', amt: '−£280K', dir: 'Unfavourable' },
              { driver: 'Customer payment delay — Acme EU', cat: 'AR', amt: '−£180K', dir: 'Unfavourable' },
              { driver: 'FX movement (GBP/USD +0.34%)', cat: 'FX', amt: '+£42K', dir: 'Favourable' },
              { driver: 'Interest income (JPMorgan pool)', cat: 'Interest', amt: '+£18K', dir: 'Favourable' },
              { driver: 'Unexplained Variance', cat: '—', amt: '−£222K', dir: 'Unexplained' },
            ].map((row, i) => (
              <tr key={i} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0 ${row.dir === 'Unexplained' ? 'bg-[var(--amber-lt)]' : ''}`}>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t1)]">{row.driver}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.cat}</td>
                <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${row.amt.startsWith('+') ? 'text-[var(--green)]' : row.dir === 'Unexplained' ? 'text-[var(--amber)]' : 'text-[var(--red)]'}`}>{row.amt}</td>
                <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.dir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      {/* Section 6: Data Caveats */}
      <ReportSection title="6. Data Caveats">
        <div className="flex flex-col gap-2">
          {[
            { type: 'warning', text: 'EUR/GBP rate used is 09:00 UTC mid-market; actual settlement rate may differ by up to 0.3%.' },
            { type: 'info', text: 'Acme EU GmbH AP schedule includes estimated amounts for 3 invoices pending vendor confirmation.' },
            { type: 'warning', text: 'Unexplained variance of £222K has not been attributed to a specific driver. Under investigation.' },
          ].map((item, i) => (
            <div key={i} className={`flex gap-2.5 items-start px-3 py-2.5 rounded-[var(--rsm)] ${item.type === 'warning' ? 'bg-[var(--amber-lt)] border border-[var(--amber-bd)]' : 'bg-[var(--info-lt)] border border-[var(--info-bd)]'}`}>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px] ${item.type === 'warning' ? 'bg-[var(--amber)]' : 'bg-[var(--info)]'}`} />
              <span className="text-[12px] text-[var(--t2)] leading-[1.6]">{item.text}</span>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Section 7: Source References */}
      <ReportSection title="7. Source References">
        <div className="flex flex-col gap-1.5">
          {[
            { name: 'Barclays Bank Feed', meta: 'Last ingested 23 Sep 2026 08:45 UTC · API · Verified' },
            { name: 'Deutsche Bank Feed', meta: 'Last ingested 23 Sep 2026 07:30 UTC · SFTP · Verified' },
            { name: 'JPMorgan Feed', meta: 'Last ingested 23 Sep 2026 08:00 UTC · API · Verified' },
            { name: 'FX Rate Table', meta: 'Updated 23 Sep 2026 09:00 UTC · Bloomberg Mid-Market' },
            { name: 'Forecast Model', meta: 'Version 2.4 · Run 23 Sep 2026 09:05 UTC · 87% accuracy' },
          ].map((src, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)]">
              <span className="text-[12px] font-semibold text-[var(--t1)]">{src.name}</span>
              <span className="text-[10.5px] text-[var(--tm)] font-[var(--mono)]">{src.meta}</span>
            </div>
          ))}
        </div>
      </ReportSection>
    </>
  )
}

function InsightTile({ label, value, pill, tooltip }: { label: string; value: string; pill: React.ReactNode; tooltip: string }) {
  return (
    <div className="bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] p-4 flex flex-col gap-1.5 shadow-[var(--shc)]" title={tooltip}>
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-[var(--tm)]">{label}</div>
      <div className="font-[var(--mono)] text-[22px] font-semibold text-[var(--t1)] tracking-[-0.02em]">{value}</div>
      {pill}
    </div>
  )
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] shadow-[var(--shc)]">
      <div className="px-5 py-3.5 border-b border-[var(--b0)] bg-[var(--elv)] rounded-t-[var(--rmd)]">
        <span className="text-[13px] font-bold text-[var(--t1)]">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function ActionRow({ number, item, onApprove, onReject }: {
  number: number
  item: ApprovalItem
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
}) {
  return (
    <div className="flex gap-3 pb-3 border-b border-[var(--b0)] last:border-0 last:pb-0">
      <div className="w-6 h-6 rounded-full bg-[var(--elv)] border border-[var(--b0)] flex items-center justify-center text-[10px] font-bold text-[var(--tm)] flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <div className="text-[12.5px] font-semibold text-[var(--t1)] mb-1">{item.title}</div>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[
            { l: 'Category', v: item.category },
            { l: 'Entity', v: item.entity },
            { l: 'Amount', v: `£${(item.amount / 1000).toFixed(0)}K` },
            { l: 'Approver', v: item.approverRole },
          ].map(f => (
            <div key={f.l}>
              <div className="text-[9px] font-bold uppercase tracking-[0.07em] text-[var(--tm)] mb-0.5">{f.l}</div>
              <div className="text-[11.5px] text-[var(--t2)]">{f.v}</div>
            </div>
          ))}
        </div>
        <ApprovalForm item={item} onApprove={onApprove} onReject={onReject} />
      </div>
    </div>
  )
}

function VMetric({ label, value, note, cls }: { label: string; value: string; note?: string; cls: string }) {
  const valClass = cls === 'vm-neg' ? 'text-[var(--red)]' : cls === 'vm-warn' ? 'text-[var(--amber)]' : 'text-[var(--t1)]'
  return (
    <div className="bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)] p-[14px]">
      <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{label}</div>
      <div className={`font-[var(--mono)] text-[20px] font-semibold ${valClass}`}>{value}</div>
      {note && <div className="text-[10.5px] text-[var(--tm)] mt-1">{note}</div>}
    </div>
  )
}
