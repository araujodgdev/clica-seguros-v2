'use client'

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FormData, CarDetails } from '@/lib/types/simulation'
import { SimulationError, ErrorType } from '@/lib/services/mock-data'
import { NavigationService } from '@/lib/services/navigation'
import { 
  useCarDetails, 
  useGenerateQuoteSimulation, 
  useInvalidateSimulation,
  useSimulationState 
} from '@/lib/hooks/use-simulation'

// Lazy load components for better performance
const InitialForm = lazy(() => import('./initial-form').then(mod => ({ default: mod.InitialForm })))
const CarDetailsConfirmation = lazy(() => import('./car-details-confirmation').then(mod => ({ default: mod.CarDetailsConfirmation })))
const LoadingState = lazy(() => import('./loading-state').then(mod => ({ default: mod.LoadingState })))
const ErrorRecovery = lazy(() => import('./error-recovery').then(mod => ({ default: mod.ErrorRecovery })))

// Loading fallback component
const ComponentLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Step enumeration for better type safety
enum SimulationStep {
  INITIAL_FORM = 1,
  CAR_DETAILS_CONFIRMATION = 2,
  LOADING = 3
}

interface SimulationFormProps {
  onComplete?: (data: FormData & { carDetails: CarDetails }) => void
  className?: string
}

interface SimulationState {
  currentStep: SimulationStep
  formData: FormData | null
  navigationAttempts: number
}

