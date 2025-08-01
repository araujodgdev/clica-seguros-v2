'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Layers, 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronDown,
  Sparkles,
  Shield,
  Car,
  CreditCard,
  FileText,
  Users,
  Headphones,
  BookOpen,
  Youtube,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Zap,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navLinks = [
  { 
    href: '#produtos', 
    label: 'Produtos',
    icon: Shield,
    submenu: [
      { label: 'Seguro Auto', href: '#auto', icon: Car, description: 'Proteção completa para seu veículo' },
      { label: 'Seguro Moto', href: '#moto', icon: Zap, description: 'Cobertura especializada para motos' },
      { label: 'Proteção Celular', href: '#celular', icon: Shield, description: 'Seu smartphone sempre protegido' },
    ]
  },
  { 
    href: '#solucoes', 
    label: 'Soluções',
    icon: Sparkles,
    submenu: [
      { label: 'Para Você', href: '#pessoal', icon: Users, description: 'Planos individuais personalizados' },
      { label: 'Para Empresas', href: '#empresas', icon: TrendingUp, description: 'Soluções corporativas flexíveis' },
      { label: 'Para Parceiros', href: '#parceiros', icon: Headphones, description: 'Programa de parceria lucrativo' },
    ]
  },
  { 
    href: '#recursos', 
    label: 'Recursos',
    icon: BookOpen,
    submenu: [
      { label: 'Central de Ajuda', href: '#ajuda', icon: MessageCircle, description: 'Tire suas dúvidas rapidamente' },
      { label: 'Blog', href: '#blog', icon: FileText, description: 'Dicas e novidades do mercado' },
      { label: 'Tutoriais', href: '#tutoriais', icon: Youtube, description: 'Aprenda com vídeos práticos' },
    ]
  },
]

