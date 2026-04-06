import { StoreProduct } from "@/types";
import { supabase } from "./supabase";

const PIX_DISCOUNT = 0.05;

function mapDbToStoreProduct(d: Record<string, unknown>): StoreProduct {
  const promoPrice = Number(d.promo_price) || 0;
  const categoryId = String(d.category_id || "");
  const categoryName = categoryId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Categoria";

  return {
    id: String(d.id),
    name: String(d.name),
    slug: String(d.slug),
    category: categoryId,
    categoryName,
    description: String(d.description || ""),
    longDescription: String(d.long_description || d.description || ""),
    images: Array.isArray(d.images) ? (d.images as string[]) : [],
    price: promoPrice,
    originalPrice: Number(d.original_price) || promoPrice,
    pixPrice: Math.round(promoPrice * (1 - PIX_DISCOUNT) * 100) / 100,
    installments: {
      count: 6,
      value: Math.round((promoPrice / 6) * 100) / 100,
    },
    rating: Number(d.rating) || 0,
    reviewCount: Number(d.review_count) || 0,
    badge: (d.badge as StoreProduct["badge"]) ?? undefined,
    inStock: d.status === "active",
    features: Array.isArray(d.features) ? (d.features as StoreProduct["features"]) : [],
    specs: Array.isArray(d.specs) ? (d.specs as StoreProduct["specs"]) : [],
    quantity: d.quantity != null ? Number(d.quantity) : undefined,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<StoreProduct | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !data) return undefined;
  return mapDbToStoreProduct(data);
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<StoreProduct[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categorySlug)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (data ?? []).map(mapDbToStoreProduct);
}

export async function getFeaturedProducts(): Promise<StoreProduct[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10);

  return (data ?? []).map(mapDbToStoreProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "active");

  return (data ?? []).map((d) => d.slug as string);
}

export async function getRelatedProducts(
  slug: string,
  limit = 3
): Promise<StoreProduct[]> {
  const product = await getProductBySlug(slug);
  if (!product) return [];

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category)
    .neq("slug", slug)
    .eq("status", "active")
    .limit(limit);

  if (!data) return [];
  return data.map(mapDbToStoreProduct);
}

