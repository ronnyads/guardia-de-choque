import { Suspense } from "react";
import ClientCheckout from "@/components/checkout/ClientCheckout";

export const metadata = {
  title: "Checkout Seguro - Guardiã de Choque",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <header className="py-4 border-b border-white/5 flex justify-center bg-surface sticky top-0 z-10 shadow-lg">
        <h1 className="text-xl font-bold tracking-tight text-accent flex items-center gap-2">
          <span className="text-white">Guardiã de Choque</span> | Checkout Seguro
        </h1>
      </header>
      
      <main className="max-w-[1200px] mx-auto p-4 md:py-8 lg:px-8">
        <Suspense fallback={<div className="text-center py-20 text-text-muted animate-pulse">Carregando ambiente seguro (SSL)...</div>}>
          <ClientCheckout />
        </Suspense>
      </main>
    </div>
  );
}
