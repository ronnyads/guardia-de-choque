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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={closeCart} aria-hidden
          />
          <motion.div
            role="dialog" aria-label="Carrinho de compras" aria-modal
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#111111]" aria-hidden />
                <span className="font-semibold text-[#111111] text-sm">Carrinho</span>
                {count > 0 && (
                  <span className="bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Fechar carrinho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-300" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111] text-sm">Carrinho vazio</p>
                    <p className="text-xs text-gray-400 mt-1">Adicione produtos para continuar</p>
                  </div>
                  <Link href="/loja" onClick={closeCart} className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:underline">
                    Ver produtos <ArrowRight className="w-3 h-3" aria-hidden />
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
              <div className="border-t border-gray-100 px-5 py-5">
                <div className="mb-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-[#111111]">1 produto por checkout</p>
                  <p className="mt-1 text-[11px] text-gray-500">A quantidade segue normalmente para a compra.</p>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="font-bold text-[#111111] tabular-nums">R$ {fmt(total)}</span>
                </div>
                <p className="text-xs text-green-600 font-medium mb-1">
                  PIX: R$ {fmt(total * 0.95)} (5% OFF)
                </p>
                <p className="text-xs text-gray-400 mb-5">Frete calculado no checkout</p>

                <Link
                  href="/carrinho"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full bg-[#111111] hover:bg-[#333333] text-white font-semibold py-3.5 rounded-full text-sm transition-colors active:scale-[0.99]"
                >
                  Revisar e ir ao checkout
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 py-2 transition-colors"
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
