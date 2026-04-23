export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container-shell max-w-4xl space-y-6">
        <span className="eyebrow">privacidade</span>
        <h1 className="display-title text-5xl">Privacidade, sessao e trilha de auditoria.</h1>
        <div className="surface-card p-6 text-sm leading-7 text-[var(--text-secondary)]">
          <p>
            A arquitetura proposta usa autenticacao segura, segregacao de papeis, protecao de
            rota, armazenamento privado de midia e logs administrativos. O documento final pode
            ser gerenciado pelo CMS basico previsto no admin.
          </p>
        </div>
      </div>
    </section>
  )
}
