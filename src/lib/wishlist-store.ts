import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreProduct } from "@/types";

interface WishlistState {
  items: StoreProduct[];
  add:    (product: StoreProduct) => void;
  remove: (id: string) => void;
  toggle: (product: StoreProduct) => void;
  has:    (id: string) => boolean;
  count:  () => number;
  clear:  () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) =>
        set((s) =>
          s.items.some((i) => i.id === product.id)
            ? s
            : { items: [...s.items, product] }
        ),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      toggle: (product) => {
        const { has, add, remove } = get();
        if (has(product.id)) {
          remove(product.id);
          return;
        }
        add(product);
      },

      has: (id) => get().items.some((i) => i.id === id),

      count: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    { name: "wishlist-store" }
  )
);
