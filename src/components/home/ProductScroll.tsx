"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Zap, ArrowRight } from "lucide-react";
import { storeProducts } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useToastStore } from "@/components/ui/ToastProvider";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ProductScroll({ title, subtitle }: Props) {
  const addItem    = useCartStore((s) => s.addItem);
  const toggle     = useWishlistStore((s) => s.toggle);
  const hasWish    = useWishlistStore((s) => s.has);
  const showToast  = useToastStore((s) => s.show);
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  function handleAdd(product: (typeof storeProducts)[0]) {
    addItem(product);
    showToast({ type: "success", title: "Adicionado ao carrinho!", message: product.name });
  }

  function handleWish(product: (typeof storeProducts)[0]) {
    toggle(product);
    const added = !hasWish(product.id);
    showToast({
      type: added ? "success" : "info",
      title: added ? "Salvo nos favoritos ♥" : "Removido dos favoritos",
      message: product.name,
    });
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex flex-col gap-2">
            <span className="badge badge-subtle">{title}</span>
            <h2
              className="text-[#09090B] leading-tight"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3vw,30px)" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[13px] text-[#A1A1AA]">{subtitle}</p>
            )}
          </div>
          <Link
            href="/loja"
            className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#09090B] border border-[#09090B] px-5 py-2 rounded-full hover:bg-[#09090B] hover:text-white transition-all duration-200 shrink-0"
          >
            Ver Todos
            <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>

        {/* Scroll row */}
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {storeProducts.map((product) => {
            const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const wished  = hasWish(product.id);

            return (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[195px] sm:w-[215px] bg-white border border-[#E4E4E7] rounded-2xl overflow-hidden hover:border-[#D4D4D8] hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Image wrapper */}
                <div className="relative aspect-square bg-[#F4F4F5] overflow-hidden">
                  <Link href={`/produto/${product.slug}`} className="block w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-400"
                      sizes="215px"
                    />
                  </Link>

                  {/* Discount badge */}
                  {savings >= 5 && (
                    <span className="absolute top-2 left-2 badge badge-red tabular-nums">
                      -{savings}%
                    </span>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={() => handleWish(product)}
                    className={[
                      "absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-200",
                      wished
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-white/90 border-white/60 text-[#A1A1AA] hover:text-red-500 hover:border-red-200",
                    ].join(" ")}
                    aria-label={wished ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name} nos favoritos`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wished ? "fill-white" : ""}`} />
                  </button>

                  {/* Quick-add overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-250 ease-out">
                    <button
                      onClick={() => handleAdd(product)}
                      className="w-full flex items-center justify-center gap-2 bg-[#09090B]/90 backdrop-blur-sm text-white text-[12px] font-semibold py-2.5 hover:bg-[#09090B] transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col gap-2 flex-1">
                  <Link
                    href={`/produto/${product.slug}`}
                    className="text-[13px] font-semibold text-[#09090B] line-clamp-2 leading-tight hover:text-[#52525B] transition-colors"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex" aria-label={`${product.rating} estrelas`}>
                      {[1,2,3,4,5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-[#E4E4E7] text-[#E4E4E7]"}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#A1A1AA] tabular-nums">({product.reviewCount})</span>
                  </div>

                  {/* PIX price */}
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-green-600 shrink-0" aria-hidden />
                    <span className="text-[11px] text-green-600 font-semibold tabular-nums">
                      PIX R$ {fmt(product.pixPrice)}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA]">(5% OFF)</span>
                  </div>

                  {/* Price block */}
                  <div className="mt-auto">
                    <p className="text-[15px] font-bold text-[#09090B] tabular-nums">R$ {fmt(product.price)}</p>
                    <p className="text-[11px] text-[#A1A1AA] tabular-nums">
                      {product.installments.count}x R$ {fmt(product.installments.value)} sem juros
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
