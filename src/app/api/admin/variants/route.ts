import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { createServiceSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { tenantId } = await requireTenant();
    const body = await request.json();
    const { name, slug: rawSlug, promo_price, original_price, category_id, status } = body;

    if (!name || !promo_price || !category_id) {
      return NextResponse.json({ error: 'name, promo_price e category_id são obrigatórios' }, { status: 400 });
    }

    const slug = rawSlug || name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const supabase = createServiceSupabase();

    const { data, error } = await supabase
      .from('products')
      .insert({
        tenant_id: tenantId,
        name,
        slug,
        promo_price: parseFloat(promo_price),
        original_price: original_price ? parseFloat(original_price) : parseFloat(promo_price),
        category_id,
        status: status || 'active',
        images: [],
        features: [],
        specs: [],
        inventory_count: 0,
      })
      .select('id, name, slug, promo_price, status')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, variant: data });
  } catch (err: unknown) {
    const e = err as Error;
    console.error('[Variants API]', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
