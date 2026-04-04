"use client";

import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import CartEmpty from "@/components/cart/CartEmpty";
import { useCartStore } from "@/lib/store";

export default function CarrinhoPage() {
  const items = useCartStore((s) => s.items);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <h1 className="text-3xl text-foreground mb-8">Seu Carrinho</h1>

          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
              {/* Summary */}
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