export function SimulationForm({ onComplete, className = '' }: SimulationFormProps) {
  const router = useRouter()
  
  // Main state management for the simulation flow
  const [state, setState] = useState<SimulationState>({
    currentStep: SimulationStep.INITIAL_FORM,
    formData: null,
    navigationAttempts: 0
  })

  // TanStack Query hooks
  const carDetailsQuery = useCarDetails(
    state.formData?.licensePlate || '', 
    state.currentStep >= SimulationStep.CAR_DETAILS_CONFIRMATION && !!state.formData?.licensePlate
  )
  
  const generateQuoteMutation = useGenerateQuoteSimulation()
  const { invalidateAll } = useInvalidateSimulation()

  // Combined state management
  const simulationState = useSimulationState([carDetailsQuery, generateQuoteMutation])

  // Handle initial form submission with TanStack Query
  const handleInitialFormSubmit = useCallback(async (formData: FormData) => {
    setState(prev => ({
      ...prev,
      formData,
      navigationAttempts: 0
    }))

    // Trigger car details fetch automatically via the enabled condition in useCarDetails
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentStep: SimulationStep.CAR_DETAILS_CONFIRMATION
      }))
    }, 100) // Small delay to ensure state is updated before query runs
  }, [])

  // Handle car details confirmation
  const handleCarDetailsConfirm = useCallback(() => {
    if (state.formData && carDetailsQuery.data) {
      // Trigger the offers generation mutation with the car details already obtained
      generateQuoteMutation.mutate({
        formData: state.formData,
        carDetails: carDetailsQuery.data
      })
      
      setState(prev => ({
        ...prev,
        currentStep: SimulationStep.LOADING
      }))
    }
  }, [state.formData, carDetailsQuery.data, generateQuoteMutation])

  // Handle edit request (go back to initial form)
  const handleEditRequest = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: SimulationStep.INITIAL_FORM
    }))
    
    // Invalidate and clear queries when editing
    invalidateAll()
  }, [invalidateAll])

  // Handle loading completion and redirect using TanStack Query data
  const handleLoadingComplete = useCallback(async () => {
    if (state.formData && generateQuoteMutation.data) {
      const { carDetails } = generateQuoteMutation.data
      const maxRetries = 3
      let currentAttempt = state.navigationAttempts + 1

      try {
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete({
            ...state.formData,
            carDetails
          })
        }

        // Update navigation attempts
        setState(prev => ({
          ...prev,
          navigationAttempts: currentAttempt
        }))

        // Create URL for quote results page using NavigationService
        const quoteResultsUrl = NavigationService.createQuoteResultsUrl(state.formData, carDetails)

        // Use NavigationService for enhanced navigation with retry logic
        const navigationSuccess = await NavigationService.navigateWithRetry(
          router,
          quoteResultsUrl,
          {
            retries: maxRetries - currentAttempt + 1,
            onRetry: (attempt) => {
              setState(prev => ({
                ...prev,
                navigationAttempts: currentAttempt + attempt - 1
              }))
            },
            onError: (error, attempt) => {
              console.warn(`Navigation attempt ${attempt} failed:`, error)
            }
          }
        )

        if (navigationSuccess) {
          // Set navigation session for tracking
          NavigationService.setNavigationSession({
            page: 'cotacao',
            timestamp: Date.now(),
            formData: state.formData,
            carDetails
          })

          // Reset navigation attempts on successful navigation
          setState(prev => ({
            ...prev,
            navigationAttempts: 0
          }))
        } else {
          throw new Error('Falha na navegação após múltiplas tentativas')
        }
        
      } catch (error) {
        console.error('Navigation error:', error)
        
        if (currentAttempt < maxRetries) {
          // Retry navigation after exponential backoff delay
          const retryDelay = Math.min(1000 * Math.pow(2, currentAttempt - 1), 5000)
          
          setTimeout(() => {
            handleLoadingComplete()
          }, retryDelay)
        } else {
          // Max retries reached - let the error boundary handle it
          generateQuoteMutation.reset()
        }
      }
    }
  }, [state.formData, generateQuoteMutation.data, state.navigationAttempts, onComplete, router, generateQuoteMutation])

  // Handle retry for errors
  const handleRetry = useCallback(() => {
    if (state.formData) {
      // Reset mutations and refetch
      generateQuoteMutation.reset()
      carDetailsQuery.refetch()
      handleInitialFormSubmit(state.formData)
    } else {
      setState(prev => ({
        ...prev,
        currentStep: SimulationStep.INITIAL_FORM
      }))
      invalidateAll()
    }
  }, [state.formData, generateQuoteMutation, carDetailsQuery, handleInitialFormSubmit, invalidateAll])

  // Enhanced browser back button navigation with proper history management
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if we have state data from the history
      const historyState = event.state
      
      if (historyState && historyState.step) {
        // Restore state from history
        setState(prev => ({
          ...prev,
          currentStep: historyState.step,
          formData: historyState.formData || prev.formData,
          navigationAttempts: 0
        }))
      } else {
        // If no history state or user navigates back during simulation, reset to initial form
        if (state.currentStep !== SimulationStep.INITIAL_FORM) {
          setState(prev => ({
            ...prev,
            currentStep: SimulationStep.INITIAL_FORM,
            navigationAttempts: 0
          }))
          invalidateAll()
        }
      }
    }

    // Add event listener for browser back/forward navigation
    window.addEventListener('popstate', handlePopState)

    // Cleanup event listener
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [state.currentStep, invalidateAll])

  // Enhanced history state management for better back button support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      const stateData = {
        step: state.currentStep,
        formData: state.formData,
        timestamp: Date.now()
      }
      
      // Push new history entry when moving forward in steps
      if (state.currentStep === SimulationStep.CAR_DETAILS_CONFIRMATION && carDetailsQuery.data) {
        window.history.pushState(stateData, '', currentUrl)
      } else if (state.currentStep === SimulationStep.LOADING) {
        window.history.pushState(stateData, '', currentUrl)
      } else if (state.currentStep === SimulationStep.INITIAL_FORM) {
        // Replace state for initial form to avoid duplicate entries
        window.history.replaceState(stateData, '', currentUrl)
      }
    }
  }, [state.currentStep, state.formData, carDetailsQuery.data])

  // Handle page visibility changes to manage navigation state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible again, check if we need to reset state
        if (state.currentStep === SimulationStep.LOADING && state.navigationAttempts > 0) {
          // If we were in loading state and had navigation attempts, reset mutation
          generateQuoteMutation.reset()
          setState(prev => ({
            ...prev,
            navigationAttempts: 0
          }))
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [state.currentStep, state.navigationAttempts, generateQuoteMutation])

  // Animation variants for step transitions
  const stepVariants = {
    enter: {
      opacity: 0,
      x: 50,
      scale: 0.95
    },
    center: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.95
    }
  }

  // Handle reset simulation
  const handleReset = useCallback(() => {
    setState({
      currentStep: SimulationStep.INITIAL_FORM,
      formData: null,
      navigationAttempts: 0
    })
    
    // Reset all queries and mutations
    generateQuoteMutation.reset()
    invalidateAll()
  }, [generateQuoteMutation, invalidateAll])

  return (
    <div className={`relative ${className}`}>
      {/* Error State - now using TanStack Query error state */}
      {simulationState.isError && simulationState.error && (
        <Suspense fallback={<ComponentLoading />}>
          <ErrorRecovery
            error={simulationState.error.userFriendlyMessage || simulationState.error.message || 'Erro desconhecido'}
            onRetry={handleRetry}
            onReset={handleReset}
            retryCount={state.navigationAttempts}
            maxRetries={3}
            showRetryButton={true}
            showResetButton={true}
          />
        </Suspense>
      )}

      {/* Main Simulation Flow */}
      {!simulationState.isError && (
        <AnimatePresence mode="wait">
          {/* Step 1: Initial Form */}
          {state.currentStep === SimulationStep.INITIAL_FORM && (
            <motion.div
              key="initial-form"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Suspense fallback={<ComponentLoading />}>
                <InitialForm
                  onSubmit={handleInitialFormSubmit}
                  isLoading={carDetailsQuery.isFetching}
                />
              </Suspense>
            </motion.div>
          )}

          {/* Step 2: Car Details Confirmation */}
          {state.currentStep === SimulationStep.CAR_DETAILS_CONFIRMATION && carDetailsQuery.data && (
            <motion.div
              key="car-details-confirmation"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Suspense fallback={<ComponentLoading />}>
                <CarDetailsConfirmation
                  carDetails={carDetailsQuery.data}
                  onConfirm={handleCarDetailsConfirm}
                  onEdit={handleEditRequest}
                  isLoading={generateQuoteMutation.isPending}
                />
              </Suspense>
            </motion.div>
          )}

          {/* Step 3: Loading State */}
          {state.currentStep === SimulationStep.LOADING && (
            <motion.div
              key="loading-state"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Suspense fallback={<ComponentLoading />}>
                <LoadingState
                  onComplete={handleLoadingComplete}
                  duration={4000}
                  onError={(error) => {
                    generateQuoteMutation.reset()
                  }}
                  onRetry={() => {
                    if (state.formData && carDetailsQuery.data) {
                      generateQuoteMutation.mutate({
                        formData: state.formData,
                        carDetails: carDetailsQuery.data
                      })
                    }
                  }}
                  maxRetries={3}
                  isLoading={generateQuoteMutation.isPending}
                  error={generateQuoteMutation.error}
                  isSuccess={generateQuoteMutation.isSuccess}
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Step Indicator (optional visual feedback) */}
      {!simulationState.isError && (
        <motion.div
          className="flex justify-center mt-6 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === state.currentStep
                  ? 'bg-primary scale-125'
                  : step < state.currentStep
                  ? 'bg-green-500'
                  : 'bg-neutral-light-gray'
              }`}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}