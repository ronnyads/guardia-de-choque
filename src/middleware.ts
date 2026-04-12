import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/**
 * Resolve o slug do tenant a partir do hostname da requisição.
 *
 * Prioridade:
 * 1. Subdomínio da plataforma:  guardia.plataforma.com.br  →  'guardia'
 * 2. Domínio customizado:       minha-loja.com.br           →  lookup em tenants.custom_domain
 * 3. Fallback:                  STORE_SLUG env var ou 'guardia-de-choque'
 */
async function resolveTenantSlug(host: string): Promise<string> {
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? '';
  const cleanHost = host.split(':')[0]; // remove porta (ex: localhost:3000)

  // Caso 1 — subdomínio da plataforma
  if (platformDomain && cleanHost.endsWith(`.${platformDomain}`)) {
    return cleanHost.slice(0, cleanHost.length - platformDomain.length - 1);
  }

  // Caso 2 — domínio customizado (não é a plataforma nem localhost)
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
      // Falhou silenciosamente — usa fallback
    }
  }

  // Caso 3 — fallback (Modelo A single-tenant ou dev local)
  return process.env.STORE_SLUG ?? 'guardia-de-choque';
}

export async function middleware(request: NextRequest) {
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

  // getUser() pode chamar setAll e reatribuir `response` — deve vir antes de setar headers
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute      = pathname.startsWith('/admin');
  const isSuperAdminRoute = pathname.startsWith('/super-admin');
  const isLoginPage       = pathname === '/admin/login';
  const isProtected       = isAdminRoute || isSuperAdminRoute;

  // Redirecionar não-autenticados para login
  if (isProtected && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Detectar tenant pelo hostname e injetar header para todos os routes
  const host = request.headers.get('host') ?? '';
  const tenantSlug = await resolveTenantSlug(host);
  response.headers.set('x-tenant-slug', tenantSlug);

  // Injetar tenant_id no header para Server Components do admin
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
  // Cobre todas as rotas exceto assets estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
