import Link from 'next/link'
import { signInWithEmail } from '@/app/(auth)/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; message?: string }>
}) {
  const params = await searchParams
  const next = params.next
  const error = params.error
  const message = params.message

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="space-y-4">
        <span className="eyebrow">login</span>
        <h1 className="display-title text-5xl">Entrar no JOB PPO</h1>
        <p className="muted text-base leading-7">
          O acesso agora usa Supabase Auth com sessao real, redirecionamento por papel e base
          integrada com as tabelas do dominio `job_ppo`.
        </p>
      </div>

      {error ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(255,141,168,0.35)] bg-[rgba(255,141,168,0.08)] p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(114,200,154,0.3)] bg-[rgba(114,200,154,0.08)] p-4 text-sm text-[var(--success)]">
          {message}
        </div>
      ) : null}

      <form action={signInWithEmail} className="mt-8 space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <label className="block space-y-2 text-sm">
          <span className="muted">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder="voce@jobppo.com"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="muted">Senha</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder="********"
          />
        </label>
        <button type="submit" className="button-primary w-full">
          Entrar
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/recuperar-senha" className="link-inline">
          Esqueci minha senha
        </Link>
        <Link href="/cadastro" className="button-ghost">
          Criar nova conta
        </Link>
      </div>

      <div className="mt-8 premium-grid cols-2">
        {[
          ['Assinante', 'Acessa feed premium, favoritos e historico financeiro.'],
          ['Criadora', 'Ganha studio, onboarding, planos, conteudo e analytics.'],
          ['Admin', 'Opera verificacao, pagamentos, moderacao e CMS.'],
          ['Super Admin', 'Controla governanca, permissoes e camadas criticas.'],
        ].map(([label, copy]) => (
          <article key={label} className="surface-card p-4">
            <p className="text-lg font-semibold">{label}</p>
            <p className="muted mt-2 text-sm leading-6">{copy}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
