/**
 * Tests for the NavigationService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NavigationService } from '../navigation'
import { FormData, CarDetails } from '../../types/simulation'

// Mock URLSearchParams for testing
class MockURLSearchParams {
  private params: Map<string, string>

  constructor(params: Record<string, string> = {}) {
    this.params = new Map(Object.entries(params))
  }

  get(key: string): string | null {
    return this.params.get(key) || null
  }

  set(key: string, value: string): void {
    this.params.set(key, value)
  }

  toString(): string {
    const pairs: string[] = []
    this.params.forEach((value, key) => {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    })
    return pairs.join('&')
  }
}

describe('NavigationService', () => {
  const mockFormData: FormData = {
    name: 'João Silva',
    email: 'joao@example.com',
    licensePlate: 'ABC1234'
  }

  const mockCarDetails: CarDetails = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fipeCode: '038001-1',
    estimatedValue: 85000
  }

  describe('createQuoteResultsUrl', () => {
    it('should create a valid URL with all parameters', () => {
      const url = NavigationService.createQuoteResultsUrl(mockFormData, mockCarDetails)
      
      expect(url).toContain('/cotacao?')
      expect(url).toContain('name=Jo%C3%A3o+Silva')
      expect(url).toContain('email=joao%40example.com')
      expect(url).toContain('licensePlate=ABC1234')
      expect(url).toContain('carMake=Toyota')
      expect(url).toContain('carModel=Corolla')
      expect(url).toContain('carYear=2020')
      expect(url).toContain('fipeCode=038001-1')
      expect(url).toContain('estimatedValue=85000')
    })

    it('should handle special characters in form data', () => {
      const specialFormData: FormData = {
        name: 'José & Maria',
        email: 'jose+maria@test.com',
        licensePlate: 'XYZ-9876'
      }

      const url = NavigationService.createQuoteResultsUrl(specialFormData, mockCarDetails)
      
      expect(url).toContain('name=Jos%C3%A9+%26+Maria')
      expect(url).toContain('email=jose%2Bmaria%40test.com')
      expect(url).toContain('licensePlate=XYZ-9876')
    })
  })

  describe('validateQuoteResultsParams', () => {
    it('should validate correct parameters', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234',
        carMake: 'Toyota',
        carModel: 'Corolla',
        carYear: '2020',
        fipeCode: '038001-1',
        estimatedValue: '85000'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.data).toBeDefined()
      expect(result.data!.name).toBe('João Silva')
      expect(result.data!.email).toBe('joao@example.com')
      expect(result.data!.licensePlate).toBe('ABC1234')
      expect(result.data!.carDetails).toBeDefined()
      expect(result.data!.carDetails!.make).toBe('Toyota')
    })

    it('should reject missing required parameters', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva'
        // Missing email and licensePlate
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Email não encontrado')
      expect(result.errors).toContain('Placa não encontrada')
      expect(result.data).toBeUndefined()
    })

    it('should reject invalid email format', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'invalid-email',
        licensePlate: 'ABC1234'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Email inválido')
    })

    it('should reject invalid license plate format', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'INVALID'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Placa inválida')
    })

    it('should validate old format license plates', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate new format (Mercosul) license plates', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1D23'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate license plates with hyphens', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC-1234'
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid car year', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234',
        carMake: 'Toyota',
        carModel: 'Corolla',
        carYear: '1980' // Too old
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Ano do veículo inválido')
    })

    it('should reject invalid estimated value', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234',
        carMake: 'Toyota',
        carModel: 'Corolla',
        carYear: '2020',
        estimatedValue: '500' // Too low
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Valor estimado do veículo inválido')
    })

    it('should work without car details', () => {
      const searchParams = new MockURLSearchParams({
        name: 'João Silva',
        email: 'joao@example.com',
        licensePlate: 'ABC1234'
        // No car details
      })

      const result = NavigationService.validateQuoteResultsParams(searchParams as any)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.data!.carDetails).toBeUndefined()
    })
  })

  describe('session management', () => {
    // Mock sessionStorage
    const mockSessionStorage = {
      store: new Map<string, string>(),
      getItem: vi.fn((key: string) => mockSessionStorage.store.get(key) || null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage.store.set(key, value)
      }),
      removeItem: vi.fn((key: string) => {
        mockSessionStorage.store.delete(key)
      }),
      clear: vi.fn(() => {
        mockSessionStorage.store.clear()
      })
    }

    beforeEach(() => {
      // Mock window.sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true
      })
      mockSessionStorage.store.clear()
      vi.clearAllMocks()
    })

    it('should set navigation session', () => {
      const sessionData = {
        page: 'cotacao',
        timestamp: Date.now(),
        formData: mockFormData,
        carDetails: mockCarDetails
      }

      NavigationService.setNavigationSession(sessionData)

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'navigation-session',
        JSON.stringify(sessionData)
      )
    })

    it('should get navigation session', () => {
      const sessionData = {
        page: 'cotacao',
        timestamp: Date.now()
      }

      mockSessionStorage.store.set('navigation-session', JSON.stringify(sessionData))

      const result = NavigationService.getNavigationSession()

      expect(result).toEqual(sessionData)
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('navigation-session')
    })

    it('should clear navigation session', () => {
      NavigationService.clearNavigationSession()

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('navigation-session')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('cotacao-loaded')
    })

    it('should validate session age', () => {
      const recentSession = {
        timestamp: Date.now() - 5 * 60 * 1000 // 5 minutes ago
      }
      const oldSession = {
        timestamp: Date.now() - 35 * 60 * 1000 // 35 minutes ago
      }

      mockSessionStorage.store.set('navigation-session', JSON.stringify(recentSession))
      expect(NavigationService.isNavigationSessionValid()).toBe(true)

      mockSessionStorage.store.set('navigation-session', JSON.stringify(oldSession))
      expect(NavigationService.isNavigationSessionValid()).toBe(false)
    })
  })

  describe('history state management', () => {
    const mockHistory = {
      state: null as any,
      replaceState: vi.fn((state, title, url) => {
        mockHistory.state = state
      })
    }

    beforeEach(() => {
      Object.defineProperty(window, 'history', {
        value: mockHistory,
        writable: true
      })
      Object.defineProperty(window, 'location', {
        value: { href: 'http://localhost:3000/test' },
        writable: true
      })
      vi.clearAllMocks()
    })

    it('should set history state', () => {
      const stateData = { page: 'test', step: 1 }

      NavigationService.setHistoryState(stateData)

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        expect.objectContaining({
          ...stateData,
          timestamp: expect.any(Number)
        }),
        '',
        'http://localhost:3000/test'
      )
    })

    it('should get history state', () => {
      const stateData = { page: 'test', step: 1 }
      mockHistory.state = stateData

      const result = NavigationService.getHistoryState()

      expect(result).toEqual(stateData)
    })
  })
})