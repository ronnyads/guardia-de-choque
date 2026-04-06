"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Zap, ArrowRight } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useToastStore } from "@/components/ui/ToastProvider";

/* ── Helpers ──────────────────────────────────────────────────── */
const fmt = (v: number) => v.toFixed(2).replace(".", ",");

interface Props {
  title: string;
  subtitle?: string;
  bg?: "white" | "gray";
  products: StoreProduct[];
}

export default function ProductScroll({ title, subtitle, bg = "white", products }: Props) {
  const addItem   = useCartStore((s) => s.addItem);
  const toggle    = useWishlistStore((s) => s.toggle);
  const hasWish   = useWishlistStore((s) => s.has);
  const showToast = useToastStore((s) => s.show);

  function handleAdd(product: StoreProduct) {
    addItem(product);
    showToast({ type: "success", title: "Adicionado ao carrinho!", message: product.name });
  }

  function handleWish(product: StoreProduct) {
    const willAdd = !hasWish(product.id);
    toggle(product);
    showToast({
      type: willAdd ? "success" : "info",
      title: willAdd ? "Salvo nos favoritos ♥" : "Removido dos favoritos",
      message: product.name,
    });
  }

  return (
    <section style={{ background: bg === "gray" ? "#F9FAFB" : "#FFFFFF" }}>
      <div className="container-wide section-pad">

        {/* ── Section header ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.12em] uppercase mb-2"
              style={{ color: "#A1A1AA" }}
            >
              {title}
            </p>
            <h2
              className="font-bold"
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: "#09090B",
                lineHeight: 1.15,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-[14px]" style={{ color: "#A1A1AA" }}>{subtitle}</p>
            )}
          </div>
          <Link
            href="/loja"
            className="inline-flex items-center gap-1.5 shrink-0 btn btn-secondary self-start sm:self-auto"
            style={{ padding: "10px 22px", fontSize: "13px" }}
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>

        {/* ── Product cards ──────────────────────────────────── */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          role="list"
          aria-label={`Produtos — ${title}`}
        >
          {storeProducts.map((product) => {
            const savings = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );
            const wished = hasWish(product.id);

            return (
              <article
                key={product.id}
                role="listitem"
                className="snap-start shrink-0 flex flex-col group"
                style={{
                  width: "220px",
                  background: "#FFFFFF",
                  border: "1px solid #E4E4E7",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#D4D4D8";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#E4E4E7";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div className="relative" style={{ aspectRatio: "1", background: "#F9FAFB" }}>
                  <Link href={`/produto/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-300"
                      sizes="(max-width: 640px) 45vw, 220px"
                    />
                  </Link>

                  {/* Discount badge */}
                  {savings >= 5 && (
                    <span className="badge badge-red absolute top-2.5 left-2.5" aria-label={`${savings}% de desconto`}>
                      -{savings}%
                    </span>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => handleWish(product)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      background: wished ? "#DC2626" : "rgba(255,255,255,0.95)",
                      border: wished ? "1px solid #DC2626" : "1px solid #E4E4E7",
                    }}
                    aria-label={wished ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name} nos favoritos`}
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      style={{ color: wished ? "#FFFFFF" : "#A1A1AA", fill: wished ? "#FFFFFF" : "none" }}
                    />
                  </button>

                  {/* Quick-add overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                  >
                    <button
                      onClick={() => handleAdd(product)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-white"
                      style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(8px)" }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <Link
                    href={`/produto/${product.slug}`}
                    className="text-[13px] font-semibold line-clamp-2 leading-snug transition-colors"
                    style={{ color: "#09090B" }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#52525B"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#09090B"; }}
                  >
                    {product.name}
                  </Link>

                  {/* Stars */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex" aria-label={`${product.rating} estrelas`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3 h-3"
                          style={{
                            fill: s <= Math.round(product.rating) ? "#F59E0B" : "#E4E4E7",
                            color: s <= Math.round(product.rating) ? "#F59E0B" : "#E4E4E7",
                          }}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-[11px] tabular-nums" style={{ color: "#A1A1AA" }}>
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* PIX */}
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 shrink-0" style={{ color: "#16A34A" }} aria-hidden />
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#16A34A" }}>
                      PIX R$ {fmt(product.pixPrice)}
                    </span>
                    <span className="text-[10px]" style={{ color: "#A1A1AA" }}>(5% off)</span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto pt-1">
                    <p className="text-[15px] font-bold tabular-nums" style={{ color: "#09090B" }}>
                      R$ {fmt(product.price)}
                    </p>
                    <p className="text-[11px] tabular-nums" style={{ color: "#A1A1AA" }}>
                      {product.installments.count}x R$ {fmt(product.installments.value)} s/juros
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 flex sm:hidden justify-center">
          <Link href="/loja" className="btn btn-secondary" style={{ padding: "11px 28px", fontSize: "13px" }}>
            Ver todos os produtos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
