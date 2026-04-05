'use server';

import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// ─── MARCA ────────────────────────────────────────────────────────────────────

export async function updateBrandConfig(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const brand_name    = formData.get('brand_name') as string | null;
  const primary_color = (formData.get('primary_color') as string) || '#0F172A';
  const accent_color  = (formData.get('accent_color') as string) || '#059669';
  const font_heading  = (formData.get('font_heading') as string) || 'Playfair Display';
  const font_body     = (formData.get('font_body') as string) || 'DM Sans';

  const { error } = await supabase
    .from('tenant_config')
    .upsert(
      { tenant_id: tenantId, brand_name, primary_color, accent_color, font_heading, font_body, updated_at: new Date().toISOString() },
      { onConflict: 'tenant_id' }
    );

  if (error) throw new Error(`Erro ao salvar marca: ${error.message}`);

  revalidatePath('/admin/settings');
}

// ─── CONTATO & CONTEÚDO ───────────────────────────────────────────────────────

export async function updateContactConfig(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const phone          = formData.get('phone') as string | null;
  const email          = formData.get('email') as string | null;
  const domain_display = formData.get('domain_display') as string | null;

  // Arrays chegam como JSON string serializado pelo client
  const parseJsonField = (key: string) => {
    const val = formData.get(key) as string | null;
    if (!val) return [];
    try { return JSON.parse(val); } catch { return []; }
  };

  const announcement_messages = parseJsonField('announcement_messages');
  const trust_messages        = parseJsonField('trust_messages');
  const faq_items             = parseJsonField('faq_items');

  const { error } = await supabase
    .from('tenant_config')
    .upsert(
      {
        tenant_id: tenantId,
        phone, email, domain_display,
        announcement_messages, trust_messages, faq_items,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tenant_id' }
    );

  if (error) throw new Error(`Erro ao salvar contato: ${error.message}`);

  revalidatePath('/admin/settings');
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export async function updateSeoConfig(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const seo_title       = formData.get('seo_title') as string | null;
  const seo_description = formData.get('seo_description') as string | null;

  const { error } = await supabase
    .from('tenant_config')
    .upsert(
      { tenant_id: tenantId, seo_title, seo_description, updated_at: new Date().toISOString() },
      { onConflict: 'tenant_id' }
    );

  if (error) throw new Error(`Erro ao salvar SEO: ${error.message}`);

  revalidatePath('/admin/settings');
}

// ─── INTEGRAÇÕES ──────────────────────────────────────────────────────────────

export type IntegrationProvider = 'mercadopago' | 'stripe' | 'meta_pixel' | 'kwai_pixel';

export async function upsertIntegration(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const provider   = formData.get('provider') as IntegrationProvider;
  const public_key = formData.get('public_key') as string | null;
  const secret_raw = formData.get('secret_key') as string | null;
  const is_active  = formData.get('is_active') === 'true';

  if (!provider) throw new Error('Provider é obrigatório');

  // Busca a integração existente para preservar secret se não enviado
  const { data: existing } = await supabase
    .from('tenant_integrations')
    .select('secret_key_encrypted')
    .eq('tenant_id', tenantId)
    .eq('provider', provider)
    .single();

  // Só atualiza o secret se o usuário enviou um valor não-vazio
  const secret_key_encrypted =
    secret_raw && secret_raw.trim().length > 0
      ? secret_raw.trim() // TODO Fase 12: criptografar com pgcrypto antes de salvar
      : (existing?.secret_key_encrypted ?? null);

  const { error } = await supabase
    .from('tenant_integrations')
    .upsert(
      {
        tenant_id: tenantId,
        provider,
        public_key: public_key || null,
        secret_key_encrypted,
        is_active,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'tenant_id,provider' }
    );

  if (error) throw new Error(`Erro ao salvar integração: ${error.message}`);

  revalidatePath('/admin/settings');
}
