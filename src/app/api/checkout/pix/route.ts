import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeDocument, sanitizeAmount } from "@/lib/pricing";

const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body    = await request.json();
    const amount  = sanitizeAmount(body.amount);
    const email   = sanitizeEmail(body.email);
    const name    = sanitizeString(body.name, 100);
    const document = sanitizeDocument(body.document);

    if (!email)    return NextResponse.json({ success: false, error: "E-mail inválido." }, { status: 400 });
    if (!document) return NextResponse.json({ success: false, error: "Documento inválido." }, { status: 400 });

    // Valida o preco contra o catalogo do servidor
    await validateAmount(amount, {
      kitId:         String(body.kitId || ""),
      hasBump:       Boolean(body.hasBump),
      hasUpsell:     Boolean(body.hasUpsell),
      paymentMethod: "pix",
    });

    const cleanDoc  = document.replace(/\D/g, "");
    const docType   = cleanDoc.length > 11 ? "CNPJ" : "CPF";
    const nameParts = name.trim().split(" ");

    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description: sanitizeString(body.itemsDescription, 250) || "Compra Guardia de Choque",
        payment_method_id: "pix",
        payer: {
          email,
          first_name: nameParts[0],
          last_name:  nameParts.slice(1).join(" ") || "Cliente",
          identification: { type: docType, number: cleanDoc },
        },
      },
    });

    if (result.status === "pending" && result.point_of_interaction) {
      return NextResponse.json({
        success:      true,
        qrCode:       result.point_of_interaction.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction.transaction_data?.qr_code_base64,
        paymentId:    result.id,
      });
    }

    return NextResponse.json({ success: false, error: "Falha na geracao do PIX" }, { status: 400 });
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[PIX]", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
