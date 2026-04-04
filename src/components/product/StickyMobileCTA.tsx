"use client";

import { ShoppingCart } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

interface Props {
  product: StoreProduct;
}

export default function StickyMobileCTA({ product }: Props) {
  const addItem  = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const fmt      = (v: number) => v.toFixed(2).replace(".", ",");

  function handleAdd() {
    addItem(product, 1);
    openCart();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#94A3B8] truncate">{product.name}</p>
        <p className="text-[16px] font-bold text-[#0F172A] tabular-nums leading-tight">R$ {fmt(product.price)}</p>
      </div>
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-5 py-3 rounded-xl text-[13px] tracking-wide transition-colors active:scale-[0.97] shrink-0"
        aria-label={`Adicionar ${product.name} ao carrinho`}
      >
        <ShoppingCart className="w-4 h-4" aria-hidden />
        Adicionar
      </button>
    </div>
  );
}
