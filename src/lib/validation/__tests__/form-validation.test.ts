import { describe, it, expect } from 'vitest'
import {
  sanitizeString,
  sanitizeLicensePlate,
  validateName,
  validateEmail,
  validateLicensePlate,
  validateFormData,
  formatLicensePlateForDisplay
} from '../form-validation'
import { FormData } from '@/lib/types/simulation'

describe('sanitizeString', () => {
  it('should trim whitespace', () => {
    expect(sanitizeString('  João Silva  ')).toBe('João Silva')
  })

  it('should replace multiple spaces with single space', () => {
    expect(sanitizeString('João    Silva')).toBe('João Silva')
  })

  it('should handle empty string', () => {
    expect(sanitizeString('')).toBe('')
  })

  it('should handle string with only spaces', () => {
    expect(sanitizeString('   ')).toBe('')
  })
})

describe('sanitizeLicensePlate', () => {
  it('should remove spaces and hyphens', () => {
    expect(sanitizeLicensePlate('ABC - 1234')).toBe('ABC1234')
  })

  it('should convert to uppercase', () => {
    expect(sanitizeLicensePlate('abc1234')).toBe('ABC1234')
  })

  it('should handle new format plates', () => {
    expect(sanitizeLicensePlate('abc1d23')).toBe('ABC1D23')
  })

  it('should handle empty string', () => {
    expect(sanitizeLicensePlate('')).toBe('')
  })
})

describe('validateName', () => {
  it('should validate correct names', () => {
    expect(validateName('João Silva')).toEqual({ isValid: true })
    expect(validateName('Maria José')).toEqual({ isValid: true })
    expect(validateName('José da Silva')).toEqual({ isValid: true })
    expect(validateName('Ana-Paula')).toEqual({ isValid: true })
    expect(validateName("O'Connor")).toEqual({ isValid: true })
  })

  it('should reject empty names', () => {
    expect(validateName('')).toEqual({
      isValid: false,
      error: 'Nome é obrigatório'
    })
    expect(validateName('   ')).toEqual({
      isValid: false,
      error: 'Nome é obrigatório'
    })
  })

  it('should reject names that are too short', () => {
    expect(validateName('A')).toEqual({
      isValid: false,
      error: 'Nome deve ter pelo menos 2 caracteres'
    })
  })

  it('should reject names that are too long', () => {
    const longName = 'A'.repeat(101)
    expect(validateName(longName)).toEqual({
      isValid: false,
      error: 'Nome deve ter no máximo 100 caracteres'
    })
  })

  it('should reject names with invalid characters', () => {
    expect(validateName('João123')).toEqual({
      isValid: false,
      error: 'Nome deve conter apenas letras e espaços'
    })
    expect(validateName('João@Silva')).toEqual({
      isValid: false,
      error: 'Nome deve conter apenas letras e espaços'
    })
  })

  it('should handle names with accents', () => {
    expect(validateName('José')).toEqual({ isValid: true })
    expect(validateName('Ângela')).toEqual({ isValid: true })
    expect(validateName('François')).toEqual({ isValid: true })
  })
})

describe('validateEmail', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('user@example.com')).toEqual({ isValid: true })
    expect(validateEmail('test.email@domain.co.uk')).toEqual({ isValid: true })
    expect(validateEmail('user+tag@example.org')).toEqual({ isValid: true })
  })

  it('should reject empty emails', () => {
    expect(validateEmail('')).toEqual({
      isValid: false,
      error: 'E-mail é obrigatório'
    })
    expect(validateEmail('   ')).toEqual({
      isValid: false,
      error: 'E-mail é obrigatório'
    })
  })

  it('should reject invalid email formats', () => {
    expect(validateEmail('invalid-email')).toEqual({
      isValid: false,
      error: 'E-mail deve ter um formato válido'
    })
    expect(validateEmail('user@')).toEqual({
      isValid: false,
      error: 'E-mail deve ter um formato válido'
    })
    expect(validateEmail('@domain.com')).toEqual({
      isValid: false,
      error: 'E-mail deve ter um formato válido'
    })
    expect(validateEmail('user@domain')).toEqual({
      isValid: false,
      error: 'E-mail deve ter um formato válido'
    })
  })

  it('should handle email case normalization', () => {
    expect(validateEmail('USER@EXAMPLE.COM')).toEqual({ isValid: true })
  })
})

