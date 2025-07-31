
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Mail, Lock, User, ArrowRight, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

const AuthForm = ({ isSignUp }: { isSignUp: boolean }) => {
  const variants = {
    hidden: { opacity: 0, x: isSignUp ? -50 : 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isSignUp ? 50 : -50 },
  }

  return (
    <motion.div
      key={isSignUp ? 'signup' : 'signin'}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: 'tween', duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-neutral-charcoal">
        {isSignUp ? 'Criar Conta' : 'Bem-vindo de Volta'}
      </h2>
      <p className="text-center text-neutral-medium-gray">
        {isSignUp
          ? 'Preencha os campos para começar.'
          : 'Acesse sua conta para continuar.'}
      </p>

      <form className="space-y-4">
        {isSignUp && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-light-gray" />
            <input
              type="text"
              placeholder="Nome Completo"
              className="w-full pl-10 pr-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-light-gray" />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full pl-10 pr-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-light-gray" />
          <input
            type="password"
            placeholder="Senha"
            className="w-full pl-10 pr-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <Button variant="default" size="lg" className="w-full group">
          {isSignUp ? 'Criar Conta' : 'Entrar'}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-light-gray"></div>
        </div>
        <div className="relative bg-white px-2 text-sm text-neutral-medium-gray">
          Ou continue com
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="secondary" className="w-full">
          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Google
        </Button>
      </div>
    </motion.div>
  )
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <>
      <div className="min-h-screen w-full bg-neutral-light-gray/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-8 sm:p-10 md:p-12 w-full mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 p-1 rounded-full flex gap-1">
                <Button
                  onClick={() => setIsSignUp(false)}
                  variant={!isSignUp ? 'default' : 'ghost'}
                  className="rounded-full px-6 py-2 transition-all"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
                <Button
                  onClick={() => setIsSignUp(true)}
                  variant={isSignUp ? 'default' : 'ghost'}
                  className="rounded-full px-6 py-2 transition-all"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Conta
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <AuthForm isSignUp={isSignUp} />
            </AnimatePresence>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-neutral-medium-gray hover:text-primary transition-colors"
              >
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
