import Link from 'next/link'
import { MetricCard } from '@/components/job-ppo/metric-card'
import { PlanCard } from '@/components/job-ppo/plan-card'
import { ProfileCard } from '@/components/job-ppo/profile-card'
import { SectionHeading } from '@/components/job-ppo/section-heading'
import {
  categories,
  creators,
  discoveryMetrics,
  publicPlans,
} from '@/lib/job-ppo/mock-data'

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="eyebrow">feminino premium editorial</span>
            <div className="space-y-5">
              <h1 className="display-title text-balance text-6xl sm:text-7xl lg:text-[5.5rem]">
                Descoberta, assinatura e desejo em um produto pronto para escalar.
              </h1>
              <p className="muted max-w-2xl text-lg leading-8">
                JOB PPO nasce como uma plataforma premium para explorar criadoras,
                converter assinatura recorrente e operar tudo com clareza para usuario,
                criadora e time administrativo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/explorar" className="button-primary">
                Explorar perfis
              </Link>
              <Link href="/cadastro" className="button-secondary">
                Criar conta
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {['grid forte de perfis', 'paywall elegante', 'dashboards frios nunca mais'].map(
                (item) => (
                  <span key={item} className="pill">
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="surface-card-strong overflow-hidden p-4">
            <div
              className="profile-portrait min-h-[420px]"
              style={{
                ['--portrait-gradient' as string]:
                  'linear-gradient(145deg, #261523 8%, #7a476d 42%, #c07aa0 72%, #ead3c4 100%)',
              }}
            >
              <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between">
                <span className="eyebrow">colecao em destaque</span>
                <span className="pill bg-black/25 text-white">cta de assinatura fixo</span>
              </div>
              <div className="absolute inset-x-5 bottom-5 z-10 space-y-4">
                <div className="glass-strip rounded-[24px] p-4">
                  <p className="display-title text-3xl">Ayla Noir</p>
                  <p className="mt-2 text-sm text-white/78">
                    Perfil premium com teaser bloqueado, plano mensal e conteudo recente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container-shell premium-grid cols-3">
          {discoveryMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-shell space-y-8">
          <SectionHeading
            eyebrow="descoberta obrigatoria"
            title="Grid de perfis com imagem forte, badges e preco visivel."
            description="A area publica prioriza descoberta visual, filtros claros e CTA de assinatura em todos os pontos de contato."
          />
          <div className="flex flex-wrap gap-3">
            {['Verificadas', 'Em alta', 'Faixa R$ 39 - R$ 79', 'Novidades', 'Popular'].map(
              (filter) => (
                <span key={filter} className="pill">
                  {filter}
                </span>
              ),
            )}
          </div>
          <div className="premium-grid cols-2">
            {creators.slice(0, 4).map((creator) => (
              <ProfileCard key={creator.slug} creator={creator} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="taxonomia"
            title="Categorias e tags desenhadas para recomendacao."
            description="O MVP ja separa descoberta por atmosfera, faixa de preco, verificado, novidade e destaque editorial."
          />
          <div className="premium-grid cols-3">
            {categories.map((category, index) => (
              <article key={category} className="surface-card p-5">
                <p className="subtle text-sm">categoria {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{category}</h3>
                <p className="muted mt-2 text-sm leading-6">
                  Curadoria com filtros, perfis semelhantes e destaque automatico por sinal de conversao.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell space-y-8">
          <SectionHeading
            eyebrow="monetizacao"
            title="Assinatura recorrente com estrutura pronta para upgrade futuro."
            description="Checkout, recorrencia, falha de pagamento, historico e repasse nascem no mesmo desenho de dominio."
          />
          <div className="premium-grid cols-3">
            {publicPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell surface-card-strong p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Area publica',
                copy: 'Landing, explorar, busca, perfil publico e planos com foco em conversao.',
              },
              {
                title: 'Area da criadora',
                copy: 'Onboarding, gestao de perfil, planos, conteudo, analytics e ganhos.',
              },
              {
                title: 'Operacao admin',
                copy: 'Moderacao, verificacao, pagamentos, repasses, CMS e logs de atividade.',
              },
            ].map((item) => (
              <article key={item.title} className="surface-card p-5">
                <p className="eyebrow">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
