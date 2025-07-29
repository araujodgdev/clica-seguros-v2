/**
 * Navigation service for handling page transitions and URL management
 * in the car insurance quote simulation feature
 */

import { FormData, CarDetails } from '../types/simulation'

// Navigation utility functions
export class NavigationService {
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAY_BASE = 1000

  /**
   * Creates a URL for the quote results page with form data and car details
   */
  static createQuoteResultsUrl(formData: FormData, carDetails: CarDetails): string {
    const searchParams = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      licensePlate: formData.licensePlate,
      carMake: carDetails.make,
      carModel: carDetails.model,
      carYear: carDetails.year.toString(),
      fipeCode: carDetails.fipeCode,
      estimatedValue: carDetails.estimatedValue.toString()
    })
    
    return `/cotacao?${searchParams.toString()}`
  }

  /**
   * Validates URL parameters for the quote results page
   */
  static validateQuoteResultsParams(searchParams: URLSearchParams): {
    isValid: boolean
    errors: string[]
    data?: {
      name: string
      email: string
      licensePlate: string
      carDetails?: CarDetails
    }
  } {
    const errors: string[] = []
    
    // Get required parameters
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const licensePlate = searchParams.get('licensePlate')
    
    // Validate required parameters
    if (!name) errors.push('Nome não encontrado')
    if (!email) errors.push('Email não encontrado')
    if (!licensePlate) errors.push('Placa não encontrada')
    
    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email inválido')
    }
    
    // Validate license plate format
    if (licensePlate) {
      const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-?[0-9]{4}$/
      if (!plateRegex.test(licensePlate.replace('-', '').toUpperCase())) {
        errors.push('Placa inválida')
      }
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors }
    }
    
    // Get optional car details
    const carMake = searchParams.get('carMake')
    const carModel = searchParams.get('carModel')
    const carYear = searchParams.get('carYear')
    const fipeCode = searchParams.get('fipeCode')
    const estimatedValue = searchParams.get('estimatedValue')
    
    let carDetails: CarDetails | undefined
    
    if (carMake && carModel && carYear) {
      const yearNum = parseInt(carYear)
      const currentYear = new Date().getFullYear()
      
      if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear + 1) {
        errors.push('Ano do veículo inválido')
      } else {
        const estimatedValueNum = estimatedValue ? parseInt(estimatedValue) : 50000
        
        if (isNaN(estimatedValueNum) || estimatedValueNum < 1000) {
          errors.push('Valor estimado do veículo inválido')
        } else {
          carDetails = {
            make: carMake,
            model: carModel,
            year: yearNum,
            fipeCode: fipeCode || '000000-0',
            estimatedValue: estimatedValueNum
          }
        }
      }
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors }
    }
    
    return {
      isValid: true,
      errors: [],
      data: {
        name: name!,
        email: email!,
        licensePlate: licensePlate!,
        carDetails
      }
    }
  }

  /**
   * Performs navigation with retry logic and fallback mechanisms
   */
  static async navigateWithRetry(
    router: any,
    url: string,
    options: {
      retries?: number
      onRetry?: (attempt: number) => void
      onError?: (error: Error, attempt: number) => void
    } = {}
  ): Promise<boolean> {
    const maxRetries = options.retries || this.MAX_RETRIES
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Try Next.js router navigation
        await router.push(url)
        
        // Verify navigation was successful by checking if we're still on the same page
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return true
        
      } catch (error) {
        console.warn(`Navigation attempt ${attempt} failed:`, error)
        
        if (options.onError) {
          options.onError(error as Error, attempt)
        }
        
        if (attempt === maxRetries) {
          // Last attempt - try window.location as fallback
          try {
            if (typeof window !== 'undefined') {
              window.location.href = url
              return true
            }
          } catch (fallbackError) {
            console.error('Fallback navigation also failed:', fallbackError)
            throw new Error('Falha na navegação após múltiplas tentativas')
          }
        } else {
          // Wait before retry with exponential backoff
          const delay = Math.min(
            this.RETRY_DELAY_BASE * Math.pow(2, attempt - 1),
            5000
          )
          
          if (options.onRetry) {
            options.onRetry(attempt)
          }
          
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    return false
  }

  /**
   * Manages session storage for navigation tracking
   */
  static setNavigationSession(data: {
    page: string
    timestamp: number
    formData?: FormData
    carDetails?: CarDetails
    [key: string]: any
  }): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('navigation-session', JSON.stringify(data))
      } catch (error) {
        console.warn('Failed to set navigation session:', error)
      }
    }
  }

  /**
   * Gets navigation session data
   */
  static getNavigationSession(): any | null {
    if (typeof window !== 'undefined') {
      try {
        const data = sessionStorage.getItem('navigation-session')
        return data ? JSON.parse(data) : null
      } catch (error) {
        console.warn('Failed to get navigation session:', error)
        return null
      }
    }
    return null
  }

  /**
   * Clears navigation session data
   */
  static clearNavigationSession(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('navigation-session')
        sessionStorage.removeItem('cotacao-loaded')
      } catch (error) {
        console.warn('Failed to clear navigation session:', error)
      }
    }
  }

  /**
   * Checks if navigation session is valid (not expired)
   */
  static isNavigationSessionValid(maxAge: number = 30 * 60 * 1000): boolean {
    const session = this.getNavigationSession()
    if (!session || !session.timestamp) {
      return false
    }
    
    const age = Date.now() - session.timestamp
    return age < maxAge
  }

  /**
   * Handles browser back button navigation
   */
  static setupBackButtonHandler(
    onBackNavigation: (event: PopStateEvent) => void
  ): () => void {
    const handlePopState = (event: PopStateEvent) => {
      onBackNavigation(event)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState)
      
      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }
    
    return () => {}
  }

  /**
   * Sets up history state for better back button support
   */
  static setHistoryState(data: any, url?: string): void {
    if (typeof window !== 'undefined') {
      try {
        const stateData = {
          ...data,
          timestamp: Date.now()
        }
        
        window.history.replaceState(stateData, '', url || window.location.href)
      } catch (error) {
        console.warn('Failed to set history state:', error)
      }
    }
  }

  /**
   * Gets current history state
   */
  static getHistoryState(): any | null {
    if (typeof window !== 'undefined') {
      return window.history.state
    }
    return null
  }
}

// Export utility functions for backward compatibility
export const createQuoteResultsUrl = NavigationService.createQuoteResultsUrl
export const validateQuoteResultsParams = NavigationService.validateQuoteResultsParams
export const navigateWithRetry = NavigationService.navigateWithRetry