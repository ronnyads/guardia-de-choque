"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { CartItem as CartItemType } from "@/types";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <div className="flex gap-4 bg-surface rounded-xl p-4">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-elevated">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {item.product.name}
        </p>
        <p className="text-accent font-bold mt-1">R$ {fmt(item.product.price)}</p>

        <div className="flex items-center justify-between mt-2">
          {/* Qty selector */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => updateQty(item.product.id, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-elevated transition-colors text-lg leading-none"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-foreground">
              {item.qty}
            </span>
            <button
              onClick={() => updateQty(item.product.id, item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-elevated transition-colors text-lg leading-none"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.product.id)}
            className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-surface-elevated"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
