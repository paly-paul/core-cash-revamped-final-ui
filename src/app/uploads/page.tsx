'use client'

import React, { useState, useRef } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'

const UPLOADS = [
  { id: 'u1', name: 'acme_uk_bank_statement_sep2026.csv', type: 'Bank Statement', entity: 'Acme UK Ltd', size: '42 KB', rows: 187, uploaded: '23 Sep 2026 08:41', status: 'processed', confidence: 'High' },
  { id: 'u2', name: 'acme_eu_bank_statement_sep2026.csv', type: 'Bank Statement', entity: 'Acme EU GmbH', size: '31 KB', rows: 124, uploaded: '23 Sep 2026 08:43', status: 'processed', confidence: 'High' },
  { id: 'u3', name: 'acme_us_bank_statement_sep2026.csv', type: 'Bank Statement', entity: 'Acme US Inc', size: '38 KB', rows: 156, uploaded: '23 Sep 2026 08:45', status: 'processed', confidence: 'High' },
  { id: 'u4', name: 'ap_schedule_sep2026.xlsx', type: 'AP Schedule', entity: 'All Entities', size: '84 KB', rows: 312, uploaded: '22 Sep 2026 17:10', status: 'processed', confidence: 'Medium' },
  { id: 'u5', name: 'ar_forecast_oct2026.xlsx', type: 'AR Forecast', entity: 'All Entities', size: '61 KB', rows: 228, uploaded: '22 Sep 2026 17:12', status: 'processed', confidence: 'Medium' },
  { id: 'u6', name: 'fx_rates_manual_22sep.csv', type: 'FX Rates', entity: 'Global', size: '3 KB', rows: 12, uploaded: '22 Sep 2026 09:05', status: 'processed', confidence: 'High' },
  { id: 'u7', name: 'payroll_sep2026_uk.csv', type: 'Payroll', entity: 'Acme UK Ltd', size: '18 KB', rows: 84, uploaded: '21 Sep 2026 14:22', status: 'pending', confidence: 'High' },
]

const statusBadge = (s: string) => {
  if (s === 'processed') return <Badge variant="success">✓ Processed</Badge>
  if (s === 'pending') return <Badge variant="warning">⏳ Pending</Badge>
  if (s === 'failed') return <Badge variant="error">✕ Failed</Badge>
  return <Badge variant="neutral">{s}</Badge>
}

export default function UploadsPage() {
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState(UPLOADS)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const total = uploads.length
  const processed = uploads.filter(u => u.status === 'processed').length
  const pending = uploads.filter(u => u.status === 'pending').length

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Uploads & Data Management</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">AS OF 23 SEP 2026 · 09:00 UTC</p>
        </div>
        <button
          className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          + Upload File
        </button>
        <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.xls" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Files', value: total, sub: 'All time uploads', color: 'blue' },
          { label: 'Processed', value: processed, sub: 'Successfully ingested', color: 'green' },
          { label: 'Pending Review', value: pending, sub: 'Awaiting validation', color: 'amber' },
        ].map(m => (
          <div key={m.label} className={`bg-[var(--sur)] border rounded-[var(--rmd)] p-[14px] shadow-[var(--shc)] border-[var(--b0)] border-t-2`} style={{ borderTopColor: `var(--${m.color})` }}>
            <div className="text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{m.label}</div>
            <div className="font-[var(--mono)] text-[24px] font-semibold text-[var(--t1)]">{m.value}</div>
            <div className="text-[11px] text-[var(--tm)] mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <SectionCard title="Upload Files">
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-[var(--rmd)] p-10 text-center cursor-pointer transition-colors ${dragging ? 'border-[var(--blue)] bg-[var(--blue-lt)]' : 'border-[var(--b1)] hover:border-[var(--blue)] hover:bg-[var(--elv)]'}`}
        >
          <div className="text-[32px] mb-3">📁</div>
          <div className="text-[13px] font-semibold text-[var(--t1)] mb-1">Drag & drop files here, or click to browse</div>
          <div className="text-[11.5px] text-[var(--tm)]">Supported formats: CSV, XLSX · Max file size: 10MB</div>
          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-[var(--tm)]">
            {['Bank Statements', 'AP/AR Schedules', 'FX Rates', 'Payroll Files'].map(t => (
              <span key={t} className="bg-[var(--elv)] border border-[var(--b0)] px-2 py-1 rounded">{t}</span>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Recent uploads table */}
      <TableCard title="Recent Uploads">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['File Name', 'Type', 'Entity', 'Size', 'Rows', 'Uploaded', 'Status', 'Confidence'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploads.map(row => (
                <tr key={row.id} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--blue)] font-medium cursor-pointer hover:underline">{row.name}</td>
                  <td className="px-[14px] py-[9px] text-[11.5px] text-[var(--t2)]">{row.type}</td>
                  <td className="px-[14px] py-[9px] text-[11.5px] text-[var(--t2)]">{row.entity}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[11.5px] text-[var(--t2)]">{row.size}</td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[11.5px] text-[var(--t2)]">{row.rows.toLocaleString()}</td>
                  <td className="px-[14px] py-[9px] text-[11px] text-[var(--tm)] font-[var(--mono)]">{row.uploaded}</td>
                  <td className="px-[14px] py-[9px]">{statusBadge(row.status)}</td>
                  <td className="px-[14px] py-[9px] text-[11.5px] text-[var(--t2)]">{row.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      {/* Data source status */}
      <SectionCard title="Data Source Connections">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Barclays Bank Feed', entity: 'Acme UK Ltd', type: 'API', status: 'connected', lastSync: '09:00 UTC today' },
            { name: 'Deutsche Bank API', entity: 'Acme EU GmbH', type: 'API', status: 'connected', lastSync: '09:00 UTC today' },
            { name: 'JPMorgan Connect', entity: 'Acme US Inc', type: 'SFTP', status: 'connected', lastSync: '08:45 UTC today' },
            { name: 'ERP System (SAP)', entity: 'All Entities', type: 'API', status: 'warning', lastSync: '08:00 UTC today' },
          ].map(src => (
            <div key={src.name} className="flex items-center gap-3 p-3 bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rmd)]">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${src.status === 'connected' ? 'bg-[var(--green)]' : 'bg-[var(--amber)]'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[var(--t1)] truncate">{src.name}</div>
                <div className="text-[10.5px] text-[var(--tm)]">{src.entity} · {src.type} · Last sync: {src.lastSync}</div>
              </div>
              <Badge variant={src.status === 'connected' ? 'success' : 'warning'}>
                {src.status === 'connected' ? 'Live' : '⚠ Check'}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}
