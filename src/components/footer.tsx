'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { 
  Layers, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Shield,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
  Users,
  Clock,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const footerLinks = {
  produtos: [
    { name: 'Seguro Auto', href: '#auto', icon: '🚗', description: 'Proteção completa' },
    { name: 'Seguro Moto', href: '#moto', icon: '🏍️', description: 'Cobertura especializada' },
    { name: 'Proteção Celular', href: '#celular', icon: '📱', description: 'Smartphone protegido' },
    { name: 'Seguro Residencial', href: '#residencial', icon: '🏠', description: 'Em breve' },
  ],
  empresa: [
    { name: 'Sobre Nós', href: '#sobre' },
    { name: 'Como Funciona', href: '#como-funciona' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Trabalhe Conosco', href: '#carreiras', badge: 'Vagas' },
    { name: 'Imprensa', href: '#imprensa' },
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '#ajuda' },
    { name: 'Perguntas Frequentes', href: '#faq' },
    { name: 'Fale Conosco', href: '#contato' },
    { name: 'Blog', href: '#blog', badge: 'Novo' },
    { name: 'Status do Sistema', href: '#status', status: 'online' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '#termos' },
    { name: 'Política de Privacidade', href: '#privacidade' },
    { name: 'Cookies', href: '#cookies' },
    { name: 'Compliance', href: '#compliance' },
  ]
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', followers: '50k' },
  { name: 'Instagram', icon: Instagram, href: '#', followers: '120k' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', followers: '35k' },
  { name: 'Twitter', icon: Twitter, href: '#', followers: '80k' },
  { name: 'YouTube', icon: Youtube, href: '#', followers: '200k' },
]

const trustBadges = [
  { icon: Shield, text: 'SSL Seguro', description: 'Dados protegidos' },
  { icon: Award, text: 'Certificado', description: 'SUSEP autorizada' },
  { icon: Users, text: '+500k', description: 'Clientes felizes' },
  { icon: Star, text: '4.9/5', description: 'Avaliação média' },
]

// Newsletter Component
function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribed(true)
    setTimeout(() => {
      setIsSubscribed(false)
      setEmail('')
    }, 3000)
  }
  
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent-emerald-green/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-emerald-green/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>
      
      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="mb-2 text-2xl font-bold text-neutral-charcoal">
            Receba ofertas exclusivas 
            <motion.span
              className="ml-2 inline-block"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </h3>
          <p className="text-neutral-medium-gray">
            Cadastre-se e ganhe 10% de desconto na primeira contratação!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 rounded-xl border-2 border-neutral-light-gray bg-white px-4 py-3 text-neutral-charcoal outline-none transition-all placeholder:text-neutral-medium-gray/50 focus:border-primary"
              required
            />
            <Button 
              type="submit" 
              className="group whitespace-nowrap"
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Inscrito!
                </motion.span>
              ) : (
                <>
                  Quero desconto
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
          
          <p className="mt-3 text-xs text-neutral-medium-gray">
            Ao se inscrever, você concorda com nossa política de privacidade. Cancele quando quiser.
          </p>
        </form>
      </div>
    </motion.div>
  )
}

