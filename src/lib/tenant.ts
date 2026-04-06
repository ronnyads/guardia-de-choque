import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceSupabase } from '@/lib/supabase-server';
import type { TenantContext } from '@/types/tenant';

/**
 * Verifica se o usuário autenticado é super admin da plataforma.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // service role para bypass de RLS na tabela super_admins
  const service = createServiceSupabase();
  const { data } = await service
    .from('super_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  return !!data;
}

/**
 * Resolve o TenantContext do usuário autenticado na sessão atual.
 * Super admins resolvem o primeiro tenant disponível (guardia-de-choque por padrão).
 * Retorna null se não houver sessão ou tenant associado.
 */
export async function getTenantFromSession(): Promise<TenantContext | null> {
  const supabase = await createServerSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  // Tenta via tenant_users normal
  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id, tenants(slug)')
    .eq('user_id', user.id)
    .single();

  if (tenantUser) {
    const rawTenants = tenantUser.tenants;
    const tenants = (Array.isArray(rawTenants) ? rawTenants[0] : rawTenants) as { slug: string } | null;
    if (tenants?.slug) {
      return { tenantId: tenantUser.tenant_id, tenantSlug: tenants.slug };
    }
  }

  // Super admin: resolve o tenant padrão (guardia-de-choque)
  const service = createServiceSupabase();
  const { data: superAdmin } = await service
    .from('super_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (superAdmin) {
    const { data: tenant } = await service
      .from('tenants')
      .select('id, slug')
      .eq('slug', process.env.STORE_SLUG ?? 'guardia-de-choque')
      .single();

    if (tenant) {
      return { tenantId: tenant.id, tenantSlug: tenant.slug };
    }
  }

  return null;
}

/**
 * Como getTenantFromSession, mas redireciona para login se não encontrar tenant.
 * Use em páginas admin onde a ausência de tenant é estado inválido.
 */
export async function requireTenant(): Promise<TenantContext> {
  const ctx = await getTenantFromSession();
  if (!ctx) {
    redirect('/admin/login');
  }
  return ctx;
}
