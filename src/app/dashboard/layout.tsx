
'use client'

import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: { 
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-off-white">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  )
}