describe('validateLicensePlate', () => {
  it('should validate old format plates', () => {
    expect(validateLicensePlate('ABC1234')).toEqual({ isValid: true })
    expect(validateLicensePlate('ABC-1234')).toEqual({ isValid: true })
    expect(validateLicensePlate('XYZ9876')).toEqual({ isValid: true })
  })

  it('should validate new format plates', () => {
    expect(validateLicensePlate('ABC1D23')).toEqual({ isValid: true })
    expect(validateLicensePlate('XYZ9A87')).toEqual({ isValid: true })
  })

  it('should reject empty plates', () => {
    expect(validateLicensePlate('')).toEqual({
      isValid: false,
      error: 'Placa é obrigatória'
    })
    expect(validateLicensePlate('   ')).toEqual({
      isValid: false,
      error: 'Placa é obrigatória'
    })
  })

  it('should reject invalid plate formats', () => {
    expect(validateLicensePlate('AB1234')).toEqual({
      isValid: false,
      error: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
    })
    expect(validateLicensePlate('ABCD1234')).toEqual({
      isValid: false,
      error: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
    })
    expect(validateLicensePlate('ABC12D3')).toEqual({
      isValid: false,
      error: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
    })
    expect(validateLicensePlate('123ABCD')).toEqual({
      isValid: false,
      error: 'Placa deve estar no formato ABC-1234 ou ABC1D23'
    })
  })

  it('should handle case insensitive input', () => {
    expect(validateLicensePlate('abc1234')).toEqual({ isValid: true })
    expect(validateLicensePlate('abc1d23')).toEqual({ isValid: true })
  })

  it('should handle plates with spaces', () => {
    expect(validateLicensePlate('ABC 1234')).toEqual({ isValid: true })
    expect(validateLicensePlate('ABC 1D23')).toEqual({ isValid: true })
  })
})

describe('validateFormData', () => {
  it('should validate complete valid form data', () => {
    const formData: FormData = {
      name: 'João Silva',
      email: 'joao@example.com',
      licensePlate: 'ABC1234'
    }
    
    expect(validateFormData(formData)).toEqual({
      isValid: true,
      errors: []
    })
  })

  it('should return all validation errors', () => {
    const formData: FormData = {
      name: '',
      email: 'invalid-email',
      licensePlate: 'invalid-plate'
    }
    
    const result = validateFormData(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(3)
    expect(result.errors).toEqual([
      { field: 'name', message: 'Nome é obrigatório' },
      { field: 'email', message: 'E-mail deve ter um formato válido' },
      { field: 'licensePlate', message: 'Placa deve estar no formato ABC-1234 ou ABC1D23' }
    ])
  })

  it('should return partial validation errors', () => {
    const formData: FormData = {
      name: 'João Silva',
      email: 'invalid-email',
      licensePlate: 'ABC1234'
    }
    
    const result = validateFormData(formData)
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toEqual({
      field: 'email',
      message: 'E-mail deve ter um formato válido'
    })
  })
})

describe('formatLicensePlateForDisplay', () => {
  it('should add hyphen to old format plates without hyphen', () => {
    expect(formatLicensePlateForDisplay('ABC1234')).toBe('ABC-1234')
  })

  it('should preserve new format plates', () => {
    expect(formatLicensePlateForDisplay('ABC1D23')).toBe('ABC1D23')
  })

  it('should handle plates that already have formatting', () => {
    expect(formatLicensePlateForDisplay('ABC-1234')).toBe('ABC-1234')
  })

  it('should handle case normalization', () => {
    expect(formatLicensePlateForDisplay('abc1234')).toBe('ABC-1234')
    expect(formatLicensePlateForDisplay('abc1d23')).toBe('ABC1D23')
  })

  it('should handle empty string', () => {
    expect(formatLicensePlateForDisplay('')).toBe('')
  })
})