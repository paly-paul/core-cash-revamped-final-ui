'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge, ApprovalBadge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { ApprovalForm } from '@/components/forms/approval-form'
import { APPROVAL_ITEMS } from '@/lib/constants'
import type { ApprovalItem } from '@/lib/types'

export default function BriefingPage() {
  const [items, setItems] = useState<ApprovalItem[]>(APPROVAL_ITEMS.slice(0, 2))

  const handleApprove = async (id: string) => {
    await new Promise(r => setTimeout(r, 600))
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'approved' as const } : it))
  }

  const handleReject = async (id: string, reason: string) => {
    await new Promise(r => setTimeout(r, 600))
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'rejected' as const, rejectionReason: reason } : it))
  }

  return (
    <>
      <FxBanner />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Daily Briefing</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">23 SEP 2026 · MORNING BRIEF</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] hover:bg-[var(--blue-lt)] cursor-pointer">
            ↓ Download PDF
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-[var(--sur)] border border-[var(--b0)] rounded-[var(--rmd)] px-[18px] py-[13px] flex items-center gap-4 shadow-[var(--shc)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] flex-shrink-0 pulse-dot" />
        <span className="text-[13px] font-bold text-[var(--green)]">Normal Operations</span>
        <span className="text-[12.5px] text-[var(--t2)] flex-1 leading-[1.6]">
          All critical thresholds met. 2 approvals pending. FX rates updated at 09:00 UTC.
        </span>
        <Badge variant="warning">2 Pending</Badge>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Behind Us */}
        <SectionCard title="Behind Us — Yesterday">
          <div className="flex flex-col gap-3">
            <BriefingBlock
              date="22 Sep 2026"
              title="Cash Position EOD"
              body="Closing position £9.04M across all entities. Acme EU GmbH EUR balance remained near threshold at £1.83M. Payroll for UK entity confirmed processed — £1.24M."
              badges={[<Badge key="1" variant="success">Completed</Badge>]}
            />
            <BriefingBlock
              date="22 Sep 2026"
              title="FX Rate Movement"
              body="GBP/USD moved from 1.2598 to 1.2641 (+0.34%). EUR/USD declined from 1.0849 to 1.0824 (−0.12%). Net USD impact on consolidated position: +£42K."
              badges={[<Badge key="1" variant="warning">⚠ FX Impact</Badge>]}
            />
            <BriefingBlock
              date="22 Sep 2026"
              title="AP Settlement"
              body="£340K in AP payments processed across 12 invoices. No payment failures. Bank reconciliation confirmed."
              badges={[<Badge key="1" variant="success">Cleared</Badge>]}
            />
          </div>
        </SectionCard>

        {/* Ahead */}
        <SectionCard title="Ahead of Us — Today & Next 7 Days">
          <div className="flex flex-col gap-3">
            <BriefingBlock
              date="23 Sep 2026"
              title="Payroll Run — UK (Today)"
              body="UK September payroll of £1.24M is pending approval. Must be released by 12:00 UTC for same-day processing. Balance post-payroll: £3.58M (above £2M threshold)."
              badges={[<Badge key="1" variant="warning">⚠ Pending Approval</Badge>, <Badge key="2" variant="primary">Today</Badge>]}
              isAlert
            />
            <BriefingBlock
              date="24 Sep 2026"
              title="EUR Balance Monitoring"
              body="Acme EU GmbH EUR balance forecast to approach threshold by 25 Sep. Consider inter-company transfer from UK entity to cover shortfall. Recommended action: Evaluate £500K transfer."
              badges={[<Badge key="1" variant="warning">⚠ Attention</Badge>]}
            />
            <BriefingBlock
              date="27 Sep 2026"
              title="Significant Outflow — EUR AP"
              body="Large AP settlement of €420K (£356K) scheduled. Currently above threshold but confirms monitoring required through the week."
              badges={[<Badge key="1" variant="neutral">Scheduled</Badge>]}
            />
          </div>
        </SectionCard>
      </div>

      {/* Approvals pending */}
      <SectionCard
        title="Approvals Pending"
        actions={<Badge variant="warning">{items.filter(i => i.status === 'pending').length} Pending</Badge>}
      >
        <div className="flex flex-col divide-y divide-[var(--b0)]">
          {items.map(item => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[12.5px] font-semibold text-[var(--t1)] mb-1">{item.title}</div>
                  <div className="text-[11.5px] text-[var(--t2)] mb-1">{item.description}</div>
                  <div className="flex gap-4 text-[10px] text-[var(--tm)]">
                    <span>Entity: {item.entity}</span>
                    <span>Amount: £{(item.amount / 1000).toFixed(0)}K</span>
                    <span>Approver: {item.approverRole}</span>
                  </div>
                </div>
              </div>
              <ApprovalForm item={item} onApprove={handleApprove} onReject={handleReject} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Markets overview */}
      <TableCard title="Markets Overview">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Instrument', 'Rate', 'Change', 'Updated'].map(h => (
                <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'GBP/USD', rate: '1.2641', change: '+0.34%', up: true, updated: '09:00 UTC' },
              { name: 'EUR/USD', rate: '1.0824', change: '−0.12%', up: false, updated: '09:00 UTC' },
              { name: 'EUR/GBP', rate: '0.8562', change: '−0.08%', up: false, updated: '09:00 UTC' },
              { name: 'US Fed Funds', rate: '5.25%', change: '0.00%', up: null, updated: 'Sep 20' },
              { name: 'UK Base Rate', rate: '5.00%', change: '0.00%', up: null, updated: 'Aug 01' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] transition-colors last:border-0">
                <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{row.name}</td>
                <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--t1)]">{row.rate}</td>
                <td className={`px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] ${row.up === true ? 'text-[var(--green)]' : row.up === false ? 'text-[var(--red)]' : 'text-[var(--tm)]'}`}>
                  {row.change}
                </td>
                <td className="px-[14px] py-[9px] text-[11px] text-[var(--tm)] font-[var(--mono)]">{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  )
}

function BriefingBlock({
  date, title, body, badges, isAlert,
}: {
  date: string
  title: string
  body: string
  badges?: React.ReactNode[]
  isAlert?: boolean
}) {
  return (
    <div className={`flex items-start gap-2.5 pb-3 border-b border-[var(--b0)] last:border-0 last:pb-0 ${isAlert ? 'bg-[var(--amber-lt)] -mx-4 px-4 py-3 rounded' : ''}`}>
      <div className={`flex flex-col`}>
        <div className="text-[10px] font-[var(--mono)] text-[var(--tm)] mb-1">{date}</div>
        <div className="text-[12px] font-semibold text-[var(--t1)] mb-1">{title}</div>
        <p className="text-[11.5px] text-[var(--t2)] leading-[1.6]">{body}</p>
        {badges && <div className="flex gap-1.5 mt-1.5 flex-wrap">{badges}</div>}
      </div>
    </div>
  )
}
