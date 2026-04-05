import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Erros fatais — não vale retentativa com outro cartão automático
const FATAL_CODES = new Set([
  'insufficient_funds',
  'stolen_card',
  'lost_card',
  'restricted_card',
  'card_not_supported',
  'expired_card',
  'incorrect_number',
  'incorrect_cvc',
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
      cardName,
      email,
      name,
      itemsDescription,
    } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gateway alternativo não configurado.' },
        { status: 500 }
      );
    }

    // 1. Tokeniza o cartão — dado nunca fica armazenado no nosso servidor
    const token = await stripe.tokens.create({
      card: {
        number: String(cardNumber).replace(/\s/g, ''),
        exp_month: Number(cardExpMonth),
        exp_year: Number(cardExpYear) < 100 ? 2000 + Number(cardExpYear) : Number(cardExpYear),
        cvc: String(cardCvc),
        name: cardName || name,
      },
    } as Parameters<typeof stripe.tokens.create>[0]);

    if (!token.id) {
      return NextResponse.json(
        { success: false, error: 'Dados do cartão inválidos no gateway alternativo.' },
        { status: 400 }
      );
    }

    // 2. Cria e confirma o PaymentIntent imediatamente
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Stripe usa centavos
      currency: 'brl',
      payment_method_data: {
        type: 'card',
        card: { token: token.id },
        billing_details: {
          name: cardName || name,
          email,
        },
      },
      description: itemsDescription || 'Guardiã de Choque',
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://guardiadechoque.online'}/checkout`,
    });

    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
      return NextResponse.json({
        success: true,
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
        gateway: 'stripe',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Pagamento não aprovado pelo gateway alternativo.', status: paymentIntent.status },
      { status: 400 }
    );

  } catch (err: unknown) {
    const e = err as { message?: string; code?: string; type?: string };
    console.error('[Stripe Fallback]', e);

    return NextResponse.json(
      {
        success: false,
        error: e.message || 'Erro no gateway alternativo.',
        code: e.code,
        fatal: FATAL_CODES.has(e.code || ''),
        gateway: 'stripe',
      },
      { status: 400 }
    );
  }
}
