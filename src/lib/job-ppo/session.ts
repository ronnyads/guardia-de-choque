import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import {
  getHomeForRole,
  getRoleLabel,
  isRoleAllowed,
  normalizeAuthRole,
  provisionAppUser,
  type AuthRole,
} from '@/lib/job-ppo/auth-helpers'
import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import type { Role, SessionUser } from '@/lib/job-ppo/types'

type SessionState = {
  role: Role
  isAuthenticated: boolean
  user: SessionUser
}

async function resolveAuthedUser(authUserId: string) {
  const service = createServiceSupabase()
  const { data } = await service
    .schema('job_ppo')
    .from('users')
    .select('id, auth_user_id, email, role, status, full_name')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  return data
}

export const getSession = cache(async (): Promise<SessionState> => {
  const supabase = await createServerSupabase()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return {
      role: 'visitor',
      isAuthenticated: false,
      user: {
        id: 'visitor',
        authUserId: null,
        role: 'visitor',
        name: 'Visitante',
        email: null,
        label: getRoleLabel('visitor'),
        home: '/',
      },
    }
  }

  let appUser = await resolveAuthedUser(authUser.id)

  if (!appUser) {
    const metadataRole =
      authUser.user_metadata?.job_ppo_role ?? authUser.app_metadata?.job_ppo_role
    const metadataName =
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      authUser.email?.split('@')[0] ??
      'Usuario JOB PPO'

    appUser = await provisionAppUser({
      authUserId: authUser.id,
      email: authUser.email ?? `${authUser.id}@jobppo.local`,
      role: normalizeAuthRole(metadataRole),
      fullName: metadataName,
    })
  }

  const role = normalizeAuthRole(appUser.role)

  return {
    role,
    isAuthenticated: true,
    user: {
      id: appUser.id,
      authUserId: appUser.auth_user_id,
      role,
      name: appUser.full_name,
      email: appUser.email,
      label: getRoleLabel(role),
      home: getHomeForRole(role),
      status: appUser.status,
    },
  }
})

export async function requireRole(allowed: AuthRole[]) {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/login')
  }

  if (!isRoleAllowed(session.role, allowed)) {
    redirect('/unauthorized')
  }

  return session
}
