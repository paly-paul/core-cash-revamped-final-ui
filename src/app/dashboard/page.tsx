'use client'

import React from 'react'
import { MetricCard, SectionCard, TableCard } from '@/components/ui/card'
import { Badge, StatusPill } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { useNavigation } from '@/context/navigation'
import type { PageKey } from '@/lib/constants'

const ACCOUNT_ROWS = [
  { entity: 'Acme UK Ltd', name: 'Main Operating', bank: 'Barclays', currency: 'GBP', balance: 4_820_000, threshold: 2_000_000, status: 'green', conf: 'High' },
  { entity: 'Acme UK Ltd', name: 'Payroll Account', bank: 'Barclays', currency: 'GBP', balance: 1_240_000, threshold: 500_000, status: 'green', conf: 'High' },
  { entity: 'Acme EU GmbH', name: 'Euro Operating', bank: 'Deutsche Bank', currency: 'EUR', balance: 1_830_000, threshold: 1_500_000, status: 'amber', conf: 'Medium' },
  { entity: 'Acme US Inc', name: 'USD Operating', bank: 'JPMorgan', currency: 'USD', balance: 2_390_000, threshold: 1_000_000, status: 'green', conf: 'High' },
  { entity: 'Acme US Inc', name: 'Investment Pool', bank: 'JPMorgan', currency: 'USD', balance: 760_000, threshold: 500_000, status: 'green', conf: 'High' },
]

const statusBadge = (s: string) => {
  if (s === 'green') return <Badge variant="success">● Normal</Badge>
  if (s === 'amber') return <Badge variant="warning">⚠ Attention</Badge>
  return <Badge variant="error">✕ Critical</Badge>
}

const fmtM = (v: number) => `£${(v / 1_000_000).toFixed(2)}M`
const fmtK = (v: number) => v >= 1_000_000 ? fmtM(v) : `£${(v / 1_000).toFixed(0)}K`

