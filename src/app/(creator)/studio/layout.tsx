import { DashboardShell } from '@/components/job-ppo/dashboard-shell'
import { creatorNav } from '@/lib/job-ppo/navigation'
import { requireRole } from '@/lib/job-ppo/session'

export default async function CreatorStudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireRole(['creator'])

  return (
    <DashboardShell
      title="Studio da criadora"
      description="Onboarding, identidade, planos, publicacao, analytics e ganhos em uma operacao elegante e objetiva."
      roleLabel="criadora"
      nav={creatorNav}
    >
      {children}
    </DashboardShell>
  )
}