// Notification component
function NotificationBell() {
  const [hasNotifications, setHasNotifications] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  
  const notifications = [
    { id: 1, text: "Novo desconto disponível!", time: "2 min", isNew: true },
    { id: 2, text: "Sua cotação está pronta", time: "1h", isNew: true },
    { id: 3, text: "Lembrete: renovação em 30 dias", time: "2h", isNew: false },
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationsRef])
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative rounded-full p-2 text-neutral-medium-gray transition-colors hover:bg-neutral-light-gray hover:text-neutral-charcoal"
      >
        <Bell className="h-5 w-5" />
        {hasNotifications && (
          <motion.span
            className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </button>
      
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 rounded-2xl bg-white p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-charcoal">Notificações</h3>
              <button
                onClick={() => setHasNotifications(false)}
                className="text-xs text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            </div>
            
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-neutral-light-gray/50"
                  whileHover={{ x: 5 }}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${notification.isNew ? 'bg-primary' : 'bg-neutral-light-gray'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-charcoal">{notification.text}</p>
                    <p className="text-xs text-neutral-medium-gray">{notification.time} atrás</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              className="mt-4 w-full rounded-lg border border-neutral-light-gray py-2 text-sm font-medium text-neutral-charcoal transition-colors hover:bg-neutral-light-gray"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver todas as notificações
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Search component
function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="rounded-full p-2 text-neutral-medium-gray transition-colors hover:bg-neutral-light-gray hover:text-neutral-charcoal"
      >
        <Search className="h-5 w-5" />
      </button>
      
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 240 }}
            exit={{ opacity: 0, width: 0 }}
            className="absolute right-0 top-0 overflow-hidden"
          >
            <div className="flex items-center rounded-full bg-white shadow-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-4 py-2 text-sm outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-neutral-medium-gray hover:text-neutral-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mega menu component
function MegaMenu({ item, isOpen }: { item: typeof navLinks[0], isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && item.submenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-1/2 top-full mt-2 w-[80rem] -translate-x-1/2 transform z-50"
        >
          <div className="rounded-2xl border border-neutral-light-gray/50 bg-white px-8 py-10 shadow-2xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {item.submenu.map((subitem, index) => (
                <motion.a
                  key={subitem.href}
                  href={subitem.href}
                  className="group flex gap-5 rounded-xl p-5 transition-all hover:bg-neutral-light-gray/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <div className=" rounded-xl transition-all group-hover:scale-110">
                    <subitem.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-base font-semibold text-neutral-charcoal transition-colors group-hover:text-primary">
                      {subitem.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-medium-gray">
                      {subitem.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-neutral-light-gray opacity-0 transition-all group-hover:translate-x-2 group-hover:text-primary group-hover:opacity-100" />
                </motion.a>
              ))}
            </div>
            
            {/* Featured section */}
            <motion.div
              className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent-emerald-green/5 p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex-1">
                  <Badge variant="primary" className="mb-3">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Novidade
                  </Badge>
                  <h3 className="mb-2 text-xl font-bold text-neutral-charcoal">
                    Simule em apenas 3 minutos
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-medium-gray">
                    Faça uma cotação rápida e descubra quanto pode economizar com nossos planos
                  </p>
                </div>
                <Link href="/simulacao">
                  <Button size="default" className="group whitespace-nowrap">
                    Simular agora
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { scrollY } = useScroll()
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64])
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full overflow-visible transition-all ${
        isScrolled 
          ? 'border-b border-neutral-light-gray/50 shadow-lg' 
          : ''
      }`}
      style={{
        height: headerHeight,
        backgroundColor: `rgba(248, 248, 246, ${headerOpacity})`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-6 overflow-visible">
        {/* Logo with animation */}
        <Link href="/" className="group flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Layers className="h-8 w-8 text-neutral-charcoal" />
          </motion.div>
          <span className="text-lg font-bold text-neutral-charcoal">
            Clica Seguros
          </span>
          <Badge variant="primary" className="text-white ml-2 hidden md:inline-flex">
            <Zap className="mr-1 h-3 w-3" />
            Novo
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-10 lg:flex overflow-visible">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => setActiveMenu(link.href)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link 
                href={link.href} 
                className="flex items-center gap-1 text-sm font-medium text-black transition-colors hover:text-neutral-charcoal"
              >
                {link.label}
                {link.submenu && (
                  <motion.div
                    animate={{ rotate: activeMenu === link.href ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                )}
              </Link>
              
              {/* Active indicator */}
              {activeMenu === link.href && (
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <MegaMenu item={link} isOpen={activeMenu === link.href} />
            </div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>
          
          {/* Notifications */}
          <div className="hidden md:block">
            <NotificationBell />
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link href="/sign-in">
              <Button variant="default" className="group hover:cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Entrar
                <ArrowRight className="ml-2 h-4 w-4 " />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="rounded-md p-2 text-neutral-charcoal"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-neutral-light-gray/50 bg-white lg:hidden"
          >
            <div className="container mx-auto px-6 py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="flex items-center rounded-full bg-neutral-light-gray/50 px-4 py-2">
                  <Search className="mr-2 h-5 w-5 text-neutral-medium-gray" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              
              {/* Mobile Nav */}
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link 
                      href={link.href} 
                      className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-neutral-dark-gray transition-colors hover:bg-neutral-light-gray/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </span>
                      {link.submenu && <ChevronDown className="h-4 w-4" />}
                    </Link>
                    
                    {link.submenu && (
                      <div className="ml-12 mt-2 space-y-2">
                        {link.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block rounded-lg px-4 py-2 text-sm text-neutral-medium-gray hover:text-neutral-charcoal"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              
              {/* Mobile CTAs */}
              <div className="mt-6 space-y-3 border-t border-neutral-light-gray pt-6">
                <Link href="/auth">
                  <Button className="w-full hover:cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              </div>
              
              {/* Mobile notifications badge */}
              <div className="mt-6 rounded-lg bg-primary/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-neutral-charcoal">
                      3 novas notificações
                    </span>
                  </div>
                  <Badge variant="primary" size="sm">
                    Ver
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
} 