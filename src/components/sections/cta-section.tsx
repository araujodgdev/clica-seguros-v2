'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '../ui/button'
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star,
  Zap,
  Lock,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Badge } from '../ui/badge'

// Animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent-emerald-green/30 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  )
}

// Countdown timer component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="flex items-center gap-4">
      <Clock className="h-5 w-5 text-primary" />
      <div className="flex gap-2">
        <div className="rounded-lg bg-neutral-charcoal px-3 py-1">
          <span className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
        </div>
        <span className="text-lg font-bold text-neutral-charcoal">:</span>
        <div className="rounded-lg bg-neutral-charcoal px-3 py-1">
          <span className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
        </div>
        <span className="text-lg font-bold text-neutral-charcoal">:</span>
        <div className="rounded-lg bg-neutral-charcoal px-3 py-1">
          <span className="text-lg font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

// Floating testimonial card
function FloatingTestimonial() {
  return (
    <motion.div
      className="absolute right-[34rem] top-16 z-20 hidden w-80 lg:block"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-3 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="mb-4 text-sm text-neutral-dark-gray">
          "Fiz a simulação em 3 minutos e economizei 40% comparado ao meu seguro anterior!"
        </p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary" />
          <div>
            <p className="text-sm font-semibold text-neutral-charcoal">João Silva</p>
            <p className="text-xs text-neutral-medium-gray">Verificado há 2 horas</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Interactive form component
function SimulationForm() {
  const [step, setStep] = useState(1)
  const [carPlate, setCarPlate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative z-10 w-full space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {step === 1 ? (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-charcoal">
              Placa do seu carro
            </label>
            <motion.input
              type="text"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
              placeholder="ABC-1234"
              className="w-full rounded-xl border-2 border-neutral-light-gray bg-neutral-light-gray/10 px-5 py-4 text-center text-lg font-bold uppercase tracking-wider text-neutral-charcoal outline-none transition-all placeholder:text-neutral-medium-gray/50 focus:border-primary focus:bg-white"
              whileFocus={{ scale: 1.02 }}
              maxLength={8}
              required
            />
            <p className="text-xs text-neutral-medium-gray">
              Digite a placa do veículo que deseja proteger
            </p>
          </div>
          
          <motion.button
            type="submit"
            className="group relative w-full overflow-hidden rounded-xl bg-neutral-charcoal px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            disabled={isLoading || carPlate.length < 7}
          >
            {isLoading ? (
              <motion.div
                className="flex items-center justify-center gap-3"
                animate={{ opacity: 1 }}
              >
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Buscando dados do veículo...</span>
              </motion.div>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Começar simulação gratuita
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent-emerald-green"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </motion.button>
          
          {/* Benefits list */}
          <div className="space-y-2 border-t border-neutral-light-gray pt-4">
            {[
              "Sem compromisso de contratação",
              "Resultado em menos de 3 minutos",
              "Compare com outras seguradoras"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-sm text-neutral-medium-gray"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent-emerald-green" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <CheckCircle className="mx-auto mb-4 h-20 w-20 text-accent-emerald-green" />
          </motion.div>
          <h3 className="mb-3 text-2xl font-bold text-neutral-charcoal">
            Perfeito! Encontramos seu veículo
          </h3>
          <p className="mb-2 text-base text-neutral-medium-gray">
            {carPlate && (
              <span className="font-semibold text-neutral-charcoal">Placa: {carPlate}</span>
            )}
          </p>
          <p className="text-sm text-neutral-medium-gray">
            Preparando sua cotação personalizada...
          </p>
          <motion.div
            className="mx-auto mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-neutral-light-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent-emerald-green"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.form>
  )
}

export function CtaSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="container mx-auto">
        <motion.div 
          className="relative overflow-hidden py-16 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent-emerald-green/20"
          style={{ scale, opacity }}
        >
          <AnimatedBackground />
          
          {/* Floating elements */}
          <FloatingTestimonial />
          
          {/* Badge */}
          <motion.div
            className="absolute left-8 top-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Badge variant="secondary" className="bg-white/90 text-neutral-charcoal backdrop-blur-sm">
              <Zap className="mr-1 h-3 w-3" />
              Oferta por tempo limitado
            </Badge>
          </motion.div>
          
          <div className="relative z-10 grid grid-cols-1 gap-12 p-8 md:p-16 lg:grid-cols-2">
            {/* Left content */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Timer */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="mb-3 text-sm font-semibold text-neutral-charcoal">
                    Promoção válida por:
                  </p>
                  <CountdownTimer />
                </motion.div>
                
                <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal">
                  Que tal
                  <span className="relative mx-2">
                    <span className="relative z-10"> economizar </span>
                    <motion.div
                      className="absolute inset-0 -rotate-2 rounded-lg bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                  </span>
                  até 40%?
                </h2>
                
                <p className="mb-8 text-xl text-neutral-charcoal/80">
                  Faça uma simulação agora e descubra quanto você pode economizar 
                  com a proteção ideal para seu carro.
                </p>
                
                {/* Trust indicators */}
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: "Cobertura completa garantida" },
                    { icon: Lock, text: "Seus dados 100% seguros" },
                    { icon: TrendingUp, text: "Preços até 40% mais baixos" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="rounded-full bg-white/20 p-2">
                        <item.icon className="h-5 w-5 text-neutral-charcoal" />
                      </div>
                      <span className="font-medium text-neutral-charcoal">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Right content - Form */}
            <div className="flex items-center justify-center">
              <motion.div
                className="w-full p-10 rounded-3xl bg-white shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-neutral-charcoal">
                    Simule em 3 minutos
                  </h3>
                  <p className="mt-2 text-base text-neutral-medium-gray">
                    Sem compromisso, 100% online
                  </p>
                </div>
                
                <SimulationForm />
                
                {/* Footer text */}
                <div className="mt-8 border-t border-neutral-light-gray pt-6">
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
              </motion.div>
            </div>
          </div>
          
          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full">
              <motion.path
                d="M0,40 C480,120 960,0 1440,80 L1440,120 L0,120 Z"
                fill="rgba(255,255,255,0.1)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>
          </div>
        </motion.div>
        
        {/* Bottom trust badges */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Dados protegidos</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <Lock className="h-5 w-5" />
            <span className="text-sm">SSL Certificado</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-medium-gray">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Empresa regulamentada</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}