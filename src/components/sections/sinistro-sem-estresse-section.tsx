'use client'

import { motion } from 'framer-motion'
import { Smartphone, UserCheck, Map } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
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

export function SinistroSemEstresseSection() {
  return (
    <section className="bg-neutral-light-gray/60 py-20 md:py-28">
      <div className="container mx-auto text-center">
        <motion.h2 
          className="text-h2 text-neutral-charcoal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          Deu ruim no trânsito? Com a gente, a solução é simples.
        </motion.h2>

        <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="rounded-full bg-primary p-4">
              <Smartphone className="h-8 w-8 text-neutral-charcoal" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-neutral-charcoal">1. Avise pelo app em 2 minutos</h3>
            <p className="mt-2 text-body text-neutral-medium-gray">Um toque no app e nós já começamos a resolver.</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="rounded-full bg-primary p-4">
              <UserCheck className="h-8 w-8 text-neutral-charcoal" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-neutral-charcoal">2. Fale com um especialista dedicado</h3>
            <p className="mt-2 text-body text-neutral-medium-gray">Alguém do nosso time cuida do seu caso do início ao fim.</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="rounded-full bg-primary p-4">
              <Map className="h-8 w-8 text-neutral-charcoal" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-neutral-charcoal">3. Acompanhe o conserto em tempo real</h3>
            <p className="mt-2 text-body text-neutral-medium-gray">Saiba exatamente onde seu carro está e quando ficará pronto.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}