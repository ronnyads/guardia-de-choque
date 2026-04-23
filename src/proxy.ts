import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { normalizeAuthRole } from '@/lib/job-ppo/auth-helpers'

type AppRole = 'subscriber' | 'creator' | 'admin' | 'super_admin'

function isAllowed(role: AppRole, allowed: AppRole[]) {
  return role === 'super_admin' || allowed.includes(role)
}

async function getRoleForRequest(authUserId: string) {
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data } = await service
    .schema('job_ppo')
    .from('users')
    .select('role')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  return data?.role ? normalizeAuthRole(data.role) : null
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const pathname = request.nextUrl.pathname
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = pathname.startsWith('/admin')
  const isSuperAdminRoute = pathname.startsWith('/super-admin')
  const isStudioRoute = pathname.startsWith('/studio')
  const isSubscriberRoute = pathname.startsWith('/assinante')
  const isAdminLogin = pathname === '/admin/login'
  const isLogin = pathname === '/login'

  const rawMetadataRole = user
    ? user.user_metadata?.job_ppo_role ?? user.app_metadata?.job_ppo_role
    : null
  const metadataRole =
    user && typeof rawMetadataRole === 'string' ? normalizeAuthRole(rawMetadataRole) : null
  const role = user ? metadataRole ?? (await getRoleForRequest(user.id)) : null

  if (isLogin && user && role) {
    const home =
      role === 'subscriber'
        ? '/assinante'
        : role === 'creator'
          ? '/studio'
          : role === 'admin'
            ? '/admin'
            : '/super-admin'

    return NextResponse.redirect(new URL(home, request.url))
  }

  if (isAdminLogin && user && role && isAllowed(role, ['admin'])) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  const redirectToLogin = () => {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isSuperAdminRoute) {
    if (!user || !role) {
      return redirectToLogin()
    }

    if (!isAllowed(role, ['super_admin'])) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (isAdminRoute && !isAdminLogin) {
    if (!user || !role) {
      return redirectToLogin()
    }

    if (!isAllowed(role, ['admin'])) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (isStudioRoute) {
    if (!user || !role) {
      return redirectToLogin()
    }

    if (!isAllowed(role, ['creator'])) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (isSubscriberRoute) {
    if (!user || !role) {
      return redirectToLogin()
    }

    if (!isAllowed(role, ['subscriber'])) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
