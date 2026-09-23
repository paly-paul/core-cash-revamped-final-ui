'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'

const POLICY_RULES = [
  { id: 'P01', category: 'Counterparty', rule: 'Maximum exposure per bank counterparty', limit: '£5,000,000', current: '£4,820,000', pct: 96, status: 'amber' },
  { id: 'P02', category: 'Counterparty', rule: 'Minimum credit rating (S&P)', limit: 'A−', current: 'A', pct: 100, status: 'green' },
  { id: 'P03', category: 'Instrument', rule: 'Maximum in money market funds', limit: '£3,000,000', current: '£760,000', pct: 25, status: 'green' },
  { id: 'P04', category: 'Instrument', rule: 'Maximum in government bonds', limit: '£2,000,000', current: '£0', pct: 0, status: 'green' },
  { id: 'P05', category: 'Liquidity', rule: 'Minimum cash available same-day', limit: '£2,000,000', current: '£4,820,000', pct: 100, status: 'green' },
  { id: 'P06', category: 'Liquidity', rule: 'Maximum investment tenor', limit: '90 days', current: '30 days', pct: 33, status: 'green' },
  { id: 'P07', category: 'Currency', rule: 'Maximum unhedged FX exposure', limit: '£1,000,000', current: '£420,000', pct: 42, status: 'green' },
  { id: 'P08', category: 'Currency', rule: 'Minimum GBP as % of total cash', limit: '50%', current: '66%', pct: 100, status: 'green' },
]

const VERSIONS = [
  { version: 'v3.2', date: '01 Sep 2026', author: 'James Whitmore', status: 'current', changes: 'Updated counterparty limit P01 from £4M to £5M' },
  { version: 'v3.1', date: '15 Jun 2026', author: 'Sarah Chen', status: 'superseded', changes: 'Added unhedged FX exposure rule P07' },
  { version: 'v3.0', date: '01 Jan 2026', author: 'James Whitmore', status: 'superseded', changes: 'Annual policy review — updated all limits' },
]

function ComplianceBar({ pct, status }: { pct: number; status: string }) {
  const color = status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--elv)] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10.5px] font-[var(--mono)] text-[var(--tm)] w-7 text-right">{pct}%</span>
    </div>
  )
}

export default function InvestmentPolicyPage() {
  const [category, setCategory] = useState<string>('All')
  const categories = ['All', ...Array.from(new Set(POLICY_RULES.map(r => r.category)))]

  const filtered = category === 'All' ? POLICY_RULES : POLICY_RULES.filter(r => r.category === category)
  const compliant = POLICY_RULES.filter(r => r.status === 'green').length
  const total = POLICY_RULES.length

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Investment Policy</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">POLICY v3.2 · EFFECTIVE 01 SEP 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] cursor-pointer">↓ Download Policy</button>
        </div>
      </div>

      {/* Compliance summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Rules Compliant', value: `${compliant} / ${total}`, color: 'green', sub: 'All key limits met' },
          { label: 'Amber Warnings', value: POLICY_RULES.filter(r => r.status === 'amber').length.toString(), color: 'amber', sub: 'Approaching limit' },
          { label: 'Breach Count', value: POLICY_RULES.filter(r => r.status === 'red').length.toString(), color: 'red', sub: 'Policy breaches' },
        ].map(m => (
          <div key={m.label} className={`bg-[var(--sur)] border border-[var(--b0)] border-t-2 rounded-[var(--rmd)] p-[14px] shadow-[var(--shc)]`} style={{ borderTopColor: `var(--${m.color})` }}>
            <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{m.label}</div>
            <div className={`font-[var(--mono)] text-[24px] font-semibold`} style={{ color: `var(--${m.color})` }}>{m.value}</div>
            <div className="text-[11px] text-[var(--tm)] mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Policy rules */}
      <TableCard
        title="Policy Rules & Compliance"
        actions={
          <div className="flex bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] p-0.5">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-[4px] rounded text-[11px] font-semibold cursor-pointer border-none transition-all ${category === c ? 'bg-[var(--sur)] text-[var(--blue)] shadow-[var(--shc)]' : 'bg-transparent text-[var(--tm)]'}`}>
                {c}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['ID', 'Category', 'Rule', 'Limit', 'Current', 'Utilisation', 'Status'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0 ${row.status === 'amber' ? 'bg-[var(--amber-lt)]' : ''}`}>
                  <td className="px-[14px] py-[9px] text-[11px] font-[var(--mono)] text-[var(--tm)]">{row.id}</td>
                  <td className="px-[14px] py-[9px]"><Badge variant="neutral">{row.category}</Badge></td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)] max-w-[280px]">{row.rule}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--tm)]">{row.limit}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] font-semibold text-[var(--t1)]">{row.current}</td>
                  <td className="px-[14px] py-[9px] w-32"><ComplianceBar pct={row.pct} status={row.status} /></td>
                  <td className="px-[14px] py-[9px]">
                    {row.status === 'green' && <Badge variant="success">✓ Compliant</Badge>}
                    {row.status === 'amber' && <Badge variant="warning">⚠ Monitor</Badge>}
                    {row.status === 'red' && <Badge variant="error">✕ Breach</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      {/* Version history */}
      <SectionCard title="Policy Version History">
        <div className="flex flex-col divide-y divide-[var(--b0)]">
          {VERSIONS.map(v => (
            <div key={v.version} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="font-[var(--mono)] text-[12px] font-bold text-[var(--blue)] w-10 flex-shrink-0">{v.version}</span>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--t1)]">{v.changes}</div>
                  <div className="text-[10.5px] text-[var(--tm)] mt-0.5">{v.date} · {v.author}</div>
                </div>
              </div>
              <Badge variant={v.status === 'current' ? 'success' : 'neutral'}>{v.status === 'current' ? '● Current' : 'Superseded'}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
