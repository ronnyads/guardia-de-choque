'use server'

import { redirect } from 'next/navigation'
import {
  formatAuthError,
  getHomeForRole,
  getRequestOrigin,
  getRoleFromAuthUserId,
  normalizeAuthRole,
  provisionAppUser,
  safeNextPath,
} from '@/lib/job-ppo/auth-helpers'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Role } from '@/lib/job-ppo/types'

function buildQuery(pathname: string, key: 'error' | 'message', value: string) {
  const url = new URL(pathname, 'http://local.jobppo')
  url.searchParams.set(key, value)
  return `${url.pathname}?${url.searchParams.toString()}`
}

function parseRole(value: FormDataEntryValue | null): Exclude<Role, 'visitor'> {
  return normalizeAuthRole(value)
}

function parsePublicSignupRole(value: FormDataEntryValue | null) {
  const role = parseRole(value)
  return role === 'creator' ? 'creator' : 'subscriber'
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  if (!email || !password) {
    redirect(buildQuery('/login', 'error', 'Informe email e senha.'))
  }

  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    redirect(buildQuery('/login', 'error', formatAuthError(error?.message ?? '')))
  }

  const role =
    (await getRoleFromAuthUserId(data.user.id)) ??
    normalizeAuthRole(
      data.user.user_metadata?.job_ppo_role ?? data.user.app_metadata?.job_ppo_role,
    )

  redirect(next ?? getHomeForRole(role))
}

export async function signUpWithEmail(formData: FormData) {
  const fullName = String(formData.get('full_name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const role = parsePublicSignupRole(formData.get('role'))

  if (!fullName || !email || !password) {
    redirect(buildQuery('/cadastro', 'error', 'Preencha nome, email e senha.'))
  }

  if (password.length < 8) {
    redirect(buildQuery('/cadastro', 'error', 'Use uma senha com pelo menos 8 caracteres.'))
  }

  const origin = await getRequestOrigin()
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(getHomeForRole(role))}`,
      data: {
        full_name: fullName,
        job_ppo_role: role,
      },
    },
  })

  if (error) {
    redirect(buildQuery('/cadastro', 'error', formatAuthError(error.message)))
  }

  if (data.user) {
    await provisionAppUser({
      authUserId: data.user.id,
      email,
      role,
      fullName,
    })
  }

  if (data.session) {
    redirect(getHomeForRole(role))
  }

  redirect(buildQuery('/login', 'message', 'Conta criada. Confira seu email para confirmar o acesso.'))
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!email) {
    redirect(buildQuery('/recuperar-senha', 'error', 'Informe o email da sua conta.'))
  }

  const origin = await getRequestOrigin()
  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/redefinir-senha')}`,
  })

  if (error) {
    redirect(buildQuery('/recuperar-senha', 'error', formatAuthError(error.message)))
  }

  redirect(
    buildQuery(
      '/recuperar-senha',
      'message',
      'Se o email existir, enviaremos um link de recuperacao.',
    ),
  )
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirm_password') ?? '')

  if (!password || password.length < 8) {
    redirect(buildQuery('/redefinir-senha', 'error', 'Use uma senha com pelo menos 8 caracteres.'))
  }

  if (password !== confirmPassword) {
    redirect(buildQuery('/redefinir-senha', 'error', 'As senhas precisam ser iguais.'))
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    redirect(buildQuery('/redefinir-senha', 'error', formatAuthError(error.message)))
  }

  redirect(buildQuery('/login', 'message', 'Senha atualizada com sucesso.'))
}

export async function signOut() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/')
}
