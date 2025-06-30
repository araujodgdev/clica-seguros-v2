'use client'

import { motion } from 'framer-motion'
import { FileText, ShieldCheck, Users, BadgeCheck } from 'lucide-react'
import Image from 'next/image'

const sectionVariants = {
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

const features = [
    {
      icon: FileText,
      title: 'Sem letras miúdas',
      description: 'Nosso contrato é claro e direto, para que você saiba exatamente o que está contratando. Transparência total, sempre.',
    },
    {
      icon: ShieldCheck,
      title: 'Seguro de verdade',
      description: 'Somos regulamentados e fiscalizados pela SUSEP. Sua proteção é garantida por lei.',
    },
    {
      icon: Users,
      title: 'Feito por pessoas, para pessoas',
      description: 'Quando você precisar, vai falar com gente de verdade, pronta para resolver seu problema com empatia e agilidade.',
    },
    {
      icon: BadgeCheck,
      title: 'Sua tranquilidade é a meta',
      description: 'Nosso objetivo não é vender seguro, é garantir que você tenha paz de espírito para ir e vir sem preocupações.',
    },
  ]

export function NossoCompromissoSection() {
  return (
    <section className="bg-neutral-off-white py-20 md:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
            <motion.h2 
                className="text-h2 text-neutral-charcoal"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7 }}
            >
                Nosso compromisso é com você
            </motion.h2>
            <motion.p 
                className="mt-4 text-body text-neutral-medium-gray"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                Mais do que um seguro, oferecemos uma promessa: estaremos ao seu lado quando você mais precisar. Sem desculpas, sem estresse.
            </motion.p>
        </div>

        <motion.div 
            className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="flex flex-col items-center text-center" variants={itemVariants}>
              <div className="rounded-full bg-neutral-light-gray/80 p-4">
                <feature.icon className="h-7 w-7 text-accent-emerald-green" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-neutral-charcoal">{feature.title}</h3>
              <p className="mt-2 text-body text-neutral-medium-gray">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
            className="mt-20 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.0, delay: 0.5 }}
        >
            <div className="flex items-center gap-4 rounded-full bg-white px-6 py-3 shadow-sm ring-1 ring-neutral-light-gray/70">
                <p className="text-sm font-semibold text-neutral-medium-gray">Regulamentado por:</p>
                <Image src="/susep-logo.svg" alt="SUSEP Logo" width={80} height={24} />
            </div>
        </motion.div>
      </div>
    </section>
  )
}