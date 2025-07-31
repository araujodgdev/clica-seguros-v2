'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CarDetails } from '@/lib/types/simulation'
import { 
  Car, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Edit3,
  Info
} from 'lucide-react'

interface CarDetailsConfirmationProps {
  carDetails: CarDetails
  onConfirm: () => void
  onEdit: () => void
  isLoading?: boolean
}

export function CarDetailsConfirmation({ 
  carDetails, 
  onConfirm, 
  onEdit, 
  isLoading = false 
}: CarDetailsConfirmationProps) {
  // Refs for focus management
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null)
  const editButtonRef = React.useRef<HTMLButtonElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Enhanced keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default behavior for handled keys
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault()
      onConfirm()
    } else if (e.key === 'Escape' && !isLoading) {
      e.preventDefault()
      onEdit()
    } else if (e.key === 'Tab') {
      // Allow natural tab navigation between buttons
      return
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      // Toggle focus between confirm and edit buttons
      if (document.activeElement === confirmButtonRef.current) {
        editButtonRef.current?.focus()
      } else {
        confirmButtonRef.current?.focus()
      }
    }
  }

  // Enhanced focus management for accessibility
  React.useEffect(() => {
    // Focus the confirm button when component mounts
    if (confirmButtonRef.current && !isLoading) {
      confirmButtonRef.current.focus()
    }
    
    // Announce to screen readers that car details are loaded
    const announcement = `Dados do veículo carregados: ${carDetails.make} ${carDetails.model} ${carDetails.year}`
    
    // Create temporary announcement element for screen readers
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    
    // Clean up announcement element
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }, [carDetails, isLoading])
  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div 
      className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/20 mb-4"
          >
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </motion.div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-charcoal mb-2">
            Veículo encontrado!
          </h3>
          <p className="text-sm sm:text-base text-neutral-medium-gray">
            Confirme se os dados estão corretos
          </p>
        </div>

        {/* Car Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-neutral-light-gray/50 shadow-md">
            {/* Car Icon and Main Info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-neutral-charcoal mb-1">
                  {carDetails.make} {carDetails.model}
                </h4>
                <p className="text-neutral-medium-gray text-sm">
                  Dados obtidos da base FIPE
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Year */}
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-light-gray/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Calendar className="h-5 w-5 text-neutral-medium-gray flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-medium-gray font-medium">Ano</p>
                  <p className="text-sm font-semibold text-neutral-charcoal">{carDetails.year}</p>
                </div>
              </motion.div>

              {/* FIPE Code */}
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-light-gray/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <FileText className="h-5 w-5 text-neutral-medium-gray flex-shrink-0" />
                <div>
                  <p className="text-xs text-neutral-medium-gray font-medium">Código FIPE</p>
                  <p className="text-sm font-semibold text-neutral-charcoal">{carDetails.fipeCode}</p>
                </div>
              </motion.div>

              {/* Estimated Value */}
              <motion.div
                className="col-span-1 sm:col-span-2 flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <DollarSign className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-neutral-medium-gray font-medium">Valor estimado FIPE</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(carDetails.estimatedValue)}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Info Note */}
            <motion.div
              className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                O valor FIPE é usado como referência para calcular o prêmio do seguro. 
                Valores podem variar conforme condições do veículo.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          onKeyDown={handleKeyDown}
        >
          {/* Confirm Button */}
          <Button
            ref={confirmButtonRef}
            id="confirm-button"
            onClick={onConfirm}
            size="lg"
            variant="gradient"
            className="w-full min-h-[48px]"
            disabled={isLoading}
            isLoading={isLoading}
            loadingText="Gerando cotação..."
            aria-describedby="car-details-summary"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Confirmar e continuar
          </Button>

          {/* Edit Button */}
          <Button
            ref={editButtonRef}
            onClick={onEdit}
            size="lg"
            variant="outline"
            className="w-full min-h-[48px]"
            disabled={isLoading}
            aria-label="Editar informações do veículo e voltar ao formulário anterior"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Editar informações
          </Button>

          {/* Screen reader summary */}
          <div 
            id="car-details-summary" 
            className="sr-only"
          >
            Resumo do veículo: {carDetails.make} {carDetails.model}, ano {carDetails.year}, 
            código FIPE {carDetails.fipeCode}, valor estimado {formatCurrency(carDetails.estimatedValue)}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="pt-6 border-t border-neutral-light-gray/30 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <div className="space-y-2">
            {[
              "Cotação personalizada para seu veículo",
              "Comparação entre múltiplas seguradoras",
              "Processo 100% digital e seguro"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-sm text-neutral-medium-gray"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}