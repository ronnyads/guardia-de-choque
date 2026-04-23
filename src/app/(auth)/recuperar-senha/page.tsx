import { requestPasswordReset } from '@/app/(auth)/actions'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="space-y-4">
        <span className="eyebrow">recuperar senha</span>
        <h1 className="display-title text-5xl">Recuperacao segura</h1>
        <p className="muted text-base leading-7">
          O Supabase envia um link de recuperacao e a rota de callback troca o codigo por uma
          sessao temporaria para redefinir a senha com seguranca.
        </p>
      </div>

      {params.error ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(255,141,168,0.35)] bg-[rgba(255,141,168,0.08)] p-4 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}

      {params.message ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(114,200,154,0.3)] bg-[rgba(114,200,154,0.08)] p-4 text-sm text-[var(--success)]">
          {params.message}
        </div>
      ) : null}

      <form action={requestPasswordReset} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="muted">Email da conta</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
        </label>
        <button type="submit" className="button-primary">
          Enviar link de recuperacao
        </button>
      </form>
    </div>
  )
}
