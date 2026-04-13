import { NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';
import { resolveProductTenant } from '@/lib/checkout-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, productSlug, productPrice, utmSource, utmMedium, utmCampaign } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: 'Email ou telefone obrigatório' }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const prod = await resolveProductTenant(String(productSlug || ''));

    if (!prod) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 400 });
    }

    // Upsert por tenant + email + produto — evita leads duplicados do mesmo cliente
    const { data: lead, error } = await supabase
      .from('leads')
      .upsert(
        {
          tenant_id:      prod.tenantId,
          customer_name:  name  || null,
          customer_email: email || null,
          customer_phone: phone || null,
          product_slug:   productSlug    || null,
          product_name:   prod.productName || null,
          product_price:  productPrice   || null,
          status:         'checkout_started',
          utm_source:     utmSource   || null,
          utm_medium:     utmMedium   || null,
          utm_campaign:   utmCampaign || null,
          updated_at:     new Date().toISOString(),
        },
        {
          onConflict: 'tenant_id,customer_email,product_slug',
          ignoreDuplicates: false, // atualiza campos quando conflito
        }
      )
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
