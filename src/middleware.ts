import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

  // Na página de login com usuário autenticado — deixa o client-side decidir para onde ir
  // (super admin → /super-admin, owner → /admin)

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
  matcher: ['/admin/:path*', '/super-admin/:path*'],
};
