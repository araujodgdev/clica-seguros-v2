'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const textContentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
    },
  },
}

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  }

export function ParaTodosOsCarrosSection() {
  return (
    <section className="overflow-hidden bg-white py-20 md:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* Left Visual */}
        <motion.div
          className="relative h-80 w-full md:h-96"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
            <Image
              src="/classic-car.jpg" // Placeholder image
              alt="Carro antigo bem cuidado"
              fill
              className="rounded-2xl object-cover"
            />
        </motion.div>
        
        {/* Right Content */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2 variants={textContentVariants} className="text-h2 text-neutral-charcoal">
            Seu carro tem história. E merece proteção.
          </motion.h2>
          <motion.p variants={textContentVariants} className="mt-4 text-body text-neutral-medium-gray">
            Não importa o ano do seu carro, nós temos a cobertura ideal para ele. Valorizamos a sua história e oferecemos a tranquilidade que você precisa para continuar rodando com segurança.
          </motion.p>
          <motion.div variants={textContentVariants}>
            <Button variant="link" className="mt-6 px-0 text-lg text-primary">
              Ver coberturas para carros mais velhos <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}