'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  Search, 
  Shield, 
  Calculator, 
  CheckCircle, 
  Sparkles,
  TrendingDown,
  Clock,
  Award
} from 'lucide-react'

interface LoadingStateProps {
  onComplete: () => void
  duration?: number // Duration in milliseconds (default: 4000ms)
  onError?: (error: Error) => void
  onRetry?: () => void
  maxRetries?: number
  isLoading?: boolean // Para integração com TanStack Query
  error?: Error | null // Erro real do TanStack Query
  isSuccess?: boolean // Status de sucesso do TanStack Query
}

interface LoadingMessage {
  icon: React.ReactNode
  title: string
  description: string
  duration: number // Duration to show this message in milliseconds
}

export function LoadingState({ 
  onComplete, 
  duration = 4000, 
  onError, 
  onRetry, 
  maxRetries = 3,
  isLoading = true,
  error = null,
  isSuccess = false
}: LoadingStateProps) {
  const [progress, setProgress] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Refs for accessibility
  const containerRef = React.useRef<HTMLDivElement>(null)
  const retryButtonRef = React.useRef<HTMLButtonElement>(null)
  const progressRef = React.useRef<HTMLDivElement>(null)

  // Motivational messages that change during loading
  const loadingMessages: LoadingMessage[] = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Analisando seu perfil",
      description: "Buscando as melhores opções de seguro para você",
      duration: 1200
    },
    {
      icon: <Calculator className="h-6 w-6 text-blue-500" />,
      title: "Calculando cotações",
      description: "Comparando preços entre múltiplas seguradoras",
      duration: 1000
    },
    {
      icon: <TrendingDown className="h-6 w-6 text-green-500" />,
      title: "Encontrando descontos",
      description: "Aplicando ofertas especiais e promoções disponíveis",
      duration: 800
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Verificando coberturas",
      description: "Garantindo a melhor proteção para seu veículo",
      duration: 1000
    }
  ]

  // Monitor TanStack Query status
  useEffect(() => {
    if (error && !hasError) {
      setHasError(true)
      setErrorMessage(error.message || 'Erro durante o processamento')
      if (onError) {
        onError(error)
      }
    }
    
    if (isSuccess && !isComplete) {
      setIsComplete(true)
      setProgress(100)
      setTimeout(() => {
        onComplete()
      }, 500)
    }
  }, [error, isSuccess, hasError, isComplete, onError, onComplete])

  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true)
      setHasError(false)
      setErrorMessage('')
      setProgress(0)
      setCurrentMessageIndex(0)
      setIsComplete(false)
      
      // Brief delay before retrying
      setTimeout(() => {
        setIsRetrying(false)
        setRetryCount(prev => prev + 1)
      }, 1000)
    }
  }

  useEffect(() => {
    // Reset states when retrying
    if (isRetrying) return

    const totalDuration = duration
    const progressInterval = 50 // Update progress every 50ms for smooth animation
    const progressIncrement = 100 / (totalDuration / progressInterval)

    // Error handling is now managed by TanStack Query integration

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressIncrement
        
        // Skip error simulation - errors are now handled by TanStack Query integration
        
        if (newProgress >= 100) {
          clearInterval(progressTimer)
          setIsComplete(true)
          // Complete after a brief delay to show 100% progress
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return newProgress
      })
    }, progressInterval)

    // Message rotation logic
    let messageTimer: NodeJS.Timeout
    let currentTime = 0
    let messageIndex = 0

    const rotateMessages = () => {
      if (messageIndex < loadingMessages.length - 1 && !hasError) {
        currentTime += loadingMessages[messageIndex].duration
        if (currentTime < totalDuration) {
          messageIndex++
          setCurrentMessageIndex(messageIndex)
          messageTimer = setTimeout(rotateMessages, loadingMessages[messageIndex].duration)
        }
      }
    }

    // Start message rotation
    messageTimer = setTimeout(rotateMessages, loadingMessages[0].duration)

    return () => {
      clearInterval(progressTimer)
      clearTimeout(messageTimer)
    }
  }, [duration, onComplete, onError, isRetrying, retryCount])

  const currentMessage = loadingMessages[currentMessageIndex]

  // Enhanced focus management for accessibility
  React.useEffect(() => {
    // Focus the container for screen reader announcement
    if (containerRef.current) {
      containerRef.current.focus()
    }
    
    // Focus retry button when error occurs
    if (hasError && retryButtonRef.current) {
      retryButtonRef.current.focus()
    }
  }, [hasError])

  return (
    <GlassCard 
      variant="colored" 
      padding="lg" 
      rounded="lg" 
      shadow="xl"
      className="w-full mx-auto px-4"
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
        tabIndex={-1}
        role="status"
        aria-live="polite"
        aria-label="Processamento de cotação em andamento"
      >
        {/* Loading Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-6 sm:mb-8"
          animate={{ 
            rotate: isComplete ? 0 : 360,
            scale: isComplete ? 1.1 : 1
          }}
          transition={{ 
            rotate: { 
              duration: 2, 
              repeat: isComplete ? 0 : Infinity, 
              ease: "linear" 
            },
            scale: { 
              duration: 0.3 
            }
          }}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-10 w-10 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="h-10 w-10 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-neutral-charcoal" id="progress-label">
              {Math.round(progress)}%
            </span>
            <div className="flex items-center gap-1 text-xs text-neutral-medium-gray">
              <Clock className="h-3 w-3" />
              <span>
                {isComplete ? 'Concluído!' : `${Math.ceil((duration - (progress * duration / 100)) / 1000)}s`}
              </span>
            </div>
          </div>
          
          <div 
            className="w-full bg-neutral-light-gray/30 rounded-full h-3 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-labelledby="progress-label"
            aria-describedby="progress-description"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-green-500 to-primary rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </div>
          
          {/* Screen reader description */}
          <div id="progress-description" className="sr-only">
            Processamento da cotação {Math.round(progress)}% concluído. 
            {isComplete ? 'Processamento finalizado.' : `Tempo restante estimado: ${Math.ceil((duration - (progress * duration / 100)) / 1000)} segundos.`}
          </div>
        </div>

        {/* Dynamic Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {currentMessage.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-charcoal">
                {currentMessage.title}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-neutral-medium-gray">
              {currentMessage.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Benefits/Features */}
        <motion.div
          className="space-y-3 pt-6 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { icon: <Award className="h-4 w-4" />, text: "Até 40% de economia" },
            { icon: <Shield className="h-4 w-4" />, text: "Cobertura completa" },
            { icon: <Clock className="h-4 w-4" />, text: "Ativação em 24h" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center gap-2 text-sm text-neutral-medium-gray"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <span className="text-green-500">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <div className="flex items-center justify-center gap-2 text-red-700 mb-3">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-semibold">Erro no processamento</span>
              </div>
              <p className="text-sm text-red-600 mb-4 text-center">
                {errorMessage}
              </p>
              {retryCount < maxRetries && onRetry && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    ref={retryButtonRef}
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-describedby="retry-status"
                    aria-label={`Tentar novamente o processamento da cotação. Tentativa ${retryCount + 1} de ${maxRetries}`}
                  >
                    {isRetrying ? 'Tentando novamente...' : 'Tentar novamente'}
                  </button>
                  <p id="retry-status" className="text-xs text-red-500">
                    Tentativa {retryCount + 1} de {maxRetries}
                  </p>
                </div>
              )}
              {retryCount >= maxRetries && (
                <div className="text-center">
                  <p className="text-sm text-red-600 mb-2">
                    Máximo de tentativas atingido.
                  </p>
                  <p className="text-xs text-red-500">
                    Tente reiniciar a simulação ou verifique sua conexão.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Message */}
        <AnimatePresence>
          {isComplete && !hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200"
            >
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Cotações encontradas!</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Redirecionando para seus resultados...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GlassCard>
  )
}