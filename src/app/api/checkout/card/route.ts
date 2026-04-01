import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, document, amount, token, installments, itemsDescription } = body;

    const cleanDoc = document.replace(/\D/g, "");
    const docType = cleanDoc.length > 11 ? "CNPJ" : "CPF";

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Cliente";

    // Criando o pagamento via Cartão
    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        token: token,
        description: itemsDescription || "Compra Guardiã de Choque",
        installments: Number(installments) || 1,
        payment_method_id: "visa", // MP normally infers this from the token, but you can pass logic to detect it if strictly needed.
        payer: {
          email: email,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: docType,
            number: cleanDoc
          }
        }
      }
    });

    if (result.status === "approved" || result.status === "in_process") {
      return NextResponse.json({
        success: true,
        status: result.status,
        paymentId: result.id
      });
    }

    return NextResponse.json(
      { success: false, error: "Pagamento recusado pela operadora", status: result.status },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Erro MP Cartão:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
