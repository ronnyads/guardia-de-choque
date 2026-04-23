import { MetricCard } from '@/components/job-ppo/metric-card'
import { Panel } from '@/components/job-ppo/panel'
import { adminMetrics } from '@/lib/job-ppo/mock-data'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="premium-grid cols-3">
        {adminMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="premium-grid cols-2">
        <Panel title="Fila critica" description="Eventos que exigem acao operacional nesta janela.">
          <div className="space-y-3">
            {[
              '7 criadoras aguardando aprovacao urgente',
              '14 falhas de pagamento para reconciliar',
              '3 denuncias sensiveis em revisao',
              '2 ajustes em banners da homepage',
            ].map((item) => (
              <div key={item} className="surface-card p-4 text-sm text-[var(--text-secondary)]">
                {item}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Atividade recente" description="Trilha resumida para operacao do dia.">
          <div className="space-y-3">
            {[
              'Helena aprovou a criadora Ivy Mirage',
              'Pagamento #pay_1082 conciliado',
              'Banner principal atualizado na home',
              'Denuncia #rep_204 marcada como resolvida',
            ].map((item) => (
              <div key={item} className="surface-card p-4 text-sm text-[var(--text-secondary)]">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
