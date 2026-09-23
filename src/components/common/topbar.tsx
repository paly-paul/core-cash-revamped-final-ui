'use client'

import React from 'react'
import { TOPBAR_STATS, CURRENT_USER } from '@/lib/constants'
import { useNavigation } from '@/context/navigation'

export function Topbar() {
  const { navigate } = useNavigation()

  return (
    <div className="col-span-full bg-[var(--sur)] border-b border-[var(--b0)] flex items-center px-5 z-50 h-[54px]">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 font-bold text-[13px] text-[var(--t1)] pr-5 cursor-pointer whitespace-nowrap"
        onClick={() => navigate('dashboard')}
      >
        <div className="w-[30px] h-[30px] bg-[var(--blue)] rounded-[7px] flex items-center justify-center font-bold text-[11px] text-white font-[var(--mono)] flex-shrink-0">
          CC
        </div>
        <span>Core Cash</span>
      </div>

      {/* Stats */}
      <div className="flex-1 flex items-center border-l border-[var(--b0)]">
        <StatCell label="Report Date" value={TOPBAR_STATS.reportDate} />
        <StatCell label="Forecast Ver" value={TOPBAR_STATS.forecastVersion} />
        <StatCell label="Confidence" value={TOPBAR_STATS.confidence} valueClass="text-[var(--green)]" />
        <StatCell label="Usable Cash" value={TOPBAR_STATS.usableCash} valueClass="text-[var(--green)]" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5 ml-auto">
        <span className="text-[11px] text-[var(--tm)] font-[var(--mono)]">
          As of {TOPBAR_STATS.reportDate}
        </span>
        <span className="text-[11px] text-[var(--t2)]">{CURRENT_USER.role}</span>
        <div className="w-[30px] h-[30px] rounded-full bg-[var(--blue-lt)] border-[1.5px] border-[var(--blue-bd)] flex items-center justify-center text-[11px] font-bold text-[var(--blue)] cursor-pointer">
          {CURRENT_USER.initials}
        </div>
        <button className="w-8 h-8 rounded-[var(--rsm)] border border-[var(--b1)] bg-[var(--sur)] text-[var(--t2)] cursor-pointer flex items-center justify-center text-sm hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-lt)]">
          ⚙
        </button>
      </div>
    </div>
  )
}

function StatCell({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col px-[18px] border-r border-[var(--b0)]">
      <span className="text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--tm)]">{label}</span>
      <span className={`font-[var(--mono)] text-[13px] font-semibold text-[var(--t1)] mt-[1px] ${valueClass ?? ''}`}>
        {value}
      </span>
    </div>
  )
}
