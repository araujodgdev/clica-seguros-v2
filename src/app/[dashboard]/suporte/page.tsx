
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LifeBuoy, MessageCircle, Phone, FileText, Search, Bell, X } from 'lucide-react'
import { useState } from 'react'

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
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-charcoal">Central de Suporte</h1>
          <p className="text-md md:text-lg text-neutral-medium-gray mt-2">Como podemos ajudar você hoje?</p>
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
