import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

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

    return NextResponse.json({
      id: result.id,
      status: result.status,
      approved: result.status === 'approved'
    });
  } catch (error: any) {
    console.error("Erro MP Status:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
