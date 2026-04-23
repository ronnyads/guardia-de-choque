import Link from 'next/link'
import { categories, creators } from '@/lib/job-ppo/mock-data'

export default function CategoriesPage() {
  return (
    <section className="section">
      <div className="container-shell space-y-8">
        <div className="max-w-2xl space-y-4">
          <span className="eyebrow">categorias</span>
          <h1 className="display-title text-5xl">Mapa de descoberta do JOB PPO.</h1>
          <p className="muted text-lg leading-8">
            Cada categoria organiza percepcao de marca, filtros da home, sugestao de perfis
            semelhantes e estrategia editorial.
          </p>
        </div>

        <div className="premium-grid cols-3">
          {categories.map((category, index) => {
            const count = creators.filter((creator) => creator.category === category).length

            return (
              <article key={category} className="surface-card p-6">
                <p className="subtle text-sm">categoria {String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{category}</h2>
                <p className="muted mt-3 text-sm leading-6">
                  {count} perfis mapeados no seed inicial, com espaco para ranqueamento,
                  destaque e clusters de recomendacao.
                </p>
                <Link href="/explorar" className="button-secondary mt-6 w-full">
                  Ver perfis desta categoria
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
