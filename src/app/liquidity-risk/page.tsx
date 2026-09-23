'use client'

import React from 'react'
import { SectionCard, MetricCard } from '@/components/ui/card'
import { Badge, StatusPill } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { TREND_7D } from '@/lib/constants'

const RISK_FACTORS = [
  { name: 'Cash Runway', score: 2, max: 10, level: 'Low', desc: '35 days runway at current burn — well above 14-day minimum', trend: 'stable' },
  { name: 'Concentration Risk', score: 4, max: 10, level: 'Medium', desc: '53% of cash in single institution (Barclays). Threshold: 50%', trend: 'deteriorating' },
  { name: 'Currency Mismatch', score: 3, max: 10, level: 'Low', desc: 'EUR exposure GBP-equivalent £1.83M. Within hedging policy', trend: 'stable' },
  { name: 'Forecast Variance', score: 2, max: 10, level: 'Low', desc: '87% 30-day forecast accuracy. Variance within ±10%', trend: 'improving' },
  { name: 'Counterparty Exposure', score: 4, max: 10, level: 'Medium', desc: 'Barclays £6.06M (96% of £5M limit). Limit review recommended', trend: 'deteriorating' },
  { name: 'Liquidity Coverage', score: 1, max: 10, level: 'Low', desc: 'All accounts above minimum thresholds. No immediate shortfall', trend: 'stable' },
]

const THRESHOLDS = [
  { entity: 'Acme UK Ltd — Main Operating', current: 4_820_000, minimum: 2_000_000, pct: 241, status: 'green' },
  { entity: 'Acme UK Ltd — Payroll', current: 1_240_000, minimum: 500_000, pct: 248, status: 'green' },
  { entity: 'Acme EU GmbH — EUR Operating', current: 1_830_000, minimum: 1_500_000, pct: 122, status: 'amber' },
  { entity: 'Acme US Inc — USD Operating', current: 2_390_000, minimum: 1_000_000, pct: 239, status: 'green' },
  { entity: 'Acme US Inc — Investment Pool', current: 760_000, minimum: 500_000, pct: 152, status: 'green' },
]

function RiskBar({ score, max, level }: { score: number; max: number; level: string }) {
  const pct = (score / max) * 100
  const color = level === 'Low' ? 'var(--green)' : level === 'Medium' ? 'var(--amber)' : 'var(--red)'
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-[var(--elv)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10.5px] font-[var(--mono)] text-[var(--tm)] w-8 text-right">{score}/{max}</span>
    </div>
  )
}

function ThresholdBar({ pct, status }: { pct: number; status: string }) {
  const color = status === 'green' ? 'var(--green)' : status === 'amber' ? 'var(--amber)' : 'var(--red)'
  const barPct = Math.min((pct / 300) * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[var(--elv)] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${barPct}%`, backgroundColor: color }} />
      </div>
      <span className={`text-[11px] font-[var(--mono)] font-semibold w-10 text-right`} style={{ color }}>{pct}%</span>
    </div>
  )
}

const overallScore = Math.round(RISK_FACTORS.reduce((s, f) => s + f.score, 0) / RISK_FACTORS.length)

export default function LiquidityRiskPage() {
  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Liquidity Risk Monitor</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">AS OF 23 SEP 2026 · 09:00 UTC</p>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Overall Risk Score"
          value={`${overallScore} / 10`}
          color={overallScore <= 3 ? 'green' : overallScore <= 6 ? 'amber' : 'red'}
          isPrimary
          subValue="Composite across all factors"
        >
          <StatusPill variant={overallScore <= 3 ? 'high' : 'medium'}>
            ● {overallScore <= 3 ? 'Low Risk' : 'Medium Risk'}
          </StatusPill>
        </MetricCard>
        <MetricCard label="Cash Runway" value="35 days" color="green" subValue="At current burn rate">
          <StatusPill variant="high">● Normal</StatusPill>
        </MetricCard>
        <MetricCard label="Liquidity Coverage" value="214%" color="green" subValue="Vs minimum thresholds" />
        <MetricCard label="Risk Factors" value={`${RISK_FACTORS.filter(f => f.level !== 'Low').length} / ${RISK_FACTORS.length}`} color="amber" subValue="Medium or above risk">
          <StatusPill variant="medium">2 Monitor</StatusPill>
        </MetricCard>
      </div>

      {/* Risk score trend */}
      <SectionCard title="7-Day Risk Score Trend">
        <div className="grid grid-cols-7 gap-2">
          {TREND_7D.map((d, i) => {
            const score = d.liquidity_risk_score
            const color = score <= 3 ? 'var(--green)' : score <= 6 ? 'var(--amber)' : 'var(--red)'
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)]">
                <div className="text-[10px] font-[var(--mono)] text-[var(--tm)]">{days[i]}</div>
                <div className="text-[20px] font-[var(--mono)] font-bold" style={{ color }}>{score}</div>
                <div className="text-[9px] text-[var(--tm)]">/10</div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Risk factor breakdown */}
      <SectionCard title="Risk Factor Analysis">
        <div className="grid grid-cols-2 gap-3">
          {RISK_FACTORS.map(f => (
            <div key={f.name} className="p-4 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[var(--t1)]">{f.name}</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant={f.level === 'Low' ? 'success' : f.level === 'Medium' ? 'warning' : 'error'}>
                    {f.level}
                  </Badge>
                  <span className={`text-[10.5px] font-[var(--mono)] text-[var(--tm)]`}>
                    {f.trend === 'improving' ? '↑' : f.trend === 'deteriorating' ? '↓' : '→'}
                  </span>
                </div>
              </div>
              <RiskBar score={f.score} max={f.max} level={f.level} />
              <p className="text-[11px] text-[var(--t2)] mt-2 leading-[1.55]">{f.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Threshold monitoring */}
      <SectionCard title="Account Threshold Monitoring">
        <div className="flex flex-col divide-y divide-[var(--b0)]">
          {THRESHOLDS.map(t => (
            <div key={t.entity} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-semibold text-[var(--t1)]">{t.entity}</span>
                <Badge variant={t.status === 'green' ? 'success' : t.status === 'amber' ? 'warning' : 'error'}>
                  {t.status === 'green' ? '● Normal' : '⚠ Monitor'}
                </Badge>
              </div>
              <ThresholdBar pct={t.pct} status={t.status} />
              <div className="flex justify-between text-[10.5px] text-[var(--tm)] mt-1 font-[var(--mono)]">
                <span>Current: £{(t.current / 1_000_000).toFixed(2)}M</span>
                <span>Minimum: £{(t.minimum / 1_000_000).toFixed(2)}M</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
