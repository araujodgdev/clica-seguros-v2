'use client'

import { motion } from 'framer-motion'
import { Users, BarChart3, TrendingUp, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statsCards = [
  {
    title: 'Total de Clientes',
    value: '1,247',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    description: 'vs. mês anterior'
  },
  {
    title: 'Cotações Ativas',
    value: '89',
    change: '+8%',
    changeType: 'positive' as const,
    icon: BarChart3,
    description: 'este mês'
  },
  {
    title: 'Taxa de Conversão',
    value: '23.4%',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'última semana'
  },
  {
    title: 'Visualizações',
    value: '5,732',
    change: '-3%',
    changeType: 'negative' as const,
    icon: Eye,
    description: 'hoje'
  }
]

const recentActivity = [
  {
    id: 1,
    user: 'Ana Silva',
    action: 'Nova cotação criada',
    time: 'há 2 minutos',
    status: 'active'
  },
  {
    id: 2,
    user: 'Bruno Costa',
    action: 'Perfil atualizado',
    time: 'há 15 minutos',
    status: 'completed'
  },
  {
    id: 3,
    user: 'Carla Dias',
    action: 'Cotação aprovada',
    time: 'há 1 hora',
    status: 'completed'
  }
]

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-neutral-charcoal mb-2">Dashboard</h1>
        <p className="text-neutral-medium-gray">
          Visão geral do seu sistema de seguros
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="bg-white rounded-card p-6 border border-neutral-light-gray/50 shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-button bg-primary/10">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <Badge 
                variant={card.changeType === 'positive' ? 'success' : 'destructive'}
                size="sm"
              >
                {card.change}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-neutral-charcoal mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-neutral-medium-gray">{card.title}</p>
            <p className="text-xs text-neutral-medium-gray mt-1">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-white rounded-card p-6 border border-neutral-light-gray/50 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-charcoal">Atividade Recente</h2>
          <Button variant="ghost" size="sm">
            Ver todas
          </Button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-button hover:bg-neutral-light-gray/30 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.8 }}
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'active' ? 'bg-primary' : 'bg-neutral-medium-gray'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-charcoal">
                  {activity.user}
                </p>
                <p className="text-xs text-neutral-medium-gray">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-neutral-medium-gray">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
