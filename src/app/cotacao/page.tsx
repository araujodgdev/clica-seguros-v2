'use client'

import { Suspense, useEffect, useState, lazy } from 'react'
import { useSearchParams } from 'next/navigation'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InsuranceOffer, CarDetails } from '@/lib/types/simulation'
import { MOCK_OFFERS } from '@/lib/services/mock-data'
import { NavigationService } from '@/lib/services/navigation'
import { Star, Shield, Car, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'

// Lazy load heavy components for better performance
const MotionDiv = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.div })))

// Enhanced loading component with sophisticated animations
function QuoteResultsLoading() {
  return (
    <div className="min-h-screen bg-neutral-light-gray/20">
      <div className="container mx-auto px-4 py-16">
        {/* Enhanced header skeleton */}
        <div className="text-center mb-16">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title skeleton with shimmer */}
            <div className="relative overflow-hidden">
              <div className="h-16 bg-white/20 rounded-2xl w-96 mx-auto" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Subtitle skeleton */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="h-6 bg-white/15 rounded-lg w-80 mx-auto" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
            </motion.div>

            {/* Stats skeleton */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 rounded-xl w-24 h-20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden bg-white/10 rounded-xl h-96"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Card content skeleton */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-white/20 rounded w-32" />
                  <div className="h-5 bg-white/15 rounded w-12" />
                </div>
                
                {/* Badge */}
                <div className="h-6 bg-white/15 rounded-full w-24" />
                
                {/* Price */}
                <div className="text-center space-y-2 py-4">
                  <div className="h-10 bg-white/25 rounded w-32 mx-auto" />
                  <div className="h-4 bg-white/15 rounded w-20 mx-auto" />
                </div>
                
                {/* Features */}
                <div className="space-y-3">
                  <div className="h-4 bg-white/15 rounded w-28" />
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded-full" />
                      <div className="h-3 bg-white/15 rounded flex-1" />
                    </div>
                  ))}
                </div>
                
                {/* Button */}
                <div className="pt-4">
                  <div className="h-12 bg-white/20 rounded-lg" />
                </div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: [-100, 400] }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: i * 0.3
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Loading indicator with text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-white font-medium">
              Encontrando as melhores ofertas para você...
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Individual offer card component with advanced interactions
function OfferCard({ offer, carDetails, index }: { offer: InsuranceOffer; carDetails?: CarDetails; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [focusRingActive, setFocusRingActive] = useState(false)

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      rotateX: 5
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1] as any
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateX: -2,
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1] as any
      }
    }
  }

  const priceVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }

  const badgeVariants = {
    initial: { x: 0, opacity: 0.9 },
    hover: { 
      x: 2, 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  }

  // Determine popularity ranking for visual hierarchy
  const isPopular = offer.rating >= 4.7
  const isBestValue = offer.savings >= 40

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full relative group"
      style={{ perspective: 1000 }}
    >
      {/* Popular/Best Value Ribbon */}
      {(isPopular || isBestValue) && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
          className="absolute -top-2 -left-2 z-20"
        >
          <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
            isBestValue ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            {isBestValue ? '🔥 MELHOR OFERTA' : '⭐ MAIS POPULAR'}
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8">
        {/* Animated background glow on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-emerald-green/5 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Header with enhanced hierarchy */}
        <div className="mb-6 relative">
          <div className="flex items-start justify-between mb-4">
            <motion.h3 
              className="text-xl font-bold text-neutral-charcoal leading-tight"
              animate={{ color: isHovered ? '#52C41A' : '#2C2C2C' }}
              transition={{ duration: 0.2 }}
            >
              {offer.insurerName}
            </motion.h3>
            
            <motion.div 
              className="flex items-center gap-1 bg-white/50 rounded-full px-2 py-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-neutral-charcoal">
                {offer.rating}
              </span>
            </motion.div>
          </div>
          
          {/* Enhanced savings badge with animation */}
          {offer.savings > 0 && (
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
            >
              <Badge 
                variant="default" 
                className="bg-gradient-to-r from-primary to-accent-emerald-green text-white font-semibold shadow-lg"
              >
                💰 Economize R$ {offer.savings}/mês
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Premium pricing with enhanced visual hierarchy */}
        <motion.div 
          className="mb-8 relative"
          variants={priceVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        >
          <div className="text-center relative">
            {/* Price highlight background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-emerald-green/10 rounded-xl"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative p-4">
              <div className="text-4xl font-black text-neutral-charcoal mb-2 tracking-tight">
                R$ {offer.monthlyPremium.toLocaleString('pt-BR')}
              </div>
              <div className="text-base text-neutral-medium-gray font-medium">por mês</div>
              <div className="text-sm text-neutral-medium-gray mt-2 flex items-center justify-center gap-1">
                <Shield className="w-4 h-4" />
                Franquia: R$ {offer.deductible.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced coverage highlights */}
        <div className="mb-8 flex-grow">
          <motion.h4 
            className="text-sm font-bold text-neutral-dark-gray mb-4 flex items-center gap-2 uppercase tracking-wide"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            <Shield className="w-5 h-5 text-accent-emerald-green" />
            Coberturas Incluídas
          </motion.h4>
          
          <ul className="space-y-3">
            {offer.coverageHighlights.map((highlight, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-start gap-3 text-sm text-neutral-dark-gray"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <CheckCircle className="w-5 h-5 text-accent-emerald-green flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Enhanced CTA Button */}
        <div className="mt-auto">
          <Link 
            href={`/cotacao/${offer.id}`} 
            className="block"
            onFocus={() => setFocusRingActive(true)}
            onBlur={() => setFocusRingActive(false)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-accent-emerald-green hover:from-accent-emerald-green hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Ver Detalhes
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Main quote results content component
function QuoteResultsContent() {
  const searchParams = useSearchParams()
  const [offers, setOffers] = useState<InsuranceOffer[]>([])
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dynamic SEO meta tags based on car details
  useEffect(() => {
    if (carDetails && typeof window !== 'undefined') {
      const title = `Cotações para ${carDetails.make} ${carDetails.model} ${carDetails.year} | Clica Seguros`
      const description = `Compare as melhores opções de seguro auto para seu ${carDetails.make} ${carDetails.model}. Economize até 40% com cobertura completa.`
      
      document.title = title
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
      
      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (!ogTitle) {
        ogTitle = document.createElement('meta')
        ogTitle.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitle)
      }
      ogTitle.setAttribute('content', title)
      
      let ogDescription = document.querySelector('meta[property="og:description"]')
      if (!ogDescription) {
        ogDescription = document.createElement('meta')
        ogDescription.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescription)
      }
      ogDescription.setAttribute('content', description)
    }
  }, [carDetails])

  useEffect(() => {
    const loadQuoteResults = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if we have URL parameters (direct navigation with data)
        const hasUrlParams = searchParams.has('licensePlate')
        
        if (hasUrlParams) {
          // Use NavigationService to validate URL parameters
          const validation = NavigationService.validateQuoteResultsParams(searchParams)
          
          if (!validation.isValid) {
            throw new Error(
              `Dados da simulação inválidos: ${validation.errors.join(', ')}. ` +
              'Por favor, refaça a cotação.'
            )
          }

          const { licensePlate, carDetails: validatedCarDetails } = validation.data!

          // Set car details if available from validation
          if (validatedCarDetails) {
            setCarDetails(validatedCarDetails)
          }
        } else {
          // Check for session data from simulation flow
          const sessionData = typeof window !== 'undefined' ? sessionStorage.getItem('cotacao-loaded') : null
          
          if (sessionData) {
            try {
              const parsedData = JSON.parse(sessionData)
              if (parsedData.carDetails) {
                setCarDetails(parsedData.carDetails)
              }
            } catch (e) {
              console.warn('Failed to parse session data:', e)
            }
          }
        }

        // Simulate loading delay with realistic timing
        const loadingDelay = Math.random() * 1500 + 800 // 800-2300ms
        await new Promise(resolve => setTimeout(resolve, loadingDelay))
        
        // Simulate occasional loading errors (3% chance, reduced from 5%)
        if (Math.random() < 0.03) {
          throw new Error('Erro temporário ao carregar cotações. Tente novamente em alguns instantes.')
        }

        // Use mock offers for now - in real implementation, this would call an API
        // with the form data to get personalized offers
        setOffers(MOCK_OFFERS)
        
        // Store successful load in sessionStorage for navigation tracking
        if (typeof window !== 'undefined') {
          const sessionData: any = {
            timestamp: Date.now(),
            carDetails: carDetails || null
          }
          
          // Add form data if available from URL params
          if (hasUrlParams) {
            const validation = NavigationService.validateQuoteResultsParams(searchParams)
            if (validation.isValid && validation.data) {
              sessionData.licensePlate = validation.data.licensePlate
              if (validation.data.carDetails) {
                sessionData.carDetails = validation.data.carDetails
              }
            }
          }
          
          sessionStorage.setItem('cotacao-loaded', JSON.stringify(sessionData))
        }
        
      } catch (err) {
        console.error('Error loading quote results:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar cotações')
        
        // Clear any stored session data on error
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('cotacao-loaded')
        }
      } finally {
        setLoading(false)
      }
    }

    loadQuoteResults()
  }, [searchParams])

  if (loading) {
    return <QuoteResultsLoading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light-gray/20">
        <div className="container mx-auto px-4 py-16">
          <div className=" mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8">
                  <div className="text-red-500 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-charcoal mb-4">
                    Ops! Algo deu errado
                  </h1>
                  <p className="text-neutral-dark-gray mb-6">
                    {error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="default" 
                      size="lg"
                      onClick={() => window.location.reload()}
                    >
                      Tentar Novamente
                    </Button>
                    <Link href="/">
                      <Button variant="secondary" size="lg">
                        Voltar ao Início
                      </Button>
                    </Link>
                  </div>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light-gray/20">
      <div className="container mx-auto px-4 py-16">
        {/* Enhanced Header Section with Dynamic Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-16 relative"
        >
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-charcoal mb-4 tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="block"
              >
                Suas Cotações
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block text-primary"
              >
                Estão Prontas! ✨
              </motion.span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-neutral-medium-gray mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Encontramos <span className="text-primary font-bold">{offers.length} opções exclusivas</span> de seguro 
            para o seu veículo. Compare benefícios e escolha a proteção perfeita.
          </motion.p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {offers.map((offer, index) => (
              <OfferCard 
                key={offer.id}
                offer={offer} 
                carDetails={carDetails || undefined} 
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Footer Section with Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          {/* Trust indicators */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { icon: '⚡', label: 'Ativação Rápida', desc: 'Em até 24h' },
              { icon: '🔒', label: 'Seguro e Confiável', desc: '100% Protegido' },
              { icon: '📞', label: 'Suporte 24/7', desc: 'Sempre disponível' },
              { icon: '💎', label: 'Melhor Preço', desc: 'Garantido' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-semibold text-sm">{item.label}</div>
                <div className="text-white/70 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>


        </motion.div>
      </div>
    </div>
  )
}



// Main page component with Suspense wrapper
export default function QuoteResultsPage() {
  return (
    <>
      <Suspense fallback={<QuoteResultsLoading />}>
        <QuoteResultsContent />
      </Suspense>
      <Footer />
    </>
  )
}