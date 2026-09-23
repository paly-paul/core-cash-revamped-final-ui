'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge, StatusPill } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'

type Horizon = 7 | 14 | 30 | 60
type ChartType = 'bar' | 'line' | 'waterfall'

const HORIZON_CONFIG: Record<Horizon, {
  label: string
  opening: string
  inflow: string
  outflow: string
  closing: string
  closingOk: boolean
  chartTitle: string
  labels: string[]
  balance: number[]
  inflows: number[]
  outflows: number[]
}> = {
  7: {
    label: '7 Day', opening: '£9.04M', inflow: '+£2.18M', outflow: '−£2.12M', closing: '£9.10M', closingOk: true,
    chartTitle: '7-Day Cash Position Forecast — Base Currency: GBP',
    labels: ['Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26', 'Sep 27'],
    balance: [9.44, 9.52, 9.38, 9.61, 9.55, 9.48, 9.10],
    inflows: [0, 0.42, 0, 0.72, 0, 0.38, 0.28],
    outflows: [0, 0.34, 0.14, 0.19, 0.27, 0.45, 0.66],
  },
  14: {
    label: '14 Day', opening: '£9.04M', inflow: '+£4.82M', outflow: '−£4.96M', closing: '£8.70M', closingOk: false,
    chartTitle: '14-Day Cash Position Forecast — Base Currency: GBP',
    labels: ['Sep 21', 'Sep 23', 'Sep 25', 'Sep 27', 'Sep 29', 'Oct 01', 'Oct 03'],
    balance: [9.44, 9.38, 9.55, 8.74, 9.12, 9.30, 8.70],
    inflows: [0, 0, 0, 0.68, 0.58, 0.42, 0.32],
    outflows: [0, 0.23, 1.24, 0.05, 0.20, 0.24, 0.72],
  },
  30: {
    label: '30 Day', opening: '£9.04M', inflow: '+£8.30M', outflow: '−£8.94M', closing: '£8.30M', closingOk: false,
    chartTitle: '30-Day Cash Position Forecast — Base Currency: GBP',
    labels: ['16S', '18S', '20S', '22S', '24S', '25S', '27S', '29S', '01O', '03O', '05O', '08O', '10O', '12O', '16O'],
    balance: [9.44, 9.61, 9.38, 9.82, 9.55, 8.31, 8.74, 9.12, 9.30, 9.48, 9.72, 9.90, 10.14, 10.22, 10.45],
    inflows: [0, 0.42, 0, 0.72, 0, 0, 0.68, 0.58, 0.42, 0.38, 0.48, 0.32, 0.48, 0.26, 0.36],
    outflows: [0, 0.25, 0.23, 0.28, 0.27, 1.24, 0.05, 0.20, 0.24, 0.20, 0.24, 0.14, 0.04, 0.18, 0.13],
  },
  60: {
    label: '60 Day', opening: '£9.04M', inflow: '+£16.4M', outflow: '−£18.7M', closing: '£7.90M', closingOk: false,
    chartTitle: '60-Day Cash Position Forecast — Base Currency: GBP',
    labels: ['Sep 21', 'Sep 28', 'Oct 05', 'Oct 12', 'Oct 19', 'Oct 26', 'Nov 02', 'Nov 09'],
    balance: [9.44, 9.10, 8.74, 9.30, 9.72, 10.14, 9.88, 7.90],
    inflows: [0, 0.58, 0.48, 0.72, 0.38, 0.46, 0.62, 0.32],
    outflows: [0, 0.92, 0.84, 0.16, 0.56, 0.48, 0.88, 2.30],
  },
}

