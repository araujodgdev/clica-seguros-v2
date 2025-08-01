import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="grid h-[90vh] grid-cols-1 lg:grid-cols-5">
      <div className="relative hidden items-center justify-center bg-neutral-off-white lg:col-span-3 lg:flex">
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
      <div className="flex items-center justify-center bg-neutral-off-white p-4 lg:col-span-2">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white',
              card: 'shadow-lg border border-neutral-light-gray/50',
              headerTitle: 'text-neutral-charcoal',
              headerSubtitle: 'text-neutral-medium-gray',
              socialButtonsBlockButton:
                'border-neutral-light-gray hover:bg-neutral-off-white',
              formFieldInput:
                'border-neutral-light-gray focus:ring-primary focus:border-primary',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
          redirectUrl="/dashboard/contratos"
          fallbackRedirectUrl="/dashboard/contratos"
        />
      </div>
    </div>
  )
}