import Link from 'next/link'
import { signUpWithEmail } from '@/app/(auth)/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="space-y-4">
        <span className="eyebrow">cadastro</span>
        <h1 className="display-title text-5xl">Criar conta</h1>
        <p className="muted text-base leading-7">
          O cadastro cria a conta no Supabase Auth e provisiona automaticamente o dominio
          `job_ppo.users`, `profiles` e, se necessario, `creators`.
        </p>
      </div>

      {params.error ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(255,141,168,0.35)] bg-[rgba(255,141,168,0.08)] p-4 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}

      <form action={signUpWithEmail} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="muted">Nome</span>
            <input
              name="full_name"
              required
              className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="muted">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="muted">Senha</span>
            <input
              name="password"
              type="password"
              minLength={8}
              required
              className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="muted">Tipo de conta</span>
            <select
              name="role"
              defaultValue="subscriber"
              className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
            >
              <option value="subscriber">Assinante</option>
              <option value="creator">Criadora</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="button-primary">
            Continuar
          </button>
          <Link href="/login" className="button-secondary">
            Ja tenho conta
          </Link>
        </div>
      </form>
    </div>
  )
}
