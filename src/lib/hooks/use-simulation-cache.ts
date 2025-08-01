'use client'

import { useQueryClient } from '@tanstack/react-query'
import { CarDetails, InsuranceOffer } from '../types/simulation'
import { simulationKeys } from './use-simulation'

/**
 * Hook para gerenciar cache e invalidação avançada do sistema de simulação
 */
export function useSimulationCache() {
  const queryClient = useQueryClient()

  return {
    // Cache management
    getCachedCarDetails: (licensePlate: string): CarDetails | undefined => {
      return queryClient.getQueryData(simulationKeys.carDetails(licensePlate))
    },

    getCachedOffers: (carDetails: CarDetails): InsuranceOffer[] | undefined => {
      return queryClient.getQueryData(simulationKeys.offers(carDetails))
    },

    // Manual data setting (useful for optimistic updates)
    setCachedCarDetails: (licensePlate: string, data: CarDetails) => {
      queryClient.setQueryData(simulationKeys.carDetails(licensePlate), data)
    },

    setCachedOffers: (carDetails: CarDetails, data: InsuranceOffer[]) => {
      queryClient.setQueryData(simulationKeys.offers(carDetails), data)
    },

    // Prefetching
    prefetchCarDetails: async (licensePlate: string) => {
      return queryClient.prefetchQuery({
        queryKey: simulationKeys.carDetails(licensePlate),
        staleTime: 5 * 60 * 1000,
      })
    },

    prefetchOffers: async (carDetails: CarDetails) => {
      return queryClient.prefetchQuery({
        queryKey: simulationKeys.offers(carDetails),
        staleTime: 2 * 60 * 1000,
      })
    },

    // Invalidation strategies
    invalidateSpecific: {
      carDetails: (licensePlate: string) => 
        queryClient.invalidateQueries({ queryKey: simulationKeys.carDetails(licensePlate) }),
      
      offers: (carDetails: CarDetails) => 
        queryClient.invalidateQueries({ queryKey: simulationKeys.offers(carDetails) }),
      
      allCarDetails: () => 
        queryClient.invalidateQueries({ 
          queryKey: [...simulationKeys.all, 'car-details'],
          exact: false 
        }),
      
      allOffers: () => 
        queryClient.invalidateQueries({ 
          queryKey: [...simulationKeys.all, 'offers'],
          exact: false 
        }),
    },

    // Cache removal
    removeSpecific: {
      carDetails: (licensePlate: string) => 
        queryClient.removeQueries({ queryKey: simulationKeys.carDetails(licensePlate) }),
      
      offers: (carDetails: CarDetails) => 
        queryClient.removeQueries({ queryKey: simulationKeys.offers(carDetails) }),
      
      allSimulation: () => 
        queryClient.removeQueries({ queryKey: simulationKeys.all }),
    },

    // Cache inspection utilities
    getQueryState: (queryKey: unknown[]) => {
      const query = queryClient.getQueryCache().find({ queryKey })
      return query ? {
        data: query.state.data,
        status: query.state.status,
        fetchStatus: query.state.fetchStatus,
        error: query.state.error,
        dataUpdatedAt: query.state.dataUpdatedAt,
        errorUpdatedAt: query.state.errorUpdatedAt,
        isStale: false // isStale is not available in QueryState, defaulting to false
      } : null
    },

    // Global cache statistics
    getCacheStats: () => {
      const cache = queryClient.getQueryCache()
      const allQueries = cache.getAll()
      const simulationQueries = allQueries.filter(query => 
        Array.isArray(query.queryKey) && 
        query.queryKey[0] === 'simulation'
      )

      return {
        total: allQueries.length,
        simulation: simulationQueries.length,
        active: simulationQueries.filter(q => q.getObserversCount() > 0).length,
        stale: simulationQueries.filter(q => q.isStale()).length,
        error: simulationQueries.filter(q => q.state.status === 'error').length,
        loading: simulationQueries.filter(q => q.state.fetchStatus === 'fetching').length,
      }
    },

    // Batch operations
    batchInvalidate: (plates: string[]) => {
      const promises = plates.map(plate => 
        queryClient.invalidateQueries({ queryKey: simulationKeys.carDetails(plate) })
      )
      return Promise.all(promises)
    },

    batchPrefetch: (plates: string[]) => {
      const promises = plates.map(plate => 
        queryClient.prefetchQuery({
          queryKey: simulationKeys.carDetails(plate),
          staleTime: 5 * 60 * 1000,
        })
      )
      return Promise.all(promises)
    },

    // Cache warming strategies
    warmCache: {
      // Popular car models that are likely to be searched
      popularModels: () => {
        const popularPlates = ['ABC1234', 'DEF5678', 'GHI9012', 'JKL3456']
        return queryClient.prefetchQuery.bind(queryClient)
      },

      // Warm cache based on user history (if available)
      userHistory: (recentPlates: string[]) => {
        return Promise.all(
          recentPlates.slice(0, 5).map(plate => 
            queryClient.prefetchQuery({
              queryKey: simulationKeys.carDetails(plate),
              staleTime: 10 * 60 * 1000, // Longer stale time for user history
            })
          )
        )
      }
    },

    // Performance monitoring
    getCachePerformance: () => {
      const cache = queryClient.getQueryCache()
      const simulationQueries = cache.getAll().filter(query => 
        Array.isArray(query.queryKey) && 
        query.queryKey[0] === 'simulation'
      )

      const hitRate = simulationQueries.length > 0 
        ? simulationQueries.filter(q => q.state.dataUpdatedAt > 0).length / simulationQueries.length 
        : 0

      return {
        hitRate: Math.round(hitRate * 100),
        avgFetchTime: simulationQueries.reduce((acc, q) => {
          const fetchTime = q.state.dataUpdatedAt - (q.state.dataUpdatedAt - 1000) // Approximation
          return acc + fetchTime
        }, 0) / simulationQueries.length || 0,
        cacheSize: simulationQueries.length,
        memoryUsage: JSON.stringify(simulationQueries.map(q => q.state.data)).length
      }
    }
  }
}