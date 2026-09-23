'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Toast, ModalConfig } from '@/lib/types'

interface UIContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  modalConfig: ModalConfig | null
  isModalOpen: boolean
  openModal: (config: ModalConfig) => void
  closeModal: () => void
  fxBannerDismissed: boolean
  dismissFxBanner: () => void
}

const UIContext = createContext<UIContextType | null>(null)

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fxBannerDismissed, setFxBannerDismissed] = useState(false)

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 4500 }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, newToast.duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const openModal = useCallback((config: ModalConfig) => {
    setModalConfig(config)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setModalConfig(null), 200)
  }, [])

  const dismissFxBanner = useCallback(() => {
    setFxBannerDismissed(true)
  }, [])

  return (
    <UIContext.Provider value={{
      toasts, addToast, removeToast,
      modalConfig, isModalOpen, openModal, closeModal,
      fxBannerDismissed, dismissFxBanner,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI(): UIContextType {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}

export function useToast() {
  const { addToast } = useUI()
  return {
    toast: (title: string, message?: string, type: Toast['type'] = 'info') =>
      addToast({ title, message, type }),
  }
}

export function useModal() {
  const { openModal, closeModal, isModalOpen, modalConfig } = useUI()
  return { openModal, closeModal, isModalOpen, modalConfig }
}
