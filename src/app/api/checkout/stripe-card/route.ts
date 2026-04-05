import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeAmount } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

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

    // Valida preco contra o catalogo do servidor
    validateAmount(amount, {
      kitId:         String(body.kitId || ""),
      hasBump:       Boolean(body.hasBump),
      hasUpsell:     Boolean(body.hasUpsell),
      paymentMethod: "cartao",
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount:         Math.round(amount * 100),
      currency:       "brl",
      payment_method: paymentMethod.id,
      description:    sanitizeString(body.itemsDescription, 250) || "Guardia de Choque",
      confirm:        true,
      return_url:     `${process.env.NEXT_PUBLIC_APP_URL || "https://guardiadechoque.online"}/checkout`,
    });

    if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
      return NextResponse.json({ success: true, paymentId: paymentIntent.id, status: paymentIntent.status, gateway: "stripe" });
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
