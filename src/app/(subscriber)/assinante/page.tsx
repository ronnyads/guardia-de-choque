import { MetricCard } from '@/components/job-ppo/metric-card'
import { Panel } from '@/components/job-ppo/panel'
import { ProfileCard } from '@/components/job-ppo/profile-card'
import { creators, subscriberMetrics } from '@/lib/job-ppo/mock-data'

export default function SubscriberDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="premium-grid cols-3">
        {subscriberMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="premium-grid cols-2">
        <Panel
          title="Resumo rapido"
          description="Visao de relacionamento com a plataforma, paywall e renovacao."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Conteudo recente', '18 novos posts premium'],
              ['Proximas renovacoes', 'Ayla em 05 maio'],
              ['Recomendacao do dia', 'Celeste Rush'],
              ['Historico financeiro', 'R$ 317 no trimestre'],
            ].map(([label, value]) => (
              <article key={label} className="metric-card">
                <p className="muted text-sm">{label}</p>
                <p className="mt-3 text-lg font-semibold">{value}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Feed premium"
          description="Estrutura inicial para consumo recorrente e ordenacao por criadora."
        >
          <div className="space-y-3">
            {[
              'Ayla Noir publicou um backstage premium',
              'Luna Sorel liberou uma nova serie em video',
              'Celeste Rush enviou uma colecao de after hours',
            ].map((item) => (
              <div key={item} className="surface-card p-4 text-sm text-[var(--text-secondary)]">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Perfis recomendados"
        description="Cards reaproveitados da descoberta publica, agora com mais contexto de favoritos e compatibilidade."
      >
        <div className="premium-grid cols-3">
          {creators.slice(0, 3).map((creator) => (
            <ProfileCard key={creator.slug} creator={creator} />
          ))}
        </div>
      </Panel>
    </div>
  )
}
