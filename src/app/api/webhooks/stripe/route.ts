import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceSupabase } from '@/lib/supabase-server';
import { getMetaPixelConfig } from '@/lib/store-config';
import { sendCapiPurchase } from '@/lib/meta-capi';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurado.');
  return new Stripe(key);
}

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    console.error('[Stripe Webhook] Secret ou assinatura ausente.');
    return NextResponse.json({ error: 'Webhook secret não configurado.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    console.error('[Stripe Webhook] Assinatura inválida:', (err as Error).message);
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  // ── checkout.session.completed — link de retentativa pago ────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const orderId  = session.metadata?.original_order_id;
    const tenantId = session.metadata?.tenant_id;

    if (!orderId || !tenantId) {
      console.warn('[Stripe Webhook] checkout.session sem original_order_id:', session.id);
      return NextResponse.json({ received: true });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('status, customer_email, customer_phone, total_amount, tenant_id')
      .eq('id', orderId)
      .eq('tenant_id', tenantId)
      .single();

    if (!order || order.status === 'approved') {
      return NextResponse.json({ received: true }); // já aprovado ou não encontrado
    }

    await supabase
      .from('orders')
      .update({
        status:              'approved',
        payment_provider:    'stripe',
        external_payment_id: session.payment_intent as string ?? session.id,
        updated_at:          new Date().toISOString(),
        internal_notes:      `\n[${new Date().toLocaleString('pt-BR')}] Pago via link Stripe Checkout: ${session.id}`,
      })
      .eq('id', orderId)
      .eq('tenant_id', tenantId);

    // CAPI Purchase
    try {
      const meta = await getMetaPixelConfig(tenantId);
      sendCapiPurchase({
        ...meta,
        email:   order.customer_email,
        phone:   order.customer_phone,
        value:   Number(order.total_amount),
        eventId: session.id,
      });
    } catch { /* silencioso */ }

    console.log(`[Stripe Webhook] Pedido ${orderId} aprovado via checkout session ${session.id}`);
  }

  // ── payment_intent.succeeded — retentativa off_session aprovada ──────────
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;

    // Busca pedido pelo external_payment_id (set na retentativa automática)
    const { data: order } = await supabase
      .from('orders')
      .select('id, status, customer_email, customer_phone, total_amount, tenant_id')
      .eq('external_payment_id', pi.id)
      .single();

    if (order && order.status !== 'approved') {
      await supabase
        .from('orders')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', order.id);

      try {
        const meta = await getMetaPixelConfig(order.tenant_id);
        sendCapiPurchase({
          ...meta,
          email:   order.customer_email,
          phone:   order.customer_phone,
          value:   Number(order.total_amount),
          eventId: pi.id,
        });
      } catch { /* silencioso */ }
    }
  }

  return NextResponse.json({ received: true });
}
