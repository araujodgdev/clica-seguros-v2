
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LifeBuoy, MessageCircle, Phone, FileText, Search, Bell, X } from 'lucide-react'
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

const supportOptions = [
  {
    title: 'Chat ao Vivo',
    description: 'Fale com um de nossos especialistas em tempo real.',
    icon: MessageCircle,
    buttonText: 'Iniciar Chat',
  },
  {
    title: 'Telefone',
    description: 'Ligue para nossa central de atendimento 24h.',
    icon: Phone,
    buttonText: 'Ver Números',
  },
  {
    title: 'Base de Conhecimento',
    description: 'Encontre respostas para as perguntas mais frequentes.',
    icon: FileText,
    buttonText: 'Acessar Artigos',
  },
]

export default function SuportePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-charcoal">Central de Suporte</h1>
          <p className="text-lg text-neutral-medium-gray mt-2">Como podemos ajudar você hoje?</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NotificationBell />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center h-full flex flex-col">
              <option.icon className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold text-neutral-charcoal mb-2">{option.title}</h2>
              <p className="text-neutral-medium-gray flex-grow mb-6">{option.description}</p>
              <Button>{option.buttonText}</Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-neutral-charcoal mb-6">Abrir um Chamado</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Assunto</label>
            <input type="text" placeholder="Ex: Dúvida sobre minha apólice" className="w-full p-3 border border-neutral-light-gray rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark-gray mb-2">Descreva seu problema</label>
            <textarea placeholder="Forneça o máximo de detalhes possível..." rows={6} className="w-full p-3 border border-neutral-light-gray rounded-lg"></textarea>
          </div>
          <div className="flex justify-end">
            <Button>Enviar Chamado</Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
