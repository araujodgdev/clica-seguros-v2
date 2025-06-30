'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-off-white py-20 md:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Left Content */}
        <motion.div
          className="z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-hero leading-none text-neutral-charcoal" variants={itemVariants}>
            Seguro de carro, finalmente do seu jeito.
          </motion.h1>
          <motion.p className="mt-6 text-lg text-neutral-medium-gray" variants={itemVariants}>
            Cotação rápida, proteção completa e a tranquilidade de saber que, se precisar, a gente resolve de verdade. Chega de estresse.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" className="mt-8">
              Simular minha proteção <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <div className="relative h-[400px] w-full">
            <motion.div 
              className="absolute right-[10%] top-0 h-full w-[80%] rounded-2xl bg-cover bg-center"
              style={{ backgroundImage: 'url(/car-on-road.jpg)'}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
            </motion.div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -left-1/4 top-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-light-gray/30 to-transparent to-70% opacity-50"></div>
    </section>
  )
}
