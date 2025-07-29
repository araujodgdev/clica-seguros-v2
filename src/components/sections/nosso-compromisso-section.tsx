'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  FileText, 
  ShieldCheck, 
  Users, 
  BadgeCheck, 
  Heart,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { useState, useRef } from 'react'
import { Badge } from '../ui/badge'

const features = [
  {
    icon: FileText,
    title: 'Sem letras miúdas',
    description: 'Nosso contrato é claro e direto, para que você saiba exatamente o que está contratando.',
    metric: { value: 100, label: 'Transparência' },
    color: 'from-primary to-yellow-300',
    rotation: -5,
  },
  {
    icon: ShieldCheck,
    title: 'Seguro de verdade',
    description: 'Somos regulamentados e fiscalizados pela SUSEP. Sua proteção é garantida por lei.',
    metric: { value: 100, label: 'Regulamentado' },
    color: 'from-accent-emerald-green to-green-400',
    rotation: 5,
  },
  {
    icon: Users,
    title: 'Feito por pessoas',
    description: 'Quando precisar, vai falar com gente de verdade, pronta para resolver com empatia.',
    metric: { value: 98, label: 'Satisfação' },
    color: 'from-primary to-accent-emerald-green',
    rotation: -3,
  },
  {
    icon: BadgeCheck,
    title: 'Sua tranquilidade',
    description: 'Nosso objetivo é garantir que você tenha paz de espírito para ir e vir.',
    metric: { value: 24, label: 'Horas por dia' },
    color: 'from-neutral-charcoal to-neutral-dark-gray',
    rotation: 3,
  },
]

// Feature card with 3D effect and metrics
function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <motion.div
      className="relative h-[380px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front side */}
        <div 
          className="absolute h-full w-full"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.div
            className="h-full"
            animate={{
              rotateY: isHovered ? 10 : 0,
              z: isHovered ? 50 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 blur-xl`}
              animate={{
                opacity: isHovered ? 0.4 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Card */}
            <div className="relative h-full overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="h-full w-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 15px)`,
                  }}
                />
              </div>
              
              {/* Icon */}
              <motion.div
                className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-4`}
                animate={{
                  rotate: isHovered ? feature.rotation : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </motion.div>
              
              {/* Content */}
              <h3 className="mb-3 text-xl font-bold text-neutral-charcoal">
                {feature.title}
              </h3>
              <p className="mb-6 text-neutral-medium-gray">
                {feature.description}
              </p>
              
              {/* Metric display */}
              <div className="mt-auto">
                <div className="flex items-end justify-between">
                  <div>
                    <motion.div
                      className="text-3xl font-bold text-neutral-charcoal"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: index * 0.1 + 0.3 }}
                    >
                      {feature.metric.value}{feature.metric.label === 'Satisfação' ? '%' : ''}
                    </motion.div>
                    <p className="text-sm text-neutral-medium-gray">{feature.metric.label}</p>
                  </div>
                  
                  {/* Flip button */}
                  <motion.button
                    className="rounded-full bg-neutral-light-gray p-2 transition-colors hover:bg-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(!isFlipped)
                    }}
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 h-2 w-full rounded-full bg-neutral-light-gray">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${feature.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${ feature.metric.value != 24 ? feature.metric.value : 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Back side */}
        <div 
          className="absolute h-full w-full"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full rounded-3xl bg-gradient-to-br from-neutral-charcoal to-neutral-dark-gray p-8 text-white shadow-xl">
            <h4 className="mb-4 text-xl font-bold">Por que isso importa?</h4>
            <p className="text-white/90">
              Nossa missão é transformar a experiência de ter um seguro de carro no Brasil. 
              Acreditamos que proteção deve ser simples, acessível e confiável para todos.
            </p>
            <button
              onClick={() => setIsFlipped(false)}
              className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-neutral-charcoal transition-all hover:bg-primary/90"
            >
              Voltar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Floating trust badges
function TrustBadges() {
  const badges = [
    { icon: Award, label: "Certificado SSL", delay: 0 },
    { icon: ShieldCheck, label: "LGPD Compliant", delay: 0.2 },
    { icon: Heart, label: "B Corp", delay: 0.4 },
  ]
  
  return (
    <div className="flex justify-center gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: badge.delay }}
          whileHover={{ y: -5 }}
          className="group cursor-pointer"
        >
          <div className="rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all group-hover:shadow-xl">
            <badge.icon className="h-6 w-6 text-accent-emerald-green" />
            <p className="mt-2 text-xs font-medium text-neutral-charcoal">{badge.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function NossoCompromissoSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], [-100, 100])
  
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-neutral-off-white to-white py-32">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-accent-emerald-green/5 blur-3xl" />
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/40"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 8)}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <div className="mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent-emerald-green/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-neutral-charcoal" />
            <span className="text-sm font-semibold text-neutral-charcoal">NOSSOS VALORES</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Nosso compromisso é
            <span className="relative ml-3">
              <span className="relative z-10 text-primary">com você</span>
              <motion.svg
                className="absolute -bottom-4 left-0 w-full"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewBox="0 0 100 20"
              >
                <path
                  d="M5,15 Q50,0 95,15"
                  stroke="#52C41A"
                  strokeWidth="4"
                  fill="none"
                />
              </motion.svg>
            </span>
          </motion.h2>
          
          <motion.p 
            className="mt-6 text-xl text-neutral-medium-gray"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Mais do que um seguro, oferecemos uma promessa: 
            <br />
            <span className="font-semibold">estaremos ao seu lado quando você mais precisar.</span>
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        {/* Trust section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-neutral-medium-gray">
            Confiança e segurança garantidas
          </p>
          
          <TrustBadges />
          
          {/* SUSEP badge */}
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="group relative overflow-hidden rounded-full bg-white px-8 py-4 shadow-lg ring-1 ring-neutral-light-gray/70 transition-all hover:shadow-xl">
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-neutral-medium-gray">Regulamentado por:</p>
                <div className="h-6 w-20 rounded bg-neutral-dark-gray" />
              </div>
              
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.7 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}