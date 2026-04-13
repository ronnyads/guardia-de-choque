import { NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';
import { resolveProductTenant } from '@/lib/checkout-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, productSlug, productPrice, declineReason } = body;

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: 'Email ou telefone obrigatório' }, { status: 400 });
    }

    const supabase = createServiceSupabase();
    const prod = await resolveProductTenant(String(productSlug || ''));

    if (!prod) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 400 });
    }

    // Upsert — atualiza o status do lead existente para card_declined
    const { error } = await supabase
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
          status:         'card_declined',
          decline_reason: declineReason  || null,
          updated_at:     new Date().toISOString(),
        },
        { onConflict: 'tenant_id,customer_email,product_slug', ignoreDuplicates: false }
      );

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const e = err as Error;
    console.error('[Lead Decline]', e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
