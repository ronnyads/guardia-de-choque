import { createServiceSupabase } from '@/lib/supabase-server';
import type { TenantConfig } from '@/types/tenant';

const DEFAULT_CONFIG: TenantConfig = {
  id: '',
  tenant_id: '',
  brand_name: 'Minha Loja',
  logo_url: null,
  primary_color: '#0F172A',
  accent_color: '#059669',
  font_heading: 'Playfair Display',
  font_body: 'DM Sans',
  phone: null,
  email: null,
  domain_display: null,
  announcement_messages: [],
  trust_messages: [],
  faq_items: [],
  stats: [],
  seo_title: 'Minha Loja',
  seo_description: null,
  og_image_url: null,
  checkout_enable_stripe_fallback: true,
  checkout_retry_delay_ms: 900,
  checkout_pix_polling_ms: 3000,
  checkout_upsell_price: 69.90,
  checkout_order_bump_price: 29.90,
  updated_at: new Date().toISOString(),
};

export async function getStoreConfig(slug?: string): Promise<TenantConfig> {
  const tenantSlug = slug ?? process.env.STORE_SLUG ?? 'guardia-de-choque';

  try {
    const supabase = createServiceSupabase();

    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();

    if (tenantError || !tenant) return DEFAULT_CONFIG;

    const { data: config, error: configError } = await supabase
      .from('tenant_config')
      .select('*')
      .eq('tenant_id', tenant.id)
      .single();

    if (configError || !config) return DEFAULT_CONFIG;

    return config as TenantConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}
