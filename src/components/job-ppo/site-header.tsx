import Link from 'next/link'
import { signOut } from '@/app/(auth)/actions'
import { BrandMark } from '@/components/job-ppo/brand-mark'
import { getSession } from '@/lib/job-ppo/session'
import { publicNav } from '@/lib/job-ppo/navigation'

export async function SiteHeader() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(13,11,18,0.82)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <BrandMark compact />
        <nav className="hidden items-center gap-6 text-sm text-[var(--text-secondary)] lg:flex">
          {publicNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {session.isAuthenticated ? (
            <>
              <span className="pill hidden sm:inline-flex">{session.user.label}</span>
              <Link href={session.user.home} className="button-secondary">
                Abrir painel
              </Link>
              <form action={signOut}>
                <button type="submit" className="button-ghost">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="button-ghost">
                Entrar
              </Link>
              <Link href="/cadastro" className="button-primary">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
