'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { 
  validateName,
  sanitizeString
} from '@/lib/validation/form-validation'
import { User, Phone, AlertCircle, CheckCircle } from 'lucide-react'

interface CustomOnboardingProps {
  onComplete: () => void
}

interface FormErrors {
  name?: string
  phone?: string
}

interface FormData {
  name: string
  phone: string
}

// Phone validation function
const validatePhone = (phone: string) => {
  // Remove any non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a valid Brazilian phone number
  if (cleaned.length === 10 || cleaned.length === 11) {
    return { isValid: true, error: null }
  }
  
  return { 
    isValid: false, 
    error: 'Digite um telefone válido (10 ou 11 dígitos)' 
  }
}

// Format phone number for display
const formatPhoneForDisplay = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length <= 2) {
    return `(${cleaned}`
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }
}

// Sanitize phone number for storage
const sanitizePhone = (phone: string) => {
  return phone.replace(/\D/g, '').slice(0, 11)
}

export function CustomOnboarding({ onComplete }: CustomOnboardingProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    phone: false
  })
  
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Convex mutation
  const completeOnboarding = useMutation(api.users.completeOnboarding)

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {}
    
    if (touched.name) {
      const nameResult = validateName(formData.name)
      if (!nameResult.isValid && nameResult.error) {
        newErrors.name = nameResult.error
      }
    }
    
    if (touched.phone) {
      const phoneResult = validatePhone(formData.phone)
      if (!phoneResult.isValid && phoneResult.error) {
        newErrors.phone = phoneResult.error
      }
    }
    
    setErrors(newErrors)
    
    // Check if form is valid
    const nameValid = validateName(formData.name).isValid
    const phoneValid = validatePhone(formData.phone).isValid
    
    setIsValid(nameValid && phoneValid)
  }, [formData, touched])

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value
    
    if (field === 'phone') {
      processedValue = sanitizePhone(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
  }

  const handleInputBlur = (field: keyof FormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
    
    // Apply sanitization on blur for name field
    if (field === 'name') {
      setFormData(prev => ({
        ...prev,
        name: sanitizeString(prev.name)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true
    })
    
    if (!isValid || isSubmitting) return

    try {
      setIsSubmitting(true)
      
      // Call Convex mutation to complete onboarding
      await completeOnboarding({
        name: formData.name,
        phone: formData.phone
      })
      
      // Call completion callback
      onComplete()
      
    } catch (error) {
      console.error('Error completing onboarding:', error)
      // You could add error state here for user feedback
    } finally {
      setIsSubmitting(false)
    }
  }

  // Enhanced keyboard navigation with focus management
  const handleKeyDown = (e: React.KeyboardEvent, field: keyof FormData) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      // Move to next field or submit if on last field
      if (field === 'name') {
        phoneInputRef.current?.focus()
      } else if (field === 'phone' && isValid) {
        submitButtonRef.current?.focus()
        handleSubmit(e as any)
      }
    }
    
    // Handle Tab navigation with validation feedback
    if (e.key === 'Tab' && !e.shiftKey) {
      // Trigger validation on tab out
      setTimeout(() => handleInputBlur(field), 0)
    }
  }

  // Focus management for accessibility
  useEffect(() => {
    // Focus first input on component mount
    if (nameInputRef.current && !isSubmitting) {
      nameInputRef.current.focus()
    }
  }, [isSubmitting])

  const getFieldStatus = (field: keyof FormData): 'default' | 'error' | 'success' => {
    if (!touched[field]) return 'default'
    return errors[field] ? 'error' : 'success'
  }

  return (
    <div className="w-full max-w-[80%] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-charcoal mb-2">
            Complete seu cadastro
          </h3>
          <p className="text-sm sm:text-base text-neutral-medium-gray">
            Precisamos de algumas informações para finalizar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Formulário de informações pessoais">
          {/* Name Field */}
          <div className="space-y-2">
            <label 
              htmlFor="name"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <User className={`h-5 w-5 ${
                  getFieldStatus('name') === 'error' ? 'text-red-500' :
                  getFieldStatus('name') === 'success' ? 'text-green-500' :
                  'text-neutral-medium-gray'
                }`} />
              </div>
              <motion.input
                ref={nameInputRef}
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleInputBlur('name')}
                onKeyDown={(e) => handleKeyDown(e, 'name')}
                placeholder="Digite seu nome completo"
                aria-label="Nome completo"
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={getFieldStatus('name') === 'error'}
                aria-required="true"
                className={`w-full pl-12 pr-12 py-4 min-h-[48px] rounded-xl border-2 bg-white/80 backdrop-blur-sm text-neutral-charcoal placeholder:text-neutral-medium-gray/60 outline-none transition-all duration-200 text-base ${
                  getFieldStatus('name') === 'error' 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
                  getFieldStatus('name') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' :
                    'border-neutral-light-gray focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                disabled={isSubmitting}
              />
              {getFieldStatus('name') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('name') === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.name && (
              <motion.p
                id="name-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label 
              htmlFor="phone"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              Telefone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Phone className={`h-5 w-5 ${
                  getFieldStatus('phone') === 'error' ? 'text-red-500' :
                  getFieldStatus('phone') === 'success' ? 'text-green-500' :
                  'text-neutral-medium-gray'
                }`} />
              </div>
              <motion.input
                ref={phoneInputRef}
                id="phone"
                type="tel"
                value={formatPhoneForDisplay(formData.phone)}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                onKeyDown={(e) => handleKeyDown(e, 'phone')}
                placeholder="(11) 99999-9999"
                aria-label="Telefone"
                aria-describedby={errors.phone ? "phone-error" : undefined}
                aria-invalid={getFieldStatus('phone') === 'error'}
                aria-required="true"
                className={`w-full pl-12 pr-12 py-4 min-h-[48px] rounded-xl border-2 bg-white/80 backdrop-blur-sm text-neutral-charcoal placeholder:text-neutral-medium-gray/60 outline-none transition-all duration-200 text-base ${
                  getFieldStatus('phone') === 'error' 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
                  getFieldStatus('phone') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' :
                    'border-neutral-light-gray focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                disabled={isSubmitting}
              />
              {getFieldStatus('phone') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('phone') === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.phone && (
              <motion.p
                id="phone-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            ref={submitButtonRef}
            type="submit"
            size="lg"
            variant="default"
            className="w-full min-h-[48px] mt-6"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Finalizando cadastro..."
            aria-describedby="form-status"
          >
            Finalizar cadastro
          </Button>

          {/* Screen reader status announcement */}
          <div 
            id="form-status" 
            className="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
          >
            {isValid ? 'Formulário válido, pronto para enviar' : 'Preencha todos os campos corretamente'}
          </div>
        </form>
      </motion.div>
    </div>
  )
}