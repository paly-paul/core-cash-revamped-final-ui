'use client'

import React from 'react'
import { useUI } from '@/context/ui'

const typeConfig = {
  success: { icon: '✓', border: 'border-l-[3px] border-l-[var(--green)]' },
  warning: { icon: '⚠', border: 'border-l-[3px] border-l-[var(--amber)]' },
  error: { icon: '✕', border: 'border-l-[3px] border-l-[var(--red)]' },
  info: { icon: 'ℹ', border: 'border-l-[3px] border-l-[var(--blue)]' },
}

export function ToastManager() {
  const { toasts, removeToast } = useUI()

  return (
    <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 px-[14px] py-3 bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] shadow-[var(--she)] min-w-[280px] max-w-[360px] toast-anim pointer-events-all ${config.border}`}
          >
            <span className="text-[15px] flex-shrink-0">{config.icon}</span>
            <div className="flex-1">
              <div className="text-[12px] font-bold text-[var(--t1)]">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-[var(--t2)] mt-0.5">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[14px] text-[var(--tm)] cursor-pointer ml-auto bg-transparent border-none flex-shrink-0 hover:text-[var(--t1)]"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
