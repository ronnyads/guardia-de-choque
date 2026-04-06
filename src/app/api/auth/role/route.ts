import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createServiceSupabase } from '@/lib/supabase-server';

/**
 * GET /api/auth/role
 * Retorna o papel do usuário autenticado: "super_admin" | "tenant_owner" | "unauthorized"
 */
export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ role: 'unauthorized' });
  }

  const service = createServiceSupabase();

  const { data: superAdmin } = await service
    .from('super_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (superAdmin) {
    return NextResponse.json({ role: 'super_admin' });
  }

  const { data: tenantUser } = await service
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  if (tenantUser) {
    return NextResponse.json({ role: 'tenant_owner' });
  }

  return NextResponse.json({ role: 'unauthorized' });
}
