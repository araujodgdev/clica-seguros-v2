'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Smartphone, 
  Car,
  Shield,
  Calculator,
  Clock, 
  CheckCircle, 
  TrendingUp,
  Sparkles,
  Calendar,
  User,
  CreditCard,
  Zap
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const steps = [
  {
    id: 1,
    icon: Car,
    title: "Dados do veículo",
    description: "Digite a placa e pronto! Buscamos todos os dados do seu carro.",
    mockup: {
      type: "vehicle",
      content: "Encontramos seu veículo!"
    }
  },
  {
    id: 2,
    icon: User,
    title: "Perfil do motorista",
    description: "Algumas perguntas rápidas para personalizar sua proteção.",
    mockup: {
      type: "profile",
      content: "Calculando o melhor preço..."
    }
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Escolha seu plano",
    description: "Compare coberturas e escolha a proteção ideal para você.",
    mockup: {
      type: "plans",
      content: "3 planos disponíveis"
    }
  }
]

// Phone mockup component with simulation flow
function PhoneMockup({ step, isActive }: { step: typeof steps[0], isActive: boolean }) {
  const [showContent, setShowContent] = useState(false)
  const [plateNumber, setPlateNumber] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isActive])
  
  return (
    <motion.div
      className="relative mx-auto h-[600px] w-[300px]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.9
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Phone frame */}
      <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-neutral-charcoal p-2 shadow-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-neutral-charcoal px-6 py-2 text-xs text-white">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-full bg-white" />
              <div className="h-3 w-6 rounded-full bg-white" />
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
          </div>
          
          {/* App header */}
          <div className="bg-primary p-4 rounded-md">
            <h4 className="text-center text-lg font-bold text-neutral-charcoal text-white">Clica Seguros</h4>
          </div>
          
          {/* Progress bar */}
          <div className="px-4 pt-4">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-neutral-light-gray"
                  animate={{
                    backgroundColor: i <= step.id ? '#4667ff' : '#E8E8E6'
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
          
          {/* Content based on step */}
          <div className="p-4">
            {step.mockup.type === "vehicle" && showContent && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-charcoal">
                    Placa do veículo
                  </label>
                  <motion.input
                    type="text"
                    placeholder="ABC-1234"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-light-gray bg-white px-4 py-3 text-lg font-semibold text-neutral-charcoal outline-none transition-all focus:border-primary"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                {plateNumber.length >= 7 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-accent-emerald-green/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent-emerald-green" />
                      <div>
                        <p className="font-semibold text-neutral-charcoal">Honda Civic 2022</p>
                        <p className="text-sm text-neutral-medium-gray">1.5 Turbo - Prata</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {step.mockup.type === "profile" && showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {[
                    { label: "Idade", value: "32 anos", icon: User },
                    { label: "CEP da garagem", value: "01310-100", icon: Shield },
                    { label: "Uso do veículo", value: "Particular", icon: Car },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center justify-between rounded-lg bg-neutral-light-gray/50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-neutral-medium-gray" />
                        <span className="text-sm text-neutral-medium-gray">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-neutral-charcoal">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  className="flex items-center justify-center gap-2 rounded-full bg-primary/20 py-3"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-neutral-charcoal">
                    Calculando melhor preço...
                  </span>
                </motion.div>
              </motion.div>
            )}
            
            {step.mockup.type === "plans" && showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {[
                  { name: "Essencial", price: "69", color: "bg-neutral-light-gray" },
                  { name: "Completo", price: "89", color: "bg-primary", recommended: true },
                  { name: "Premium", price: "119", color: "bg-accent-emerald-green" },
                ].map((plan, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl p-4 ${
                      plan.recommended ? 'ring-2 ring-primary shadow-lg' : 'bg-white border border-neutral-light-gray'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-neutral-charcoal">
                        Recomendado
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutral-charcoal">{plan.name}</p>
                        <p className="text-xs text-neutral-medium-gray">Proteção completa</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-medium-gray">R$</p>
                        <p className="text-2xl font-bold text-neutral-charcoal">{plan.price}</p>
                        <p className="text-xs text-neutral-medium-gray">/mês</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Real-time price calculator component
function PriceCalculator() {
  const [currentPrice, setCurrentPrice] = useState(0)
  const targetPrice = 89
  
  useEffect(() => {
    const duration = 2000
    const start = Date.now()
    const startPrice = 150
    
    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const price = Math.floor(startPrice - (startPrice - targetPrice) * easeOut)
      setCurrentPrice(price)
      
      if (progress === 1) clearInterval(timer)
    }, 16)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <motion.div
      className="rounded-3xl bg-gradient-to-br from-primary to-accent-emerald-green p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="mb-2 text-sm font-medium text-neutral-charcoal/80">Seu preço especial</p>
      <div className="mb-4 flex items-start justify-center">
        <span className="text-2xl font-bold text-neutral-charcoal">R$</span>
        <motion.span
          className="text-6xl font-bold text-neutral-charcoal"
          key={currentPrice}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {currentPrice}
        </motion.span>
        <span className="mt-4 text-lg text-neutral-charcoal">/mês</span>
      </div>
      <Badge variant="secondary" className="bg-white/90 text-neutral-charcoal">
        <TrendingUp className="mr-1 h-3 w-3" />
        Economia de 40%
      </Badge>
    </motion.div>
  )
}

// Features showcase component
function FeaturesShowcase() {
  const features = [
    { icon: Zap, label: "Cotação em 3 minutos", value: "3min" },
    { icon: Shield, label: "Sem análise de perfil", value: "100%" },
    { icon: CreditCard, label: "Pagamento facilitado", value: "12x" },
    { icon: Clock, label: "Ativação imediata", value: "24h" },
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <motion.div
            className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent-emerald-green/20"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <feature.icon className="h-8 w-8 text-neutral-charcoal" />
          </motion.div>
          <p className="mb-1 text-2xl font-bold text-primary">{feature.value}</p>
          <p className="text-sm text-neutral-medium-gray">{feature.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export function SinistroSemEstresseSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const [activeStep, setActiveStep] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  
  // Auto-advance steps when simulating
  useEffect(() => {
    if (!isSimulating) return
    
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsSimulating(false)
          return prev
        }
        return prev + 1
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isSimulating, activeStep])
  
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-white to-neutral-light-gray/30 py-32">
      {/* Background elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-accent-emerald-green/10 blur-3xl" />
      </motion.div>
      
      {/* Floating elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full bg-primary/30"
          style={{
            left: `${15 + (i * 15)}%`,
            top: `${20 + (i * 12)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent-emerald-green/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-neutral-charcoal" />
            <span className="text-sm font-semibold text-neutral-charcoal">SIMULAÇÃO EM TEMPO REAL</span>
          </motion.div>
          
          <motion.h2 
            className="mx-auto text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Veja como é fácil 
            <br />
            <span className="relative">
              <span className="relative z-10">descobrir seu preço em</span>
              <motion.span
                className="relative z-10 ml-3 text-primary"
                animate={{
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                3 minutos
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 w-full bg-primary"
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
            Sem burocracia, sem pegadinhas. Apenas o melhor preço 
            para proteger o que é seu.
          </motion.p>
        </div>
        
        {/* Interactive demo */}
        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup step={steps[activeStep]} isActive={true} />
          </div>
          
          {/* Steps and controls */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Live price calculator */}
            {isSimulating && activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <PriceCalculator />
              </motion.div>
            )}
            
            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`relative cursor-pointer rounded-2xl p-6 transition-all ${
                    index === activeStep 
                      ? 'bg-white shadow-xl' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => setActiveStep(index)}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`rounded-xl p-3 ${
                        index === activeStep
                          ? 'bg-primary'
                          : 'bg-neutral-light-gray'
                      }`}
                      animate={{
                        scale: index === activeStep ? 1.1 : 1,
                        rotate: index === activeStep ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon className={`h-6 w-6 ${
                        index === activeStep
                          ? 'text-neutral-charcoal'
                          : 'text-neutral-medium-gray'
                      }`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-charcoal">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-neutral-medium-gray">
                        {step.description}
                      </p>
                      
                      {index === activeStep && (
                        <motion.div
                          className="mt-4 flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">
                            {isSimulating ? 'Processando...' : 'Clique para ver'}
                          </span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Progress indicator */}
                    {index <= activeStep && (
                      <motion.div
                        className="absolute -left-1 top-0 h-full w-1 rounded-full bg-primary"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Action button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="group w-full bg-neutral-charcoal hover:bg-neutral-dark-gray"
                onClick={() => {
                  setIsSimulating(true)
                  setActiveStep(0)
                }}
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Simulando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Começar simulação ao vivo
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Features showcase */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FeaturesShowcase />
        </motion.div>
        
        {/* Trust message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="outline" className="mx-auto">
            <Shield className="mr-1 h-3 w-3" />
            Seus dados protegidos com criptografia de ponta
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}