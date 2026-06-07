import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import { clerkEnabled } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const description =
  "Tu tienda de celulares, accesorios y reparación. Compra los últimos equipos con garantía y factura, o agenda la reparación de tu celular con técnicos expertos.";

export const metadata: Metadata = {
  metadataBase: new URL("https://i-store.shop"),
  title: {
    default: "iStore — Celulares, accesorios y reparación",
    template: "%s · iStore",
  },
  description,
  applicationName: "iStore",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: "iStore — Celulares, accesorios y reparación",
    description,
    siteName: "iStore",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "iStore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iStore — Celulares, accesorios y reparación",
    description,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "iStore",
  },
};

export const viewport: Viewport = {
  // Adaptativo: la barra de estado del navegador/PWA sigue el tema activo.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );

  // Clerk envuelve toda la app SOLO si hay keys (pk_live/sk_live).
  // signInUrl/signUpUrl propios → patrón anti-loop con redirectToSignIn.
  if (!clerkEnabled) return app;
  return (
    <ClerkProvider
      localization={esES}
      signInUrl="/login"
      signUpUrl="/registro"
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#2563eb",
          colorBackground: "#111111",
          colorInputBackground: "#1c1c1c",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorInputText: "#ffffff",
          borderRadius: "0.85rem",
        },
        elements: {
          card: "shadow-2xl border border-white/[0.06] backdrop-blur-2xl",
          formButtonPrimary: "bg-[#2563eb] hover:bg-[#1d4ed8] text-sm normal-case",
        },
      }}
    >
      {app}
    </ClerkProvider>
  );
}
