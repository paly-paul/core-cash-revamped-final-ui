'use client'

import React, { useState } from 'react'
import { SectionCard } from '@/components/ui/card'
import { FxBanner } from '@/components/common/fx-banner'
import { useToast } from '@/context/ui'

export default function SettingsPage() {
  const { toast } = useToast()
  const [reportPrefs, setReportPrefs] = useState({ currency: 'GBP', dateFormat: 'DD MMM YYYY', timezone: 'UTC', autoRefresh: '15' })
  const [thresholds, setThresholds] = useState({ amberPct: '110', redPct: '100', forecastDays: '30' })

  const save = (section: string) => {
    toast('Saved', `${section} settings saved successfully.`, 'success')
  }

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Settings</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">SYSTEM CONFIGURATION</p>
        </div>
      </div>

      {/* Company */}
      <SectionCard title="Company & Organisation">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Company Name', value: 'Acme Group Holdings Ltd', type: 'text' },
            { label: 'Primary Currency', value: 'GBP — British Pound', type: 'text' },
            { label: 'Registered Address', value: '1 Financial Square, London EC2V 8JB', type: 'text' },
            { label: 'Company Registration', value: '12345678', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{f.label}</label>
              <input defaultValue={f.value} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => save('Company')} className="px-4 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">Save Changes</button>
        </div>
      </SectionCard>

      {/* Report Preferences */}
      <SectionCard title="Report Preferences">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Default Currency</label>
            <select value={reportPrefs.currency} onChange={e => setReportPrefs(p => ({ ...p, currency: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {['GBP', 'USD', 'EUR'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Date Format</label>
            <select value={reportPrefs.dateFormat} onChange={e => setReportPrefs(p => ({ ...p, dateFormat: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Timezone</label>
            <select value={reportPrefs.timezone} onChange={e => setReportPrefs(p => ({ ...p, timezone: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {['UTC', 'Europe/London', 'America/New_York', 'Europe/Berlin'].map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Auto-Refresh Interval</label>
            <select value={reportPrefs.autoRefresh} onChange={e => setReportPrefs(p => ({ ...p, autoRefresh: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {[['5', '5 minutes'], ['15', '15 minutes'], ['30', '30 minutes'], ['60', '1 hour']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => save('Report')} className="px-4 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">Save Changes</button>
        </div>
      </SectionCard>

      {/* Alert Thresholds */}
      <SectionCard title="Alert Thresholds">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Amber Alert (% of minimum)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={thresholds.amberPct} onChange={e => setThresholds(p => ({ ...p, amberPct: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]" />
              <span className="text-[12px] text-[var(--tm)]">%</span>
            </div>
            <p className="text-[10.5px] text-[var(--tm)] mt-1">Triggers amber when balance ≤ {thresholds.amberPct}% of threshold</p>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Red Alert (% of minimum)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={thresholds.redPct} onChange={e => setThresholds(p => ({ ...p, redPct: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]" />
              <span className="text-[12px] text-[var(--tm)]">%</span>
            </div>
            <p className="text-[10.5px] text-[var(--tm)] mt-1">Triggers red when balance ≤ {thresholds.redPct}% of threshold</p>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Forecast Horizon (days)</label>
            <input type="number" value={thresholds.forecastDays} onChange={e => setThresholds(p => ({ ...p, forecastDays: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]" />
            <p className="text-[10.5px] text-[var(--tm)] mt-1">Default forecast window shown on dashboard</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => save('Threshold')} className="px-4 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">Save Changes</button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notification Preferences">
        <div className="flex flex-col gap-3">
          {[
            { label: 'Cash below threshold alert', sub: 'Email when any account approaches minimum balance', on: true },
            { label: 'Daily briefing email', sub: 'Morning summary delivered at 07:00 UTC', on: true },
            { label: 'Approval request notifications', sub: 'Email when items require your approval', on: true },
            { label: 'FX rate movement alerts', sub: 'Alert when rates move more than 1% in 24 hours', on: false },
            { label: 'Data feed failures', sub: 'Immediate notification if a bank feed disconnects', on: true },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-2.5 border-b border-[var(--b0)] last:border-0">
              <div>
                <div className="text-[12.5px] font-semibold text-[var(--t1)]">{n.label}</div>
                <div className="text-[11px] text-[var(--tm)]">{n.sub}</div>
              </div>
              <button className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none ${n.on ? 'bg-[var(--blue)]' : 'bg-[var(--b1)]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.on ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={() => save('Notification')} className="px-4 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">Save Changes</button>
        </div>
      </SectionCard>
    </>
  )
}
