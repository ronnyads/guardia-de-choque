import { SiteFooter } from '@/components/job-ppo/site-footer'
import { SiteHeader } from '@/components/job-ppo/site-header'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
