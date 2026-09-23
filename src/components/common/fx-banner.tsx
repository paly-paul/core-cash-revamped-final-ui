'use client'

import React from 'react'
import { useUI } from '@/context/ui'

export function FxBanner() {
  const { fxBannerDismissed, dismissFxBanner } = useUI()

  if (fxBannerDismissed) return null

  return (
    <div className="bg-[var(--amber-lt)] border border-[var(--amber-bd)] rounded-[var(--rmd)] px-[14px] py-[10px] flex items-start gap-2.5">
      <span className="text-sm flex-shrink-0 mt-0.5">⚠</span>
      <div className="flex-1">
        <div className="font-bold text-[#92400E] text-[12px] mb-0.5">FX Rate Update</div>
        <div className="text-[12px] text-[var(--t2)] leading-[1.5]">
          GBP/USD rate updated to 1.2641 (+0.34%) and EUR/USD to 1.0824 (−0.12%) as of 09:00 UTC.
          All calculations reflect the latest rates.
        </div>
      </div>
      <button
        onClick={dismissFxBanner}
        className="bg-none border-none text-[16px] cursor-pointer text-[var(--tm)] px-1 flex-shrink-0 hover:text-[var(--t1)]"
      >
        ✕
      </button>
    </div>
  )
}
