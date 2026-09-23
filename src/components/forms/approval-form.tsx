'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ApprovalBadge } from '@/components/ui/badge'
import { useToast } from '@/context/ui'
import type { ApprovalItem } from '@/lib/types'

interface ApprovalFormProps {
  item: ApprovalItem
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
}

export function ApprovalForm({ item, onApprove, onReject }: ApprovalFormProps) {
  const [showRejectPanel, setShowRejectPanel] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (item.status !== 'pending') {
    return (
      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-[var(--b0)]">
        <ApprovalBadge status={item.status} />
        {item.status === 'rejected' && item.rejectionReason && (
          <span className="text-[11px] text-[var(--tm)]">Reason: {item.rejectionReason}</span>
        )}
      </div>
    )
  }

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove(item.id)
      toast('Approved', `${item.title} has been approved.`, 'success')
    } catch {
      toast('Error', 'Failed to approve. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast('Reason required', 'Please provide a rejection reason.', 'warning')
      return
    }
    setIsLoading(true)
    try {
      await onReject(item.id, rejectReason)
      toast('Rejected', `${item.title} has been rejected.`, 'warning')
    } catch {
      toast('Error', 'Failed to reject. Please try again.', 'error')
    } finally {
      setIsLoading(false)
      setShowRejectPanel(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-[var(--b0)]">
        <Button variant="primary" size="sm" onClick={handleApprove} isLoading={isLoading}>
          ✓ Approve
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowRejectPanel(p => !p)}
          disabled={isLoading}
        >
          ✕ Reject
        </Button>
        <ApprovalBadge status="pending" />
      </div>
      {showRejectPanel && (
        <div className="mt-2 p-2.5 bg-[var(--red-lt)] border border-[var(--red-bd)] rounded-[var(--rsm)]">
          <textarea
            className="w-full border border-[var(--red-bd)] rounded-[var(--rsm)] px-[10px] py-[7px] text-[12px] font-[var(--ui)] bg-[var(--sur)] text-[var(--t1)] resize-none min-h-[56px] mb-1.5 outline-none focus:border-[var(--red)]"
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" isLoading={isLoading} onClick={handleReject}>
              Confirm Rejection
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowRejectPanel(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
