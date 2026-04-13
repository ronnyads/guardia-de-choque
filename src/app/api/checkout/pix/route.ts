import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeDocument, sanitizeAmount } from "@/lib/pricing";
import { createServiceSupabase } from "@/lib/supabase-server";
import { resolveProductTenant } from "@/lib/checkout-helpers";

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

    const shippingCost = Math.min(Math.max(Number(body.shippingCost ?? 0), 0), 200);

    // Valida o preco contra o catalogo do servidor
    await validateAmount(amount, {
      kitId:         String(body.kitId || ""),
      qty:           Math.max(1, parseInt(String(body.qty || "1"), 10) || 1),
      hasBump:       Boolean(body.hasBump),
      hasUpsell:     Boolean(body.hasUpsell),
      paymentMethod: "pix",
      shippingCost,
    });

    const cleanDoc  = document.replace(/\D/g, "");
    const docType   = cleanDoc.length > 11 ? "CNPJ" : "CPF";
    const nameParts = name.trim().split(" ");

    const roundedAmount = Math.round(amount * 100) / 100;
    const result = await payment.create({
      body: {
        transaction_amount: roundedAmount,
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
      // Salvar pedido pendente no banco
      let orderSaveError: string | undefined;
      try {
        const kitSlug = String(body.kitId || '');
        const qty     = Math.max(1, parseInt(String(body.qty || '1'), 10) || 1);
        const prod    = await resolveProductTenant(kitSlug);
        if (!prod) {
          console.error('[PIX] Não foi possível resolver produto/tenant para slug:', kitSlug);
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
            payment_method:      'pix',
            payment_provider:    'mercadopago',
            external_payment_id: String(result.id),
            status:              'pending',
            items:               [{ slug: kitSlug, name: prod.productName, price: amount, qty }],
            shipping_method:     sanitizeString(body.shippingMethod, 100) || null,
            shipping_cost:       shippingCost,
          });
          if (insertErr) {
            console.error('[PIX] Erro ao inserir pedido:', insertErr.message);
            orderSaveError = insertErr.message;
          }
        }
      } catch (saveErr) {
        console.error('[PIX] Exceção ao salvar pedido:', saveErr);
        orderSaveError = String(saveErr);
      }
      return NextResponse.json({
        success:      true,
        qrCode:       result.point_of_interaction.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction.transaction_data?.qr_code_base64,
        paymentId:    result.id,
        ...(orderSaveError ? { orderSaveError } : {}),
      });
    }

    return NextResponse.json({ success: false, error: "Falha na geracao do PIX" }, { status: 400 });
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[PIX]", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
