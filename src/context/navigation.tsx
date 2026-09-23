'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { PAGE_ROUTES, type PageKey } from '@/lib/constants'

interface NavigationContextType {
  currentPage: PageKey
  navigate: (pageKey: PageKey) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageKey>(PAGE_ROUTES.DASHBOARD)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigate = useCallback((pageKey: PageKey) => {
    setCurrentPage(pageKey)
    window.scrollTo(0, 0)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, sidebarCollapsed, toggleSidebar }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextType {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}
