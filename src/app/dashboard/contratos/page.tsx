
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Shield, Search, Bell, X } from 'lucide-react'
import { useState } from 'react'

// Notification component
function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  
  const notifications = [
    { id: 1, text: "Novo desconto disponível!", time: "2 min", isNew: true },
    { id: 2, text: "Sua cotação está pronta", time: "1h", isNew: true },
    { id: 3, text: "Lembrete: renovação em 30 dias", time: "2h", isNew: false },
  ]
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative rounded-full p-2 text-neutral-medium-gray transition-colors hover:bg-neutral-light-gray hover:text-neutral-charcoal"
      >
        <Bell className="h-5 w-5" />
        {hasNotifications && (
          <motion.span
            className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 rounded-2xl bg-white p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-charcoal">Notificações</h3>
              <button
                onClick={() => setHasNotifications(false)}
                className="text-xs text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-light-gray/50"
                  whileHover={{ x: 5 }}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${notification.isNew ? 'bg-primary' : 'bg-neutral-light-gray'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-charcoal">{notification.text}</p>
                    <p className="text-xs text-neutral-medium-gray">{notification.time} atrás</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              className="mt-4 w-full rounded-lg border border-neutral-light-gray py-2 text-sm font-medium text-neutral-charcoal transition-colors hover:bg-neutral-light-gray"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver todas as notificações
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Search component
function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="rounded-full p-2 text-neutral-medium-gray transition-colors hover:bg-neutral-light-gray hover:text-neutral-charcoal"
      >
        <Search className="h-5 w-5" />
      </button>
      
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 240 }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute right-0 top-0 overflow-hidden"
          >
            <div className="flex items-center rounded-full bg-white shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-4 py-2 text-sm outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-neutral-medium-gray hover:text-neutral-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const contracts = [
  {
    id: 'AUTO-12345',
    type: 'Seguro Auto',
    vehicle: 'Toyota Corolla 2023',
    status: 'Ativo',
    endDate: '2025-12-31',
  },
  {
    id: 'MOTO-67890',
    type: 'Seguro Moto',
    vehicle: 'Honda CB 500X',
    status: 'Inativo',
    endDate: '2024-06-30',
  },
]

export default function ContratosPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-neutral-charcoal">Meus Contratos</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NotificationBell />
        </div>
      </div>

      <div className="space-y-6">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-neutral-charcoal">{contract.type}</h2>
                    <Badge variant={contract.status === 'Ativo' ? 'primary' : 'default'}>
                      {contract.status}
                    </Badge>
                  </div>
                  <p className="text-neutral-medium-gray">{contract.vehicle}</p>
                  <p className="text-sm text-neutral-medium-gray">ID do Contrato: {contract.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-dark-gray">Data de Vencimento</p>
                    <p className="text-neutral-medium-gray">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <Button variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Apólice
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg">Contratar Novo Seguro</Button>
      </div>
    </motion.div>
  )
}
