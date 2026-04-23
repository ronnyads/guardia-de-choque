import { PlanCard } from '@/components/job-ppo/plan-card'
import { SectionHeading } from '@/components/job-ppo/section-heading'
import { publicPlans } from '@/lib/job-ppo/mock-data'

export default function PlansPage() {
  return (
    <section className="section">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="planos"
          title="Assinaturas desenhadas para recorrencia, valor percebido e upgrade."
          description="A plataforma separa o pricing institucional da criadora, mas a experiencia de checkout ja nasce coesa."
        />
        <div className="premium-grid cols-3">
          {publicPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
