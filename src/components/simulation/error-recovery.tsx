'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Wifi, 
  Clock,
  Server,
  Shield
} from 'lucide-react'
import { SimulationError, ErrorType } from '@/lib/services/mock-data'

interface ErrorRecoveryProps {
  error: Error | SimulationError | string
  onRetry?: () => void
  onReset?: () => void
  onGoHome?: () => void
  retryCount?: number
  maxRetries?: number
  showRetryButton?: boolean
  showResetButton?: boolean
  showHomeButton?: boolean
  className?: string
}

interface ErrorInfo {
  icon: React.ReactNode
  title: string
  description: string
  suggestions: string[]
  color: string
  retryable: boolean
}

export function ErrorRecovery({
  error,
  onRetry,
  onReset,
  onGoHome,
  retryCount = 0,
  maxRetries = 3,
  showRetryButton = true,
  showResetButton = true,
  showHomeButton = false,
  className = ''
}: ErrorRecoveryProps) {
  
  // Determine error information based on error type
  const getErrorInfo = (error: Error | SimulationError | string): ErrorInfo => {
    if (error instanceof SimulationError) {
      switch (error.type) {
        case ErrorType.NETWORK_ERROR:
          return {
            icon: <Wifi className="h-8 w-8" />,
            title: 'Erro de Conexão',
            description: error.userFriendlyMessage || 'Problema de conectividade detectado.',
            suggestions: [
              'Verifique sua conexão com a internet',
              'Tente novamente em alguns segundos',
              'Se o problema persistir, recarregue a página'
            ],
            color: 'text-blue-500',
            retryable: error.retryable
          }
        
        case ErrorType.TIMEOUT_ERROR:
          return {
            icon: <Clock className="h-8 w-8" />,
            title: 'Tempo Limite Excedido',
            description: error.userFriendlyMessage || 'A operação demorou mais que o esperado.',
            suggestions: [
              'Sua conexão pode estar lenta',
              'Tente novamente',
              'Verifique se há problemas com sua internet'
            ],
            color: 'text-orange-500',
            retryable: error.retryable
          }
        
        case ErrorType.SERVER_ERROR:
          return {
            icon: <Server className="h-8 w-8" />,
            title: 'Erro do Servidor',
            description: error.userFriendlyMessage || 'Nossos servidores estão temporariamente indisponíveis.',
            suggestions: [
              'Este é um problema temporário',
              'Tente novamente em alguns instantes',
              'Nossa equipe já foi notificada'
            ],
            color: 'text-red-500',
            retryable: error.retryable
          }
        
        case ErrorType.RATE_LIMIT:
          return {
            icon: <Shield className="h-8 w-8" />,
            title: 'Muitas Tentativas',
            description: error.userFriendlyMessage || 'Aguarde alguns segundos antes de tentar novamente.',
            suggestions: [
              'Aguarde alguns segundos',
              'Evite clicar múltiplas vezes',
              'Tente novamente após a pausa'
            ],
            color: 'text-yellow-500',
            retryable: error.retryable
          }
        
        case ErrorType.INVALID_PLATE:
          return {
            icon: <AlertTriangle className="h-8 w-8" />,
            title: 'Placa Não Encontrada',
            description: error.userFriendlyMessage || 'Não encontramos informações para esta placa.',
            suggestions: [
              'Verifique se digitou a placa corretamente',
              'Certifique-se de usar o formato ABC-1234 ou ABC1D23',
              'Tente novamente com a placa correta'
            ],
            color: 'text-amber-500',
            retryable: error.retryable
          }
        
        case ErrorType.VALIDATION_ERROR:
          return {
            icon: <AlertTriangle className="h-8 w-8" />,
            title: 'Dados Inválidos',
            description: error.userFriendlyMessage || 'Alguns dados fornecidos são inválidos.',
            suggestions: [
              'Verifique os dados inseridos',
              'Certifique-se de preencher todos os campos',
              'Use formatos válidos para email e placa'
            ],
            color: 'text-red-500',
            retryable: false
          }
        
        default:
          return {
            icon: <AlertTriangle className="h-8 w-8" />,
            title: 'Erro Inesperado',
            description: error.userFriendlyMessage || error.message,
            suggestions: [
              'Tente novamente',
              'Se o problema persistir, recarregue a página',
              'Entre em contato conosco se necessário'
            ],
            color: 'text-red-500',
            retryable: error.retryable
          }
      }
    }
    
    // Handle regular Error objects
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: 'Algo deu errado',
      description: errorMessage,
      suggestions: [
        'Tente novamente',
        'Verifique sua conexão',
        'Se o problema persistir, recarregue a página'
      ],
      color: 'text-red-500',
      retryable: true
    }
  }

  const errorInfo = getErrorInfo(error)
  const canRetry = showRetryButton && errorInfo.retryable && retryCount < maxRetries && onRetry
  const hasReachedMaxRetries = retryCount >= maxRetries

  return (
    <GlassCard 
      variant="colored" 
      padding="lg" 
      rounded="lg" 
      shadow="xl"
      className={`w-full mx-auto ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Error Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-50 mb-6 ${errorInfo.color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {errorInfo.icon}
        </motion.div>

        {/* Error Title */}
        <motion.h3
          className="text-xl font-bold text-neutral-charcoal mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {errorInfo.title}
        </motion.h3>

        {/* Error Description */}
        <motion.p
          className="text-neutral-medium-gray mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {errorInfo.description}
        </motion.p>

        {/* Suggestions */}
        <motion.div
          className="mb-6 text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-semibold text-neutral-charcoal mb-3 text-center">
            O que você pode fazer:
          </h4>
          <ul className="space-y-2">
            {errorInfo.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 text-sm text-neutral-medium-gray"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="text-primary mt-1">•</span>
                <span>{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Retry Information */}
        {retryCount > 0 && (
          <motion.div
            className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-yellow-700">
              {hasReachedMaxRetries 
                ? `Máximo de tentativas atingido (${maxRetries})`
                : `Tentativa ${retryCount} de ${maxRetries}`
              }
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Retry Button */}
          {canRetry && (
            <Button
              onClick={onRetry}
              size="lg"
              variant="gradient"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          )}

          {/* Reset Button */}
          {showResetButton && onReset && (
            <Button
              onClick={onReset}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Reiniciar simulação
            </Button>
          )}

          {/* Home Button */}
          {showHomeButton && onGoHome && (
            <Button
              onClick={onGoHome}
              size="lg"
              variant="outline"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar ao início
            </Button>
          )}

          {/* Max retries reached message */}
          {hasReachedMaxRetries && !showResetButton && (
            <div className="text-center">
              <p className="text-sm text-neutral-medium-gray mb-3">
                Se o problema persistir, tente recarregar a página ou entre em contato conosco.
              </p>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Recarregar página
              </Button>
            </div>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mt-6 pt-4 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-neutral-medium-gray">
            Precisa de ajuda? Entre em contato conosco pelo chat ou email.
          </p>
        </motion.div>
      </motion.div>
    </GlassCard>
  )
}