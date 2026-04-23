import type { PlanSummary } from '@/lib/job-ppo/types'

type PlanCardProps = {
  plan: PlanSummary
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <article
      className={`surface-card relative overflow-hidden p-6 ${
        plan.featured ? 'border-[rgba(226,195,179,0.3)] bg-[rgba(226,195,179,0.08)]' : ''
      }`}
    >
      {plan.featured ? (
        <span className="eyebrow mb-5">Mais indicado para MVP</span>
      ) : null}
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{plan.name}</h3>
        <p className="muted leading-6">{plan.description}</p>
        <p className="display-title text-5xl">R$ {plan.price}</p>
        <p className="subtle text-sm">{plan.target}</p>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--champagne-soft)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a href="/cadastro" className="button-primary mt-8 w-full">
        Comecar agora
      </a>
    </article>
  )
}
