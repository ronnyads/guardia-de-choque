export default function SupportPage() {
  return (
    <section className="section">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <span className="eyebrow">suporte</span>
          <h1 className="display-title text-5xl">Central de suporte preparada para escala.</h1>
          <p className="muted text-lg leading-8">
            Atendimento, denuncias, falhas de pagamento e verificacao podem conviver no mesmo
            fluxo com clareza para usuario, criadora e time interno.
          </p>
        </div>
        <div className="premium-grid cols-2">
          {[
            'FAQ e ajuda operacional',
            'Recuperacao de conta e cobranca',
            'Denuncia de perfil e conteudo',
            'Contato prioritario para criadoras',
          ].map((item) => (
            <article key={item} className="surface-card p-5">
              <p className="text-lg font-semibold">{item}</p>
              <p className="muted mt-3 text-sm leading-6">
                Estrutura inicial pronta para evoluir para chat, tickets e SLA por prioridade.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
