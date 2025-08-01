'use client'

import Image from 'next/image'
import { OnboardingForm } from '@/components/auth/onboarding-form'

export default function OnboardingPage() {
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-5">
      <div className="relative col-span-3 hidden items-center justify-center bg-neutral-off-white lg:flex">
        <div className="relative h-3/4 w-11/12 overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/hero-image.png"
            alt="Car on a scenic road"
            fill
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center bg-neutral-off-white p-4">
        <OnboardingForm />
      </div>
    </div>
  )
}
