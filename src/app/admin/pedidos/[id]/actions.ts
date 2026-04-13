"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/tenant";
import { createServerSupabase } from "@/lib/supabase-server";

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
