import type { NavItem, Role } from '@/lib/job-ppo/types'

export const publicNav: NavItem[] = [
  { href: '/explorar', label: 'Explorar' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/planos', label: 'Planos' },
  { href: '/institucional', label: 'Sobre' },
  { href: '/suporte', label: 'Suporte' },
]

export const subscriberNav: NavItem[] = [
  { href: '/assinante', label: 'Resumo' },
  { href: '/assinante/favoritos', label: 'Favoritos' },
  { href: '/assinante/assinaturas', label: 'Assinaturas' },
  { href: '/assinante/pagamentos', label: 'Pagamentos' },
  { href: '/assinante/biblioteca', label: 'Biblioteca' },
  { href: '/assinante/mensagens', label: 'Mensagens' },
  { href: '/assinante/notificacoes', label: 'Notificacoes' },
  { href: '/assinante/configuracoes', label: 'Configuracoes' },
]

export const creatorNav: NavItem[] = [
  { href: '/studio', label: 'Dashboard' },
  { href: '/studio/onboarding', label: 'Onboarding' },
  { href: '/studio/perfil', label: 'Perfil artistico' },
  { href: '/studio/verificacao', label: 'Verificacao' },
  { href: '/studio/planos', label: 'Planos' },
  { href: '/studio/conteudo', label: 'Conteudo' },
  { href: '/studio/biblioteca', label: 'Midia' },
  { href: '/studio/assinantes', label: 'Assinantes' },
  { href: '/studio/ganhos', label: 'Ganhos' },
  { href: '/studio/analytics', label: 'Analytics' },
  { href: '/studio/notificacoes', label: 'Notificacoes' },
  { href: '/studio/configuracoes', label: 'Configuracoes' },
]

export const adminNav: NavItem[] = [
  { href: '/admin', label: 'Painel' },
  { href: '/admin/usuarios', label: 'Usuarios' },
  { href: '/admin/criadoras', label: 'Criadoras' },
  { href: '/admin/verificacao', label: 'Verificacao' },
  { href: '/admin/moderacao', label: 'Moderacao' },
  { href: '/admin/denuncias', label: 'Denuncias' },
  { href: '/admin/assinaturas', label: 'Assinaturas' },
  { href: '/admin/pagamentos', label: 'Pagamentos' },
  { href: '/admin/repasses', label: 'Repasses' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/cms', label: 'CMS' },
  { href: '/admin/configuracoes', label: 'Configuracoes' },
  { href: '/admin/logs', label: 'Logs' },
  { href: '/admin/permissoes', label: 'Permissoes' },
]

export const roleHome: Record<Exclude<Role, 'visitor'>, string> = {
  subscriber: '/assinante',
  creator: '/studio',
  admin: '/admin',
  super_admin: '/super-admin',
}
