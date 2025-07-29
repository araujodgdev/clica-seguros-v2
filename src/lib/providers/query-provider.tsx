'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Com SSR, queremos definir um staleTime padrão acima de 0
            // para evitar refetch imediato no cliente
            staleTime: 60 * 1000, // 1 minuto
            // Configurações de cache para melhor performance
            gcTime: 5 * 60 * 1000, // 5 minutos (antes era cacheTime)
            retry: (failureCount, error) => {
              // Não retry em erros 4xx
              if (error instanceof Error && 'status' in error) {
                const status = (error as any).status
                if (status >= 400 && status < 500) {
                  return false
                }
              }
              return failureCount < 3
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}