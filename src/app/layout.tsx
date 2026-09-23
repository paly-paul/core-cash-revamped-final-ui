import type { Metadata } from 'next'
import './globals.css'
import { NavigationProvider } from '@/context/navigation'
import { UIProvider } from '@/context/ui'
import { ChatProvider } from '@/context/chat'
import { AppShell } from '@/components/common/app-shell'

export const metadata: Metadata = {
  title: 'Core Cash — Treasury Intelligence',
  description: 'Treasury Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <UIProvider>
            <ChatProvider>
              <AppShell />
            </ChatProvider>
          </UIProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
