'use client'

import * as React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { ThemeProvider } from 'next-themes'
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// --- TanStack Query -----------------------------------------------------------
// Use a singleton on the server, per-request on the client to avoid
// sharing state across users.

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, set staleTime > 0 to avoid refetching on the client
        staleTime: 60 * 1000, // 1 minute
        gcTime:    5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

// --- Props --------------------------------------------------------------------

interface ProvidersProps {
  children: React.ReactNode
}

// --- Providers ----------------------------------------------------------------

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient()

  return (
    <ClerkProvider
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: '#ff8c00',
          colorBackground: '#1e1e1e',
          colorText: '#f5f5f5',
          colorTextSecondary: '#a8a8a8',
          colorInputBackground: '#2a2a2a',
          colorInputText: '#f5f5f5',
          borderRadius: '0.75rem',
        },
        elements: {
          card:
            'bg-surface-container border border-surface-border shadow-obsidian',
          formButtonPrimary:
            'bg-primary hover:bg-primary-dark text-white transition-colors',
          footerActionLink: 'text-primary hover:text-primary-light',
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e1e1e',
                color: '#f5f5f5',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#1e1e1e' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#1e1e1e' },
              },
            }}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}
