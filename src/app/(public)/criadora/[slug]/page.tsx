import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProfileCard } from '@/components/job-ppo/profile-card'
import { PlanCard } from '@/components/job-ppo/plan-card'
import { getCreatorBySlug, getSimilarCreators, publicPlans } from '@/lib/job-ppo/mock-data'

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const creator = getCreatorBySlug(slug)

  if (!creator) {
    notFound()
  }

  const similarCreators = getSimilarCreators(slug)

  return (
    <section className="section">
      <div className="container-shell space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <span className="eyebrow">{creator.category}</span>
            <div>
              <h1 className="display-title text-6xl">{creator.artisticName}</h1>
              <p className="mt-3 text-lg text-[var(--champagne-soft)]">{creator.tagline}</p>
            </div>
            <p className="muted max-w-2xl text-lg leading-8">{creator.bio}</p>
            <div className="flex flex-wrap gap-3">
              {creator.badges.map((badge) => (
                <span key={badge} className="pill">
                  {badge}
                </span>
              ))}
              <span className="pill">R$ {creator.monthlyPrice}/mes</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="metric-card">
                <p className="muted text-sm">Assinantes</p>
                <p className="metric-value mt-2">{creator.stats.subscribers}</p>
              </article>
              <article className="metric-card">
                <p className="muted text-sm">Posts premium</p>
                <p className="metric-value mt-2">{creator.stats.premiumPosts}</p>
              </article>
              <article className="metric-card">
                <p className="muted text-sm">Tempo medio</p>
                <p className="metric-value mt-2">{creator.stats.responseTime}</p>
              </article>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="button-primary">
                Assinar agora
              </Link>
              <Link href="/explorar" className="button-secondary">
                Favoritar e continuar explorando
              </Link>
            </div>
          </div>

          <div className="surface-card-strong overflow-hidden p-4">
            <div
              className="profile-portrait"
              style={{ ['--portrait-gradient' as string]: creator.portraitGradient }}
            >
              <div className="absolute inset-x-4 bottom-4 z-10">
                <div className="glass-strip rounded-[22px] p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-white/65">
                    teaser bloqueado
                  </p>
                  <p className="mt-2 text-sm text-white/78">{creator.teaser}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-grid cols-2">
          <section className="surface-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Galeria teaser</h2>
                <p className="muted mt-2 text-sm">Previa desbloqueada para incentivar conversao.</p>
              </div>
              <span className="pill">CTA fixo de assinatura</span>
            </div>
            <div className="premium-grid cols-3">
              {creator.mediaPreview.map((item) => (
                <article key={item.title} className="surface-card p-4">
                  <div
                    className="mb-4 h-28 rounded-[18px]"
                    style={{ background: creator.portraitGradient }}
                  />
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="subtle mt-2 text-xs">
                    {item.kind} {item.locked ? '• premium' : '• teaser'}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Planos sugeridos</h2>
              <p className="muted mt-2 text-sm">
                O perfil pode ofertar planos proprios, mas o MVP ja nasce compatível com uma
                estrategia premium em camadas.
              </p>
            </div>
            <div className="space-y-4">
              {publicPlans.slice(0, 2).map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-6">
          <div>
            <span className="eyebrow">semelhantes</span>
            <h2 className="display-title mt-4 text-4xl">Perfis com energia parecida</h2>
          </div>
          <div className="premium-grid cols-3">
            {similarCreators.map((similarCreator) => (
              <ProfileCard key={similarCreator.slug} creator={similarCreator} />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
