'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  validateName, 
  validateEmail, 
  validateLicensePlate,
  sanitizeString,
  sanitizeLicensePlate,
  formatLicensePlateForDisplay
} from '@/lib/validation/form-validation'
import { FormData, FieldValidationResult } from '@/lib/types/simulation'
import { User, Mail, Car, AlertCircle, CheckCircle } from 'lucide-react'

interface InitialFormProps {
  onSubmit: (formData: FormData) => void
  isLoading?: boolean
}

interface FormErrors {
  licensePlate?: string
}

export function InitialForm({ onSubmit, isLoading = false }: InitialFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    licensePlate: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<'licensePlate', boolean>>({
    licensePlate: false
  })
  
  const [isValid, setIsValid] = useState(false)
  
  // Refs for focus management
  const plateInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {}
    
    if (touched.licensePlate) {
      const licensePlateResult = validateLicensePlate(formData.licensePlate)
      if (!licensePlateResult.isValid && licensePlateResult.error) {
        newErrors.licensePlate = licensePlateResult.error
      }
    }
    
    setErrors(newErrors)
    
    // Check if form is valid (only license plate required now)
    const licensePlateValid = validateLicensePlate(formData.licensePlate).isValid
    
    setIsValid(licensePlateValid)
  }, [formData, touched])

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value
    
    if (field === 'licensePlate') {
      processedValue = sanitizeLicensePlate(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
  }

  const handleInputBlur = (field: 'licensePlate') => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark license plate field as touched
    setTouched({
      licensePlate: true
    })
    
    if (isValid) {
      onSubmit(formData)
    }
  }

  // Enhanced keyboard navigation with focus management
  const handleKeyDown = (e: React.KeyboardEvent, field: 'licensePlate') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      // Submit if valid
      if (field === 'licensePlate' && isValid) {
        submitButtonRef.current?.focus()
        handleSubmit(e as any)
      }
    }
    
    // Handle Escape key to clear current field
    if (e.key === 'Escape') {
      handleInputChange(field, '')
      setTouched(prev => ({ ...prev, [field]: false }))
    }
    
    // Handle Tab navigation with validation feedback
    if (e.key === 'Tab' && !e.shiftKey) {
      // Trigger validation on tab out
      setTimeout(() => handleInputBlur(field), 0)
    }
  }

  // Focus management for accessibility
  useEffect(() => {
    // Focus plate input on component mount
    if (plateInputRef.current && !isLoading) {
      plateInputRef.current.focus()
    }
  }, [isLoading])

  const getFieldStatus = (field: 'licensePlate'): 'default' | 'error' | 'success' => {
    if (!touched[field]) return 'default'
    return errors[field] ? 'error' : 'success'
  }

  return (
    <div 
      className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-charcoal mb-2">
            Comece sua simulação
          </h3>
          <p className="text-sm sm:text-base text-neutral-medium-gray">
            Digite a placa do seu veículo para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" role="form" aria-label="Formulário de simulação de seguro">
          {/* License Plate Field */}
          <div className="space-y-2">
            <label 
              htmlFor="licensePlate"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              Placa do veículo
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Car className={`h-5 w-5 ${
                  getFieldStatus('licensePlate') === 'error' ? 'text-red-500' :
                  getFieldStatus('licensePlate') === 'success' ? 'text-green-500' :
                  'text-neutral-medium-gray'
                }`} />
              </div>
              <motion.input
                ref={plateInputRef}
                id="licensePlate"
                type="text"
                value={formatLicensePlateForDisplay(formData.licensePlate)}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                onBlur={() => handleInputBlur('licensePlate')}
                onKeyDown={(e) => handleKeyDown(e, 'licensePlate')}
                placeholder="ABC-1234 ou ABC1D23"
                aria-label="Placa do veículo"
                aria-describedby={errors.licensePlate ? "licensePlate-error" : "licensePlate-help"}
                aria-invalid={getFieldStatus('licensePlate') === 'error'}
                aria-required="true"
                className={`w-full pl-12 pr-12 py-4 sm:py-4 min-h-[48px] rounded-xl border-2 bg-white/80 backdrop-blur-sm text-center text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-charcoal placeholder:text-neutral-medium-gray/60 placeholder:font-normal placeholder:tracking-normal outline-none transition-all duration-200 ${
                  getFieldStatus('licensePlate') === 'error' 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
                  getFieldStatus('licensePlate') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' :
                    'border-neutral-light-gray focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                maxLength={8}
                disabled={isLoading}
              />
              {getFieldStatus('licensePlate') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('licensePlate') === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.licensePlate && (
              <motion.p
                id="licensePlate-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.licensePlate}
              </motion.p>
            )}
            <p id="licensePlate-help" className="text-xs text-neutral-medium-gray">
              Formatos aceitos: ABC-1234 (antigo) ou ABC1D23 (Mercosul)
            </p>
          </div>

          {/* Submit Button */}
          <Button
            ref={submitButtonRef}
            type="submit"
            size="lg"
            variant="gradient"
            className="w-full min-h-[48px]"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            loadingText="Validando dados..."
            aria-describedby="form-status"
          >
            Continuar simulação
          </Button>

          {/* Screen reader status announcement */}
          <div 
            id="form-status" 
            className="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
          >
            {isValid ? 'Placa válida, pronto para enviar' : 'Digite uma placa válida'}
          </div>

          {/* Benefits */}
          <div className="pt-4 border-t border-neutral-light-gray/30">
            <div className="space-y-2">
              {[
                "Sem compromisso de contratação",
                "Resultado em menos de 3 minutos",
                "Dados protegidos com criptografia"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-sm text-neutral-medium-gray"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}