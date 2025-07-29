'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CarDetails, InsuranceOffer } from '../types/simulation'
import { 
  getCarDetailsByPlate, 
  getInsuranceOffers, 
  getOfferDetails,
  SimulationError,
  ErrorType
} from '../services/mock-data'

// Query Keys
export const simulationKeys = {
  all: ['simulation'] as const,
  carDetails: (plate: string) => [...simulationKeys.all, 'car-details', plate] as const,
  offers: (carDetails: CarDetails) => [...simulationKeys.all, 'offers', carDetails] as const,
  offerDetails: (offerId: string) => [...simulationKeys.all, 'offer-details', offerId] as const,
}

// Hook para buscar detalhes do carro por placa
export function useCarDetails(licensePlate: string, enabled: boolean = true) {
  return useQuery({
    queryKey: simulationKeys.carDetails(licensePlate),
    queryFn: () => getCarDetailsByPlate(licensePlate),
    enabled: enabled && !!licensePlate,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: (failureCount, error) => {
      // Não retry em erros de validação ou placa inválida
      if (error instanceof SimulationError && 
          (error.type === ErrorType.VALIDATION_ERROR || error.type === ErrorType.INVALID_PLATE)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Hook para buscar ofertas de seguro
export function useInsuranceOffers(carDetails: CarDetails | null, enabled: boolean = true) {
  return useQuery({
    queryKey: carDetails ? simulationKeys.offers(carDetails) : ['offers-disabled'],
    queryFn: () => carDetails ? getInsuranceOffers(carDetails) : Promise.resolve([]),
    enabled: enabled && !!carDetails,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      if (error instanceof SimulationError && error.type === ErrorType.VALIDATION_ERROR) {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1500 * 2 ** attemptIndex, 30000),
  })
}

// Hook para buscar detalhes de uma oferta específica
export function useOfferDetails(offerId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: simulationKeys.offerDetails(offerId),
    queryFn: () => getOfferDetails(offerId),
    enabled: enabled && !!offerId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: (failureCount, error) => {
      if (error instanceof SimulationError && error.type === ErrorType.VALIDATION_ERROR) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Mutation para gerar ofertas de seguro baseado nos detalhes já obtidos do carro
export function useGenerateQuoteSimulation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { formData: { name: string; email: string; licensePlate: string }, carDetails: CarDetails }) => {
      // Usar os carDetails já obtidos para buscar as ofertas
      const offers = await getInsuranceOffers(data.carDetails)
      
      return { carDetails: data.carDetails, offers, formData: data.formData }
    },
    onSuccess: (data) => {
      // Popula o cache com os dados obtidos
      queryClient.setQueryData(
        simulationKeys.offers(data.carDetails),
        data.offers
      )
    },
    retry: (failureCount, error) => {
      if (error instanceof SimulationError && error.type === ErrorType.VALIDATION_ERROR) {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1500 * 2 ** attemptIndex, 15000),
  })
}

// Hook para invalidar cache de simulação
export function useInvalidateSimulation() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: simulationKeys.all }),
    invalidateCarDetails: (plate: string) => 
      queryClient.invalidateQueries({ queryKey: simulationKeys.carDetails(plate) }),
    invalidateOffers: (carDetails: CarDetails) => 
      queryClient.invalidateQueries({ queryKey: simulationKeys.offers(carDetails) }),
    clearAll: () => queryClient.removeQueries({ queryKey: simulationKeys.all }),
  }
}

// Hook para prefetch de dados
export function usePrefetchSimulation() {
  const queryClient = useQueryClient()

  return {
    prefetchCarDetails: (licensePlate: string) => {
      return queryClient.prefetchQuery({
        queryKey: simulationKeys.carDetails(licensePlate),
        queryFn: () => getCarDetailsByPlate(licensePlate),
        staleTime: 5 * 60 * 1000,
      })
    },
    prefetchOffers: (carDetails: CarDetails) => {
      return queryClient.prefetchQuery({
        queryKey: simulationKeys.offers(carDetails),
        queryFn: () => getInsuranceOffers(carDetails),
        staleTime: 2 * 60 * 1000,
      })
    },
  }
}

// Hook utilitário para gerenciar estado de loading/error
export function useSimulationState(queries: Array<{ isLoading?: boolean; isError?: boolean; error?: any }>) {
  const isLoading = queries.some(query => query.isLoading)
  const isError = queries.some(query => query.isError)
  const errors = queries.filter(query => query.isError && query.error).map(query => query.error)
  
  // Priorizar erros de validação
  const criticalError = errors.find(error => 
    error instanceof SimulationError && 
    (error.type === ErrorType.VALIDATION_ERROR || error.type === ErrorType.INVALID_PLATE)
  ) || errors[0]

  return {
    isLoading,
    isError,
    error: criticalError,
    hasErrors: errors.length > 0,
    errors,
  }
}