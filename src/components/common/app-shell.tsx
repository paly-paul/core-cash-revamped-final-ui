'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Topbar } from './topbar'
import { Sidebar } from './sidebar'
import { ChatPanel } from './chat-panel'
import { ToastManager } from './toast-manager'
import { ModalManager } from './modal-manager'
import { useNavigation } from '@/context/navigation'
import { PageRouter } from './page-router'

export function AppShell() {
  const { currentPage, sidebarCollapsed } = useNavigation()

  return (
    <div
      className={cn(
        'grid h-screen',
        sidebarCollapsed
          ? 'grid-rows-[54px_1fr] grid-cols-[52px_1fr_356px]'
          : 'grid-rows-[54px_1fr] grid-cols-[220px_1fr_356px]'
      )}
    >
      <Topbar />
      <Sidebar />
      <main className="bg-[var(--bg)] overflow-y-auto overflow-x-hidden px-[22px] py-5 flex flex-col gap-4 min-h-0">
        <PageRouter currentPage={currentPage} />
      </main>
      <ChatPanel pageKey={currentPage} />
      <ToastManager />
      <ModalManager />
    </div>
  )
}
