"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { storeProducts } from "@/lib/products";
import { useCartStore } from "@/lib/store";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ProductScroll({ title, subtitle }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center bg-[#F1F5F9] text-[#475569] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest w-fit">
              {title}
            </span>
            <h2 className="font-playfair text-[22px] md:text-[28px] text-[#0F172A] leading-tight">{title}</h2>
            {subtitle && <p className="text-[13px] text-[#94A3B8]">{subtitle}</p>}
          </div>
          <Link href="/loja" className="text-[12px] font-semibold text-[#0F172A] border border-[#0F172A] px-5 py-2 rounded-full hover:bg-[#0F172A] hover:text-white transition-colors duration-200 hidden sm:block shrink-0">
            Ver Todos
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {storeProducts.map((product) => {
            const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[180px] sm:w-[200px] bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image */}
                <Link href={`/produto/${product.slug}`} className="relative aspect-square bg-gray-50 block overflow-hidden group">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                  {savings >= 5 && (
                    <span className="absolute top-2 left-2 bg-[#E53E3E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md tabular-nums">
                      -{savings}%
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <p className="text-xs font-semibold text-[#111111] line-clamp-2 leading-tight">
                    {product.name}
                  </p>

                  <div className="flex items-center gap-1">
                    <div className="flex" aria-hidden>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(product.rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-100 text-gray-100"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 tabular-nums">({product.reviewCount})</span>
                  </div>

                  <div className="mt-auto">
                    <p className="text-sm font-bold text-[#111111] tabular-nums">R$ {fmt(product.price)}</p>
                    <p className="text-[10px] text-gray-400 tabular-nums">
                      em {product.installments.count}x R$ {fmt(product.installments.value)}
                    </p>
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    className="mt-1 flex items-center justify-center gap-1.5 w-full bg-[#111111] hover:bg-[#333333] active:scale-[0.97] text-white text-xs font-semibold py-2 rounded-xl transition-all duration-150"
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    <ShoppingCart className="w-3 h-3" aria-hidden />
                    Comprar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
