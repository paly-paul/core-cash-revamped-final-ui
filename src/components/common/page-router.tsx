'use client'

import React from 'react'
import type { PageKey } from '@/lib/constants'
import DashboardPage from '@/app/dashboard/page'
import BriefingPage from '@/app/briefing/page'
import CfoSummaryPage from '@/app/cfo-summary/page'
import CashPositionPage from '@/app/cash-position/page'
import ForecastPage from '@/app/forecast/page'
import UploadsPage from '@/app/uploads/page'
import TrendsPage from '@/app/trends/page'
import SettingsPage from '@/app/settings/page'
import FxAdminPage from '@/app/fx-admin/page'
import PermissionsPage from '@/app/permissions/page'
import InvestmentPolicyPage from '@/app/investment-policy/page'
import LiquidityRiskPage from '@/app/liquidity-risk/page'
import AccountMasterPage from '@/app/account-master/page'

const PAGE_MAP: Record<PageKey, React.ComponentType> = {
  'dashboard': DashboardPage,
  'briefing': BriefingPage,
  'cfo-summary': CfoSummaryPage,
  'cash-position': CashPositionPage,
  'forecast': ForecastPage,
  'uploads': UploadsPage,
  'trends': TrendsPage,
  'settings': SettingsPage,
  'fx-admin': FxAdminPage,
  'permissions': PermissionsPage,
  'investment-policy': InvestmentPolicyPage,
  'liquidity-risk': LiquidityRiskPage,
  'account-master': AccountMasterPage,
}

export function PageRouter({ currentPage }: { currentPage: PageKey }) {
  const PageComponent = PAGE_MAP[currentPage]
  if (!PageComponent) return <div className="text-[var(--tm)]">Page not found</div>
  return <PageComponent />
}
