'use client'

import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InsuranceOffer } from '@/lib/types/simulation'
import { getOfferDetails } from '@/lib/services/mock-data'
import { 
  Star, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Phone, 
  Mail,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'

// Lazy load heavy components for better performance
const MotionDiv = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.div })))

// Loading component for offer details
function OfferDetailsLoading() {
  return (
    <div className="min-h-screen bg-neutral-light-gray/20">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto">
          <div className="h-8 bg-white/20 rounded-lg w-64 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-white/10 rounded-xl animate-pulse mb-6" />
              <div className="h-64 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="h-80 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OfferDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [offer, setOffer] = useState<InsuranceOffer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dynamic SEO meta tags based on offer details
  useEffect(() => {
    if (offer && typeof window !== 'undefined') {
      const title = `${offer.insurerName} - Seguro Auto por R$ ${offer.monthlyPremium}/mês | Clica Seguros`
      const description = `Seguro auto ${offer.insurerName} com cobertura completa por R$ ${offer.monthlyPremium}/mês. Economize R$ ${offer.savings}/mês com ativação em 24h.`
      
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

      // Add structured data for better SEO
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "InsuranceQuote",
        "name": `Seguro Auto ${offer.insurerName}`,
        "description": description,
        "provider": {
          "@type": "Organization",
          "name": offer.insurerName
        },
        "priceRange": `R$ ${offer.monthlyPremium}`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": offer.rating,
          "bestRating": "5"
        }
      }

      let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script')
        structuredDataScript.setAttribute('type', 'application/ld+json')
        document.head.appendChild(structuredDataScript)
      }
      structuredDataScript.textContent = JSON.stringify(structuredData)
    }
  }, [offer])

  useEffect(() => {
    const loadOfferDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const offerId = params.offerId as string
        
        // Validate offerId parameter
        if (!offerId || typeof offerId !== 'string') {
          throw new Error('ID da oferta inválido')
        }
        
        const offerData = await getOfferDetails(offerId)
        
        if (!offerData) {
          setError('Oferta não encontrada')
          return
        }
        
        setOffer(offerData)
      } catch (err) {
        console.error('Error loading offer details:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes da oferta')
      } finally {
        setLoading(false)
      }
    }

    loadOfferDetails()
  }, [params.offerId])

  // Enhanced browser back button handling with better navigation logic
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if we have session storage data about the previous cotacao page
      const cotacaoData = sessionStorage.getItem('cotacao-loaded')
      
      if (cotacaoData) {
        try {
          const data = JSON.parse(cotacaoData)
          const timeDiff = Date.now() - data.timestamp
          
          // If cotacao data is recent (within 30 minutes), allow natural back navigation
          if (timeDiff < 30 * 60 * 1000) {
            return
          }
        } catch (e) {
          console.warn('Error parsing cotacao session data:', e)
        }
      }
      
      // If no recent cotacao data or user came from elsewhere, redirect to quote results
      if (!document.referrer.includes('/cotacao') || document.referrer.includes('/cotacao/')) {
        event.preventDefault()
        router.push('/cotacao')
      }
    }

    // Add history state for this page
    if (typeof window !== 'undefined') {
      const stateData = {
        page: 'offer-details',
        offerId: params.offerId,
        timestamp: Date.now()
      }
      window.history.replaceState(stateData, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router, params.offerId])

  // Handle page visibility to manage navigation state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && error) {
        // If page becomes visible and we have an error, check if we should redirect
        const cotacaoData = sessionStorage.getItem('cotacao-loaded')
        if (!cotacaoData) {
          // No cotacao session data, redirect to home
          router.push('/')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [error, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light-gray/20">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto">
            <div className="h-8 bg-white/20 rounded-lg w-64 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-white/10 rounded-xl animate-pulse mb-6" />
                <div className="h-64 bg-white/10 rounded-xl animate-pulse" />
              </div>
              <div className="h-80 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-neutral-light-gray/20">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-neutral-charcoal mb-4">
                  {error || 'Oferta não encontrada'}
                </h1>
                <p className="text-neutral-dark-gray mb-6">
                  A oferta que você está procurando não existe ou foi removida.
                </p>
                <Link href="/cotacao">
                  <Button variant="default" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar às Cotações
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-light-gray/20">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link href="/cotacao">
                <Button variant="ghost" className="text-neutral-charcoal hover:bg-neutral-light-gray/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar às Cotações
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold text-neutral-charcoal">
                        {offer.insurerName}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold text-neutral-dark-gray">
                          {offer.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neutral-charcoal">
                          R$ {offer.monthlyPremium.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-neutral-medium-gray">por mês</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neutral-charcoal">
                          R$ {offer.deductible.toLocaleString('pt-BR')}
                        </div>
                        <div className="text-sm text-neutral-medium-gray">franquia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-emerald-green">
                          R$ {offer.savings}
                        </div>
                        <div className="text-sm text-neutral-medium-gray">economia/mês</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Coverage Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-neutral-charcoal mb-6 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      Detalhes da Cobertura
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-neutral-dark-gray mb-3">Coberturas Básicas</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            {offer.coverageDetails.collision ? (
                              <CheckCircle className="w-4 h-4 text-accent-emerald-green" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-neutral-dark-gray">Colisão</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {offer.coverageDetails.theft ? (
                              <CheckCircle className="w-4 h-4 text-accent-emerald-green" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-neutral-dark-gray">Roubo e Furto</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {offer.coverageDetails.fire ? (
                              <CheckCircle className="w-4 h-4 text-accent-emerald-green" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-neutral-dark-gray">Incêndio</span>
                          </li>
                          <li className="flex items-center gap-2">
                            {offer.coverageDetails.naturalDisasters ? (
                              <CheckCircle className="w-4 h-4 text-accent-emerald-green" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-neutral-dark-gray">Desastres Naturais</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-neutral-dark-gray mb-3">Valores de Cobertura</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-dark-gray">Responsabilidade Civil</span>
                            <span className="text-sm font-medium text-neutral-charcoal">
                              R$ {offer.coverageDetails.thirdPartyLiability.toLocaleString('pt-BR')}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-dark-gray">Acidentes Pessoais</span>
                            <span className="text-sm font-medium text-neutral-charcoal">
                              R$ {offer.coverageDetails.personalAccident.toLocaleString('pt-BR')}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-light-gray/30">
                      <h3 className="font-semibold text-neutral-dark-gray mb-3">Serviços Incluídos</h3>
                      <div className="flex flex-wrap gap-2">
                        {offer.coverageHighlights.map((highlight, index) => (
                          <Badge key={index} variant="success">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Purchase CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-neutral-light-gray/50 p-6 sm:p-8 sticky top-8">
                    <h3 className="text-xl font-semibold text-neutral-charcoal mb-4">
                      Contratar Seguro
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-accent-emerald-green" />
                        <span className="text-sm text-neutral-dark-gray">Cartão de Crédito</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-accent-emerald-green" />
                        <span className="text-sm text-neutral-dark-gray">PIX</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Banknote className="w-5 h-5 text-accent-emerald-green" />
                        <span className="text-sm text-neutral-dark-gray">Boleto</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full mb-4"
                      onClick={() => {
                        // Check if user is logged in - for now we'll redirect to sign-up
                        // In a real app, you'd check authentication state
                        router.push('/sign-up')
                      }}
                    >
                      Contratar Agora
                    </Button>
                    
                    <div className="text-center space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Falar com Consultor
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar por Email
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-neutral-light-gray/30 text-center">
                      <p className="text-xs text-neutral-medium-gray">
                        Ativação em até 24 horas
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}