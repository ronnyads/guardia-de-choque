import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

async function resolveTenantSlug(host: string): Promise<string> {
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? '';
  const cleanHost = host.split(':')[0];

  if (platformDomain && cleanHost.endsWith(`.${platformDomain}`)) {
    return cleanHost.slice(0, cleanHost.length - platformDomain.length - 1);
  }

  if (
    platformDomain &&
    cleanHost !== platformDomain &&
    cleanHost !== 'localhost' &&
    !cleanHost.startsWith('192.') &&
    !cleanHost.startsWith('127.')
  ) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      const { data } = await supabase
        .from('tenants')
        .select('slug')
        .eq('custom_domain', cleanHost)
        .eq('status', 'active')
        .single();
      if (data?.slug) return data.slug;
    } catch {
      // fallback silencioso
    }
  }

  return process.env.STORE_SLUG ?? 'guardia-de-choque';
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  const isLoginPage = pathname === '/admin/login';
  const isProtected = isAdminRoute || isSuperAdminRoute;

  if (isProtected && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const host = request.headers.get('host') ?? '';
  const tenantSlug = await resolveTenantSlug(host);
  response.headers.set('x-tenant-slug', tenantSlug);

  if (user && isAdminRoute && !isLoginPage) {
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single();

    if (tenantUser?.tenant_id) {
      response.headers.set('x-tenant-id', tenantUser.tenant_id);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
