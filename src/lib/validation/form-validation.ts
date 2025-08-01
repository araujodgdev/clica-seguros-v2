import { FormData, ValidationResult, ValidationError, FieldValidationResult } from '@/lib/types/simulation'

/**
 * Validation patterns for form fields
 */
const VALIDATION_PATTERNS = {
  // Brazilian name pattern - allows letters, spaces, accents, and hyphens
  name: /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\-']+$/,
  // Standard email pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Brazilian license plate patterns (old: ABC-1234, new: ABC1D23)
  licensePlateOld: /^[A-Z]{3}-?[0-9]{4}$/,
  licensePlateNew: /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
}

/**
 * Error messages for validation failures
 */
const ERROR_MESSAGES = {
  name: {
    required: 'Nome é obrigatório',
    invalid: 'Nome deve conter apenas letras e espaços',
    minLength: 'Nome deve ter pelo menos 2 caracteres',
    maxLength: 'Nome deve ter no máximo 100 caracteres',
    tooShort: 'Nome muito curto. Digite seu nome completo',
    invalidChars: 'Nome contém caracteres inválidos',
    onlySpaces: 'Nome não pode conter apenas espaços'
  },
  email: {
    required: 'E-mail é obrigatório',
    invalid: 'E-mail deve ter um formato válido',
    invalidDomain: 'Domínio do e-mail inválido',
    tooLong: 'E-mail muito longo (máximo 254 caracteres)',
    commonTypos: 'Verifique se digitou o e-mail corretamente'
  },
  licensePlate: {
    required: 'Placa é obrigatória',
    invalid: 'Placa deve estar no formato ABC-1234 ou ABC1D23',
    tooShort: 'Placa incompleta. Digite todos os caracteres',
    tooLong: 'Placa muito longa. Verifique o formato',
    invalidFormat: 'Formato de placa não reconhecido',
    invalidChars: 'Placa contém caracteres inválidos'
  },
  cpf: {
    required: 'CPF é obrigatório',
    invalid: 'CPF inválido',
    tooShort: 'CPF deve ter 11 dígitos',
    tooLong: 'CPF deve ter 11 dígitos',
    invalidFormat: 'CPF deve conter apenas números',
    sameDigits: 'CPF não pode ter todos os dígitos iguais'
  }
}

/**
 * Sanitizes a string by trimming whitespace and removing extra spaces
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

/**
 * Sanitizes license plate by removing spaces, hyphens and converting to uppercase
 */
export function sanitizeLicensePlate(value: string): string {
  return value.replace(/[\s-]/g, '').toUpperCase()
}

/**
 * Sanitizes CPF by removing non-numeric characters
 */
export function sanitizeCpf(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Validates a name field with enhanced error checking
 */
export function validateName(name: string): FieldValidationResult {
  const sanitized = sanitizeString(name)
  
  if (!sanitized) {
    return { isValid: false, error: ERROR_MESSAGES.name.required }
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: ERROR_MESSAGES.name.minLength }
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: ERROR_MESSAGES.name.maxLength }
  }
  
  if (!VALIDATION_PATTERNS.name.test(sanitized)) {
    return { isValid: false, error: ERROR_MESSAGES.name.invalid }
  }
  
  return { isValid: true }
}

/**
 * Validates an email field
 */
export function validateEmail(email: string): FieldValidationResult {
  const sanitized = sanitizeString(email).toLowerCase()
  
  if (!sanitized) {
    return { isValid: false, error: ERROR_MESSAGES.email.required }
  }
  
  if (!VALIDATION_PATTERNS.email.test(sanitized)) {
    return { isValid: false, error: ERROR_MESSAGES.email.invalid }
  }
  
  return { isValid: true }
}

/**
 * Validates a Brazilian license plate
 */
export function validateLicensePlate(licensePlate: string): FieldValidationResult {
  const sanitized = sanitizeLicensePlate(licensePlate)
  
  if (!sanitized) {
    return { isValid: false, error: ERROR_MESSAGES.licensePlate.required }
  }
  
  const isOldFormat = VALIDATION_PATTERNS.licensePlateOld.test(sanitized)
  const isNewFormat = VALIDATION_PATTERNS.licensePlateNew.test(sanitized)
  
  if (!isOldFormat && !isNewFormat) {
    return { isValid: false, error: ERROR_MESSAGES.licensePlate.invalid }
  }
  
  return { isValid: true }
}

/**
 * Validates a Brazilian CPF using the official algorithm
 */
export function validateCpf(cpf: string): FieldValidationResult {
  const sanitized = sanitizeCpf(cpf)
  
  if (!sanitized) {
    return { isValid: false, error: ERROR_MESSAGES.cpf.required }
  }
  
  if (sanitized.length !== 11) {
    return { isValid: false, error: ERROR_MESSAGES.cpf.tooShort }
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(sanitized)) {
    return { isValid: false, error: ERROR_MESSAGES.cpf.sameDigits }
  }
  
  // Validate CPF check digits
  let sum = 0
  let remainder
  
  // Calculate first check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(sanitized.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  
  if (remainder !== parseInt(sanitized.substring(9, 10))) {
    return { isValid: false, error: ERROR_MESSAGES.cpf.invalid }
  }
  
  sum = 0
  
  // Calculate second check digit
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(sanitized.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  
  if (remainder !== parseInt(sanitized.substring(10, 11))) {
    return { isValid: false, error: ERROR_MESSAGES.cpf.invalid }
  }
  
  return { isValid: true }
}

/**
 * Validates the complete form data
 */
export function validateFormData(formData: FormData): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validate name
  const nameResult = validateName(formData.name)
  if (!nameResult.isValid && nameResult.error) {
    errors.push({ field: 'name', message: nameResult.error })
  }
  
  // Validate email
  const emailResult = validateEmail(formData.email)
  if (!emailResult.isValid && emailResult.error) {
    errors.push({ field: 'email', message: emailResult.error })
  }
  
  // Validate license plate
  const licensePlateResult = validateLicensePlate(formData.licensePlate)
  if (!licensePlateResult.isValid && licensePlateResult.error) {
    errors.push({ field: 'licensePlate', message: licensePlateResult.error })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Formats license plate for display (adds hyphen if old format)
 */
export function formatLicensePlateForDisplay(licensePlate: string): string {
  const sanitized = sanitizeLicensePlate(licensePlate)
  
  // Check if it's old format without hyphen
  if (/^[A-Z]{3}[0-9]{4}$/.test(sanitized)) {
    return `${sanitized.slice(0, 3)}-${sanitized.slice(3)}`
  }
  
  return sanitized
}

/**
 * Formats CPF for display (adds dots and hyphen)
 */
export function formatCpfForDisplay(cpf: string): string {
  const sanitized = sanitizeCpf(cpf)
  
  if (sanitized.length <= 3) {
    return sanitized
  } else if (sanitized.length <= 6) {
    return `${sanitized.slice(0, 3)}.${sanitized.slice(3)}`
  } else if (sanitized.length <= 9) {
    return `${sanitized.slice(0, 3)}.${sanitized.slice(3, 6)}.${sanitized.slice(6)}`
  } else {
    return `${sanitized.slice(0, 3)}.${sanitized.slice(3, 6)}.${sanitized.slice(6, 9)}-${sanitized.slice(9, 11)}`
  }
}

/**
 * Gets error message for a specific field
 */
export function getFieldErrorMessage(field: keyof FormData, error: string): string {
  return error
}