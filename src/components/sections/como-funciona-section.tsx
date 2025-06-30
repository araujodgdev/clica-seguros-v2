'use client'

import { motion } from 'framer-motion'
import { FileSearch, SlidersHorizontal, FileCheck } from 'lucide-react'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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

const steps = [
    {
        icon: FileSearch,
        title: '1. Simule em minutos',
        description: 'Responda poucas perguntas e receba uma cotação transparente na hora.'
    },
    {
        icon: SlidersHorizontal,
        title: '2. Personalize sua proteção',
        description: 'Ajuste as coberturas e serviços para criar um seguro que é a sua cara.'
    },
    {
        icon: FileCheck,
        title: '3. Contrate 100% online',
        description: 'Sem papelada, sem burocracia. Finalize tudo online e comece a dirigir protegido.'
    }
]

export function ComoFuncionaSection() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto">
        <div className="text-center">
            <motion.h2 
              className="text-h2 text-neutral-charcoal"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
                Proteger seu carro nunca foi tão fácil
            </motion.h2>
            <motion.p 
              className="mx-auto mt-4 max-w-2xl text-body text-neutral-medium-gray"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
                Nosso processo é simples, rápido e totalmente digital. Veja como funciona:
            </motion.p>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
            {steps.map((step, index) => (
                <motion.div key={index} variants={itemVariants} className="relative flex flex-col items-center text-center">
                     {index < steps.length - 1 && (
                        <div className="absolute left-1/2 top-7 hidden h-px w-full bg-neutral-light-gray md:block" />
                    )}
                    <div className="relative z-10 rounded-full bg-white p-2 shadow-md ring-1 ring-neutral-light-gray">
                      <div className="rounded-full bg-primary p-5">
                          <step.icon className="h-8 w-8 text-neutral-charcoal" />
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-neutral-charcoal">{step.title}</h3>
                    <p className="mt-2 text-body text-neutral-medium-gray">{step.description}</p>
                </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  )
}