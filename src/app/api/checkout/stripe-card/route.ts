import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Erros fatais — cartão definitivamente inválido, sem retentativa
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

    // 1. Tokeniza o cartão via Stripe (dado nunca armazenado no nosso servidor)
    const fullYear = Number(cardExpYear) < 100 ? 2000 + Number(cardExpYear) : Number(cardExpYear);
    const cardToken = await stripe.tokens.create({
      card: {
        number: String(cardNumber || '').replace(/\s/g, ''),
        exp_month: String(Number(cardExpMonth)),
        exp_year: String(fullYear),
        cvc: String(cardCvc || ''),
        name: cardName || name || '',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // 2. Cria PaymentMethod a partir do token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: { token: cardToken.id },
      billing_details: {
        name: cardName || name,
        email: email || undefined,
      },
    });

    // 3. Cria e confirma o PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // Stripe trabalha em centavos
      currency: 'brl',
      payment_method: paymentMethod.id,
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
      {
        success: false,
        error: 'Pagamento não aprovado pelo gateway alternativo.',
        status: paymentIntent.status,
      },
      { status: 400 }
    );

  } catch (err: unknown) {
    const e = err as { message?: string; code?: string };
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
