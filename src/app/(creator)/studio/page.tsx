import { MetricCard } from '@/components/job-ppo/metric-card'
import { Panel } from '@/components/job-ppo/panel'
import { creatorMetrics } from '@/lib/job-ppo/mock-data'

export default function CreatorStudioPage() {
  return (
    <div className="space-y-6">
      <div className="premium-grid cols-3">
        {creatorMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="premium-grid cols-2">
        <Panel title="Status da conta" description="O que falta para publicar melhor e vender mais.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Verificacao', 'pendente de selfie'],
              ['Perfil', '86% completo'],
              ['Plano destaque', 'Velvet Circle'],
              ['Agenda', '2 posts para hoje'],
            ].map(([label, value]) => (
              <article key={label} className="metric-card">
                <p className="muted text-sm">{label}</p>
                <p className="mt-3 text-lg font-semibold">{value}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Atalhos operacionais" description="Acoes mais frequentes no MVP.">
          <div className="space-y-3">
            {[
              'Criar novo post premium',
              'Atualizar CTA do perfil publico',
              'Enviar documento de verificacao',
              'Conferir repasse previsto',
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
