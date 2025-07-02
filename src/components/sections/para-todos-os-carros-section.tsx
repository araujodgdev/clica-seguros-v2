'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { ArrowRight, Car, Calendar, Shield, CheckCircle, ChevronLeft, ChevronRight, Sparkles, Zap, TrendingUp, MessageCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Badge } from '../ui/badge'

const carTypes = [
  {
    id: 1,
    title: "Carros novos",
    age: "0-3 anos",
    description: "Proteção completa com assistência 24h e carro reserva",
    image: "/modern-car.jpg",
    features: ["Cobertura total", "Vidros inclusos", "Carro reserva", "Guincho ilimitado"],
    color: "from-primary to-yellow-300",
    price: "A partir de R$ 89/mês",
    discount: "-35%"
  },
  {
    id: 2,
    title: "Seminovos",
    age: "4-8 anos",
    description: "Coberturas flexíveis que cabem no seu bolso",
    image: "/seminovo-car.jpg",
    features: ["Terceiros inclusos", "Assistência 24h", "Proteção vidros", "Franquia reduzida"],
    color: "from-accent-emerald-green to-green-400",
    price: "A partir de R$ 69/mês",
    discount: "-40%"
  },
  {
    id: 3,
    title: "Carros com história",
    age: "9+ anos",
    description: "Seu carro antigo também merece proteção especial",
    image: "/classic-car.jpg",
    features: ["Preço justo", "Peças garantidas", "Oficinas parceiras", "Sem análise de perfil"],
    color: "from-neutral-charcoal to-neutral-dark-gray",
    price: "A partir de R$ 49/mês",
    discount: "-45%"
  },
]

// Car Card Component with enhanced 3D effect
function CarCard({ car, isActive }: { car: typeof carTypes[0], isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5,
        scale: isActive ? 1 : 0.9,
      }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        animate={{
          rotateY: isHovered ? 5 : 0,
          z: isHovered ? 50 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${car.color} opacity-0 blur-2xl`}
          animate={{
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Main card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Image section with overlay */}
          <div className="relative h-64 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${car.color} opacity-80 mix-blend-multiply`} />
              <div className="h-full w-full bg-gradient-to-br from-neutral-light-gray to-neutral-medium-gray" />
            </motion.div>
            
            {/* Floating badges */}
            <motion.div
              className="absolute right-4 top-4 space-y-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="primary" className="bg-white/90 text-neutral-charcoal backdrop-blur-sm">
                <Calendar className="mr-1 h-3 w-3" />
                {car.age}
              </Badge>
              <Badge variant="primary" className="bg-red-500 text-white">
                <TrendingUp className="mr-1 h-3 w-3" />
                {car.discount}
              </Badge>
            </motion.div>
            
            {/* Car icon animation */}
            <motion.div
              className="absolute bottom-4 left-4 rounded-full bg-white/90 p-3 backdrop-blur-sm"
              animate={{
                x: isHovered ? [0, 10, 0] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Car className="h-6 w-6 text-neutral-charcoal" />
            </motion.div>
          </div>
          
          {/* Content section */}
          <div className="p-8">
            <h3 className="mb-2 text-2xl font-bold text-neutral-charcoal">{car.title}</h3>
            <p className="mb-4 text-lg text-neutral-medium-gray">{car.description}</p>
            
            {/* Price highlight */}
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-neutral-charcoal">{car.price}</span>
            </motion.div>
            
            {/* Features list */}
            <div className="mb-6 space-y-2">
              {car.features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CheckCircle className="h-5 w-5 text-accent-emerald-green" />
                  <span className="text-neutral-dark-gray">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Button */}
            <motion.button
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-charcoal px-6 py-3 font-semibold text-white transition-all hover:bg-neutral-dark-gray"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-4 w-4" />
              Simular agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Enhanced Timeline Component
function Timeline({ activeIndex, onSelect }: { activeIndex: number, onSelect: (index: number) => void }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Timeline line */}
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-neutral-light-gray" />
      <motion.div
        className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${(activeIndex / (carTypes.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Timeline points */}
      <div className="relative flex justify-between">
        {carTypes.map((car, index) => (
          <motion.button
            key={car.id}
            onClick={() => onSelect(index)}
            className="group relative flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Point */}
            <motion.div
              className={`relative h-12 w-12 rounded-full border-4 ${
                index <= activeIndex
                  ? 'border-primary bg-primary'
                  : 'border-neutral-light-gray bg-white'
              } transition-all duration-300`}
              animate={{
                scale: index === activeIndex ? 1.2 : 1,
              }}
            >
              {/* Pulse effect for active */}
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
              
              <div className="flex h-full w-full items-center justify-center">
                <Car className={`h-5 w-5 ${index <= activeIndex ? 'text-neutral-charcoal' : 'text-neutral-medium-gray'}`} />
              </div>
            </motion.div>
            
            {/* Label */}
            <motion.span
              className={`mt-3 text-sm font-semibold ${
                index === activeIndex ? 'text-neutral-charcoal' : 'text-neutral-medium-gray'
              }`}
            >
              {car.age}
            </motion.span>
            
            {/* Hover tooltip */}
            <motion.div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-charcoal px-3 py-1 text-xs text-white opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.2 }}
            >
              {car.title}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export function ParaTodosOsCarrosSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < carTypes.length - 1 ? prev + 1 : 0))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])
  
  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : carTypes.length - 1))
  }
  
  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev < carTypes.length - 1 ? prev + 1 : 0))
  }
  
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-off-white py-32">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-accent-emerald-green/5 blur-3xl" />
      </motion.div>
      
      {/* Road animation */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-neutral-dark-gray">
        <motion.div
          className="h-full bg-repeating-linear-gradient"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #52C41A 0, #52C41A 20px, transparent 20px, transparent 40px)',
          }}
          animate={{ x: [0, 40] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2"
          >
            <Shield className="h-4 w-4 text-neutral-charcoal" />
            <span className="text-sm font-semibold text-neutral-charcoal">PARA TODOS OS CARROS</span>
          </motion.div>
          
          <motion.h2 
            className="mx-auto max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Seu carro tem
            <span className="relative mx-3">
              <span className="relative z-10 text-primary">história</span>
              <motion.div
                className="absolute inset-0 -rotate-2 rounded-lg bg-neutral-charcoal"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </span>
            e merece proteção
          </motion.h2>
          
          <motion.p 
            className="mx-auto mt-6 max-w-2xl text-xl text-neutral-medium-gray"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Não importa se é zero km ou se já rodou muito. 
            <br />
            <span className="font-semibold">Temos o plano ideal para cada fase.</span>
          </motion.p>
        </div>
      </div>
    </section>
  )
}