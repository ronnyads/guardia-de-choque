import { createServiceSupabase } from '@/lib/supabase-server';
import type { TenantConfig } from '@/types/tenant';

export async function getMetaPixelConfig(tenantId: string): Promise<{ pixelId: string; accessToken: string }> {
  try {
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from('tenant_integrations')
      .select('public_key, secret_key_encrypted')
      .eq('tenant_id', tenantId)
      .eq('provider', 'meta_pixel')
      .eq('is_active', true)
      .single();
    return {
      pixelId:     data?.public_key           ?? '',
      accessToken: data?.secret_key_encrypted ?? '',
    };
  } catch {
    return { pixelId: '', accessToken: '' };
  }
}

export async function getGoogleIds(slug?: string): Promise<{ gaId: string; gtmId: string }> {
  const tenantSlug = slug ?? process.env.STORE_SLUG ?? 'guardia-de-choque';
  try {
    const supabase = createServiceSupabase();
    const { data: tenant } = await supabase
      .from('tenants').select('id').eq('slug', tenantSlug).single();
    if (!tenant) return { gaId: '', gtmId: '' };

    const { data: integrations } = await supabase
      .from('tenant_integrations')
      .select('provider, public_key')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .in('provider', ['google_analytics', 'google_tag_manager']);

    return {
      gaId:  integrations?.find(i => i.provider === 'google_analytics')?.public_key  ?? '',
      gtmId: integrations?.find(i => i.provider === 'google_tag_manager')?.public_key ?? '',
    };
  } catch {
    return { gaId: '', gtmId: '' };
  }
}

export async function getPixelIds(slug?: string): Promise<{ metaPixelId: string; kwaiPixelId: string }> {
  const tenantSlug = slug ?? process.env.STORE_SLUG ?? 'guardia-de-choque';
  try {
    const supabase = createServiceSupabase();
    const { data: tenant } = await supabase
      .from('tenants').select('id').eq('slug', tenantSlug).single();
    if (!tenant) return { metaPixelId: '', kwaiPixelId: '' };

    const { data: integrations } = await supabase
      .from('tenant_integrations')
      .select('provider, public_key')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .in('provider', ['meta_pixel', 'kwai_pixel']);

    const meta = integrations?.find(i => i.provider === 'meta_pixel');
    const kwai = integrations?.find(i => i.provider === 'kwai_pixel');
    return {
      metaPixelId: meta?.public_key ?? '',
      kwaiPixelId: kwai?.public_key ?? '',
    };
  } catch {
    return { metaPixelId: '', kwaiPixelId: '' };
  }
}

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
  recovery_whatsapp_template: null,
  page_sections: null,
  header_config: null,
  footer_config: null,
  updated_at: new Date().toISOString(),
};

export async function getShippingConfig(tenantId: string): Promise<{ originCep: string; isFree: boolean }> {
  try {
    const supabase = createServiceSupabase();
    const { data } = await supabase
      .from('tenant_config')
      .select('shipping_origin_cep, shipping_free')
      .eq('tenant_id', tenantId)
      .single();
    return {
      originCep: data?.shipping_origin_cep ?? '',
      isFree:    data?.shipping_free !== false,
    };
  } catch {
    return { originCep: '', isFree: true };
  }
}

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
