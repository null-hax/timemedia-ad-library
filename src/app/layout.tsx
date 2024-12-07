import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CONFIG } from '@/lib/config'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { NavigationProvider } from '@/contexts/navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: CONFIG.APP.name,
    template: `%s | ${CONFIG.APP.name}`,
  },
  description: CONFIG.APP.description,
  metadataBase: new URL(`https://${CONFIG.APP.domain}`),
  openGraph: {
    type: 'website',
    siteName: CONFIG.APP.name,
    title: CONFIG.APP.name,
    description: CONFIG.APP.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.APP.name,
    description: CONFIG.APP.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <NavigationProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NavigationProvider>
      </body>
    </html>
  )
}
