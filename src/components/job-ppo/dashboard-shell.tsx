'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/(auth)/actions'
import { BrandMark } from '@/components/job-ppo/brand-mark'
import type { NavItem } from '@/lib/job-ppo/types'

type DashboardShellProps = {
  title: string
  description: string
  roleLabel: string
  nav: NavItem[]
  children: React.ReactNode
}

export function DashboardShell({
  title,
  description,
  roleLabel,
  nav,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <BrandMark />
        <div className="mt-6 space-y-2">
          <span className="eyebrow">{roleLabel}</span>
          <p className="muted text-sm leading-6">
            Espaco operacional desenhado para manter clareza, conversao e ritmo diario.
          </p>
        </div>
        <nav className="dashboard-nav">
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(`${item.href}/`))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.label}</span>
                <span className="subtle text-xs">/</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-6">
          <form action={signOut}>
            <button type="submit" className="button-ghost w-full">
              Encerrar sessao demo
            </button>
          </form>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="surface-card-strong p-5 sm:p-6">
          <div className="topbar">
            <div className="space-y-3">
              <span className="eyebrow">{roleLabel}</span>
              <div>
                <h1 className="display-title text-4xl sm:text-5xl">{title}</h1>
                <p className="muted mt-2 max-w-3xl text-base leading-7">{description}</p>
              </div>
            </div>
            <div className="glass-strip rounded-[20px] p-4 text-sm text-[var(--text-secondary)]">
              Mobile-first, premium e pronto para integracao real com Supabase + gateway.
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </main>
    </div>
  )
}
