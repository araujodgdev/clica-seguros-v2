'use client'

import { motion } from 'framer-motion'
import { SimulationForm } from '@/components/simulation/simulation-form'
import { ArrowLeft, Shield, Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SimulacaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light-gray/30 via-white to-primary/5">
      {/* Skip Links for Accessibility */}
      <div className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-4 left-4 z-50 bg-primary text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Pular para o conteúdo principal
        </a>
        <a
          href="#simulation-form"
          className="absolute top-4 left-40 z-50 bg-primary text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Pular para o formulário
        </a>
      </div>

      {/* Main Content */}
      <main id="main-content" className="px-4 py-6 sm:py-8 md:py-16" role="main">

        {/* Simulation Form - Full width */}
        <motion.div
          id="simulation-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SimulationForm className="mx-auto lg:max-w-[70%]" />
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Dados protegidos</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">SSL Certificado</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Empresa regulamentada</span>
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="container mx-auto px-4">
          <motion.div
            className="mt-6 sm:mt-8 rounded-2xl bg-primary/5 p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="mb-3 sm:mb-4 text-center text-base sm:text-lg font-semibold text-neutral-charcoal">
              Por que escolher a Clica Seguros?
            </h3>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                "Sem compromisso de contratação",
                "Resultado em menos de 3 minutos",
                "Compare com outras seguradoras"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-xs sm:text-sm text-neutral-medium-gray"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-accent-emerald-green" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-light-gray bg-white/50 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs leading-relaxed text-neutral-medium-gray">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="font-medium text-primary hover:underline">
              termos de uso
            </a>{' '}
            e{' '}
            <a href="#" className="font-medium text-primary hover:underline">
              política de privacidade
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}