// Simple bar/line chart using SVG
function ForecastChart({ config, chartType }: { config: typeof HORIZON_CONFIG[7]; chartType: ChartType }) {
  const { labels, balance } = config
  const MIN_LINE = 7.5
  const WARN_LINE = 5.25
  const w = 600; const h = 200
  const padL = 40; const padR = 20; const padT = 20; const padB = 30
  const chartW = w - padL - padR
  const chartH = h - padT - padB
  const minVal = 0; const maxVal = 12
  const range = maxVal - minVal

  const xPos = (i: number) => padL + (i / (labels.length - 1)) * chartW
  const yPos = (v: number) => padT + chartH - ((v - minVal) / range) * chartH
  const minY = yPos(MIN_LINE)
  const warnY = yPos(WARN_LINE)

  const pts = balance.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      {/* Grid lines */}
      {[0, 3, 6, 9, 12].map(v => (
        <line key={v} x1={padL} y1={yPos(v)} x2={w - padR} y2={yPos(v)} stroke="var(--b0)" strokeWidth="1" strokeDasharray="3,3" />
      ))}
      {/* Min threshold line */}
      <line x1={padL} y1={minY} x2={w - padR} y2={minY} stroke="var(--tm)" strokeWidth="1.5" strokeDasharray="5,4" />
      <text x={w - padR + 3} y={minY + 4} fill="var(--tm)" fontSize="9">Min</text>

      {/* Balance line or bars */}
      {chartType === 'line' || chartType === 'waterfall' ? (
        <>
          <polyline points={pts} fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {balance.map((v, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(v)} r="3" fill="var(--blue)" />
          ))}
        </>
      ) : (
        <>
          {/* Inflows */}
          {config.inflows.map((v, i) => {
            if (v <= 0) return null
            const bw = chartW / labels.length * 0.35
            const x = xPos(i) - bw - 1
            const y = yPos(v)
            return <rect key={i} x={x} y={y} width={bw} height={yPos(0) - y} fill="rgba(5,150,105,0.35)" stroke="rgba(5,150,105,0.6)" strokeWidth="1" />
          })}
          {/* Outflows */}
          {config.outflows.map((v, i) => {
            if (v <= 0) return null
            const bw = chartW / labels.length * 0.35
            const x = xPos(i) + 1
            const y = yPos(v)
            return <rect key={i} x={x} y={y} width={bw} height={yPos(0) - y} fill="rgba(220,38,38,0.35)" stroke="rgba(220,38,38,0.6)" strokeWidth="1" />
          })}
          {/* Balance line overlay */}
          <polyline points={pts} fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}

      {/* X axis labels */}
      {labels.map((lbl, i) => (
        <text key={i} x={xPos(i)} y={h - 5} textAnchor="middle" fill="var(--tm)" fontSize="9">{lbl}</text>
      ))}
      {/* Y axis labels */}
      {[0, 3, 6, 9, 12].map(v => (
        <text key={v} x={padL - 4} y={yPos(v) + 4} textAnchor="end" fill="var(--tm)" fontSize="9">{v}</text>
      ))}
    </svg>
  )
}

const ENTITY_ROWS = [
  { name: 'Acme UK Ltd', sub: 'GBP entity', balance: '£4,820K', inflow: '+£820K', outflow: '−£740K', closing: '£4,900K', ok: true },
  { name: 'Acme EU GmbH', sub: 'EUR entity', balance: '£1,830K', inflow: '+£510K', outflow: '−£600K', closing: '£1,740K', ok: false },
  { name: 'Acme US Inc', sub: 'USD entity', balance: '£2,390K', inflow: '+£580K', outflow: '−£450K', closing: '£2,520K', ok: true },
]

const DRIVERS = [
  { date: 'Sep 25', desc: 'Payroll — UK September', amount: '−£1,240,000', cat: 'Payroll', conf: '95%', risk: 'high' },
  { date: 'Sep 27', desc: 'AP Settlement — EU Vendors', amount: '−£356,000', cat: 'AP', conf: '80%', risk: 'medium' },
  { date: 'Sep 28', desc: 'Customer Payment — Acme EU', amount: '+£510,000', cat: 'AR', conf: '75%', risk: 'medium' },
  { date: 'Oct 01', desc: 'FX Settlement — EUR/GBP Hedge', amount: '+£42,000', cat: 'FX', conf: '90%', risk: 'low' },
  { date: 'Oct 05', desc: 'Rent & Facilities — UK', amount: '−£84,000', cat: 'Overhead', conf: '98%', risk: 'low' },
]

