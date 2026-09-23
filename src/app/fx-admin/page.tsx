'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { useToast } from '@/context/ui'

const RATES = [
  { pair: 'GBP/USD', rate: 1.2641, prev: 1.2598, source: 'Reuters', updated: '09:00 UTC', type: 'spot' },
  { pair: 'GBP/EUR', rate: 1.1676, prev: 1.1685, source: 'Reuters', updated: '09:00 UTC', type: 'spot' },
  { pair: 'EUR/USD', rate: 1.0824, prev: 1.0849, source: 'Reuters', updated: '09:00 UTC', type: 'spot' },
  { pair: 'USD/GBP', rate: 0.7910, prev: 0.7939, source: 'Calculated', updated: '09:00 UTC', type: 'derived' },
  { pair: 'EUR/GBP', rate: 0.8562, prev: 0.8569, source: 'Calculated', updated: '09:00 UTC', type: 'derived' },
  { pair: 'USD/EUR', rate: 0.9238, prev: 0.9217, source: 'Calculated', updated: '09:00 UTC', type: 'derived' },
]

const HISTORY = [
  { date: '22 Sep', gbpusd: 1.2598, eurusd: 1.0849, eurgbp: 0.8569 },
  { date: '21 Sep', gbpusd: 1.2582, eurusd: 1.0837, eurgbp: 0.8573 },
  { date: '20 Sep', gbpusd: 1.2564, eurusd: 1.0821, eurgbp: 0.8581 },
  { date: '19 Sep', gbpusd: 1.2541, eurusd: 1.0805, eurgbp: 0.8590 },
  { date: '18 Sep', gbpusd: 1.2510, eurusd: 1.0792, eurgbp: 0.8607 },
]

export default function FxAdminPage() {
  const { toast } = useToast()
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  const handleOverride = (pair: string, val: string) => setOverrides(p => ({ ...p, [pair]: val }))

  const saveOverride = (pair: string) => {
    toast('Rate Override Saved', `Manual rate for ${pair} has been applied.`, 'success')
  }

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">FX Rate Administration</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">AS OF 23 SEP 2026 · 09:00 UTC</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast('Rates Refreshed', 'FX rates updated from Reuters feed.', 'info')}
            className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] cursor-pointer"
          >
            ↺ Refresh Rates
          </button>
          <button className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">
            ↑ Upload Rates
          </button>
        </div>
      </div>

      {/* Live rates */}
      <TableCard title="Live FX Rates" actions={<Badge variant="success">● Live — Reuters 09:00 UTC</Badge>}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Pair', 'Current Rate', 'Previous', 'Change', 'Change %', 'Source', 'Type', 'Manual Override'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RATES.map(row => {
                const chg = row.rate - row.prev
                const pct = (chg / row.prev) * 100
                return (
                  <tr key={row.pair} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                    <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{row.pair}</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12.5px] font-semibold text-[var(--t1)]">{row.rate.toFixed(4)}</td>
                    <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--tm)]">{row.prev.toFixed(4)}</td>
                    <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${chg >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                      {chg >= 0 ? '+' : ''}{chg.toFixed(4)}
                    </td>
                    <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${pct >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                      {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                    </td>
                    <td className="px-[14px] py-[9px] text-[11.5px] text-[var(--t2)]">{row.source}</td>
                    <td className="px-[14px] py-[9px]">
                      <Badge variant={row.type === 'spot' ? 'primary' : 'neutral'}>{row.type}</Badge>
                    </td>
                    <td className="px-[14px] py-[9px]">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.0001"
                          placeholder={row.rate.toFixed(4)}
                          value={overrides[row.pair] || ''}
                          onChange={e => handleOverride(row.pair, e.target.value)}
                          className="w-24 px-2 py-1 text-[11.5px] font-[var(--mono)] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]"
                        />
                        {overrides[row.pair] && (
                          <button onClick={() => saveOverride(row.pair)} className="px-2 py-1 text-[10.5px] font-semibold rounded bg-[var(--amber)] text-white border-none cursor-pointer">Apply</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </TableCard>

      {/* Rate history */}
      <TableCard title="Rate History — Last 5 Trading Days">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Date', 'GBP/USD', 'EUR/USD', 'EUR/GBP'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.map(row => (
              <tr key={row.date} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                <td className="px-[14px] py-[9px] text-[12px] text-[var(--t1)]">{row.date}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.gbpusd.toFixed(4)}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.eurusd.toFixed(4)}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t2)]">{row.eurgbp.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* Feed configuration */}
      <SectionCard title="Rate Feed Configuration">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Primary Feed', value: 'Reuters Eikon API', status: 'connected' },
            { label: 'Fallback Feed', value: 'Bloomberg B-PIPE', status: 'standby' },
            { label: 'Update Frequency', value: 'Every 15 minutes (market hours)' },
            { label: 'After-Hours Source', value: 'Manual / Last known rate' },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between p-3 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)]">
              <div>
                <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)]">{f.label}</div>
                <div className="text-[12.5px] text-[var(--t1)] mt-0.5">{f.value}</div>
              </div>
              {f.status && (
                <Badge variant={f.status === 'connected' ? 'success' : 'neutral'}>
                  {f.status === 'connected' ? '● Live' : '◎ Standby'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
