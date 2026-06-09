import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://istorepro.mx'
  ),
  title: {
    default: 'iStore Pro — Tecnología Premium en México',
    template: '%s | iStore Pro',
  },
  description:
    'La tienda de tecnología más completa de México. iPhones, Samsung, accesorios, audio y más. Financiamiento disponible, envío a todo el país.',
  keywords: [
    'iStore Pro',
    'iPhone México',
    'Samsung México',
    'tienda de tecnología',
    'smartphones',
    'accesorios Apple',
    'financiamiento celular',
  ],
  authors: [{ name: 'iStore Pro', url: 'https://istorepro.mx' }],
  creator: 'iStore Pro',
  publisher: 'iStore Pro',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://istorepro.mx',
    siteName: 'iStore Pro',
    title: 'iStore Pro — Tecnología Premium en México',
    description:
      'La tienda de tecnología más completa de México. iPhones, Samsung, accesorios, audio y más.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'iStore Pro — Tecnología Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iStore Pro — Tecnología Premium en México',
    description:
      'La tienda de tecnología más completa de México.',
    images: ['/og-image.png'],
    creator: '@istorepromx',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
  const ttPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

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
          card: 'bg-surface-container border border-surface-border shadow-obsidian',
          navbar: 'bg-surface',
          navbarButton: 'text-on-surface-muted hover:text-primary',
          formButtonPrimary:
            'bg-primary hover:bg-primary-dark text-white transition-colors',
          footerActionLink: 'text-primary hover:text-primary-light',
        },
      }}
    >
      <html lang="es" suppressHydrationWarning className={inter.variable}>
        <head />
        <body className={`${inter.className} min-h-screen bg-surface`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
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
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#1e1e1e',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#1e1e1e',
                  },
                },
              }}
            />
          </ThemeProvider>

          {/* -- Google Analytics ------------------------------ */}
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true,
                  });
                `}
              </Script>
            </>
          )}

          {/* -- Meta (Facebook) Pixel ------------------------- */}
          {fbPixelId && (
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${fbPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
          )}

          {/* -- TikTok Pixel ---------------------------------- */}
          {ttPixelId && (
            <Script id="tiktok-pixel" strategy="afterInteractive">
              {`
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                  ttq.methods=["page","track","identify","instances","debug",
                    "on","off","once","ready","alias","group","enableCookie","disableCookie"];
                  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                  ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                    ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
                    var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
                    var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${ttPixelId}');
                  ttq.page();
                }(window, document, 'ttq');
              `}
            </Script>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
