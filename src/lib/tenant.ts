import { createServerSupabase } from '@/lib/supabase-server';
import type { TenantContext } from '@/types/tenant';

/**
 * Resolve o TenantContext do usuário autenticado na sessão atual.
 * Retorna null se não houver sessão ou se o usuário não tiver tenant associado.
 *
 * Use em Server Components e API Routes.
 */
export async function getTenantFromSession(): Promise<TenantContext | null> {
  const supabase = await createServerSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: tenantUser, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, tenants(slug)')
    .eq('user_id', user.id)
    .single();

  if (error || !tenantUser) return null;

  const rawTenants = tenantUser.tenants;
  const tenants = (Array.isArray(rawTenants) ? rawTenants[0] : rawTenants) as { slug: string } | null;
  if (!tenants?.slug) return null;

  return {
    tenantId: tenantUser.tenant_id,
    tenantSlug: tenants.slug,
  };
}

/**
 * Como getTenantFromSession, mas lança um erro se o tenant não for encontrado.
 * Use em páginas admin onde a ausência de tenant é um estado inválido.
 */
export async function requireTenant(): Promise<TenantContext> {
  const ctx = await getTenantFromSession();
  if (!ctx) {
    throw new Error('Tenant não encontrado. Usuário não está associado a nenhuma loja.');
  }
  return ctx;
}
