import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Instância nativa do MP v2 no server-side
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, document, amount, itemsDescription } = body;

    // Remove toda a pontuação do documento pra não dar erro na API
    const cleanDoc = document.replace(/\D/g, "");
    
    // Identifica se é CPF ou CNPJ baseado no tamanho
    const docType = cleanDoc.length > 11 ? "CNPJ" : "CPF";

    // O Nome pode ser quebrado em Primeiro Nome e Sobrenome para evitar falha no MP
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Cliente";

    // Criando o pagamento PIX no Mercado Pago
    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        description: itemsDescription || "Compra Guardiã de Choque",
        payment_method_id: "pix",
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

    if (result.status === "pending" && result.point_of_interaction) {
      const qrCode = result.point_of_interaction.transaction_data?.qr_code;
      const qrCodeBase64 = result.point_of_interaction.transaction_data?.qr_code_base64;
      
      return NextResponse.json({
        success: true,
        qrCode,
        qrCodeBase64,
        paymentId: result.id
      });
    }

    return NextResponse.json(
      { success: false, error: "Falha na geração do PIX" },
      { status: 400 }
    );

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Erro MP Pix:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
