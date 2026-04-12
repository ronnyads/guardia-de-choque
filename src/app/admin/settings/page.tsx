import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import type { TenantConfig, TenantIntegration } from '@/types/tenant';
import SettingsTabs from './SettingsTabs';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const [{ data: config }, { data: integrations }] = await Promise.all([
    supabase
      .from('tenant_config')
      .select('*')
      .eq('tenant_id', tenantId)
      .single(),
    supabase
      .from('tenant_integrations')
      .select('id, provider, public_key, is_active, updated_at, secret_key_encrypted')
      .eq('tenant_id', tenantId),
  ]);

  // Mascarar secret: substituir valor real por booleano antes de enviar ao cliente
  const maskedIntegrations = (integrations ?? []).map(i => ({
    ...i,
    secret_key_encrypted: i.secret_key_encrypted ? '••••' : null,
  }));

  return (
    <div className="flex flex-col gap-0 h-full">
      <div className="mb-6 pb-5 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0F172A]">Configurações</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Personalize sua loja, integrações e conteúdo.
        </p>
      </div>

      <SettingsTabs
        config={config as TenantConfig | null}
        integrations={maskedIntegrations as Omit<TenantIntegration, 'tenant_id' | 'extra_config'>[]}
      />
    </div>
  );
}
