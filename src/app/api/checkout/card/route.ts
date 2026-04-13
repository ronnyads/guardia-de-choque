import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeDocument, sanitizeAmount } from "@/lib/pricing";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getMetaPixelConfig } from "@/lib/store-config";
import { sendCapiPurchase } from "@/lib/meta-capi";

const client  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body       = await request.json();
    const amount     = sanitizeAmount(body.amount);
    const email      = sanitizeEmail(body.email);
    const name       = sanitizeString(body.name, 100);
    const document   = sanitizeDocument(body.document);
    const token      = sanitizeString(body.token, 100);
    const brand      = sanitizeString(body.brand, 20) || "visa";
    const installments = Math.min(Math.max(Number(body.installments) || 1, 1), 12);

    if (!email)    return NextResponse.json({ success: false, error: "E-mail invalido." }, { status: 400 });
    if (!document) return NextResponse.json({ success: false, error: "Documento invalido." }, { status: 400 });
    if (!token)    return NextResponse.json({ success: false, error: "Token de cartao ausente." }, { status: 400 });

    // Valida preco contra o catalogo do servidor
    await validateAmount(amount, {
      kitId:         String(body.kitId || ""),
      qty:           Math.max(1, parseInt(String(body.qty || "1"), 10) || 1),
      hasBump:       Boolean(body.hasBump),
      hasUpsell:     Boolean(body.hasUpsell),
      paymentMethod: "cartao",
    });

    const cleanDoc  = document.replace(/\D/g, "");
    const docType   = cleanDoc.length > 11 ? "CNPJ" : "CPF";
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(" ") || "Cliente";
    const addr      = body.address || {};

    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token,
        description:   sanitizeString(body.itemsDescription, 250) || "Compra Guardia de Choque",
        installments,
        payment_method_id: brand,
        payer: {
          email,
          first_name: firstName,
          last_name:  lastName,
          identification: { type: docType, number: cleanDoc },
          address: {
            zip_code:      String(addr.cep  || "").replace(/\D/g, ""),
            street_name:   sanitizeString(addr.street, 100),
            street_number: sanitizeString(addr.number, 20),
            neighborhood:  sanitizeString(addr.neighborhood, 100),
            city:          sanitizeString(addr.city, 100),
            federal_unit:  sanitizeString(addr.state, 2),
          },
        },
        additional_info: {
          payer: {
            first_name: firstName,
            last_name:  lastName,
            phone: {
              area_code: body.phone ? String(body.phone).replace(/\D/g, "").substring(0, 2) : "",
              number:    body.phone ? String(body.phone).replace(/\D/g, "").substring(2) : "",
            },
          },
          items: [{
            id: "gd-choque-1",
            title: sanitizeString(body.itemsDescription, 100) || "Guardia de Choque",
            description: "Kit Defesa Pessoal",
            quantity: 1,
            unit_price: amount,
          }],
        },
      },
    });

    if (result.status === "approved" || result.status === "in_process") {
      // Salvar pedido no banco
      let orderSaveError: string | undefined;
      try {
        const supabase = createServiceSupabase();
        const { data: prod, error: prodErr } = await supabase
          .from('products')
          .select('tenant_id, name')
          .eq('slug', String(body.kitId || ''))
          .single();
        if (prodErr) {
          console.error('[MP Card] Produto não encontrado:', prodErr.message, '| slug:', body.kitId);
          orderSaveError = `Produto não encontrado: ${prodErr.message}`;
        } else if (prod?.tenant_id) {
          const { error: insertErr } = await supabase.from('orders').insert({
            tenant_id:           prod.tenant_id,
            customer_name:       name,
            customer_email:      email,
            customer_phone:      sanitizeString(body.phone, 20) || null,
            customer_address:    body.address || null,
            total_amount:        amount,
            payment_method:      'card',
            payment_provider:    'mercadopago',
            external_payment_id: String(result.id),
            status:              result.status === 'approved' ? 'approved' : 'pending',
            items:               [{ slug: body.kitId, name: prod.name, price: amount, qty: Math.max(1, parseInt(String(body.qty || '1'), 10) || 1) }],
          });
          if (insertErr) {
            console.error('[MP Card] Erro ao inserir pedido:', insertErr.message);
            orderSaveError = insertErr.message;
          } else {
            const meta = await getMetaPixelConfig(prod.tenant_id);
            sendCapiPurchase({ ...meta, email, phone: body.phone, value: amount, eventId: String(result.id) });
          }
        } else {
          console.error('[MP Card] tenant_id não encontrado para slug:', body.kitId);
          orderSaveError = 'tenant_id não encontrado';
        }
      } catch (saveErr) {
        console.error('[MP Card] Exceção ao salvar pedido:', saveErr);
        orderSaveError = String(saveErr);
      }
      return NextResponse.json({ success: true, status: result.status, paymentId: result.id, ...(orderSaveError ? { orderSaveError } : {}) });
    }

    return NextResponse.json({ success: false, error: "Pagamento recusado pela operadora", status: result.status }, { status: 400 });
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[MP Card]", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
