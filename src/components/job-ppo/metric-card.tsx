import type { DashboardMetric } from '@/lib/job-ppo/types'

type MetricCardProps = {
  metric: DashboardMetric
}

export function MetricCard({ metric }: MetricCardProps) {
  const toneClass =
    metric.tone === 'danger'
      ? 'metric-delta-danger'
      : metric.tone === 'warning'
        ? 'metric-delta-warning'
        : 'metric-delta-positive'

  return (
    <article className="metric-card">
      <p className="muted text-sm">{metric.label}</p>
      <p className="metric-value mt-3">{metric.value}</p>
      <p className={`mt-2 text-sm font-semibold ${toneClass}`}>{metric.delta}</p>
    </article>
  )
}
