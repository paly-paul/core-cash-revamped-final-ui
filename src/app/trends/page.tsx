'use client'

import React, { useState } from 'react'
import { SectionCard, MetricCard } from '@/components/ui/card'
import { FxBanner } from '@/components/common/fx-banner'

const PERIODS = ['1M', '3M', '6M', '1Y'] as const
type Period = typeof PERIODS[number]

const MONTHLY_DATA = [
  { month: 'Oct 25', cash: 7.2, inflow: 4.1, outflow: 3.8 },
  { month: 'Nov 25', cash: 7.5, inflow: 4.3, outflow: 4.0 },
  { month: 'Dec 25', cash: 7.8, inflow: 5.2, outflow: 4.9 },
  { month: 'Jan 26', cash: 8.1, inflow: 4.0, outflow: 3.7 },
  { month: 'Feb 26', cash: 7.9, inflow: 3.9, outflow: 4.1 },
  { month: 'Mar 26', cash: 8.3, inflow: 4.5, outflow: 4.1 },
  { month: 'Apr 26', cash: 8.6, inflow: 4.7, outflow: 4.4 },
  { month: 'May 26', cash: 8.4, inflow: 4.2, outflow: 4.4 },
  { month: 'Jun 26', cash: 8.7, inflow: 4.8, outflow: 4.5 },
  { month: 'Jul 26', cash: 8.9, inflow: 4.9, outflow: 4.7 },
  { month: 'Aug 26', cash: 8.8, inflow: 4.4, outflow: 4.5 },
  { month: 'Sep 26', cash: 9.0, inflow: 4.6, outflow: 4.4 },
]

function TrendChart({ data, period }: { data: typeof MONTHLY_DATA; period: Period }) {
  const count = period === '1M' ? 4 : period === '3M' ? 6 : period === '6M' ? 8 : 12
  const visible = data.slice(-count)
  const maxCash = Math.max(...visible.map(d => d.cash))
  const W = 560; const H = 160; const padL = 40; const padB = 28; const padR = 12; const padT = 12
  const chartW = W - padL - padR
  const chartH = H - padT - padB
  const xStep = chartW / (visible.length - 1)

  const toX = (i: number) => padL + i * xStep
  const toY = (v: number) => padT + chartH - (v / (maxCash * 1.1)) * chartH

  const linePts = visible.map((d, i) => `${toX(i)},${toY(d.cash)}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => {
        const y = padT + chartH * (1 - f)
        return (
          <g key={f}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--b0)" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="var(--tm)" fontFamily="var(--mono)">
              £{(maxCash * 1.1 * f).toFixed(1)}M
            </text>
          </g>
        )
      })}
      {/* Bars for inflow/outflow */}
      {visible.map((d, i) => {
        const bw = xStep * 0.3
        const x = toX(i)
        return (
          <g key={i}>
            <rect x={x - bw} y={toY(d.inflow)} width={bw * 0.9} height={chartH - (toY(d.inflow) - padT)} fill="var(--green)" opacity="0.25" />
            <rect x={x + 1} y={toY(d.outflow)} width={bw * 0.9} height={chartH - (toY(d.outflow) - padT)} fill="var(--red)" opacity="0.25" />
          </g>
        )
      })}
      {/* Cash line */}
      <polyline points={linePts} fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {visible.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.cash)} r="3" fill="var(--blue)" />
      ))}
      {/* X axis labels */}
      {visible.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="var(--tm)" fontFamily="var(--mono)">{d.month}</text>
      ))}
    </svg>
  )
}

export default function TrendsPage() {
  const [period, setPeriod] = useState<Period>('6M')

  const latest = MONTHLY_DATA[MONTHLY_DATA.length - 1]
  const prev = MONTHLY_DATA[MONTHLY_DATA.length - 2]
  const delta = latest.cash - prev.cash

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Historical Trends</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">AS OF 23 SEP 2026 · 09:00 UTC</p>
        </div>
        <div className="flex bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] p-0.5">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3.5 py-[5px] rounded text-[11px] font-semibold cursor-pointer border-none transition-all ${period === p ? 'bg-[var(--sur)] text-[var(--blue)] shadow-[var(--shc)]' : 'bg-transparent text-[var(--tm)]'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Current Cash" value={`£${latest.cash.toFixed(2)}M`} delta={`${delta >= 0 ? '▲' : '▼'} ${delta >= 0 ? '+' : ''}£${(delta * 1000).toFixed(0)}K MoM`} deltaDir={delta >= 0 ? 'up' : 'down'} color="blue" isPrimary subValue="Consolidated all entities" />
        <MetricCard label="Avg Monthly Inflow" value={`£${(MONTHLY_DATA.reduce((s, d) => s + d.inflow, 0) / MONTHLY_DATA.length).toFixed(2)}M`} color="green" subValue="12-month average" />
        <MetricCard label="Avg Monthly Outflow" value={`£${(MONTHLY_DATA.reduce((s, d) => s + d.outflow, 0) / MONTHLY_DATA.length).toFixed(2)}M`} color="amber" subValue="12-month average" />
        <MetricCard label="Net Cash Trend" value="+£1.8M" delta="▲ YTD growth" deltaDir="up" color="info" subValue="Since Oct 2025" />
      </div>

      <SectionCard title="Cash Balance Trend">
        <div className="mb-3 flex items-center gap-4 text-[10.5px] text-[var(--tm)]">
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-[var(--blue)]" /> Cash Balance</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-[var(--green)] opacity-40 rounded-sm" /> Net Inflow</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-[var(--red)] opacity-40 rounded-sm" /> Net Outflow</span>
        </div>
        <TrendChart data={MONTHLY_DATA} period={period} />
      </SectionCard>

      <SectionCard title="Monthly Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Month', 'Opening Cash', 'Net Inflow', 'Net Outflow', 'Net Flow', 'Closing Cash', 'MoM Change'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.slice(-6).map((row, i, arr) => {
                const prev = i > 0 ? arr[i - 1] : null
                const net = row.inflow - row.outflow
                const mom = prev ? row.cash - prev.cash : null
                return (
                  <tr key={row.month} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                    <td className="px-[14px] py-[9px] text-[12px] font-semibold text-[var(--t1)]">{row.month}</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">£{(prev ? prev.cash : row.cash - net).toFixed(2)}M</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--green)]">+£{row.inflow.toFixed(2)}M</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--red)]">−£{row.outflow.toFixed(2)}M</td>
                    <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${net >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>{net >= 0 ? '+' : ''}£{net.toFixed(2)}M</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] font-semibold text-[var(--t1)]">£{row.cash.toFixed(2)}M</td>
                    <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${mom === null ? 'text-[var(--tm)]' : mom >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                      {mom === null ? '—' : `${mom >= 0 ? '+' : ''}£${(mom * 1000).toFixed(0)}K`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  )
}
