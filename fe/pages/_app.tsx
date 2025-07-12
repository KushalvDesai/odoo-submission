
import '../src/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { apolloClient } from '../src/lib/apollo'
import { AuthProvider } from '../src/contexts/AuthContext'
import Layout from '../src/components/Layout'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
