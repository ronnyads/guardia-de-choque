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
