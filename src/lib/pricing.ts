/**
 * Server-side pricing — NEVER trust the client amount.
 * Always recalculate from the database.
 */

import { createServiceSupabase } from '@/lib/supabase-server';


export const ORDER_BUMP_PRICE = 29.90;
export const UPSELL_PRICE     = 69.90;
export const PIX_DISCOUNT     = 0.05; // 5%
export const AMOUNT_TOLERANCE = 0.05; // R$0,05 de tolerância (arredondamentos)

export interface PriceParams {
  kitId:         string;
  qty?:          number;
  hasBump:       boolean;
  hasUpsell:     boolean;
  paymentMethod: "pix" | "cartao";
}

async function getProductData(slug: string): Promise<{ promo_price: number; bump_price: number | null; upsell_price: number | null }> {
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('promo_price, bump_price, upsell_price')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !data) throw new Error(`Produto não encontrado: ${slug}`);
  return {
    promo_price:  Number(data.promo_price),
    bump_price:   data.bump_price   ? Number(data.bump_price)   : null,
    upsell_price: data.upsell_price ? Number(data.upsell_price) : null,
  };
}

/**
 * Calculates the expected total amount server-side, fetching price from DB.
 * Uses per-product bump/upsell prices when configured, falls back to global constants.
 */
export async function calculateExpectedAmount(p: PriceParams): Promise<number> {
  const product = await getProductData(p.kitId);
  const qty = Math.max(1, p.qty ?? 1);

  const bumpPrice   = product.bump_price   ?? ORDER_BUMP_PRICE;
  const upsellPrice = product.upsell_price ?? UPSELL_PRICE;

  let total = product.promo_price * qty;
  if (p.hasBump)   total += bumpPrice;
  if (p.hasUpsell) total += upsellPrice;
  if (p.paymentMethod === "pix") total = total * (1 - PIX_DISCOUNT);

  return Math.round(total * 100) / 100;
}

/**
 * Validates that the client-provided amount matches the server calculation.
 * Throws if tampered.
 */
export async function validateAmount(clientAmount: number, params: PriceParams): Promise<void> {
  const expected = await calculateExpectedAmount(params);
  const diff = Math.abs(clientAmount - expected);

  if (diff > AMOUNT_TOLERANCE) {
    console.warn(`[Security] Amount mismatch: client=${clientAmount} expected=${expected} diff=${diff}`, params);
    throw new Error("Valor do pedido inválido. Recarregue a página e tente novamente.");
  }
}

/**
 * Basic input sanitization helpers.
 */
export function sanitizeString(val: unknown, maxLen = 200): string {
  if (typeof val !== "string") return "";
  return val.replace(/<[^>]*>/g, "").trim().substring(0, maxLen);
}

export function sanitizeEmail(val: unknown): string {
  const s = sanitizeString(val, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : "";
}

export function sanitizeDocument(val: unknown): string {
  if (typeof val !== "string") return "";
  return val.replace(/\D/g, "").substring(0, 14);
}

export function sanitizeAmount(val: unknown): number {
  const n = Number(val);
  if (isNaN(n) || n <= 0 || n > 10000) throw new Error("Valor inválido.");
  return n;
}
