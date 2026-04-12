"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, StoreProduct } from "@/types";
import { kwaiAddToCart } from "@/components/analytics/KwaiPixel";
import { gaAddToCart } from "@/components/analytics/GoogleAnalytics";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: StoreProduct, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { product, qty }], isOpen: true };
        });
        // Kwai Ads — EVENT_ADD_TO_CART
        kwaiAddToCart(product.price * qty);
        // GA4 — add_to_cart
        gaAddToCart({ id: product.id, name: product.name, price: product.price, quantity: qty });
        // Meta Pixel — AddToCart com eventID único para deduplicação futura via CAPI
        if (typeof window !== "undefined" && window.fbq) {
          const eventId = `atc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          window.fbq("track", "AddToCart", {
            content_ids:  [product.id],
            content_name: product.name,
            value:        (product.price * qty).toFixed(2),
            currency:     "BRL",
          }, { eventID: eventId });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, qty } : i
          ),
        }));
      },

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: "os-oliveiras-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