// Animated Stats
function AnimatedStats() {
  const stats = [
    { value: 500, suffix: 'k+', label: 'Clientes', icon: Users },
    { value: 98, suffix: '%', label: 'Satisfação', icon: Heart },
    { value: 24, suffix: '/7', label: 'Suporte', icon: Clock },
    { value: 4.9, suffix: '/5', label: 'Avaliação', icon: Star },
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative overflow-hidden rounded-2xl bg-white/50 p-4 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
          <motion.div
            className="text-2xl font-bold text-neutral-charcoal"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
          >
            {stat.value}{stat.suffix}
          </motion.div>
          <p className="text-sm text-neutral-medium-gray">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

export function Footer() {
  const footerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])
  
  return (
    <motion.footer 
      ref={footerRef}
      className="relative overflow-hidden border-t border-neutral-light-gray bg-gradient-to-b from-neutral-off-white to-white"
      style={{ opacity }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-accent-emerald-green/5 blur-3xl" />
      </div>
      
      <motion.div 
        className="container relative z-10 mx-auto px-6"
        style={{ y }}
      >
        {/* Top Section - Newsletter & Stats */}
        <div className="grid gap-12 py-16 lg:grid-cols-2">
          <Newsletter />
          <div className="flex flex-col justify-center">
            <h3 className="mb-6 text-xl font-bold text-neutral-charcoal">
              Números que falam por si
            </h3>
            <AnimatedStats />
          </div>
        </div>
        
        {/* Main Footer Content */}
        <div className="border-t border-neutral-light-gray py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Layers className="h-10 w-10 text-primary" />
                  </motion.div>
                  <span className="text-2xl font-bold text-neutral-charcoal">Clica Seguros</span>
                </Link>
              </motion.div>
              
              <p className="mb-6 text-sm leading-relaxed text-neutral-medium-gray">
                Revolucionando o mercado de seguros com tecnologia e simplicidade. 
                Proteção completa para o que mais importa na sua vida.
              </p>
              
              {/* Trust Badges */}
              <div className="mb-8 grid grid-cols-2 gap-3">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={badge.text}
                    className="flex items-center gap-3 rounded-lg bg-white/70 p-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
                  >
                    <badge.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-charcoal">{badge.text}</p>
                      <p className="text-xs text-neutral-medium-gray">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Links */}
              <div>
                <p className="mb-4 text-sm font-semibold text-neutral-charcoal">
                  Siga-nos nas redes
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="group relative overflow-hidden rounded-xl bg-white p-3 shadow-sm transition-all hover:shadow-md"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="h-5 w-5 text-neutral-medium-gray transition-colors group-hover:text-primary" />
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      {social.followers && (
                        <motion.span
                          className="absolute -right-1 -top-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                        >
                          {social.followers}
                        </motion.span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Links Sections */}
            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              {/* Produtos */}
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-charcoal">
                  <Zap className="h-4 w-4 text-primary" />
                  Produtos
                </h3>
                <ul className="space-y-3">
                  {footerLinks.produtos.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={link.href} 
                        className="group flex items-center gap-3 text-sm text-neutral-medium-gray transition-all hover:text-primary"
                      >
                        <span className="text-lg">{link.icon}</span>
                        <div>
                          <span className="block font-medium group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                          <span className="text-xs text-neutral-medium-gray/70">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Empresa */}
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-charcoal">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Empresa
                </h3>
                <ul className="space-y-3">
                  {footerLinks.empresa.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={link.href} 
                        className="group flex items-center gap-2 text-sm text-neutral-medium-gray transition-all hover:text-primary"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                        {link.badge && (
                          <Badge variant="primary" size="sm">
                            {link.badge}
                          </Badge>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Suporte */}
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-charcoal">
                  <Shield className="h-4 w-4 text-primary" />
                  Suporte
                </h3>
                <ul className="space-y-3">
                  {footerLinks.suporte.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={link.href} 
                        className="group flex items-center gap-2 text-sm text-neutral-medium-gray transition-all hover:text-primary"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                        {link.badge && (
                          <Badge variant="primary" size="sm">
                            {link.badge}
                          </Badge>
                        )}
                        {link.status === 'online' && (
                          <motion.span
                            className="h-2 w-2 rounded-full bg-accent-emerald-green"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-charcoal">
                  <Award className="h-4 w-4 text-primary" />
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={link.href} 
                        className="group text-sm text-neutral-medium-gray transition-all hover:text-primary"
                      >
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {link.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-neutral-light-gray py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-neutral-medium-gray md:flex-row md:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              &copy; {new Date().getFullYear()} Clica Seguros. Feito com 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </motion.span>
              no Brasil
            </motion.p>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link 
                href="#" 
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                São Paulo, SP
              </Link>
              <Link 
                href="tel:0800123456" 
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                0800 123 456
              </Link>
              <Link 
                href="mailto:contato@clicaseguros.com.br" 
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                contato@clicaseguros.com.br
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" className="w-full">
          <motion.path
            d="M0,50 C360,100 720,0 1440,50 L1440,100 L0,100 Z"
            fill="url(#footerGradient)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFA500" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#FFA500" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.footer>
  )
}
