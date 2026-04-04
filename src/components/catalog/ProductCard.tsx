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

const badgeColors: Record<string, string> = {
  "Mais Vendido": "bg-accent text-white",
  "Oferta": "bg-danger text-white",
  "Novo": "bg-success text-white",
  "Kit": "bg-foreground text-background",
};

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-background border border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <Link href={`/produto/${product.slug}`} className="relative aspect-square bg-surface overflow-hidden block">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}
        {savings > 0 && (
          <span className="absolute top-3 right-3 text-xs font-bold bg-success text-white px-2 py-1 rounded-full">
            -{savings}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-bold text-foreground text-sm leading-snug hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-surface-elevated text-surface-elevated"}`}
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              R$ {fmt(product.price)}
            </span>
            <span className="text-xs text-text-muted line-through">
              R$ {fmt(product.originalPrice)}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            ou {product.installments.count}x de R$ {fmt(product.installments.value)}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => addItem(product)}
          className="mt-2 flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar
        </button>
      </div>
    </motion.div>
  );
}
