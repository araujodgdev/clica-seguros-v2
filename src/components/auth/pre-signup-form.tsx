'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  validateName, 
  validateEmail,
  sanitizeString
} from '@/lib/validation/form-validation'
import { User, Mail, AlertCircle, CheckCircle } from 'lucide-react'

interface PreSignupFormProps {
  onComplete: (data: { name: string; email: string }) => void
  isLoading?: boolean
}

interface FormErrors {
  name?: string
  email?: string
}

interface FormData {
  name: string
  email: string
}

export function PreSignupForm({ onComplete, isLoading = false }: PreSignupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false
  })
  
  const [isValid, setIsValid] = useState(false)
  
  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {}
    
    if (touched.name) {
      const nameResult = validateName(formData.name)
      if (!nameResult.isValid && nameResult.error) {
        newErrors.name = nameResult.error
      }
    }
    
    if (touched.email) {
      const emailResult = validateEmail(formData.email)
      if (!emailResult.isValid && emailResult.error) {
        newErrors.email = emailResult.error
      }
    }
    
    setErrors(newErrors)
    
    // Check if form is valid
    const nameValid = validateName(formData.name).isValid
    const emailValid = validateEmail(formData.email).isValid
    
    setIsValid(nameValid && emailValid)
  }, [formData, touched])

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value
    
    if (field === 'email') {
      processedValue = value.toLowerCase()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true
    })
    
    if (isValid) {
      onComplete(formData)
    }
  }

  // Enhanced keyboard navigation with focus management
  const handleKeyDown = (e: React.KeyboardEvent, field: keyof FormData) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      // Move to next field or submit if on last field
      if (field === 'name') {
        emailInputRef.current?.focus()
      } else if (field === 'email' && isValid) {
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
    if (nameInputRef.current && !isLoading) {
      nameInputRef.current.focus()
    }
  }, [isLoading])

  const getFieldStatus = (field: keyof FormData): 'default' | 'error' | 'success' => {
    if (!touched[field]) return 'default'
    return errors[field] ? 'error' : 'success'
  }

  return (
    <div className="w-full mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-charcoal mb-2">
            Quase lá!
          </h3>
          <p className="text-sm sm:text-base text-neutral-medium-gray">
            Precisamos de algumas informações para finalizar sua contratação
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
                disabled={isLoading}
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

          {/* Email Field */}
          <div className="space-y-2">
            <label 
              htmlFor="email"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Mail className={`h-5 w-5 ${
                  getFieldStatus('email') === 'error' ? 'text-red-500' :
                  getFieldStatus('email') === 'success' ? 'text-green-500' :
                  'text-neutral-medium-gray'
                }`} />
              </div>
              <motion.input
                ref={emailInputRef}
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleInputBlur('email')}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                placeholder="seu@email.com"
                aria-label="E-mail"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={getFieldStatus('email') === 'error'}
                aria-required="true"
                className={`w-full pl-12 pr-12 py-4 min-h-[48px] rounded-xl border-2 bg-white/80 backdrop-blur-sm text-neutral-charcoal placeholder:text-neutral-medium-gray/60 outline-none transition-all duration-200 text-base ${
                  getFieldStatus('email') === 'error' 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
                  getFieldStatus('email') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' :
                    'border-neutral-light-gray focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                disabled={isLoading}
              />
              {getFieldStatus('email') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('email') === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <motion.p
                id="email-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.email}
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
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            loadingText="Processando..."
            aria-describedby="form-status"
          >
            Continuar
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