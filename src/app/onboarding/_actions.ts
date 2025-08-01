'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const completeOnboarding = async (formData: FormData) => {
  const { userId, getToken } = await auth()

  if (!userId) {
    return { error: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const cpf = formData.get('cpf') as string

    if (!name || !phone || !cpf) {
      return { error: 'Nome, telefone e CPF são obrigatórios' }
    }

    // 1. Update Clerk publicMetadata (for session token)
    const clerkRes = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        name: name,
        phone: phone,
        cpf: cpf,
      },
    })

    // 2. Update Convex database with auth token
    const token = await getToken({ template: 'convex' })
    if (token) {
      convex.setAuth(token)
      
      // Call Convex mutation to complete onboarding
      await convex.mutation(api.users.completeOnboarding, {
        name,
        phone,
        cpf
      })
    }
    
    return { message: 'Onboarding completed successfully', data: clerkRes.publicMetadata }
  } catch (err) {
    console.error('Error updating user metadata:', err)
    return { error: 'Erro ao atualizar informações do usuário' }
  }
}