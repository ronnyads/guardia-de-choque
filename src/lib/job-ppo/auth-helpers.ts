import 'server-only'

import { headers } from 'next/headers'
import { createServiceSupabase } from '@/lib/supabase-server'
import { roleHome } from '@/lib/job-ppo/navigation'
import type { Role } from '@/lib/job-ppo/types'

export type AuthRole = Exclude<Role, 'visitor'>

const roleLabels: Record<Role, string> = {
  visitor: 'Visitante',
  subscriber: 'Assinante',
  creator: 'Criadora',
  admin: 'Admin',
  super_admin: 'Super Admin',
}

export function normalizeAuthRole(value: unknown): AuthRole {
  if (
    value === 'subscriber' ||
    value === 'creator' ||
    value === 'admin' ||
    value === 'super_admin'
  ) {
    return value
  }

  return 'subscriber'
}

export function getRoleLabel(role: Role) {
  return roleLabels[role]
}

export function isRoleAllowed(role: Role, allowed: AuthRole[]) {
  return role === 'super_admin' || (role !== 'visitor' && allowed.includes(role))
}

export function safeNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== 'string') {
    return null
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return null
  }

  return value
}

export async function getRequestOrigin() {
  const headerStore = await headers()
  const forwardedProto = headerStore.get('x-forwarded-proto')
  const forwardedHost = headerStore.get('x-forwarded-host')
  const host = forwardedHost ?? headerStore.get('host')
  const protocol = forwardedProto ?? (host?.includes('localhost') ? 'http' : 'https')

  if (host) {
    return `${protocol}://${host}`
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createUniqueHandle(seed: string, authUserId: string) {
  const base = slugify(seed) || 'job-ppo-user'
  return `${base}-${authUserId.slice(0, 8)}`
}

type ProvisionInput = {
  authUserId: string
  email: string
  role: AuthRole
  fullName: string
}

export async function provisionAppUser({
  authUserId,
  email,
  role,
  fullName,
}: ProvisionInput) {
  const service = createServiceSupabase()
  const username = createUniqueHandle(email.split('@')[0] ?? fullName, authUserId)
  const creatorSlug = createUniqueHandle(fullName, authUserId)

  const { data: appUser, error: userError } = await service
    .schema('job_ppo')
    .from('users')
    .upsert(
      {
        auth_user_id: authUserId,
        email,
        role,
        full_name: fullName,
        status: 'active',
      },
      { onConflict: 'auth_user_id' },
    )
    .select('id, role, full_name, email, auth_user_id, status')
    .single()

  if (userError || !appUser) {
    throw new Error(userError?.message ?? 'Nao foi possivel provisionar job_ppo.users')
  }

  const { error: profileError } = await service.schema('job_ppo').from('profiles').upsert(
    {
      user_id: appUser.id,
      username,
      display_name: fullName,
      bio:
        role === 'creator'
          ? 'Perfil artistico em configuracao. Complete seu onboarding para publicar.'
          : 'Perfil premium do JOB PPO.',
      is_public: role === 'creator',
    },
    { onConflict: 'user_id' },
  )

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (role === 'creator') {
    const { error: creatorError } = await service.schema('job_ppo').from('creators').upsert(
      {
        user_id: appUser.id,
        artistic_name: fullName,
        slug: creatorSlug,
        tagline: 'Perfil em onboarding no JOB PPO.',
        teaser_text: 'Finalize seu perfil, planos e verificacao para abrir a descoberta.',
        status: 'draft',
        verification_status: 'pending',
        base_subscription_price: 0,
        is_featured: false,
        is_new: true,
        is_trending: false,
      },
      { onConflict: 'user_id' },
    )

    if (creatorError) {
      throw new Error(creatorError.message)
    }
  }

  return appUser
}

export async function getRoleFromAuthUserId(authUserId: string): Promise<AuthRole | null> {
  const service = createServiceSupabase()
  const { data, error } = await service
    .schema('job_ppo')
    .from('users')
    .select('role')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) {
    return null
  }

  return data?.role ? normalizeAuthRole(data.role) : null
}

export function getHomeForRole(role: AuthRole) {
  return roleHome[role]
}

export function formatAuthError(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes('invalid login credentials')) {
    return 'Email ou senha invalidos.'
  }

  if (normalized.includes('email not confirmed')) {
    return 'Confirme seu email antes de entrar.'
  }

  if (normalized.includes('user already registered')) {
    return 'Ja existe uma conta com este email.'
  }

  if (normalized.includes('password should be at least')) {
    return 'Use uma senha com pelo menos 8 caracteres.'
  }

  return 'Nao foi possivel concluir a autenticacao agora.'
}
