"use client";

import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import CartEmpty from "@/components/cart/CartEmpty";
import { useCartStore } from "@/lib/store";
import { Truck, ShieldCheck, Star } from "lucide-react";

export default function CarrinhoPage() {
  const items = useCartStore((s) => s.items);

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-[#F8FAFC] min-h-screen">

        {/* Trust bar */}
        <div className="bg-[#0F172A] text-white">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-6 flex-wrap text-[12px] font-medium">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#34D399]" />Frete Gratis para todo o Brasil</span>
            <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />Garantia 30 dias</span>
            <span className="hidden sm:flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-[#FCD34D]" />4.7/5 - 194 avaliações</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-[28px] font-black text-[#0F172A] mb-6">Seu Carrinho</h1>

          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-3">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    O checkout finaliza um produto por vez.
                  </p>
                  <p className="mt-1 text-[12px] text-[#64748B]">
                    Ajuste a quantidade aqui e conclua este item. Para comprar outro produto, faça um novo checkout em seguida.
                  </p>
                </div>
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
              <div>
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
