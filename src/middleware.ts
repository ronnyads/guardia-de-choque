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
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // Redirecionar não-autenticados para login
  if (isAdminRoute && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirecionar autenticados da página de login para o admin
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

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
  matcher: ['/admin/:path*'],
};
