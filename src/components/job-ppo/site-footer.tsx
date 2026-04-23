import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="section-tight border-t border-white/8">
      <div className="container-shell grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="display-title text-3xl">JOB PPO</p>
          <p className="muted max-w-md text-sm leading-6">
            Plataforma premium para descoberta, assinatura recorrente e operacao completa
            de criadoras com foco em experiencia feminina e escalabilidade.
          </p>
        </div>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Plataforma</p>
          <Link href="/explorar">Explorar</Link>
          <Link href="/planos">Planos</Link>
          <Link href="/institucional">Institucional</Link>
        </div>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Legal</p>
          <Link href="/termos">Termos</Link>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/suporte">Suporte</Link>
        </div>
      </div>
    </footer>
  )
}
