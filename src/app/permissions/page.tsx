'use client'

import React, { useState } from 'react'
import { SectionCard, TableCard } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FxBanner } from '@/components/common/fx-banner'
import { useToast } from '@/context/ui'

const USERS = [
  { id: 'u1', name: 'James Whitmore', email: 'j.whitmore@acme.com', role: 'CFO', entity: 'All Entities', lastLogin: '23 Sep 2026 08:52', status: 'active' },
  { id: 'u2', name: 'Sarah Chen', email: 's.chen@acme.com', role: 'Group Treasurer', entity: 'All Entities', lastLogin: '23 Sep 2026 07:41', status: 'active' },
  { id: 'u3', name: 'Marcus Adeyemi', email: 'm.adeyemi@acme.com', role: 'FP&A Analyst', entity: 'Acme UK Ltd', lastLogin: '22 Sep 2026 17:05', status: 'active' },
  { id: 'u4', name: 'Lena Hoffmann', email: 'l.hoffmann@acme.com', role: 'Regional Treasury', entity: 'Acme EU GmbH', lastLogin: '22 Sep 2026 16:30', status: 'active' },
  { id: 'u5', name: 'Tom Bradley', email: 't.bradley@acme.com', role: 'Auditor (Read Only)', entity: 'All Entities', lastLogin: '20 Sep 2026 09:00', status: 'active' },
  { id: 'u6', name: 'Priya Sharma', email: 'p.sharma@acme.com', role: 'IT Admin', entity: 'N/A', lastLogin: '18 Sep 2026 14:00', status: 'inactive' },
]

const ROLES = [
  { name: 'CFO', permissions: ['view_all', 'approve_all', 'export', 'manage_users', 'configure_system'] },
  { name: 'Group Treasurer', permissions: ['view_all', 'approve_payments', 'export', 'manage_forecasts'] },
  { name: 'FP&A Analyst', permissions: ['view_entity', 'export', 'upload_data'] },
  { name: 'Regional Treasury', permissions: ['view_entity', 'approve_entity', 'export'] },
  { name: 'Auditor (Read Only)', permissions: ['view_all'] },
]

const ALL_PERMS = ['view_all', 'view_entity', 'approve_all', 'approve_payments', 'approve_entity', 'export', 'upload_data', 'manage_forecasts', 'manage_users', 'configure_system']

const AUDIT = [
  { time: '23 Sep 08:52', user: 'James Whitmore', action: 'Approved payroll payment £1.24M', ip: '10.0.1.42' },
  { time: '23 Sep 08:43', user: 'Sarah Chen', action: 'Uploaded EU bank statement', ip: '10.0.1.55' },
  { time: '22 Sep 17:05', user: 'Marcus Adeyemi', action: 'Exported CFO Summary PDF', ip: '10.0.1.87' },
  { time: '22 Sep 16:30', user: 'Lena Hoffmann', action: 'Reviewed EUR forecast', ip: '10.0.2.11' },
  { time: '22 Sep 09:05', user: 'Sarah Chen', action: 'Uploaded FX rates manual', ip: '10.0.1.55' },
]

export default function PermissionsPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState<'users' | 'roles' | 'audit'>('users')

  return (
    <>
      <FxBanner />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-[var(--t1)] tracking-[-0.01em]">Permissions & User Management</h1>
          <p className="text-[11px] text-[var(--tm)] font-[var(--mono)] mt-0.5">ACCESS CONTROL · {USERS.filter(u => u.status === 'active').length} ACTIVE USERS</p>
        </div>
        <button
          onClick={() => toast('Coming Soon', 'User invite functionality coming in next release.', 'info')}
          className="px-3.5 py-[7px] text-[12px] font-semibold rounded-[var(--rsm)] bg-[var(--blue)] text-white border-none hover:bg-[#004BBD] cursor-pointer"
        >
          + Invite User
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-[var(--elv)] border border-[var(--b0)] rounded-[var(--rsm)] p-0.5 self-start">
        {([['users', 'Users'], ['roles', 'Roles & Permissions'], ['audit', 'Audit Log']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-[5px] rounded text-[11px] font-semibold cursor-pointer border-none transition-all ${tab === k ? 'bg-[var(--sur)] text-[var(--blue)] shadow-[var(--shc)]' : 'bg-transparent text-[var(--tm)]'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <TableCard title="User Accounts">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Entity Access', 'Last Login', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.id} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                    <td className="px-[14px] py-[9px] text-[12.5px] font-semibold text-[var(--t1)]">{u.name}</td>
                    <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)] font-[var(--mono)]">{u.email}</td>
                    <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{u.role}</td>
                    <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{u.entity}</td>
                    <td className="px-[14px] py-[9px] text-[11px] text-[var(--tm)] font-[var(--mono)]">{u.lastLogin}</td>
                    <td className="px-[14px] py-[9px]">
                      <Badge variant={u.status === 'active' ? 'success' : 'neutral'}>{u.status === 'active' ? '● Active' : '○ Inactive'}</Badge>
                    </td>
                    <td className="px-[14px] py-[9px]">
                      <button onClick={() => toast('Edit User', `Editing ${u.name}`, 'info')} className="text-[11px] text-[var(--blue)] font-semibold cursor-pointer bg-transparent border-none hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      )}

      {tab === 'roles' && (
        <SectionCard title="Role Permissions Matrix">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">Permission</th>
                  {ROLES.map(r => (
                    <th key={r.name} className="px-[14px] py-[7px] text-center text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)] whitespace-nowrap">{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMS.map(perm => (
                  <tr key={perm} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                    <td className="px-[14px] py-[9px] text-[11.5px] font-[var(--mono)] text-[var(--t2)]">{perm}</td>
                    {ROLES.map(r => (
                      <td key={r.name} className="px-[14px] py-[9px] text-center">
                        {r.permissions.includes(perm) ? <span className="text-[var(--green)] text-[14px]">✓</span> : <span className="text-[var(--b1)] text-[14px]">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === 'audit' && (
        <TableCard title="Audit Log">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Timestamp', 'User', 'Action', 'IP Address'].map(h => (
                  <th key={h} className="px-[14px] py-[7px] text-left text-[10px] font-bold tracking-[0.07em] uppercase text-[var(--tm)] border-b border-[var(--b0)] bg-[var(--elv)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT.map((row, i) => (
                <tr key={i} className="border-b border-[var(--b0)] hover:bg-[var(--hov)] last:border-0">
                  <td className="px-[14px] py-[9px] text-[11px] font-[var(--mono)] text-[var(--tm)]">{row.time}</td>
                  <td className="px-[14px] py-[9px] text-[12px] font-semibold text-[var(--t1)]">{row.user}</td>
                  <td className="px-[14px] py-[9px] text-[12px] text-[var(--t2)]">{row.action}</td>
                  <td className="px-[14px] py-[9px] text-[11px] font-[var(--mono)] text-[var(--tm)]">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
    </>
  )
}
