import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { validateAmount, sanitizeString, sanitizeEmail, sanitizeDocument, sanitizeAmount } from "@/lib/pricing";
import { createServiceSupabase } from "@/lib/supabase-server";
import { getMetaPixelConfig } from "@/lib/store-config";
import { sendCapiPurchase } from "@/lib/meta-capi";
import { resolveProductTenant } from "@/lib/checkout-helpers";

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
    const deviceId  = sanitizeString(body.deviceId, 128) || undefined;
    const clientIp  = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                   ?? request.headers.get('x-real-ip')
                   ?? undefined;

    const zipCode      = String(addr.cep  || "").replace(/\D/g, "");
    const streetName   = sanitizeString(addr.street, 100);
    const streetNumber = sanitizeString(addr.number, 20);
    const neighborhood = sanitizeString(addr.neighborhood, 100);
    const city         = sanitizeString(addr.city, 100);
    const federalUnit  = sanitizeString(addr.state, 2);

    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token,
        description:        sanitizeString(body.itemsDescription, 250) || "Compra Guardia de Choque",
        statement_descriptor: "GUARDIA CHOQUE",
        installments,
        payment_method_id:  brand,
        ...(deviceId ? { device_id: deviceId } : {}),
        payer: {
          email,
          first_name: firstName,
          last_name:  lastName,
          identification: { type: docType, number: cleanDoc },
          ...(clientIp ? { ip_address: clientIp } : {}),
          address: {
            zip_code:      zipCode,
            street_name:   streetName,
            street_number: streetNumber,
            neighborhood,
            city,
            federal_unit:  federalUnit,
          },
        },
        additional_info: {
          ip_address: clientIp ?? "",
          payer: {
            first_name:        firstName,
            last_name:         lastName,
            registration_date: "2000-01-01T00:00:00.000-03:00", // cliente novo = data neutra
            phone: {
              area_code: body.phone ? String(body.phone).replace(/\D/g, "").substring(0, 2) : "",
              number:    body.phone ? String(body.phone).replace(/\D/g, "").substring(2) : "",
            },
            address: {
              zip_code:      zipCode,
              street_name:   streetName,
              street_number: streetNumber,
            },
          },
          items: [{
            id:          String(body.kitId || "guardia-de-choque"),
            title:       sanitizeString(body.itemsDescription, 100) || "Guardia de Choque",
            description: "Kit Defesa Pessoal",
            category_id: "others",
            quantity:    Math.max(1, parseInt(String(body.qty || "1"), 10) || 1),
            unit_price:  amount,
          }],
          shipments: {
            receiver_address: {
              zip_code:      zipCode,
              street_name:   streetName,
              street_number: streetNumber,
              floor:         sanitizeString(addr.complement, 50) || "",
              apartment:     sanitizeString(addr.complement, 50) || "",
            },
          },
        },
      },
    });

    if (result.status === "approved" || result.status === "in_process") {
      // Salvar pedido no banco
      let orderSaveError: string | undefined;
      try {
        const kitSlug = String(body.kitId || '');
        const qty     = Math.max(1, parseInt(String(body.qty || '1'), 10) || 1);
        const prod    = await resolveProductTenant(kitSlug);
        if (!prod) {
          console.error('[MP Card] Não foi possível resolver produto/tenant para slug:', kitSlug);
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
            payment_method:      'card',
            payment_provider:    'mercadopago',
            external_payment_id: String(result.id),
            status:              result.status === 'approved' ? 'approved' : 'pending',
            items:               [{ slug: kitSlug, name: prod.productName, price: amount, qty }],
          });
          if (insertErr) {
            console.error('[MP Card] Erro ao inserir pedido:', insertErr.message);
            orderSaveError = insertErr.message;
          } else {
            const meta = await getMetaPixelConfig(prod.tenantId);
            sendCapiPurchase({ ...meta, email, phone: body.phone, value: amount, eventId: String(result.id) });
          }
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
