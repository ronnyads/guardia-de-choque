import { updatePassword } from '@/app/(auth)/actions'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="space-y-4">
        <span className="eyebrow">nova senha</span>
        <h1 className="display-title text-5xl">Definir uma nova senha</h1>
        <p className="muted text-base leading-7">
          Esta tela usa a sessao temporaria do fluxo de recovery do Supabase para concluir a
          troca de senha sem expor tokens manualmente.
        </p>
      </div>

      {params.error ? (
        <div className="mt-6 rounded-[20px] border border-[rgba(255,141,168,0.35)] bg-[rgba(255,141,168,0.08)] p-4 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}

      <form action={updatePassword} className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="muted">Nova senha</span>
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="muted">Confirmar senha</span>
          <input
            name="confirm_password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 outline-none"
          />
        </label>
        <button type="submit" className="button-primary">
          Atualizar senha
        </button>
      </form>
    </div>
  )
}
