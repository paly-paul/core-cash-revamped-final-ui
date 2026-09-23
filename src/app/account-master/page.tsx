'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/context/ui'

const ACCOUNTS = [
  { id: 'A001', entity: 'Acme UK Ltd', name: 'Main Operating Account', bank: 'Barclays', sortCode: '20-00-00', accountNo: '12345678', iban: 'GB29BUKB20000012345678', currency: 'GBP', type: 'Operating', threshold: 2_000_000, status: 'active' },
  { id: 'A002', entity: 'Acme UK Ltd', name: 'Payroll Account', bank: 'Barclays', sortCode: '20-00-00', accountNo: '87654321', iban: 'GB29BUKB20000087654321', currency: 'GBP', type: 'Payroll', threshold: 500_000, status: 'active' },
  { id: 'A003', entity: 'Acme EU GmbH', name: 'Euro Operating Account', bank: 'Deutsche Bank', sortCode: '—', accountNo: 'DE89370400440532013000', iban: 'DE89370400440532013000', currency: 'EUR', type: 'Operating', threshold: 1_500_000, status: 'active' },
  { id: 'A004', entity: 'Acme US Inc', name: 'USD Operating Account', bank: 'JPMorgan', sortCode: '—', accountNo: '000123456789', iban: 'N/A', currency: 'USD', type: 'Operating', threshold: 1_000_000, status: 'active' },
  { id: 'A005', entity: 'Acme US Inc', name: 'Investment Pool', bank: 'JPMorgan', sortCode: '—', accountNo: '000987654321', iban: 'N/A', currency: 'USD', type: 'Investment', threshold: 500_000, status: 'active' },
  { id: 'A006', entity: 'Acme UK Ltd', name: 'Dormant Collection Account', bank: 'HSBC', sortCode: '40-00-00', accountNo: '55556666', iban: 'GB29MIDL40000055556666', currency: 'GBP', type: 'Collection', threshold: 0, status: 'dormant' },
]

type NewAccount = { entity: string; name: string; bank: string; currency: string; type: string; threshold: string }
const EMPTY: NewAccount = { entity: '', name: '', bank: '', currency: 'GBP', type: 'Operating', threshold: '' }

export default function AccountMasterPage() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filterEntity, setFilterEntity] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [newAcc, setNewAcc] = useState<NewAccount>(EMPTY)

  const entities = ['All', ...Array.from(new Set(ACCOUNTS.map(a => a.entity)))]
  const filtered = ACCOUNTS.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.bank.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
    const matchEntity = filterEntity === 'All' || a.entity === filterEntity
    const matchStatus = filterStatus === 'All' || a.status === filterStatus
    return matchSearch && matchEntity && matchStatus
  })

  const handleSave = () => {
    if (!newAcc.entity || !newAcc.name || !newAcc.bank) {
      toast('Validation Error', 'Please fill in all required fields.', 'error')
      return
    }
    setShowModal(false)
    setNewAcc(EMPTY)
    toast('Account Added', `${newAcc.name} has been added to the account master.`, 'success')
  }

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Account Master</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">{ACCOUNTS.filter(a => a.status === 'active').length} ACTIVE ACCOUNTS · {ACCOUNTS.length} TOTAL</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer"
        >
          + Add Account
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search accounts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-[7px] text-[12.5px] bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] w-52"
        />
        <select value={filterEntity} onChange={e => setFilterEntity(e.target.value)} className="px-3 py-[7px] text-[12.5px] bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t2)] outline-none focus:border-[var(--blue)] cursor-pointer">
          {entities.map(e => <option key={e}>{e}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-[7px] text-[12.5px] bg-[var(--sur)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t2)] outline-none focus:border-[var(--blue)] cursor-pointer">
          {['All', 'active', 'dormant'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="text-[11.5px] text-[var(--tm)] ml-auto">{filtered.length} of {ACCOUNTS.length} accounts</span>
      </div>

      <TableCard title="Account Register">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['ID', 'Entity', 'Account Name', 'Bank', 'Sort Code', 'Account / IBAN', 'CCY', 'Type', 'Min Threshold', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className={`border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0 ${row.status === 'dormant' ? 'opacity-60' : ''}`}>
                  <td className="px-[14px] py-[9px] text-[11px] font-[var(--mono)] text-[var(--tm)]">{row.id}</td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.entity}</td>
                  <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{row.name}</td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.bank}</td>
                  <td className="px-[14px] py-[9px] text-[11.5px] font-[var(--mono)] text-[var(--t2)]">{row.sortCode}</td>
                  <td className="px-[14px] py-[9px] text-[11px] font-[var(--mono)] text-[var(--tm)]">{row.iban !== 'N/A' ? row.iban : row.accountNo}</td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.currency}</td>
                  <td className="px-[14px] py-[9px]"><Badge variant="neutral">{row.type}</Badge></td>
                  <td className="px-[14px] py-[9px] text-right font-[var(--mono)] text-[12px] text-[var(--tm)]">
                    {row.threshold > 0 ? `£${(row.threshold / 1_000_000).toFixed(1)}M` : '—'}
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <Badge variant={row.status === 'active' ? 'success' : 'neutral'}>
                      {row.status === 'active' ? '● Active' : '○ Dormant'}
                    </Badge>
                  </td>
                  <td className="px-[14px] py-[9px]">
                    <button onClick={() => toast('Edit Account', `Editing ${row.name}`, 'info')} className="text-[11px] text-[var(--blue)] font-semibold cursor-pointer bg-transparent border-none hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      {/* Add account modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Account" size="md">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Legal Entity *', key: 'entity' as const, placeholder: 'e.g. Acme UK Ltd' },
            { label: 'Account Name *', key: 'name' as const, placeholder: 'e.g. Main Operating' },
            { label: 'Bank *', key: 'bank' as const, placeholder: 'e.g. Barclays' },
            { label: 'Min Threshold (£)', key: 'threshold' as const, placeholder: 'e.g. 1000000' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">{f.label}</label>
              <input
                value={newAcc[f.key]}
                onChange={e => setNewAcc(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)]"
              />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Currency</label>
            <select value={newAcc.currency} onChange={e => setNewAcc(p => ({ ...p, currency: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {['GBP', 'EUR', 'USD'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] mb-1.5">Account Type</label>
            <select value={newAcc.type} onChange={e => setNewAcc(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-[7px] text-[12.5px] bg-[var(--elv)] border border-[var(--b1)] rounded-[var(--rsm)] text-[var(--t1)] outline-none focus:border-[var(--blue)] cursor-pointer">
              {['Operating', 'Payroll', 'Investment', 'Collection', 'Escrow'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => setShowModal(false)} className="px-4 py-[7px] text-[12px] font-medium rounded-[var(--rsm)] bg-[var(--sur)] text-[var(--t2)] border border-[var(--b1)] hover:border-[var(--blue)] cursor-pointer">Cancel</button>
          <button onClick={handleSave} className="px-4 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer">Add Account</button>
        </div>
      </Modal>
    </>
  )
}
