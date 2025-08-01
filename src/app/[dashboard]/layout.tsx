
'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { SearchBar } from '@/components/dashboard/search-bar'
import { NotificationBell } from '@/components/dashboard/notification-bell'
import { UserButton } from '@clerk/nextjs'

export default function DashboardLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-off-white">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <header className="flex items-center justify-end p-4 bg-white border-b border-neutral-light-gray">
          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationBell />
            <UserButton />
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
