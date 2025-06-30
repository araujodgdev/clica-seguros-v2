'use client'

import { motion } from 'framer-motion'
import React from 'react'

const testimonials = [
  {
    quote: "Quando precisei, o atendimento foi humano e rápido. Resolveram tudo sem burocracia!",
    author: "Ana Paula, São Paulo/SP",
  },
  {
    quote: "Meu carro é antigo e achei que não conseguiria seguro. A ClicaSeguros me surpreendeu!",
    author: "Carlos Eduardo, Rio de Janeiro/RJ",
  },
  {
    quote: "O processo de sinistro foi muito simples e sem estresse. Recomendo demais!",
    author: "Fernanda Lima, Belo Horizonte/MG",
  },
  {
    quote: "Finalmente um seguro que fala a minha língua. Sem termos complicados, tudo claro.",
    author: "Roberto Silva, Curitiba/PR",
  },
  {
    quote: "Acompanhei todo o conserto do meu carro pelo app. Transparência total!",
    author: "Mariana Costa, Porto Alegre/RS",
  },
]

export function SocialProofSection() {
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-20">
      <div className="container mx-auto text-center">
        <motion.h2 
          className="mx-auto max-w-2xl text-h2 text-neutral-charcoal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          O que nossos clientes dizem
        </motion.h2>
        <motion.p 
          className="mx-auto mt-4 max-w-2xl text-lg text-neutral-medium-gray"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Histórias reais de quem encontrou a tranquilidade que buscava.
        </motion.p>
      </div>
      
      <div className="group relative mt-12 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <motion.div 
          className="flex animate-marquee group-hover:pause"
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{
            ease: 'linear',
            duration: 40,
            repeat: Infinity,
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-shrink-0 items-center justify-center px-6 py-4">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-neutral-light-gray/70">
                    <p className="text-body text-neutral-dark-gray">"{testimonial.quote}"</p>
                    <p className="mt-4 text-sm font-semibold text-neutral-medium-gray">- {testimonial.author}</p>
                </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}