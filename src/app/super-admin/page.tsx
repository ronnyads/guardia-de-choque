import { Panel } from '@/components/job-ppo/panel'
import { permissionMatrix } from '@/lib/job-ppo/permissions'
import { requireRole } from '@/lib/job-ppo/session'

export default async function SuperAdminPage() {
  await requireRole(['super_admin'])

  return (
    <main className="section">
      <div className="container-shell space-y-6">
        <div className="surface-card-strong p-6 sm:p-8">
          <span className="eyebrow">super admin</span>
          <h1 className="display-title mt-4 text-5xl">Governanca, RBAC e controle critico.</h1>
          <p className="muted mt-4 max-w-3xl text-lg leading-8">
            Esta area concentra permissoes sensiveis, auditoria de alto nivel, politicas globais
            e configuracoes que nao devem ficar com o admin operacional.
          </p>
        </div>

        <Panel title="Matriz de acesso" description="Principio de menor privilegio aplicado aos cinco papeis do MVP.">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Capacidade</th>
                  <th>Visitante</th>
                  <th>Assinante</th>
                  <th>Criadora</th>
                  <th>Admin</th>
                  <th>Super Admin</th>
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((row) => (
                  <tr key={row.capability}>
                    <td>{row.capability}</td>
                    <td>{row.visitor ? 'sim' : 'nao'}</td>
                    <td>{row.subscriber ? 'sim' : 'nao'}</td>
                    <td>{row.creator ? 'sim' : 'nao'}</td>
                    <td>{row.admin ? 'sim' : 'nao'}</td>
                    <td>{row.superAdmin ? 'sim' : 'nao'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  )
}
