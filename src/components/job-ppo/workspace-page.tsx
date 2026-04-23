import { MetricCard } from '@/components/job-ppo/metric-card'
import { Panel } from '@/components/job-ppo/panel'
import type { WorkspaceSection } from '@/lib/job-ppo/types'

type WorkspacePageProps = {
  section: WorkspaceSection
}

export function WorkspacePage({ section }: WorkspacePageProps) {
  return (
    <div className="space-y-6">
      <div className="premium-grid cols-2">
        {section.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="premium-grid cols-2">
        <Panel title="Como essa area funciona" description={section.description}>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            {section.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--champagne-soft)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Focos do MVP" description="Esses pontos orientam prioridade e clareza operacional.">
          <div className="flex flex-wrap gap-3">
            {section.highlights.map((highlight) => (
              <span key={highlight} className="pill">
                {highlight}
              </span>
            ))}
          </div>
        </Panel>
      </div>

      {section.table ? (
        <Panel title="Visao operacional" description="Estrutura de dados e listagem inicial desta area.">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  {section.table.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, index) => (
                  <tr key={`${section.slug}-${index}`}>
                    {row.map((value, valueIndex) => (
                      <td key={`${section.slug}-${index}-${valueIndex}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}
    </div>
  )
}
