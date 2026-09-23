'use client'

import React, { useState } from 'react'
import { MetricCard, TableCard, SectionCard } from '@/components/ui/card'
import { Badge, StatusPill } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'

const ACCOUNTS = [
  { entity: 'Acme UK Ltd', name: 'Main Operating', bank: 'Barclays', currency: 'GBP', balance: 4_820_000, avail: 4_820_000, threshold: 2_000_000, mtdAvg: 4_650_000, mtdHigh: 5_100_000, mtdLow: 4_200_000, status: 'green', conf: 'High', trend: [4.2, 4.5, 4.3, 4.7, 4.6, 4.8, 4.82] },
  { entity: 'Acme UK Ltd', name: 'Payroll Account', bank: 'Barclays', currency: 'GBP', balance: 1_240_000, avail: 1_240_000, threshold: 500_000, mtdAvg: 1_180_000, mtdHigh: 1_500_000, mtdLow: 980_000, status: 'green', conf: 'High', trend: [1.5, 1.4, 1.3, 1.5, 1.6, 1.2, 1.24] },
  { entity: 'Acme EU GmbH', name: 'Euro Operating', bank: 'Deutsche Bank', currency: 'EUR', balance: 1_830_000, avail: 1_830_000, threshold: 1_500_000, mtdAvg: 1_920_000, mtdHigh: 2_200_000, mtdLow: 1_780_000, status: 'amber', conf: 'Medium', trend: [2.1, 2.0, 1.95, 1.9, 1.85, 1.84, 1.83] },
  { entity: 'Acme US Inc', name: 'USD Operating', bank: 'JPMorgan', currency: 'USD', balance: 2_390_000, avail: 2_390_000, threshold: 1_000_000, mtdAvg: 2_280_000, mtdHigh: 2_600_000, mtdLow: 2_100_000, status: 'green', conf: 'High', trend: [2.1, 2.2, 2.3, 2.2, 2.35, 2.4, 2.39] },
  { entity: 'Acme US Inc', name: 'Investment Pool', bank: 'JPMorgan', currency: 'USD', balance: 760_000, avail: 760_000, threshold: 500_000, mtdAvg: 740_000, mtdHigh: 800_000, mtdLow: 700_000, status: 'green', conf: 'High', trend: [0.72, 0.74, 0.75, 0.73, 0.76, 0.77, 0.76] },
]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 60; const h = 24
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  return (
    <svg width={w} height={h}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

const fmtM = (v: number) => `${(v / 1_000_000).toFixed(2)}M`
const statusBadge = (s: string) => {
  if (s === 'green') return <Badge variant="success">● Normal</Badge>
  if (s === 'amber') return <Badge variant="warning">⚠ Monitor</Badge>
  return <Badge variant="error">✕ Critical</Badge>
}

export default function CashPositionPage() {
  const [view, setView] = useState<'currency' | 'entity'>('entity')

  const totalUsable = ACCOUNTS.reduce((s, a) => s + a.avail, 0)

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Cash Position</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">AS OF 23 SEP 2026 · 09:00 UTC</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] p-0.5">
            {(['entity', 'currency'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3.5 py-[5px] rounded text-[11px] font-semibold cursor-pointer border-none transition-all ${view === v ? 'bg-[var(--sur)] text-[var(--blue)] shadow-[var(--shc)]' : 'bg-transparent text-[var(--tm)]'}`}>
                {v === 'entity' ? 'By Entity' : 'By Currency'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total Usable Cash" value={`£${(totalUsable / 1_000_000).toFixed(2)}M`} color="blue" isPrimary subValue="Available across all entities" />
        <MetricCard label="Restricted Cash" value="£1.20M" color="info" subValue="Per account restrictions" />
        <MetricCard label="OD Limit Available" value="£2.00M" color="info" subValue="Uncommitted facility" />
        <MetricCard label="Entities Normal" value="2 / 3" color="amber" subValue="EU GmbH monitoring required">
          <StatusPill variant="medium">1 Alert</StatusPill>
        </MetricCard>
      </div>

      {/* Account breakdown table */}
      <TableCard title="Account Breakdown — All Entities">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Entity', 'Account Name', 'Bank', 'CCY', 'Balance', 'Available', 'Min Threshold', 'MTD Avg', 'MTD High', 'MTD Low', '7d Trend', 'Status', 'Conf'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0 ${row.status === 'amber' ? 'bg-[var(--amber-lt)]' : ''}`}>
                  <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{row.entity}</td>
                  <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.name}</td>
                  <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t2)]">{row.bank}</td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.currency}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px]">{fmtM(row.balance)}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--green)]">{fmtM(row.avail)}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--tm)]">{fmtM(row.threshold)}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{fmtM(row.mtdAvg)}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--green)]">{fmtM(row.mtdHigh)}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--red)]">{fmtM(row.mtdLow)}</td>
                  <td className="px-[14px] py-[9px]">
                    <MiniSparkline data={row.trend} color={row.status === 'amber' ? 'var(--amber)' : 'var(--green)'} />
                  </td>
                  <td className="px-[14px] py-[9px]">{statusBadge(row.status)}</td>
                  <td className="px-[14px] py-[9px]">
                    <StatusPill variant={row.conf === 'High' ? 'high' : 'medium'}>● {row.conf}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      {/* Variance section */}
      <SectionCard title="Variance — Actual vs Forecast (MTD)">
        <div className="grid grid-cols-3 gap-3">
          {[
            { l: 'Actual Closing', v: '£9.04M', cls: '' },
            { l: 'Forecast Closing', v: '£9.66M', cls: '' },
            { l: 'Variance', v: '−£0.62M', note: '−6.4% vs forecast', cls: 'warn' },
          ].map(m => (
            <div key={m.l} className="bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)] p-[14px]">
              <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{m.l}</div>
              <div className={`font-[var(--mono)] text-[20px] font-semibold ${m.cls === 'warn' ? 'text-[var(--amber)]' : 'text-[var(--t1)]'}`}>{m.v}</div>
              {m.note && <div className="text-[10.5px] text-[var(--tm)] mt-1">{m.note}</div>}
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
