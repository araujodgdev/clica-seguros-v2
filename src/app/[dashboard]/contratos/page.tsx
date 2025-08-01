
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Shield, Search, Bell, X } from 'lucide-react'
import { useState } from 'react'

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
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-charcoal">Meus Contratos</h1>
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
