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

  const { error } = await supabase
    .from('products')
    .update({ name, slug, status, original_price, promo_price, sku, inventory_count, description })
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw new Error(`Erro ao atualizar produto: ${error.message}`);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw new Error(`Erro ao excluir produto: ${error.message}`);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}
