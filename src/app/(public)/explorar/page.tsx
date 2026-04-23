import { ProfileCard } from '@/components/job-ppo/profile-card'
import { SectionHeading } from '@/components/job-ppo/section-heading'
import { categories, creators } from '@/lib/job-ppo/mock-data'

export default function ExplorePage() {
  return (
    <section className="section">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="explorar perfis"
          title="Busca premium com filtros, vitrines e cards imageticos."
          description="Estruturada para discovery first: cards fortes, ordenacao editorial, preco visivel, badges e CTA constante."
        />

        <div className="surface-card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none"
              placeholder="Buscar por nome artistico, tag ou atmosfera"
            />
            <div className="flex flex-wrap gap-2">
              {['verificadas', 'novidades', 'trending', 'ate R$ 59', 'mais recentes'].map(
                (filter) => (
                  <span key={filter} className="pill">
                    {filter}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="pill">
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-grid cols-2">
          {creators.map((creator) => (
            <ProfileCard key={creator.slug} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  )
}
