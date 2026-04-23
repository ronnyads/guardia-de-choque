export default function InstitutionalPage() {
  return (
    <section className="section">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <span className="eyebrow">institucional</span>
          <h1 className="display-title text-5xl">Plataforma premium para creator economy feminina.</h1>
          <p className="muted text-lg leading-8">
            JOB PPO junta descoberta, assinatura e operacao em um produto com sensacao
            editorial, mobile-first e pronto para escalar via stacks modernas.
          </p>
        </div>
        <div className="premium-grid cols-2">
          {[
            'Area publica forte para conversao',
            'Studio da criadora com monetizacao',
            'Admin focado em moderacao e operacao',
            'Base preparada para Supabase, Stripe e Railway',
          ].map((item) => (
            <article key={item} className="surface-card p-5">
              <p className="text-lg font-semibold">{item}</p>
              <p className="muted mt-3 text-sm leading-6">
                Fundacao pronta para MVP com escalabilidade futura e modelagem consistente.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
