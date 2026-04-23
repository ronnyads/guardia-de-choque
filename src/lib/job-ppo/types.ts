export type Role = 'visitor' | 'subscriber' | 'creator' | 'admin' | 'super_admin'

export type CreatorBadge = 'Verificada' | 'Nova' | 'Popular' | 'Trending'

export type NavItem = {
  href: string
  label: string
  hint?: string
}

export type CreatorSummary = {
  slug: string
  artisticName: string
  tagline: string
  category: string
  monthlyPrice: number
  badges: CreatorBadge[]
  bio: string
  teaser: string
  tags: string[]
  portraitGradient: string
  stats: {
    subscribers: string
    premiumPosts: string
    responseTime: string
  }
  mediaPreview: Array<{
    title: string
    kind: 'Foto' | 'Video' | 'Audio'
    locked: boolean
  }>
  similarSlugs: string[]
}

export type PlanSummary = {
  id: string
  name: string
  price: number
  description: string
  featured?: boolean
  target: string
  features: string[]
}

export type DashboardMetric = {
  label: string
  value: string
  delta: string
  tone?: 'positive' | 'warning' | 'danger'
}

export type DashboardTable = {
  columns: string[]
  rows: string[][]
}

export type WorkspaceSection = {
  slug: string
  title: string
  description: string
  bullets: string[]
  highlights: string[]
  metrics: DashboardMetric[]
  table?: DashboardTable
}

export type PermissionRow = {
  capability: string
  visitor: boolean
  subscriber: boolean
  creator: boolean
  admin: boolean
  superAdmin: boolean
}

export type SessionUser = {
  id: string
  authUserId?: string | null
  name: string
  email?: string | null
  role: Role
  label: string
  home: string
  status?: string
}
