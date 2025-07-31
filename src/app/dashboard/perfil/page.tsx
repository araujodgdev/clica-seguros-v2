
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Search, Bell, X } from 'lucide-react'
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

export default function PerfilPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-neutral-charcoal">Perfil</h1>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NotificationBell />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-neutral-charcoal mb-6">Informações Pessoais</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Nome Completo</label>
              <input type="text" defaultValue="Alexandre" className="w-full p-3 border border-neutral-light-gray rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark-gray mb-2">E-mail</label>
              <input type="email" defaultValue="alexandre@email.com" className="w-full p-3 border border-neutral-light-gray rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Telefone</label>
              <input type="tel" defaultValue="+55 (11) 99999-9999" className="w-full p-3 border border-neutral-light-gray rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-dark-gray mb-2">CPF</label>
              <input type="text" defaultValue="123.456.789-00" className="w-full p-3 border border-neutral-light-gray rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Salvar Alterações</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-neutral-charcoal mb-6">Segurança</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Senha</label>
            <Button variant="secondary">Alterar Senha</Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Autenticação de Dois Fatores</label>
            <Button variant="secondary">Ativar</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
