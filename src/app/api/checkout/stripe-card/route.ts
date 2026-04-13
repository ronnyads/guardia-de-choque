import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeAmount } from "@/lib/pricing";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getMetaPixelConfig } from "@/lib/store-config";
import { sendCapiPurchase } from "@/lib/meta-capi";
import { resolveProductTenant } from "@/lib/checkout-helpers";

// Instância lazy — só criada quando a key existe (evita erro no build sem env)
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY não configurado.");
  return new Stripe(key);
}

const FATAL_CODES = new Set(["insufficient_funds","stolen_card","lost_card","restricted_card",
  "card_not_supported","expired_card","incorrect_number","incorrect_cvc"]);

export async function POST(request: Request) {
  try {
    const body    = await request.json();
    const amount  = sanitizeAmount(body.amount);
    const email   = sanitizeEmail(body.email);
    const name    = sanitizeString(body.name, 100);
    const cardName = sanitizeString(body.cardName, 100) || name;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ success: false, error: "Gateway alternativo nao configurado." }, { status: 500 });
    }

    const stripe = getStripe();

    const shippingCost = Math.min(Math.max(Number(body.shippingCost ?? 0), 0), 200);

    // Valida preco contra o catalogo do servidor
    await validateAmount(amount, {
      kitId:         String(body.kitId || ""),
      qty:           Math.max(1, parseInt(String(body.qty || "1"), 10) || 1),
      hasBump:       Boolean(body.hasBump),
      hasUpsell:     Boolean(body.hasUpsell),
      paymentMethod: "cartao",
      shippingCost,
    });

    const fullYear = Number(body.cardExpYear) < 100
      ? 2000 + Number(body.cardExpYear)
      : Number(body.cardExpYear);

    const cardToken = await (stripe.tokens.create as (p: unknown) => Promise<{ id: string }>)({
      card: {
        number:    String(body.cardNumber || "").replace(/\s/g, ""),
        exp_month: String(Number(body.cardExpMonth)),
        exp_year:  String(fullYear),
        cvc:       String(body.cardCvc || ""),
        name:      cardName,
      },
    });

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: cardToken.id },
      billing_details: { name: cardName, email: email || undefined },
    });

    // Criar/recuperar Customer para permitir retentativa off-session futura
    let customerId: string | undefined;
    try {
      if (email) {
        const existing = await stripe.customers.list({ email, limit: 1 });
        if (existing.data.length > 0) {
          customerId = existing.data[0].id;
        } else {
          const customer = await stripe.customers.create({ email, name: cardName || undefined });
          customerId = customer.id;
        }
        await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });
        await stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: paymentMethod.id },
        });
      }
    } catch (custErr) {
      console.warn('[Stripe] Erro ao criar Customer (não bloqueia pagamento):', custErr);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:              Math.round(amount * 100),
      currency:            "brl",
      payment_method:      paymentMethod.id,
      ...(customerId ? { customer: customerId } : {}),
      description:         sanitizeString(body.itemsDescription, 250) || "Guardia de Choque",
      setup_future_usage:  "off_session", // salva cartão para retentativa sem cliente
      confirm:             true,
      return_url:          `${process.env.NEXT_PUBLIC_APP_URL || "https://guardiadechoque.online"}/checkout`,
    });

    if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
      // Salvar pedido no banco
      let orderSaveError: string | undefined;
      try {
        const kitSlug = String(body.kitId || '');
        const qty     = Math.max(1, parseInt(String(body.qty || '1'), 10) || 1);
        const prod    = await resolveProductTenant(kitSlug);
        if (!prod) {
          console.error('[Stripe] Não foi possível resolver produto/tenant para slug:', kitSlug);
          orderSaveError = 'Produto ou tenant não encontrado';
        } else {
          const supabase = createServiceSupabase();
          const { error: insertErr } = await supabase.from('orders').insert({
            tenant_id:           prod.tenantId,
            customer_name:       name,
            customer_email:      email,
            customer_phone:      sanitizeString(body.phone, 20) || null,
            customer_address:    body.address || null,
            total_amount:        amount,
            payment_method:      'card',
            payment_provider:    'stripe',
            external_payment_id: paymentIntent.id,
            status:              paymentIntent.status === 'succeeded' ? 'approved' : 'pending',
            items:               [{ slug: kitSlug, name: prod.productName, price: amount, qty }],
            shipping_method:     sanitizeString(body.shippingMethod, 100) || null,
            shipping_cost:       shippingCost,
            metadata: {
              stripe_customer_id:        customerId ?? null,
              stripe_payment_method_id:  paymentMethod.id,
            },
          });
          if (insertErr) {
            console.error('[Stripe] Erro ao inserir pedido:', insertErr.message);
            orderSaveError = insertErr.message;
          } else {
            const meta = await getMetaPixelConfig(prod.tenantId);
            sendCapiPurchase({ ...meta, email, value: amount, eventId: paymentIntent.id });
          }
        }
      } catch (saveErr) {
        console.error('[Stripe] Exceção ao salvar pedido:', saveErr);
        orderSaveError = String(saveErr);
      }
      return NextResponse.json({ success: true, paymentId: paymentIntent.id, status: paymentIntent.status, gateway: "stripe", ...(orderSaveError ? { orderSaveError } : {}) });
    }

    return NextResponse.json({ success: false, error: "Pagamento nao aprovado pelo gateway alternativo.", status: paymentIntent.status }, { status: 400 });
  } catch (err: unknown) {
    const e = err as { message?: string; code?: string };
    console.error("[Stripe Fallback]", e);
    return NextResponse.json({
      success: false,
      error:   e.message || "Erro no gateway alternativo.",
      code:    e.code,
      fatal:   FATAL_CODES.has(e.code || ""),
      gateway: "stripe",
    }, { status: 400 });
  }
}
