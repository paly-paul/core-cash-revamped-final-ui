'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { NAVIGATION_STRUCTURE } from '@/lib/constants'
import { useNavigation } from '@/context/navigation'
import type { PageKey } from '@/lib/constants'

export function Sidebar() {
  const { currentPage, navigate, sidebarCollapsed, toggleSidebar } = useNavigation()

  return (
    <div
      className={cn(
        'bg-[var(--sur)] border-r border-[var(--b0)] overflow-y-auto overflow-x-visible py-[14px] flex flex-col gap-0.5 flex-shrink-0 transition-[width] duration-200',
        sidebarCollapsed ? 'w-[52px] overflow-visible' : 'w-[220px]'
      )}
    >
      {/* Toggle */}
      <div
        className="flex items-center justify-between px-[14px] pb-1 cursor-pointer text-[var(--tm)] text-[11px] font-semibold tracking-[0.04em] hover:text-[var(--t1)] pt-2"
        onClick={toggleSidebar}
      >
        {!sidebarCollapsed && <span className="sb-toggle-label">Navigation</span>}
        <span className="ml-auto">{sidebarCollapsed ? '→' : '←'}</span>
      </div>

      {NAVIGATION_STRUCTURE.map((section) => (
        <div key={section.section}>
          {!sidebarCollapsed && (
            <div className="text-[10px] font-bold tracking-[0.09em] uppercase text-[var(--tm)] px-4 pt-[14px] pb-[5px]">
              {section.section}
            </div>
          )}
          {section.items.map((item) => (
            <NavItem
              key={item.key}
              itemKey={item.key as PageKey}
              label={item.label}
              icon={item.icon}
              isActive={currentPage === item.key}
              isCollapsed={sidebarCollapsed}
              onClick={() => navigate(item.key as PageKey)}
            />
          ))}
        </div>
      ))}

      {/* Footer data feeds */}
      {!sidebarCollapsed && (
        <div className="mx-3 mt-3.5 p-3 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)]">
          <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-2">Data Feeds</div>
          <div className="flex justify-between py-[5px] border-b border-[var(--b0)]">
            <span className="text-[11px] text-[var(--t2)]">Bank Feeds</span>
            <span className="font-[var(--mono)] text-[11px] font-semibold text-[var(--green)]">Live</span>
          </div>
          <div className="flex justify-between py-[5px] border-b border-[var(--b0)]">
            <span className="text-[11px] text-[var(--t2)]">ERP Sync</span>
            <span className="font-[var(--mono)] text-[11px] font-semibold text-[var(--t1)]">09:00</span>
          </div>
          <div className="flex justify-between py-[5px]">
            <span className="text-[11px] text-[var(--t2)]">FX Rates</span>
            <span className="font-[var(--mono)] text-[11px] font-semibold text-[var(--amber)]">Stale</span>
          </div>
        </div>
      )}
    </div>
  )
}

function NavItem({
  itemKey,
  label,
  icon,
  isActive,
  isCollapsed,
  onClick,
}: {
  itemKey: PageKey
  label: string
  icon: string
  isActive: boolean
  isCollapsed: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-[9px] py-[7px] cursor-pointer text-[var(--t2)] text-[13px] border-l-[3px] border-transparent transition-all duration-[120ms] mx-[6px] rounded-r-[var(--rsm)]',
        isCollapsed ? 'justify-center px-0 mx-1 relative' : 'px-[14px] pl-3',
        isActive
          ? 'text-[var(--blue)] border-l-[var(--blue)] bg-[var(--blue-lt)] font-semibold'
          : 'hover:text-[var(--t1)] hover:bg-[var(--hov)]'
      )}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
    >
      <span
        className={cn(
          'text-[14px] w-[18px] text-center flex-shrink-0',
          isActive ? 'opacity-100' : 'opacity-70'
        )}
      >
        {icon}
      </span>
      {!isCollapsed && <span className="nav-label">{label}</span>}
      {isCollapsed && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-[var(--t1)] text-white text-[11.5px] font-medium px-[11px] py-[6px] rounded-[var(--rsm)] whitespace-nowrap shadow-[var(--she)] opacity-0 pointer-events-none transition-all duration-[140ms] group-hover:opacity-100 z-[80] nav-tip">
          {label}
        </div>
      )}
    </div>
  )
}
