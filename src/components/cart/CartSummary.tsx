"use client";

import Link from "next/link";
import { Shield, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  const pixPrice = total * 0.95;
  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24">
      <h2 className="text-xl font-bold text-foreground mb-4">Resumo do Pedido</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-text-body">
          <span>Subtotal</span>
          <span>R$ {fmt(total)}</span>
        </div>
        <div className="flex justify-between text-success font-medium">
          <span>5% OFF no PIX</span>
          <span>− R$ {fmt(total - pixPrice)}</span>
        </div>
        <div className="flex justify-between text-text-muted">
          <span>Frete</span>
          <span>Calculado no checkout</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between font-bold text-lg text-foreground">
          <span>Total</span>
          <span>R$ {fmt(total)}</span>
        </div>
        <p className="text-xs text-accent font-semibold">
          No PIX: R$ {fmt(pixPrice)}
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-5 flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-colors animate-pulse-glow"
      >
        <Zap className="w-4 h-4" />
        FINALIZAR COMPRA
      </Link>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
        <Shield className="w-3.5 h-3.5" />
        Pagamento 100% seguro
      </div>
    </div>
  );
}
