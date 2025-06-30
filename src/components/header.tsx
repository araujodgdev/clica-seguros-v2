'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#produtos', label: 'Produtos' },
  { href: '#solucoes', label: 'Soluções' },
  { href: '#desenvolvedores', label: 'Desenvolvedores' },
  { href: '#recursos', label: 'Recursos' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-light-gray/50 bg-neutral-off-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Layers className="h-8 w-8 text-neutral-charcoal" />
          <span className="text-lg font-bold text-neutral-charcoal">Clica Seguros</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-neutral-medium-gray transition-colors hover:text-neutral-charcoal">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden items-center space-x-4 md:flex">
          <Button variant="ghost" className="text-sm">
            Entrar
          </Button>
          <Button>Começar agora</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-md p-2 text-neutral-charcoal">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-neutral-light-gray/50 md:hidden"
          >
            <div className="flex flex-col space-y-4 p-6">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-base font-medium text-neutral-dark-gray" onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-4 border-t border-neutral-light-gray pt-6">
                <Button variant="ghost">Entrar</Button>
                <Button>Começar agora</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 