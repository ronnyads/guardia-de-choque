"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

interface Props {
  product: StoreProduct;
  index?: number;
}

const badgeStyle: Record<string, string> = {
  "Mais Vendido": "bg-accent text-white",
  "Oferta":       "bg-danger text-white",
  "Novo":         "bg-success text-white",
  "Kit":          "bg-surface-elevated text-foreground border border-border",
};

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-xl hover:shadow-black/30 transition-all duration-250"
    >
      {/* ── Image ─────────────────────────────────────────────── */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative aspect-square bg-surface-elevated overflow-hidden block"
        aria-label={`Ver ${product.name}`}
        tabIndex={0}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        {savings >= 5 && (
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-danger text-white px-2 py-1 rounded-full tabular-nums">
            -{savings}%
          </span>
        )}
      </Link>

      {/* ── Info ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Name */}
        <Link href={`/produto/${product.slug}`} tabIndex={-1} aria-hidden>
          <h3 className="font-semibold text-foreground text-sm leading-snug hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5" aria-label={`${product.rating} de 5 estrelas, ${product.reviewCount} avaliações`}>
          <div className="flex" aria-hidden>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${
                  s <= Math.round(product.rating)
                    ? "fill-accent text-accent"
                    : "fill-surface-elevated text-surface-elevated"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-muted tabular-nums">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price — push to bottom */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-bold text-foreground tabular-nums">
              R$ {fmt(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-text-muted line-through tabular-nums">
                R$ {fmt(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-muted mt-0.5 tabular-nums">
            {product.installments.count}x R$ {fmt(product.installments.value)} s/juros
          </p>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mt-1"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
          Adicionar
        </button>
      </div>
    </motion.article>
  );
}
