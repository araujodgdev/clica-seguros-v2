'use client'

import { useState, useEffect } from 'react'
import { SignUp } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { CustomOnboarding } from './custom-onboarding'
import { useRouter } from 'next/navigation'

interface AuthFlowProps {
  redirectAfterComplete?: string
}

export function AuthFlow({ redirectAfterComplete = '/dashboard/contratos' }: AuthFlowProps) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  // Check if user needs onboarding
  const needsOnboarding = useQuery(api.users.needsOnboarding)

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    // Redirect to dashboard or specified path
    router.push(redirectAfterComplete)
  }

  // Monitor authentication and onboarding status
  useEffect(() => {
    if (needsOnboarding === true) {
      setShowOnboarding(true)
    } else if (needsOnboarding === false) {
      // User is authenticated and onboarding is complete
      router.push(redirectAfterComplete)
    }
  }, [needsOnboarding, redirectAfterComplete, router])

  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <SignUp
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
          // Don't redirect immediately after sign up - we need to check onboarding
          redirectUrl={window.location.href}
          fallbackRedirectUrl={window.location.href}
        />
      </Unauthenticated>

      <Authenticated>
        {showOnboarding ? (
          <CustomOnboarding onComplete={handleOnboardingComplete} />
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </Authenticated>
    </>
  )
}