import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  if ((await auth()).sessionClaims?.metadata?.onboardingComplete === true) {
    redirect('/dashboard/contratos')
  }

  return <>{children}</>
}