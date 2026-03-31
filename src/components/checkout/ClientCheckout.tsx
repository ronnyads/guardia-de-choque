"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { KITS } from "@/lib/constants";
import OrderSummary from "./OrderSummary";
import CheckoutForm from "./CheckoutForm";
import UpsellModal from "./UpsellModal";

export default function ClientCheckout() {
  const searchParams = useSearchParams();
  const kitId = searchParams.get("kit") || "kit-dupla"; // default fallback
  
  const kit = KITS.find((k) => k.id === kitId) || KITS[1];

  const [hasOrderBump, setHasOrderBump] = useState(false);
  const orderBumpPrice = 29.90; // Preço da Garantia Estendida
  const upsellPrice = 69.90;

  const [showUpsell, setShowUpsell] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Calcula subtotais
  const itemsTotal = kit.promoPrice;
  const total = itemsTotal + (hasOrderBump ? orderBumpPrice : 0);

  const handleFinishCheckout = () => {
    // Ao invés de finalizar de vez, abre o Upsell (Padrão e-commerce BR alta conversão)
    setShowUpsell(true);
  };

  const handleCompleteAll = (acceptedUpsell: boolean) => {
    setShowUpsell(false);
    setCheckoutComplete(true);
    // Aqui seria a integração real (redirecionar para página de sucesso ou thank you page enviando os dados pro gateway)
  };

  if (checkoutComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">Compra Confirmada!</h2>
        <p className="text-text-muted text-center max-w-lg text-lg">
          Seu pedido foi processado com segurança. Em breve você receberá as informações de rastreio no e-mail informado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Progress Indicator (Cognitive Load Reduction) */}
          <div className="flex items-center justify-between text-xs font-semibold px-2 mb-2">
            <span className="text-accent flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-black flex items-center justify-center">1</span> 
              <span>Identificação</span>
            </span>
            <span className="h-[2px] flex-1 bg-white/10 mx-3 rounded-full overflow-hidden">
               <span className="h-full bg-accent/30 w-1/2 block"></span>
            </span>
            <span className="text-text-muted flex items-center gap-2 mix-blend-screen opacity-60">
              <span className="w-6 h-6 rounded-full bg-surface border border-white/20 text-white flex items-center justify-center">2</span> 
              <span>Pagamento</span>
            </span>
          </div>

          <CheckoutForm 
            onFinish={handleFinishCheckout}
            hasOrderBump={hasOrderBump}
            setHasOrderBump={setHasOrderBump}
            orderBumpPrice={orderBumpPrice}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <OrderSummary 
            kit={kit} 
            hasOrderBump={hasOrderBump} 
            orderBumpPrice={orderBumpPrice} 
            total={total} 
          />
        </div>
      </div>

      {showUpsell && (
        <UpsellModal 
          upsellPrice={upsellPrice} 
          onDecision={handleCompleteAll} 
        />
      )}
    </>
  );
}
