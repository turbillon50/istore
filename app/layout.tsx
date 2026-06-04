import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const description =
  "Plataforma SaaS premium para talleres de reparación de celulares, tablets y computadoras. Órdenes, diagnósticos, inventario, POS, CRM y analytics.";

export const metadata: Metadata = {
  metadataBase: new URL("https://istore-pro.demo"),
  title: {
    default: "iStore Pro — Sistema para talleres de reparación",
    template: "%s · iStore Pro",
  },
  description,
  applicationName: "iStore Pro",
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
    title: "iStore Pro — Sistema inteligente para talleres de reparación",
    description,
    siteName: "iStore Pro",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "iStore Pro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iStore Pro",
    description,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "iStore Pro",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
