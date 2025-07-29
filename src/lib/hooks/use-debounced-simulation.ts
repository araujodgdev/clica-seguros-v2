'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCarDetails, usePrefetchSimulation } from './use-simulation'
import { validateLicensePlate } from '../services/mock-data'

/**
 * Hook para busca de carros com debounce, útil para campos de input em tempo real
 */
export function useDebouncedCarSearch(licensePlate: string, delay: number = 500) {
  const [debouncedPlate, setDebouncedPlate] = useState(licensePlate)
  const [isDebouncing, setIsDebouncing] = useState(false)

  useEffect(() => {
    setIsDebouncing(true)
    const handler = setTimeout(() => {
      setDebouncedPlate(licensePlate)
      setIsDebouncing(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [licensePlate, delay])

  // Validar placa antes de fazer a busca
  const isValidPlate = useMemo(() => {
    return debouncedPlate.length >= 7 && validateLicensePlate(debouncedPlate)
  }, [debouncedPlate])

  // Query só executa se a placa for válida
  const carDetailsQuery = useCarDetails(debouncedPlate, isValidPlate)

  return {
    ...carDetailsQuery,
    isDebouncing,
    debouncedPlate,
    isValidPlate,
    originalPlate: licensePlate
  }
}

/**
 * Hook para sugestões de placas com prefetch inteligente
 */
export function useSmartPlateSuggestions(partialPlate: string) {
  const { prefetchCarDetails } = usePrefetchSimulation()
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Placas comuns para sugestões (baseado no mock data)
  const commonPlates = useMemo(() => [
    'ABC1234', 'DEF5678', 'GHI9012', 'JKL3456', 'MNO7890', 
    'PQR1234', 'STU5678', 'VWX9012', 'YZA3456', 'BCD7890',
    'ABC1D23', 'DEF2E34'
  ], [])

  useEffect(() => {
    if (partialPlate.length >= 3) {
      // Filtrar placas que começam com o input do usuário
      const filtered = commonPlates.filter(plate => 
        plate.startsWith(partialPlate.toUpperCase())
      )

      setSuggestions(filtered.slice(0, 5)) // Máximo 5 sugestões

      // Prefetch das sugestões para melhor UX
      filtered.slice(0, 3).forEach(plate => {
        prefetchCarDetails(plate).catch(() => {
          // Ignorar erros de prefetch silenciosamente
        })
      })
    } else {
      setSuggestions([])
    }
  }, [partialPlate, commonPlates, prefetchCarDetails])

  return suggestions
}

/**
 * Hook para busca inteligente com histórico e cache
 */
export function useIntelligentCarSearch() {
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const { prefetchCarDetails } = usePrefetchSimulation()

  // Carregar histórico do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('car-search-history')
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved))
        } catch {
          // Ignorar erro de parse
        }
      }
    }
  }, [])

  const addToHistory = (plate: string) => {
    if (!plate || !validateLicensePlate(plate)) return

    setSearchHistory(prev => {
      const normalized = plate.toUpperCase()
      const filtered = prev.filter(p => p !== normalized)
      const newHistory = [normalized, ...filtered].slice(0, 10) // Máximo 10 itens

      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('car-search-history', JSON.stringify(newHistory))
      }

      return newHistory
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('car-search-history')
    }
  }

  // Prefetch do histórico para acelerar buscas
  const warmUpHistory = () => {
    searchHistory.slice(0, 5).forEach(plate => {
      prefetchCarDetails(plate).catch(() => {
        // Ignorar erros de prefetch
      })
    })
  }

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    warmUpHistory
  }
}

/**
 * Hook para otimizar buscas baseado no comportamento do usuário
 */
export function useAdaptiveSearch(initialPlate: string = '') {
  const [searchTerm, setSearchTerm] = useState(initialPlate)
  const [searchMode, setSearchMode] = useState<'instant' | 'debounced' | 'manual'>('debounced')
  const [userBehavior, setUserBehavior] = useState({
    fastTyper: false,
    searchFrequency: 0,
    avgTypingSpeed: 0
  })

  const debouncedSearch = useDebouncedCarSearch(
    searchTerm, 
    searchMode === 'instant' ? 100 : searchMode === 'debounced' ? 500 : 0
  )

  const suggestions = useSmartPlateSuggestions(searchTerm)
  const { searchHistory, addToHistory } = useIntelligentCarSearch()

  // Analisar comportamento do usuário
  useEffect(() => {
    const analyzeTyping = () => {
      // Lógica para detectar padrões de digitação
      // Ajustar searchMode baseado no comportamento
      if (userBehavior.avgTypingSpeed > 200) { // WPM alto
        setSearchMode('instant')
      } else if (userBehavior.searchFrequency > 10) {
        setSearchMode('debounced')
      }
    }

    const timer = setTimeout(analyzeTyping, 2000)
    return () => clearTimeout(timer)
  }, [userBehavior])

  const handleSearch = (plate: string) => {
    setSearchTerm(plate)
    
    // Atualizar estatísticas de comportamento
    setUserBehavior(prev => ({
      ...prev,
      searchFrequency: prev.searchFrequency + 1
    }))

    // Adicionar ao histórico quando a busca for bem-sucedida
    if (validateLicensePlate(plate)) {
      addToHistory(plate)
    }
  }

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    searchMode,
    suggestions,
    searchHistory,
    carDetailsQuery: debouncedSearch,
    userBehavior
  }
}