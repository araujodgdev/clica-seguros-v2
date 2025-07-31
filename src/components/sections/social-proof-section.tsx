'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useState } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Quando precisei, o atendimento foi humano e rápido. Resolveram tudo sem burocracia!",
    author: "Ana Paula",
    location: "São Paulo/SP",
    rating: 5,
    avatar: "AP",
    delay: 0.1,
  },
  {
    quote: "Meu carro é antigo e achei que não conseguiria seguro. A ClicaSeguros me surpreendeu!",
    author: "Carlos Eduardo",
    location: "Rio de Janeiro/RJ",
    rating: 5,
    avatar: "CE",
    delay: 0.2,
  },
  {
    quote: "O processo de sinistro foi muito simples e sem estresse. Recomendo demais!",
    author: "Fernanda Lima",
    location: "Belo Horizonte/MG",
    rating: 5,
    avatar: "FL",
    delay: 0.3,
  },
  {
    quote: "Finalmente um seguro que fala a minha língua. Sem termos complicados, tudo claro.",
    author: "Roberto Silva",
    location: "Curitiba/PR",
    rating: 5,
    avatar: "RS",
    delay: 0.4,
  },
  {
    quote: "Acompanhei todo o conserto do meu carro pelo app. Transparência total!",
    author: "Mariana Costa",
    location: "Porto Alegre/RS",
    rating: 5,
    avatar: "MC",
    delay: 0.5,
  },
]

// Testimonial Card Component with 3D effect
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="flex flex-shrink-0 px-4 mb-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: testimonial.delay }}
    >
      <motion.div
        className="relative w-[380px] cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          rotateY: isHovered ? 5 : 0,
          z: isHovered ? 50 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          {/* Background gradient animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-emerald-green/5"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Quote icon */}
          <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20 transition-all group-hover:text-primary/40" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Rating stars */}
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: testimonial.delay + i * 0.05 }}
                >
                  <Star className="h-4 w-4 fill-primary text-primary" />
                </motion.div>
              ))}
            </div>
            
            {/* Quote */}
            <p className="mb-6 text-lg text-neutral-dark-gray">
              "{testimonial.quote}"
            </p>
            
            {/* Author info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-emerald-green text-sm font-bold text-white shadow-md"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                {testimonial.avatar}
              </motion.div>
              
              {/* Name and location */}
              <div>
                <p className="font-semibold text-neutral-charcoal">{testimonial.author}</p>
                <p className="text-sm text-neutral-medium-gray">{testimonial.location}</p>
              </div>
            </div>
          </div>
          
          {/* Hover effect border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function SocialProofSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -50])
  const [isPaused, setIsPaused] = useState(false)
  
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="relative overflow-hidden py-32">
      {/* Background decoration */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-neutral-off-white via-white to-neutral-light-gray/30"
        style={{ y }}
      />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute left-10 top-20 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-accent-emerald-green/10 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-neutral-charcoal"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            +50.000 CLIENTES SATISFEITOS
          </motion.span>
          
          <motion.h2 
            className="mx-auto text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-charcoal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Histórias reais de quem já
            <span className="relative mx-2">
              <span className="relative z-10 text-primary">mudou</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <path
                  d="M5,20 Q50,5 95,20"
                  stroke="#52C41A"
                  strokeWidth="3"
                  fill="none"
                />
              </motion.svg>
            </span>
            a forma de proteger
          </motion.h2>
          
          <motion.p 
            className="mx-auto mt-6 text-xl text-neutral-medium-gray"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Confira o que nossos clientes têm a dizer sobre a experiência com a ClicaSeguros
          </motion.p>
        </motion.div>
      </div>
      
      {/* Testimonials carousel */}
      <div 
        className="group relative mt-16 w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />
        
        <motion.div 
          className="flex"
          animate={{ 
            x: isPaused ? 0 : '-50%' 
          }}
          transition={{
            x: {
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            }
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      </div>
      
      {/* Trust badges */}
      <motion.div 
        className="mt-20 flex flex-wrap items-center justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text-center">
          <p className="text-3xl font-bold text-neutral-charcoal">4.9/5</p>
          <p className="text-sm text-neutral-medium-gray">Avaliação média</p>
        </div>
        <div className="h-12 w-px bg-neutral-light-gray" />
        <div className="text-center">
          <p className="text-3xl font-bold text-neutral-charcoal">98%</p>
          <p className="text-sm text-neutral-medium-gray">Taxa de renovação</p>
        </div>
        <div className="h-12 w-px bg-neutral-light-gray" />
        <div className="text-center">
          <p className="text-3xl font-bold text-neutral-charcoal">24h</p>
          <p className="text-sm text-neutral-medium-gray">Resposta média</p>
        </div>
      </motion.div>
    </section>
  )
}