export default function ForecastPage() {
  const [horizon, setHorizon] = useState<Horizon>(30)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const config = HORIZON_CONFIG[horizon]

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Forecast</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">FORECAST ACCURACY: 87% · CONFIDENCE: HIGH</p>
        </div>
      </div>

      {/* Horizon tabs */}
      <div className="flex bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] overflow-hidden shadow-[var(--shc)]">
        {([7, 14, 30, 60] as Horizon[]).map(h => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`flex-1 py-3 px-2.5 text-center cursor-pointer border-r border-[var(--b0)] last:border-r-0 transition-colors ${horizon === h ? 'bg-[var(--blue-lt)] border-b-[3px] border-b-[var(--blue)]' : 'bg-transparent hover:bg-[var(--hov)]'}`}
          >
            <div className={`text-[10px] font-bold tracking-[0.07em] uppercase mb-0.5 ${horizon === h ? 'text-[var(--blue)]' : 'text-[var(--tm)]'}`}>
              {h}-Day
            </div>
            <div className={`font-[var(--mono)] text-[17px] font-semibold mt-0.5 ${horizon === h ? 'text-[var(--t1)]' : 'text-[var(--t2)]'}`}>
              {HORIZON_CONFIG[h].closing}
            </div>
            <div className={`text-[10px] mt-0.5 font-semibold ${HORIZON_CONFIG[h].closingOk ? 'text-[var(--green)]' : 'text-[var(--amber)]'}`}>
              {HORIZON_CONFIG[h].closingOk ? '▲ Above threshold' : '⚠ Monitor'}
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <SectionCard
        title={config.chartTitle}
        actions={
          <div className="flex bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] p-0.5">
            {(['bar', 'line', 'waterfall'] as ChartType[]).map(ct => (
              <button key={ct} onClick={() => setChartType(ct)} className={`px-3 py-1 rounded text-[11px] font-semibold cursor-pointer border-none transition-all capitalize ${chartType === ct ? 'bg-[var(--sur)] text-[var(--blue)] shadow-[var(--shc)]' : 'bg-transparent text-[var(--tm)]'}`}>
                {ct}
              </button>
            ))}
          </div>
        }
      >
        <div className="mb-4">
          <ForecastChart config={config} chartType={chartType} />
        </div>
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3 border-t border-[var(--b0)] pt-4">
          {[
            { l: 'Opening', v: config.opening },
            { l: 'Total Inflows', v: config.inflow, cls: 'text-[var(--green)]' },
            { l: 'Total Outflows', v: config.outflow, cls: 'text-[var(--red)]' },
            { l: 'Forecast Closing', v: config.closing, cls: config.closingOk ? 'text-[var(--green)]' : 'text-[var(--amber)]' },
          ].map(item => (
            <div key={item.l} className="bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] px-3 py-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.07em] text-[var(--tm)] mb-1">{item.l}</div>
              <div className={`font-[var(--mono)] text-[16px] font-semibold ${item.cls ?? 'text-[var(--t1)]'}`}>{item.v}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Entity forecast table */}
      <TableCard title={`Entity Forecast — ${horizon}-Day Closing Position (GBP)`}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Entity', 'Current Balance', 'Est. Inflows', 'Est. Outflows', 'Forecast Closing', 'vs. Threshold', 'Confidence'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENTITY_ROWS.map((row, i) => (
              <tr key={i} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0 ${!row.ok ? 'bg-[var(--amber-lt)]' : ''}`}>
                <td className="px-[14px] py-[9px]">
                  <div className="text-[12.5px] font-semibold text-[var(--t1)]">{row.name}</div>
                  <div className="text-[11px] text-[var(--tm)] font-[var(--mono)]">{row.sub}</div>
                </td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.balance}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--green)]">{row.inflow}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--red)]">{row.outflow}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] font-semibold text-[var(--t1)]">{row.closing}</td>
                <td className="px-[14px] py-[9px]">
                  {row.ok ? <Badge variant="success">▲ Above</Badge> : <Badge variant="warning">⚠ Below</Badge>}
                </td>
                <td className="px-[14px] py-[9px]">
                  <StatusPill variant={row.ok ? 'high' : 'medium'}>● {row.ok ? 'High' : 'Medium'}</StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* Forecast drivers */}
      <TableCard title="Forecast Drivers">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Date', 'Description', 'Amount', 'Category', 'Confidence', 'Risk'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DRIVERS.map((row, i) => (
              <tr key={i} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                <td className="px-[14px] py-[9px] font-[var(--mono)] text-[11px] text-[var(--tm)]">{row.date}</td>
                <td className="px-[14px] py-[9px] text-[12.5px] text-[var(--t1)]">{row.desc}</td>
                <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${row.amount.startsWith('+') ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>{row.amount}</td>
                <td className="px-[14px] py-[9px]"><Badge variant="neutral">{row.cat}</Badge></td>
                <td className="px-[14px] py-[9px] font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.conf}</td>
                <td className="px-[14px] py-[9px]">
                  <Badge variant={row.risk === 'high' ? 'warning' : row.risk === 'medium' ? 'neutral' : 'success'}>
                    {row.risk}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  )
}
