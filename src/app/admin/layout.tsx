'use client'

import { AdminSidebar } from '@/components/admin/sidebar'
import { SearchBar } from '@/components/dashboard/search-bar'
import { NotificationBell } from '@/components/dashboard/notification-bell'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex min-h-screen bg-neutral-off-white">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 lg:ml-64">
        <header className="flex items-center justify-between p-4 bg-white border-b border-neutral-light-gray">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-button hover:bg-neutral-light-gray/50 transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-medium-gray" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <SearchBar />
            <NotificationBell />
            <UserButton />
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
