"use client";

import Link from "next/link";
import { X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import CartItem from "@/components/cart/CartItem";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const closeCart = useCartStore((s) => s.closeCart);
  const isOpen = useCartStore((s) => s.isOpen);

  const fmt = (v: number) =>
    v.toFixed(2).replace(".", ",");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-accent" />
                <span className="font-bold text-foreground">Seu Carrinho</span>
                {items.length > 0 && (
                  <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface text-text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-9 h-9 text-text-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Carrinho vazio</p>
                    <p className="text-sm text-text-secondary mt-1">Adicione produtos para continuar</p>
                  </div>
                  <Link
                    href="/loja"
                    onClick={closeCart}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    Ver todos os produtos →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-secondary text-sm">Subtotal</span>
                  <span className="font-bold text-foreground">R$ {fmt(total)}</span>
                </div>
                <p className="text-xs text-text-muted mb-4">
                  Frete calculado no checkout · 5% OFF no PIX
                </p>
                <Link
                  href="/carrinho"
                  onClick={closeCart}
                  className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Finalizar Compra
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-sm text-text-secondary hover:text-accent mt-3 transition-colors"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
