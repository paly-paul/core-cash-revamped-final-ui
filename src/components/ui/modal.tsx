'use client'

import React, { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-[400px]',
  md: 'w-[520px]',
  lg: 'w-[720px]',
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 bg-[rgba(15,23,40,0.4)] z-[200] flex items-center justify-center transition-opacity duration-200',
        isOpen ? 'opacity-100 pointer-events-all' : 'opacity-0 pointer-events-none'
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          'bg-[var(--sur)] rounded-[var(--rlg)] shadow-[var(--she)] max-w-[96vw] max-h-[90vh] flex flex-col overflow-hidden',
          sizeClasses[size]
        )}
      >
        {title && (
          <div className="px-5 py-4 border-b border-[var(--b0)] flex items-center justify-between bg-[var(--elv)]">
            <span className="text-[14px] font-bold text-[var(--t1)]">{title}</span>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-[var(--rsm)] text-[var(--tm)] hover:text-[var(--t1)] hover:bg-[var(--hov)] cursor-pointer border-none bg-transparent text-[16px]"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 border-t border-[var(--b0)] flex justify-end gap-2 bg-[var(--elv)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
