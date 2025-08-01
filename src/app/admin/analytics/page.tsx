'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, FileText, DollarSign, BarChart2 } from 'lucide-react'

// Placeholder for a chart component
const ChartPlaceholder = ({ title, height = 'h-64' }: { title: string; height?: string }) => (
  <div className={`bg-white rounded-card p-6 border border-neutral-light-gray/50 shadow-sm ${height}`}>
    <h3 className="text-lg font-semibold text-neutral-charcoal mb-4">{title}</h3>
    <div className="flex items-end justify-center h-full pb-6">
      <div className="w-full h-full bg-neutral-light-gray/30 rounded-lg flex items-center justify-center">
        <BarChart2 className="w-16 h-16 text-neutral-medium-gray/50" />
      </div>
    </div>
  </div>
)

export default function AnalyticsPage() {
  const analyticsCards = [
    { title: 'Receita Total', value: 'R$ 152.789', change: '+15.2%', icon: DollarSign },
    { title: 'Novos Clientes (Mês)', value: '184', change: '+8%', icon: Users },
    { title: 'Apólices Emitidas', value: '212', change: '+20%', icon: FileText },
    { title: 'Taxa de Renovação', value: '82%', change: '-1.5%', icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-neutral-charcoal mb-2">Analytics</h1>
        <p className="text-neutral-medium-gray">
          Métricas de desempenho e insights da plataforma.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {analyticsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="bg-white rounded-card p-6 border border-neutral-light-gray/50 shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-medium-gray">{card.title}</h3>
              <card.icon className="w-5 h-5 text-neutral-medium-gray" />
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-charcoal">{card.value}</p>
              <p className={`text-sm font-semibold ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {card.change} vs. período anterior
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ChartPlaceholder title="Crescimento de Clientes (Últimos 6 meses)" />
        <ChartPlaceholder title="Funil de Conversão de Cotações" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ChartPlaceholder title="Receita Mensal Recorrente (MRR)" height="h-80" />
      </motion.div>
    </div>
  )
}
