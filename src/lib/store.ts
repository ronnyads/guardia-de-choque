"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, StoreProduct } from "@/types";
import { kwaiAddToCart } from "@/components/analytics/KwaiPixel";
import { gaAddToCart } from "@/components/analytics/GoogleAnalytics";
import { metaAddToCart } from "@/lib/meta-events";

function normalizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const validItems = items.filter(
    (item): item is CartItem =>
      Boolean(
        item &&
        typeof item === "object" &&
        "product" in item &&
        item.product &&
        typeof item.product === "object" &&
        "id" in item.product
      )
  );

  if (validItems.length === 0) {
    return [];
  }

  const primaryProductId = validItems[0].product.id;
  const qty = validItems
    .filter((item) => item.product.id === primaryProductId)
    .reduce((sum, item) => sum + Math.max(1, Number(item.qty) || 1), 0);

  return [{ product: validItems[0].product, qty }];
}

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
          return {
            items: [{ product, qty: Math.max(1, qty) }],
            isOpen: true,
          };
        });
        // Kwai Ads — EVENT_ADD_TO_CART
        kwaiAddToCart(product.price * qty);
        // GA4 — add_to_cart
        gaAddToCart({ id: product.id, name: product.name, price: product.price, quantity: qty });
        // Meta Pixel + CAPI — AddToCart com deduplicação por eventID
        metaAddToCart({ productSlug: product.slug, productName: product.name, value: product.price * qty });
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
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CartStore> | undefined;

        return {
          ...currentState,
          ...persisted,
          items: normalizeCartItems(persisted?.items),
        };
      },
    }
  )
);
