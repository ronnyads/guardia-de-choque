"use client";

import Link from "next/link";
import { Shield, Truck, Lock, Zap, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartSummary() {
  const total    = useCartStore((s) => s.total());
  const items    = useCartStore((s) => s.items);
  const pixPrice = total * 0.95;
  const fmt      = (v: number) => v.toFixed(2).replace(".", ",");
  const checkoutHref = items.length > 0
    ? `/checkout?kit=${items[0].product.slug}`
    : '/checkout';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden sticky top-24">
      <div className="bg-[#059669] px-5 py-3 flex items-center gap-2">
        <Truck className="w-4 h-4 text-white shrink-0" />
        <p className="text-white text-[13px] font-bold">FRETE GRATIS para todo o Brasil!</p>
      </div>
      <div className="p-5">
        <h2 className="text-[15px] font-bold text-[#0F172A] mb-4">Resumo do Pedido</h2>
        <div className="space-y-2.5 text-[13px]">
          <div className="flex justify-between text-[#475569]">
            <span>Subtotal</span>
            <span className="font-medium text-[#0F172A]">R$ {fmt(total)}</span>
          </div>
          <div className="flex justify-between text-[#059669] font-semibold">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" />Frete Expresso BR</span>
            <span className="font-bold">GRÁTIS</span>
          </div>
          <div className="flex justify-between text-[#059669] font-medium">
            <span>5% OFF no PIX</span>
            <span>- R$ {fmt(total - pixPrice)}</span>
          </div>
          <div className="border-t border-[#E2E8F0] pt-3 mt-2">
            <div className="flex justify-between items-end">
              <span className="font-bold text-[#0F172A] text-[15px]">Total</span>
              <div className="text-right">
                <p className="text-[24px] font-black text-[#0F172A] tabular-nums leading-none">R$ {fmt(total)}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">No PIX: <strong className="text-[#059669]">R$ {fmt(pixPrice)}</strong></p>
              </div>
            </div>
          </div>
        </div>
        <Link href={checkoutHref} className="mt-5 flex items-center justify-center gap-2.5 w-full bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white font-bold text-[15px] py-4 rounded-xl transition-all">
          <Zap className="w-5 h-5" />
          Finalizar Compra Segura
        </Link>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
          <Lock className="w-3 h-3" /><span>Checkout 100% seguro - SSL 256-bit</span>
        </div>
        <div className="mt-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex gap-2.5">
          <Package className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-semibold text-[#0F172A]">Entrega para todo o Brasil</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Prazo: 5 a 12 dias uteis via Correios. Rastreio por e-mail.</p>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 text-[11px] text-[#166534]">
          <Shield className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <p><strong>Garantia 30 dias</strong> - Nao gostou? Devolvemos 100%.</p>
        </div>
      </div>
    </div>
  );
}
