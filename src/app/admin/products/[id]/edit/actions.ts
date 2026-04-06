'use server';

import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateProduct(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const id             = formData.get('id') as string;
  const name           = formData.get('name') as string;
  const rawSlug        = formData.get('slug') as string;
  const slug           = rawSlug || name.toLowerCase().replace(/ /g, '-');
  const status         = (formData.get('status') as string) || 'draft';
  const original_price = parseFloat((formData.get('original_price') as string) || '0');
  const promo_price    = parseFloat((formData.get('promo_price') as string) || '0');
  const sku            = formData.get('sku') as string;
  const inventory_count = parseInt((formData.get('inventory_count') as string) || '0');
  const description    = (formData.get('description') as string) || '';

  const long_description = (formData.get('long_description') as string) || '';
  const badge = (formData.get('badge') as string) || null;
  const category_id = (formData.get('category_id') as string) || null;

  const imagesRaw = (formData.get('images') as string) || '';
  const images = imagesRaw.split('\n').map(s => s.trim()).filter(Boolean);

  let features: unknown[] = [];
  try {
    const featuresRaw = (formData.get('features') as string) || '[]';
    const parsed = JSON.parse(featuresRaw);
    if (Array.isArray(parsed)) features = parsed;
  } catch {
    // JSON inválido — manter array vazio
  }

  let specs: unknown[] = [];
  try {
    const specsRaw = (formData.get('specs') as string) || '[]';
    const parsed = JSON.parse(specsRaw);
    if (Array.isArray(parsed)) specs = parsed;
  } catch {
    // JSON inválido — manter array vazio
  }

  const cost_price = parseFloat((formData.get('cost_price') as string) || '0') || null;
  const rating = parseFloat((formData.get('rating') as string) || '0');
  const review_count = parseInt((formData.get('review_count') as string) || '0');

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      status,
      original_price,
      promo_price,
      cost_price,
      sku,
      inventory_count,
      description,
      long_description,
      badge,
      category_id,
      images,
      features,
      specs,
      rating,
      review_count,
    })
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`);

  revalidatePath('/admin/products');
  revalidatePath(`/produto/${slug}`);
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('products')
    .update({ status: 'archived' })
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw new Error(`Erro ao arquivar produto: ${error.message}`);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}
