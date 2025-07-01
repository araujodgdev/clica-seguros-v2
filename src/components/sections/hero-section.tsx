'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Shield, Zap, CreditCard, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const start = Date.now()
    const end = start + duration
    
    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      const currentValue = Math.floor(progress * value)
      setDisplayValue(currentValue)
      
      if (progress === 1) clearInterval(timer)
    }, 16)
    
    return () => clearInterval(timer)
  }, [value])
  
  return <span>{prefix}{displayValue.toLocaleString('pt-BR')}{suffix}</span>
}

// Floating card component
function FloatingCard({ 
  children, 
  delay = 0, 
  className = '',
  floatIntensity = 10
}: { 
  children: React.ReactNode, 
  delay?: number, 
  className?: string,
  floatIntensity?: number 
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: [0, -floatIntensity, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: 4,
          delay: delay + 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet="/hero-image.png" 
          />
          <img 
            src="/hero-image.png" 
            alt="Seguro de carro moderno"
            className="h-[120%] w-full object-cover hero-image-mobile"
            loading="eager"
          />
        </picture>
      </motion.div>

      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 z-[1] opacity-20 mix-blend-overlay">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[100vh] items-center px-4 py-20">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Content - Adjusted for full background */}
          <motion.div 
            className="flex flex-col justify-center lg:col-span-7"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.9] tracking-tight text-white text-shadow-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              MUDE A FORMA
              <br />
              COMO VOCÊ
              <br />
              <span className="relative">
                <span className="relative z-10">PROTEGE</span>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-4 w-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-white/90 text-shadow-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Proteção completa para seu carro.
              <br />
              <span className="font-semibold">Simples, rápido e justo.</span>
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-primary text-neutral-charcoal hover:bg-primary/90"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center font-semibold">
                  Fazer cotação grátis 
                  <motion.span
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </span>
              </Button>
              
              <span className="text-sm text-white/70">
                <Shield className="mr-1 inline h-4 w-4" />
                Sem consulta ao CPF
              </span>
            </motion.div>

            {/* Inline stats for desktop */}
            <motion.div 
              className="mt-12 hidden gap-8 lg:flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter value={50000} prefix="+" />
                </p>
                <p className="text-sm text-white/70">Motoristas protegidos</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">
                  <AnimatedCounter value={35} suffix="%" />
                </p>
                <p className="text-sm text-white/70">Economia média</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">24h</p>
                <p className="text-sm text-white/70">Ativação</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right area with floating cards */}
          <div className="relative lg:col-span-5">
            {/* Floating Cards - Adjusted positions */}
            {/* Price card */}
            <FloatingCard 
              delay={0.8}
              className="left-0 top-20 z-20 lg:left-10"
              floatIntensity={15}
            >
              <motion.div 
                className="group cursor-pointer rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                whileHover={{ rotate: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/20 p-2">
                    <TrendingUp className="h-5 w-5 text-accent-forest-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-medium-gray">Economia garantida</p>
                    <p className="text-2xl font-bold text-neutral-charcoal">
                      Até <AnimatedCounter value={40} suffix="%" />
                    </p>
                  </div>
                </div>
              </motion.div>
            </FloatingCard>

            {/* Coverage card */}
            <FloatingCard 
              delay={1}
              className="right-0 top-40 z-20 lg:right-10"
              floatIntensity={20}
            >
              <motion.div 
                className="cursor-pointer rounded-2xl bg-neutral-charcoal p-6 text-white shadow-2xl transition-all hover:scale-105"
                whileHover={{ rotate: 2 }}
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm opacity-80">Cobertura</p>
                    <p className="text-xl font-bold">Total</p>
                  </div>
                </div>
              </motion.div>
            </FloatingCard>

            {/* Payment method card */}
            <FloatingCard 
              delay={1}
              className="left-0 top-80 z-20 lg:left-24"
              floatIntensity={20}
            >
              <motion.div 
                className="cursor-pointer rounded-2xl bg-primary p-6 text-black shadow-2xl transition-all hover:scale-105"
                whileHover={{ rotate: 2 }}
              >
                <div className="flex items-center gap-3 font-bold">
                  <span>PIX | Boleto | Cartão</span>
                </div>
              </motion.div>
            </FloatingCard>
          </div>
        </div>

        {/* Mobile stats - shown only on mobile */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-md">
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={50} prefix="+" suffix="k" />
            </p>
            <p className="text-xs text-white/70">Clientes</p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-md">
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={35} suffix="%" />
            </p>
            <p className="text-xs text-white/70">Economia</p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-md">
            <p className="text-2xl font-bold text-white">24h</p>
            <p className="text-xs text-white/70">Ativação</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-off-white to-transparent" />
    </section>
  )
}
