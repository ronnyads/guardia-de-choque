import { DashboardShell } from '@/components/job-ppo/dashboard-shell'
import { subscriberNav } from '@/lib/job-ppo/navigation'
import { requireRole } from '@/lib/job-ppo/session'

export default async function SubscriberLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireRole(['subscriber'])

  return (
    <DashboardShell
      title="Dashboard do assinante"
      description="Resumo de assinaturas, favoritos, historico financeiro e biblioteca premium em uma experiencia que prioriza clareza e descoberta."
      roleLabel="assinante"
      nav={subscriberNav}
    >
      {children}
    </DashboardShell>
  )
}
