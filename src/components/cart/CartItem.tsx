"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { CartItem as CartItemType } from "@/types";

interface Props { item: CartItemType; }

export default function CartItem({ item }: Props) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty  = useCartStore((s) => s.updateQty);
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-100">
        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#111111] text-xs leading-snug line-clamp-2">{item.product.name}</p>
        <p className="text-[#111111] font-bold text-sm mt-1 tabular-nums">R$ {fmt(item.product.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden" role="group" aria-label="Quantidade">
            <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base" aria-label="Diminuir">−</button>
            <span className="w-7 text-center text-xs font-bold text-[#111111] tabular-nums" aria-live="polite">{item.qty}</span>
            <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base" aria-label="Aumentar">+</button>
          </div>
          <button onClick={() => removeItem(item.product.id)} className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-[#E53E3E] transition-colors rounded-lg" aria-label={`Remover ${item.product.name}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
