'use client'

import { motion } from 'framer-motion'
import { Search, Plus, Filter, Download, MoreHorizontal, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const mockClients = [
  {
    id: 'USR-001',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    status: 'Ativo',
    signedUp: '2023-10-26',
    cotacoes: 3,
    avatar: 'AS'
  },
  {
    id: 'USR-002',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    status: 'Inativo',
    signedUp: '2023-10-25',
    cotacoes: 1,
    avatar: 'BC'
  },
  {
    id: 'USR-003',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    status: 'Ativo',
    signedUp: '2023-10-24',
    cotacoes: 5,
    avatar: 'CD'
  },
  {
    id: 'USR-004',
    name: 'Daniel Martins',
    email: 'daniel.martins@example.com',
    status: 'Ativo',
    signedUp: '2023-10-23',
    cotacoes: 2,
    avatar: 'DM'
  },
  {
    id: 'USR-005',
    name: 'Eduarda Ferreira',
    email: 'eduarda.ferreira@example.com',
    status: 'Pendente',
    signedUp: '2023-10-22',
    cotacoes: 0,
    avatar: 'EF'
  },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Ativo':
      return 'success'
    case 'Inativo':
      return 'destructive'
    case 'Pendente':
      return 'secondary'
    default:
      return 'default'
  }
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-neutral-charcoal mb-2">Clientes</h1>
          <p className="text-neutral-medium-gray">
            Gerencie todos os clientes da plataforma
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium-gray w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-light-gray rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-card border border-neutral-light-gray/50 shadow-sm"
      >
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-light-gray/30">
            <thead className="bg-neutral-light-gray/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-dark-gray uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-dark-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-dark-gray uppercase tracking-wider">
                  Cotações
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-dark-gray uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-dark-gray uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-light-gray/20">
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  className="hover:bg-neutral-light-gray/20 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {client.avatar}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-charcoal">
                          {client.name}
                        </p>
                        <p className="text-xs text-neutral-medium-gray">
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(client.status)} size="sm">
                      {client.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-charcoal">
                      {client.cotacoes}
                    </span>
                    <span className="text-xs text-neutral-medium-gray ml-1">
                      cotações
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-medium-gray">
                    {new Date(client.signedUp).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
            {filteredClients.map((client, index) => (
                <motion.div
                key={client.id}
                className="bg-white rounded-lg p-4 border border-neutral-light-gray/50 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                        {client.avatar}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-neutral-charcoal">
                        {client.name}
                        </p>
                        <p className="text-xs text-neutral-medium-gray">
                        {client.email}
                        </p>
                    </div>
                    </div>
                    <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                    <p className="text-xs text-neutral-medium-gray mb-1">Status</p>
                    <Badge variant={getStatusVariant(client.status)} size="sm">
                        {client.status}
                    </Badge>
                    </div>
                    <div>
                    <p className="text-xs text-neutral-medium-gray mb-1">Cotações</p>
                    <p className="font-medium text-neutral-charcoal">{client.cotacoes}</p>
                    </div>
                    <div className="col-span-2">
                    <p className="text-xs text-neutral-medium-gray mb-1">Data de Cadastro</p>
                    <p className="font-medium text-neutral-charcoal">{new Date(client.signedUp).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                </motion.div>
            ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-neutral-medium-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-charcoal mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-neutral-medium-gray">
              Tente ajustar os filtros de busca ou adicione um novo cliente.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center justify-between text-sm text-neutral-medium-gray"
      >
        <span>
          Mostrando {filteredClients.length} de {mockClients.length} clientes
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Próxima
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
