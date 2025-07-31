'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { FileSearch, SlidersHorizontal, FileCheck, ArrowRight, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'

const steps = [
  {
    icon: FileSearch,
    title: 'Simule em minutos',
    description: 'Responda poucas perguntas e receba uma cotação transparente na hora.',
    color: 'from-primary to-yellow-300',
    rotation: -5,
  },
  {
    icon: SlidersHorizontal,
    title: 'Personalize sua proteção',
    description: 'Ajuste as coberturas e serviços para criar um seguro que é a sua cara.',
    color: 'from-accent-emerald-green to-green-400',
    rotation: 5,
  },
  {
    icon: FileCheck,
    title: 'Contrate 100% online',
    description: 'Sem papelada, sem burocracia. Finalize tudo e comece a dirigir protegido.',
    color: 'from-primary to-accent-emerald-green',
    rotation: -3,
  },
]

// 3D Card Component
function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.5 })
  
  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 50, rotateX: -30 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: 0.8, 
          delay: index * 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotateY: isHovered ? 10 : 0,
          z: isHovered ? 50 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 blur-2xl`}
          animate={{
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Card content */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="h-full w-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          
          {/* Step number */}
          <motion.div
            className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neutral-charcoal to-neutral-dark-gray text-2xl font-bold text-white shadow-lg"
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {index + 1}
          </motion.div>
          
          {/* Icon container */}
          <motion.div
            className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${step.color} p-4`}
            animate={{
              rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <step.icon className="h-8 w-8 text-white" />
          </motion.div>
          
          {/* Content */}
          <h3 className="mb-3 text-2xl font-bold text-neutral-charcoal">
            {step.title}
          </h3>
          <p className="text-lg text-neutral-medium-gray">
            {step.description}
          </p>
          
          {/* Action arrow */}
          <motion.div
            className="mt-6 flex items-center text-sm font-semibold text-primary"
            animate={{
              x: isHovered ? 10 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <span>Saiba mais</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Animated connection line
function ConnectionLine({ progress }: { progress: number }) {
  return (
    <svg className="absolute left-0 top-1/2 -z-10 h-2 w-full -translate-y-1/2">
      <motion.path
        d="M0,4 L1000,4"
        stroke="#E8E8E6"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      <motion.path
        d="M0,4 L1000,4"
                        stroke="#52C41A"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  )
}

export function ComoFuncionaSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const [activeStep, setActiveStep] = useState(0)
  
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-neutral-off-white to-white py-32">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-accent-emerald-green/5 blur-3xl" />
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      
      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-neutral-charcoal" />
            <span className="text-sm font-semibold text-neutral-charcoal">PROCESSO SIMPLES</span>
          </motion.div>
          
          <motion.h2 
            className="mx-auto text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Proteger seu carro nunca foi
            <span className="relative ml-3">
              <span className="relative z-10 text-primary">tão fácil</span>
              <motion.div
                className="absolute -bottom-2 left-0 h-3 w-full bg-primary/30"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h2>
          
          <motion.p 
            className="mx-auto mt-6 text-xl text-neutral-medium-gray"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Nosso processo é simples, rápido e totalmente digital. 
            <br />
            <span className="font-semibold">Em apenas 3 passos você está protegido.</span>
          </motion.p>
        </div>

        {/* Steps container */}
        <div className="relative mt-20">
          {/* Connection line for desktop */}
          <div className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 md:block">
            <ConnectionLine progress={activeStep / (steps.length - 1)} />
          </div>
          
          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveStep(index)}
              >
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-neutral-charcoal px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Começar agora</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="relative z-10 h-5 w-5" />
            </motion.span>
            
            {/* Background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent-emerald-green"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <p className="mt-4 text-sm text-neutral-medium-gray">
            Leva menos de 5 minutos • Sem compromisso
          </p>
        </motion.div>
      </div>
    </section>
  )
}