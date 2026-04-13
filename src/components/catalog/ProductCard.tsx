"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

interface Props {
  product: StoreProduct;
  index?: number;
}

const badgeStyle: Record<string, string> = {
  "Mais Vendido": "bg-[#0F172A] text-white",
  "Oferta":       "bg-[#DC2626] text-white",
  "Novo":         "bg-[#059669] text-white",
  "Kit":          "bg-[#F1F5F9] text-[#475569]",
};

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  function handleAdd() {
    addItem(product);
    openCart();
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
      className="group flex flex-col bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:border-[#94A3B8] hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Name above image */}
      <Link href={`/produto/${product.slug}`} className="px-4 pt-4 pb-2 block">
        <h3 className="text-[13px] font-semibold text-[#0F172A] leading-snug line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* Image zone */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative aspect-square bg-[#F8FAFC] block overflow-hidden"
        aria-label={`Ver ${product.name}`}
        tabIndex={0}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 motion-safe:group-hover:scale-[1.04] transition-transform duration-400 ease-out"
        />

        {/* Badges */}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${badgeStyle[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {savings >= 5 && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-lg tabular-nums">
            -{savings}%
          </span>
        )}

        {/* Desktop hover overlay — hidden on touch via opacity-0, visible on group-hover */}
        <div
          className="absolute inset-x-0 bottom-0 h-14 bg-[#0F172A]/90 flex items-center justify-center gap-2
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     pointer-events-none group-hover:pointer-events-auto"
          aria-hidden
        >
          <ShoppingCart className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-[12px] font-semibold">Adicionar ao Carrinho</span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5" aria-label={`${product.rating} de 5 estrelas, ${product.reviewCount} avaliações`}>
          <div className="flex" aria-hidden>
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#F1F5F9] text-[#F1F5F9]"}`} />
            ))}
          </div>
          <span className="text-[11px] text-[#94A3B8] tabular-nums">({product.reviewCount})</span>
        </div>

        {/* PIX price */}
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#059669] shrink-0" aria-hidden />
          <span className="text-[11px] text-[#059669] font-semibold tabular-nums">
            PIX R$ {fmt(product.pixPrice)}
          </span>
          <span className="text-[10px] text-[#94A3B8]">(5% OFF)</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[15px] font-bold text-[#0F172A] tabular-nums">
              R$ {fmt(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-[#94A3B8] line-through tabular-nums">
                R$ {fmt(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5 tabular-nums">
            em {product.installments.count}x R$ {fmt(product.installments.value)}
          </p>
        </div>

        {/* CTA — always visible (touch devices don't have hover overlay) */}
        <button
          onClick={handleAdd}
          className="mt-2 flex items-center justify-center gap-2 w-full bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.97] text-white font-semibold py-2.5 rounded-xl text-[12px] tracking-wide transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A] cursor-pointer"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
          Adicionar
        </button>
      </div>
    </motion.article>
  );
}
