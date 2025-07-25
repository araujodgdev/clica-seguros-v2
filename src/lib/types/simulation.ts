/**
 * TypeScript interfaces for the car insurance quote simulation feature
 */

export interface FormData {
  name: string
  email: string
  licensePlate: string
}

export interface CarDetails {
  make: string
  model: string
  year: number
  fipeCode: string
  estimatedValue: number
}

export interface InsuranceOffer {
  id: string
  insurerName: string
  monthlyPremium: number
  coverageHighlights: string[]
  savings: number
  rating: number
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface FieldValidationResult {
  isValid: boolean
  error?: string
}