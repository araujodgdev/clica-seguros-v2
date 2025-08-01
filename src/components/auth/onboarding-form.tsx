'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { User, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { useOnboarding } from '@/lib/hooks/useOnboarding'

const formatPhoneForDisplay = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length <= 2) {
    return `(${cleaned}`
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
      2,
      6,
    )}-${cleaned.slice(6)}`
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(
      2,
      7,
    )}-${cleaned.slice(7, 11)}`
  }
}

export const OnboardingForm: React.FC = () => {
  const {
    formData,
    errors,
    isSubmitting,
    submitError,
    handleInputChange,
    handleInputBlur,
    handleSubmit,
    getFieldStatus,
    isValid,
  } = useOnboarding()

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-neutral-light-gray/50 bg-white p-6 shadow-lg sm:p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-charcoal sm:text-3xl">
            Complete seu cadastro
          </h1>
          <p className="text-sm text-neutral-medium-gray sm:text-base">
            Precisamos de algumas informações para finalizar
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              Nome completo
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
                <User
                  className={`h-5 w-5 ${
                    getFieldStatus('name') === 'error'
                      ? 'text-red-500'
                      : getFieldStatus('name') === 'success'
                      ? 'text-green-500'
                      : 'text-neutral-medium-gray'
                  }`}
                />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                onBlur={() => handleInputBlur('name')}
                placeholder="Digite seu nome completo"
                required
                className={`min-h-[48px] w-full rounded-xl border-2 bg-white/80 py-4 pl-12 pr-12 text-base text-neutral-charcoal outline-none transition-all duration-200 placeholder:text-neutral-medium-gray/60 focus:ring-2 backdrop-blur-sm ${
                  getFieldStatus('name') === 'error'
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : getFieldStatus('name') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                    : 'border-neutral-light-gray focus:border-primary focus:ring-primary/20'
                }`}
                disabled={isSubmitting}
              />
              {getFieldStatus('name') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('name') === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-neutral-charcoal"
            >
              Telefone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
                <Phone
                  className={`h-5 w-5 ${
                    getFieldStatus('phone') === 'error'
                      ? 'text-red-500'
                      : getFieldStatus('phone') === 'success'
                      ? 'text-green-500'
                      : 'text-neutral-medium-gray'
                  }`}
                />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formatPhoneForDisplay(formData.phone)}
                onChange={e => handleInputChange('phone', e.target.value)}
                onBlur={() => handleInputBlur('phone')}
                placeholder="(11) 99999-9999"
                required
                className={`min-h-[48px] w-full rounded-xl border-2 bg-white/80 py-4 pl-12 pr-12 text-base text-neutral-charcoal outline-none transition-all duration-200 placeholder:text-neutral-medium-gray/60 focus:ring-2 backdrop-blur-sm ${
                  getFieldStatus('phone') === 'error'
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : getFieldStatus('phone') === 'success'
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                    : 'border-neutral-light-gray focus:border-primary focus:ring-primary/20'
                }`}
                disabled={isSubmitting}
              />
              {getFieldStatus('phone') !== 'default' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {getFieldStatus('phone') === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.phone && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              Erro: {submitError}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            variant="default"
            className="mt-6 min-h-[48px] w-full"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="Finalizando cadastro..."
          >
            Finalizar cadastro
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
