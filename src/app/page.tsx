import { HeroSection } from '@/components/sections/hero-section'
import { SinistroSemEstresseSection } from '@/components/sections/sinistro-sem-estresse-section'
import { ComoFuncionaSection } from '@/components/sections/como-funciona-section'
import { NossoCompromissoSection } from '@/components/sections/nosso-compromisso-section'
import { ParaTodosOsCarrosSection } from '@/components/sections/para-todos-os-carros-section'
import { SocialProofSection } from '@/components/sections/social-proof-section'
import { CtaSection } from '@/components/sections/cta-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="bg-neutral-off-white">
      <HeroSection />
      <SinistroSemEstresseSection />
      <NossoCompromissoSection />
      <ParaTodosOsCarrosSection />
      <SocialProofSection />
      <CtaSection />
      <Footer />
    </main>
  )
}