export default function DashboardPage() {
  const { navigate } = useNavigation()

  return (
    <>
      <FxBanner />

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Dashboard</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5 tracking-[0.03em]">
            AS OF 23 SEP 2026 · 09:00 UTC
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] hover:bg-[var(--blue-lt)] hover:text-[var(--t1)] cursor-pointer">
            ↓ Export
          </button>
          <button className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white hover:bg-[#004BBD] cursor-pointer border-none">
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Usable Cash"
          value="£9.04M"
          delta="▲ +£0.22M vs yesterday"
          deltaDir="up"
          color="blue"
          isPrimary
          subValue="Available £10.24M · Restricted £1.20M"
        />
        <MetricCard
          label="Liquidity Position"
          value="35 days"
          color="green"
          subValue="Normal — above all thresholds"
        >
          <StatusPill variant="high">● High</StatusPill>
        </MetricCard>
        <MetricCard
          label="Cash Runway"
          value="35 days"
          delta="▼ −1 day vs last week"
          deltaDir="down"
          color="amber"
          subValue="7-day forward at current burn rate"
        >
          <StatusPill variant="medium">● Medium</StatusPill>
        </MetricCard>
        <MetricCard
          label="Forecast Accuracy"
          value="87%"
          delta="▲ +2% vs last month"
          deltaDir="up"
          color="info"
          subValue="30-day rolling average"
        >
          <StatusPill variant="high">● High</StatusPill>
        </MetricCard>
      </div>

      {/* Status cards row */}
      <div className="flex flex-col gap-3">
        <div className="bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] px-[18px] py-[13px] flex items-center gap-4 shadow-[var(--shc)]">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] flex-shrink-0 pulse-dot" />
          <span className="text-[13px] font-bold text-[var(--green)]">Normal</span>
          <span className="text-[12.5px] text-[var(--t2)] flex-1 leading-[1.6]">
            All cash positions above minimum thresholds. No forecast shortfalls detected in the next 7 days.
            Data feeds current as of 09:00 UTC.
          </span>
          <Badge variant="success">3 entities OK</Badge>
        </div>
      </div>

      {/* Account breakdown table */}
      <TableCard
        title="Account Breakdown"
        actions={
          <div className="flex gap-2">
            <button
              className="text-[11px] text-[var(--blue)] font-semibold cursor-pointer bg-transparent border-none hover:underline"
              onClick={() => navigate('account-master' as PageKey)}
            >
              View All →
            </button>
          </div>
        }
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Entity', 'Account Name', 'Bank', 'Currency', 'Current Balance', 'Min Threshold', 'Status', 'Confidence'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACCOUNT_ROWS.map((row, i) => (
              <tr key={i} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] transition-colors duration-100">
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t1)] font-semibold">{row.entity}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.name}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.bank}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.currency}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">
                  {fmtK(row.balance)}
                </td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--tm)]">
                  {fmtK(row.threshold)}
                </td>
                <td className="px-[14px] py-[9px]">{statusBadge(row.status)}</td>
                <td className="px-[14px] py-[9px]">
                  <StatusPill variant={row.conf === 'High' ? 'high' : 'medium'}>
                    ● {row.conf}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* AI Recommendations */}
      <SectionCard title="AI Recommendations" actions={
        <Badge variant="primary">2 Actions</Badge>
      }>
        <div className="flex flex-col gap-3">
          <RecommendationCard
            type="Cash Management"
            body="Acme EU GmbH EUR balance is approaching minimum threshold (£1.83M vs £1.50M threshold). Consider evaluating inter-company transfer options from Acme UK to cover potential shortfall in the 14-day horizon."
            why="EUR balance at 122% of threshold. 14-day forecast shows balance declining to £1.45M — below threshold."
            meta="Confidence: High · Based on 30-day AR/AP schedule · Generated 23 Sep 2026 09:00"
          />
          <RecommendationCard
            type="Investment"
            typeColor="info"
            body="Acme US Inc USD pool has £760K in uncommitted liquidity above the minimum threshold. Consider evaluating short-term money market placement (3-month T-bill) to earn additional yield."
            why="USD operating balance exceeds minimum by £260K. 30-day forecast shows stable outflow pattern with no shortfall risk."
            meta="Confidence: Medium · Subject to investment policy review · Generated 23 Sep 2026 09:00"
          />
        </div>
      </SectionCard>
    </>
  )
}

function RecommendationCard({
  type,
  typeColor = 'blue',
  body,
  why,
  meta,
}: {
  type: string
  typeColor?: string
  body: string
  why: string
  meta: string
}) {
  const borderColor = typeColor === 'info' ? 'var(--info)' : 'var(--blue)'
  const bgColor = typeColor === 'info' ? 'var(--info-lt)' : 'var(--sur)'
  const typeTextColor = typeColor === 'info' ? 'var(--info)' : 'var(--blue)'
  return (
    <div
      className="border rounded-[var(--rmd)] px-4 py-[14px] shadow-[var(--shc)]"
      style={{ borderLeftWidth: 4, borderColor: 'var(--b0)', borderLeftColor: borderColor, background: bgColor }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: typeTextColor }}>
          {type}
        </span>
        <div className="flex gap-2">
          <button className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] hover:bg-[var(--blue-lt)] cursor-pointer">
            Review
          </button>
          <button className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">
            Propose
          </button>
        </div>
      </div>
      <p className="text-[12.5px] text-[var(--t1)] leading-[1.65] mb-2.5">{body}</p>
      <div className="flex gap-1.5 px-2.5 py-2 bg-[var(--elv)] rounded-[var(--rsm)] border border-[var(--b0)] mb-2.5">
        <span className="text-[var(--tm)] flex-shrink-0 font-bold uppercase text-[10px] tracking-[0.05em] pt-px">Why</span>
        <span className="text-[11px] text-[var(--t2)]">{why}</span>
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--b0)]">
        <span className="text-[10px] text-[var(--tm)] font-[var(--mono)]">{meta}</span>
      </div>
    </div>
  )
}
