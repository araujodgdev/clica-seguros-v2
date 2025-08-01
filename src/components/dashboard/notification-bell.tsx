'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const notifications = [
    { id: 1, text: "Novo desconto disponível!", time: "2 min", isNew: true },
    { id: 2, text: "Sua cotação está pronta", time: "1h", isNew: true },
    { id: 3, text: "Lembrete: renovação em 30 dias", time: "2h", isNew: false },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])
  
  return (
    <div className="relative" ref={containerRef}>
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
            className="absolute right-0 top-12 w-80 rounded-2xl bg-white p-4 shadow-xl z-50"
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