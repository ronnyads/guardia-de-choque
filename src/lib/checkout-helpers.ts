/**
 * Shared helpers for checkout API routes.
 */
import { createServiceSupabase } from "@/lib/supabase-server";

interface ProductInfo {
  tenantId: string;
  productName: string;
}

/**
 * Resolves tenant_id and product name for a given product slug.
 * Falls back to STORE_SLUG tenant when the product row has no tenant_id.
 * Returns null if resolution fails entirely.
 */
export async function resolveProductTenant(slug: string): Promise<ProductInfo | null> {
  const supabase = createServiceSupabase();

  // 1. Try to get product with its tenant_id
  const { data: prod, error: prodErr } = await supabase
    .from("products")
    .select("tenant_id, name")
    .eq("slug", slug)
    .maybeSingle(); // maybeSingle returns null instead of error when 0 rows

  if (prodErr) {
    console.error("[checkout] Product lookup error:", prodErr.message, "slug:", slug);
    return null;
  }

  // Product found and has tenant_id
  if (prod?.tenant_id) {
    return { tenantId: prod.tenant_id, productName: prod.name ?? slug };
  }

  // Product found but no tenant_id — fall back to STORE_SLUG tenant
  const storeSlug = process.env.STORE_SLUG ?? "guardia-de-choque";
  const { data: tenant, error: tenantErr } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", storeSlug)
    .single();

  if (tenantErr || !tenant) {
    console.error("[checkout] Tenant fallback failed:", tenantErr?.message, "storeSlug:", storeSlug);
    return null;
  }

  console.warn("[checkout] Product has no tenant_id, using fallback tenant:", storeSlug, "slug:", slug);
  return { tenantId: tenant.id, productName: prod?.name ?? slug };
}
