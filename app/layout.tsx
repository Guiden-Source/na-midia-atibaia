import { Baloo_2, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/next';
import { cn } from '@/lib/utils';
import './globals.css';
import type { Viewport } from 'next';
import { CartProvider } from '@/lib/delivery/CartContext';

const baloo2 = Baloo_2({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-baloo2' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://namidia.com.br'),
  title: 'Na Mídia - Eventos em Atibaia | Ganhe Cupons de Bebida',
  description: 'Descubra os melhores eventos em Atibaia. Confirme presença, veja as bebidas disponíveis e ganhe cupons de desconto. Grátis e fácil!',
  keywords: ['eventos atibaia', 'festas atibaia', 'bebidas grátis', 'cupons', 'rolê atibaia', 'na mídia', 'eventos'],
  authors: [{ name: 'Na Mídia' }],
  creator: 'Na Mídia',
  publisher: 'Na Mídia',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/logotiponamidiavetorizado.svg', color: '#f97316' },
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Na Mídia'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://namidia.com.br',
    title: 'Na Mídia - Eventos em Atibaia | Ganhe Cupons de Bebida',
    description: 'Descubra eventos em Atibaia, veja as bebidas disponíveis e ganhe cupons de desconto. Simples, rápido e gratuito!',
    siteName: 'Na Mídia',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Na Mídia - Eventos + Bebidas Grátis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Na Mídia - Eventos em Atibaia | Ganhe Cupons de Bebida',
    description: 'Descubra eventos e ganhe cupons de desconto em bebidas!',
    images: ['/og-image.png'],
  },
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Meta tags específicas para iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Na Mídia" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        {/* Splash screens para iOS */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 font-inter antialiased",
          baloo2.variable,
          inter.variable
        )}
      >
        <CartProvider>
          <PWAInstaller />
          <Header />

          <main className="flex-1">{children}</main>

          <Toaster
            position="bottom-right"
            toastOptions={{
              // Estilo de toast inspirado na Ref 1 (iOS-like)
              style: {
                background: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />

          <Analytics />

          {/* Debug de autenticação (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && <AuthDebug />}
        </CartProvider>

        <footer className="py-12 md:py-16 mb-20 md:mb-0 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">
            {/* Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">

              {/* Coluna 1 - Sobre */}
              <div className="space-y-4">
                <img
                  src="/logotiponamidiavetorizado.svg"
                  alt="Na Mídia"
                  className="h-10 w-auto"
                />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Descubra os melhores eventos em Atibaia e ganhe cupons de desconto em bebidas.
                </p>
              </div>

              {/* Coluna 2 - Navegação */}
              <div className="space-y-4">
                <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">
                  Navegação
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Eventos
                    </a>
                  </li>
                  <li>
                    <a href="/cupons" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Meus Cupons
                    </a>
                  </li>
                  <li>
                    <a href="/#como-funciona" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Como Funciona
                    </a>
                  </li>
                </ul>
              </div>

              {/* Coluna 3 - Suporte */}
              <div className="space-y-4">
                <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">
                  Suporte
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/faq" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/ajuda" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Ajuda
                    </a>
                  </li>
                  <li>
                    <a href="/termos" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Termos de Uso
                    </a>
                  </li>
                  <li>
                    <a href="/privacidade" className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      Política de Privacidade
                    </a>
                  </li>
                </ul>
              </div>

              {/* Coluna 4 - Contato */}
              <div className="space-y-4">
                <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">
                  Contato
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.instagram.com/namidia.atibaia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      @namidia.atibaia
                    </a>
                  </li>
                  <li>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      📍 Atibaia - SP
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                © {new Date().getFullYear()} Na Mídia. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <ExpandableTabs />
        </div>
      </body>
    </html>
  );
}

// Import the components
import Header from '@/components/Header';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { AuthDebug } from '@/components/AuthDebug';
import { PWAInstaller } from '@/components/PWAInstaller';
