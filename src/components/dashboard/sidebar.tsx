
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, FileText, LifeBuoy, LogOut, ChevronRight, Layers } from 'lucide-react'

const navLinks = [
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
  { href: '/dashboard/contratos', label: 'Contratos', icon: FileText },
  { href: '/dashboard/suporte', label: 'Suporte', icon: LifeBuoy },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-light-gray flex flex-col p-4">
      <Link href="/" className="flex items-center gap-2 p-4 mb-8">
        <Layers className="h-8 w-8 text-neutral-charcoal" />
        <span className="text-lg font-bold text-neutral-charcoal">Clica Seguros</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-dark-gray hover:bg-neutral-light-gray/50'
                }`}
                whileHover={{ x: isActive ? 0 : 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-chevron">
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="font-semibold text-xs text-neutral-charcoal truncate">Alexandre</p>
            </div>
          </div>
          <motion.div
            className="p-2 rounded-lg cursor-pointer text-neutral-dark-gray hover:bg-neutral-light-gray/50 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <LogOut className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </aside>
  )
}
