import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createServiceSupabase } from '@/lib/supabase-server';
import { getMetaPixelConfig } from '@/lib/store-config';
import { sendCapiPurchase } from '@/lib/meta-capi';

export const dynamic = 'force-dynamic';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const payment = new Payment(client);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    const result = await payment.get({ id });

    // Atualizar pedido no banco quando PIX for pago
    if (result.status === 'approved') {
      try {
        const supabase = createServiceSupabase();

        // Busca o pedido para pegar tenant_id e dados do cliente
        const { data: order } = await supabase
          .from('orders')
          .select('tenant_id, customer_email, customer_phone, total_amount')
          .eq('external_payment_id', String(result.id))
          .eq('status', 'pending')
          .single();

        await supabase
          .from('orders')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('external_payment_id', String(result.id))
          .eq('status', 'pending');

        // Dispara CAPI Purchase após PIX confirmado
        if (order?.tenant_id) {
          const meta = await getMetaPixelConfig(order.tenant_id);
          sendCapiPurchase({
            ...meta,
            email: order.customer_email,
            phone: order.customer_phone,
            value: Number(order.total_amount),
            eventId: String(result.id),
          });
        }
      } catch (updateErr) {
        console.error('[Status] Erro ao atualizar pedido:', updateErr);
      }
    }

    return NextResponse.json({
      id: result.id,
      status: result.status,
      approved: result.status === 'approved'
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Erro MP Status:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
