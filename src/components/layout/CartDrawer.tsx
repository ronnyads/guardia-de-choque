"use client";

import Link from "next/link";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import CartItem from "@/components/cart/CartItem";

export default function CartDrawer() {
  const items     = useCartStore((s) => s.items);
  const total     = useCartStore((s) => s.total());
  const closeCart = useCartStore((s) => s.closeCart);
  const isOpen    = useCartStore((s) => s.isOpen);
  const count     = useCartStore((s) => s.count());
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-label="Carrinho de compras"
            aria-modal
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-accent" aria-hidden />
                <span className="font-semibold text-foreground text-sm">Carrinho</span>
                {count > 0 && (
                  <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-7 h-7 text-text-muted" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Carrinho vazio</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Adicione produtos para continuar
                    </p>
                  </div>
                  <Link
                    href="/loja"
                    onClick={closeCart}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                  >
                    Ver produtos <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-5 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-secondary text-sm">Subtotal</span>
                  <span className="font-bold text-foreground tabular-nums">R$ {fmt(total)}</span>
                </div>
                <p className="text-xs text-accent font-medium mb-1">
                  No PIX: R$ {fmt(total * 0.95)} (5% OFF)
                </p>
                <p className="text-xs text-text-muted mb-5">
                  Frete calculado no checkout
                </p>

                <Link
                  href="/carrinho"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.99]"
                >
                  Finalizar Compra
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs text-text-muted hover:text-text-secondary mt-3 py-2 transition-colors"
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
