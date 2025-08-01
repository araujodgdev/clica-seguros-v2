'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, BarChart3, Settings, Home, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-light-gray/60 flex flex-col shadow-sm z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
      <div className="p-6 border-b border-neutral-light-gray/40">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="block group" onClick={() => window.innerWidth < 1024 && onToggle()}>
            <div>
              <h1 className="text-lg font-semibold text-neutral-charcoal">Admin</h1>
              <p className="text-xs text-neutral-medium-gray">Painel de controle</p>
            </div>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-button hover:bg-neutral-light-gray/50 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-medium-gray" />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link, index) => {
          const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={link.href} onClick={() => window.innerWidth < 1024 && onToggle()}>
                <motion.div
                  className={`group flex items-center justify-between p-3 rounded-button cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-neutral-dark-gray hover:bg-neutral-light-gray/50 hover:text-neutral-charcoal'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-neutral-medium-gray'
                    }`} />
                    <span className="font-medium text-sm">{link.label}</span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    </motion.aside>
  </>
  )
}
