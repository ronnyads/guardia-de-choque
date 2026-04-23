export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="min-h-screen">
      <div className="container-shell grid min-h-screen gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="surface-card-strong hidden h-full min-h-[620px] overflow-hidden p-8 lg:block">
          <div
            className="profile-portrait h-full min-h-[560px]"
            style={{
              ['--portrait-gradient' as string]:
                'linear-gradient(155deg, #251420 10%, #7d4b70 45%, #c07aa0 72%, #ead5c5 100%)',
            }}
          >
            <div className="absolute inset-x-6 top-6 z-10 space-y-4">
              <span className="eyebrow">supabase auth</span>
              <h1 className="display-title text-5xl">
                Sessao real, papeis reais e base pronta para producao.
              </h1>
            </div>
            <div className="absolute inset-x-6 bottom-6 z-10 glass-strip rounded-[24px] p-5">
              <p className="text-sm leading-7 text-white/78">
                O fluxo agora usa Supabase Auth no App Router, callback dedicado, recuperacao de
                senha e provisionamento automatico das entidades do dominio JOB PPO.
              </p>
            </div>
          </div>
        </section>
        <section>{children}</section>
      </div>
    </main>
  )
}
