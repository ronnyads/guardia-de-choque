import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="section">
      <div className="container-shell max-w-3xl">
        <div className="surface-card-strong p-8 text-center">
          <span className="eyebrow">acesso negado</span>
          <h1 className="display-title mt-4 text-5xl">Este papel nao pode abrir esta area.</h1>
          <p className="muted mt-4 text-lg leading-8">
            A fundacao do JOB PPO ja trata segregacao por papel. Volte para o painel correto ou
            inicie outra sessao demo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="button-primary">
              Trocar sessao
            </Link>
            <Link href="/" className="button-secondary">
              Voltar para a home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
