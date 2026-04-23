import type { Metadata } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import { TenantProvider } from '@/components/providers/TenantProvider'
import { getStoreConfig } from '@/lib/store-config'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jobppo.com'),
  title: {
    default: 'JOB PPO | Descubra criadoras premium',
    template: '%s | JOB PPO',
  },
  description:
    'Plataforma premium para descoberta, assinatura e monetizacao de criadoras com experiencia feminina, aspiracional e pronta para escalar.',
  keywords: [
    'criadoras',
    'assinaturas',
    'conteudo premium',
    'creator economy',
    'marketplace',
    'job ppo',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'JOB PPO | Descubra criadoras premium',
    description:
      'Assine, acompanhe e monetize em uma plataforma editorial, sofisticada e mobile-first.',
    siteName: 'JOB PPO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JOB PPO',
    description:
      'Descoberta premium, assinaturas recorrentes e dashboards claros para criadoras e administracao.',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const tenantConfig = await getStoreConfig()

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body>
        <TenantProvider config={tenantConfig}>{children}</TenantProvider>
      </body>
    </html>
  )
}
