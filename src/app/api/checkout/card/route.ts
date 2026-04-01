import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, document, amount, token, installments, itemsDescription, brand, phone, address } = body;

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
        payment_method_id: brand || "visa",
        payer: {
          email: email,
          first_name: firstName,
          last_name: lastName,
          identification: {
            type: docType,
            number: cleanDoc
          },
          address: {
            zip_code: address?.cep?.replace(/\D/g, "") || "",
            street_name: address?.street || "",
            street_number: address?.number || "",
            neighborhood: address?.neighborhood || "",
            city: address?.city || "",
            federal_unit: address?.state || ""
          }
        },
        additional_info: {
          payer: {
            first_name: firstName,
            last_name: lastName,
            phone: {
              area_code: phone ? phone.replace(/\D/g, "").substring(0, 2) : "",
              number: phone ? phone.replace(/\D/g, "").substring(2) : ""
            },
            address: {
              zip_code: address?.cep?.replace(/\D/g, "") || "",
              street_name: address?.street || "",
              street_number: address?.number || ""
            }
          },
          items: [
            {
              id: "gd-choque-1",
              title: itemsDescription || "Compra Guardiã de Choque",
              description: "Kit Defesa Pessoal",
              quantity: 1,
              unit_price: Number(amount)
            }
          ]
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

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Erro MP Cartão:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
