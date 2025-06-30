'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto">
        <motion.div 
          className="grid grid-cols-1 overflow-hidden rounded-2xl bg-primary md:grid-cols-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Image */}
          <div className="relative h-64 w-full md:h-full">
            <Image
              src="/car-on-road.jpg"
              alt="Car on road"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-center p-8 text-neutral-charcoal md:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider">Pronto para simular?</p>
            <h2 className="mt-2 text-h2 leading-tight">
              Descubra a proteção ideal para o seu carro. Rápido, fácil e sem burocracia.
            </h2>
            <Button
              variant="secondary"
              className="mt-8 self-start border-neutral-charcoal bg-neutral-charcoal text-white hover:bg-neutral-charcoal/90"
            >
              Simular minha proteção <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}