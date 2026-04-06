import { NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, productSlug, productPrice, utmSource, utmMedium, utmCampaign } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: 'Email ou telefone obrigatório' }, { status: 400 });
    }

    const supabase = createServiceSupabase();

    // Resolver tenant_id pelo slug do produto
    const { data: product } = await supabase
      .from('products')
      .select('tenant_id, name')
      .eq('slug', String(productSlug || ''))
      .single();

    if (!product?.tenant_id) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 400 });
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        tenant_id:      product.tenant_id,
        customer_name:  name  || null,
        customer_email: email || null,
        customer_phone: phone || null,
        product_slug:   productSlug  || null,
        product_name:   product.name || null,
        product_price:  productPrice || null,
        status:         'checkout_started',
        utm_source:     utmSource  || null,
        utm_medium:     utmMedium  || null,
        utm_campaign:   utmCampaign || null,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err: unknown) {
    const e = err as Error;
    console.error('[Lead Capture]', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
