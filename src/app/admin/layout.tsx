import { DashboardShell } from '@/components/job-ppo/dashboard-shell'
import { adminNav } from '@/lib/job-ppo/navigation'
import { requireRole } from '@/lib/job-ppo/session'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireRole(['admin'])

  return (
    <DashboardShell
      title="Operacao administrativa"
      description="Moderacao, verificacao, pagamentos, repasses, CMS e configuracoes em uma camada pensada para operacao real."
      roleLabel="admin"
      nav={adminNav}
    >
      {children}
    </DashboardShell>
  )
}
