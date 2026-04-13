"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/tenant";
import { createServerSupabase } from "@/lib/supabase-server";
import Stripe from "stripe";

const VALID_STATUSES = ["pending", "approved", "failed", "refunded", "cancelled"] as const;

export async function updateOrderStatus(orderId: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Status inválido.");
  }
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}

export async function updateOrderTracking(orderId: string, trackingCode: string) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ tracking_code: trackingCode.trim(), updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function updateOrderNotes(orderId: string, notes: string) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ internal_notes: notes, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function updateOrderAddress(orderId: string, address: Record<string, string>) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ customer_address: address, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function deleteOrder(orderId: string) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  await supabase
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("tenant_id", tenantId);
  redirect("/admin/pedidos");
}

/**
 * Retenta o pagamento automaticamente usando o cartão já salvo no Stripe.
 * Funciona sem ação do cliente (off_session).
 * Só funciona se o pedido original passou pelo Stripe e o cartão foi salvo.
 */
export async function retryPaymentWithStripe(orderId: string): Promise<{ success: boolean; message: string }> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error("Stripe não configurado neste ambiente.");

  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !order) throw new Error("Pedido não encontrado.");

  const meta = order.metadata as Record<string, string> | null;
  const customerId       = meta?.stripe_customer_id;
  const paymentMethodId  = meta?.stripe_payment_method_id;

  if (!customerId || !paymentMethodId) {
    throw new Error("Cartão não salvo para este pedido. Use 'Retentar via Stripe' para enviar link ao cliente.");
  }

  const stripe = new Stripe(stripeKey);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:         Math.round(Number(order.total_amount) * 100),
      currency:       "brl",
      customer:       customerId,
      payment_method: paymentMethodId,
      description:    `Retentativa pedido ${orderId.slice(0, 8).toUpperCase()}`,
      confirm:        true,
      off_session:    true,
    });

    if (paymentIntent.status === "succeeded" || paymentIntent.status === "processing") {
      await supabase
        .from("orders")
        .update({
          status:              "approved",
          payment_provider:    "stripe",
          external_payment_id: paymentIntent.id,
          updated_at:          new Date().toISOString(),
          internal_notes:      (order.internal_notes ?? "") +
            `\n[${new Date().toLocaleString("pt-BR")}] Retentativa Stripe aprovada: ${paymentIntent.id}`,
        })
        .eq("id", orderId)
        .eq("tenant_id", tenantId);

      revalidatePath(`/admin/pedidos/${orderId}`);
      revalidatePath("/admin/pedidos");
      return { success: true, message: "Pagamento aprovado no Stripe!" };
    }

    return { success: false, message: `Status: ${paymentIntent.status}. Tente o link manual.` };
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string };
    // Cartão recusado — anota nas notas
    await supabase
      .from("orders")
      .update({
        internal_notes: (order.internal_notes ?? "") +
          `\n[${new Date().toLocaleString("pt-BR")}] Retentativa Stripe falhou: ${err.message}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("tenant_id", tenantId);
    revalidatePath(`/admin/pedidos/${orderId}`);
    throw new Error(err.message ?? "Cartão recusado na retentativa.");
  }
}

/**
 * Gera um link de pagamento Stripe para retentar um pedido recusado/cancelado.
 * Admin copia o link e manda pro cliente via WhatsApp.
 */
export async function generateStripeRetryLink(orderId: string): Promise<string> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error("Stripe não configurado neste ambiente.");

  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !order) throw new Error("Pedido não encontrado.");

  const stripe = new Stripe(stripeKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://guardiadechoque.online";

  // Monta os items do Stripe a partir do pedido
  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map((item: { name?: string; price?: number; qty?: number }) => ({
        price_data: {
          currency: "brl",
          unit_amount: Math.round(Number(item.price ?? order.total_amount) * 100),
          product_data: { name: item.name ?? "Produto" },
        },
        quantity: item.qty ?? 1,
      }))
    : [{
        price_data: {
          currency: "brl",
          unit_amount: Math.round(Number(order.total_amount) * 100),
          product_data: { name: "Pedido Guardiã de Choque" },
        },
        quantity: 1,
      }];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: order.customer_email ?? undefined,
    line_items: items,
    metadata: {
      original_order_id: orderId,
      tenant_id: tenantId,
    },
    success_url: `${appUrl}/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/checkout`,
    expires_at:  Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
  });

  // Salva o link gerado nas notas internas
  const existingNotes = order.internal_notes ?? "";
  const noteEntry = `\n[${new Date().toLocaleString("pt-BR")}] Link Stripe gerado: ${session.url}`;
  await supabase
    .from("orders")
    .update({ internal_notes: existingNotes + noteEntry, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("tenant_id", tenantId);

  revalidatePath(`/admin/pedidos/${orderId}`);
  return session.url!;
}
