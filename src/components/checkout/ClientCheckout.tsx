"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { KITS } from "@/lib/constants";
import OrderSummary from "./OrderSummary";
import CheckoutForm from "./CheckoutForm";
import UpsellModal from "./UpsellModal";

export default function ClientCheckout() {
  const searchParams = useSearchParams();
  const kitId = searchParams.get("kit") || "kit-dupla"; // default fallback
  
  const kit = KITS.find((k) => k.id === kitId) || KITS[1];

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      // O Meta prefere disparar o checkout no momento que a página de pagamento carrega
      window.fbq("track", "InitiateCheckout", {
        content_name: kit.name,
        currency: "BRL",
        value: kit.promoPrice,
      });
    }
  }, [kit.name, kit.promoPrice]);

  const [hasOrderBump, setHasOrderBump] = useState(false);
  const orderBumpPrice = 29.90; // Preço da Garantia Estendida
  const upsellPrice = 69.90;

  const [showUpsell, setShowUpsell] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isProcessingFull, setIsProcessingFull] = useState(false);
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pixData, setPixData] = useState<{qrCodeBase64?: string, qrCode?: string, paymentId?: string} | null>(null);

  // Calcula subtotais
  const itemsTotal = kit.promoPrice;
  const total = itemsTotal + (hasOrderBump ? orderBumpPrice : 0);

  // Efeito Mágico de Polling do PIX
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (checkoutComplete && pixData?.paymentId) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/checkout/status?id=${pixData.paymentId}`);
          const data = await res.json();
          if (data.approved) {
            setPixData(null); // Remove a tela do PIX para cair na tela de Sucesso padrão
          }
        } catch (e) {
          console.error("Poller error", e);
        }
      }, 3000); // 3 em 3 segundos
    }

    return () => clearInterval(intervalId);
  }, [checkoutComplete, pixData?.paymentId]);

  const handleFinishCheckout = (data: unknown) => {
    setPaymentData(data);
    setShowUpsell(true);
  };

  const handleCompleteAll = async (acceptedUpsell: boolean) => {
    setShowUpsell(false);
    setIsProcessingFull(true);
    
    // Cálculo final com todas as adições de funil
    const finalItemsTotal = itemsTotal + (hasOrderBump ? orderBumpPrice : 0) + (acceptedUpsell ? upsellPrice : 0);
    const amountWithDiscount = paymentData.paymentMethod === 'pix' ? finalItemsTotal * 0.95 : finalItemsTotal;

    try {
      const endpoint = paymentData.paymentMethod === 'pix' ? '/api/checkout/pix' : '/api/checkout/card';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountWithDiscount,
          token: paymentData.token, // para cartão
          brand: paymentData.cardData?.brand || "visa",
          installments: paymentData.cardData?.installments || 1, // para cartão
          email: paymentData.personalData.email,
          name: paymentData.personalData.name,
          phone: paymentData.personalData.phone,
          document: paymentData.document,
          address: paymentData.address,
          itemsDescription: `${kit.name}${hasOrderBump ? ' + Garantia Premium' : ''}${acceptedUpsell ? ' + Mini Taser 12.000KV' : ''}`
        })
      });

      const result = await res.json();

      if (result.success) {
        if (paymentData.paymentMethod === 'pix') {
          setPixData({ 
            qrCodeBase64: result.qrCodeBase64, 
            qrCode: result.qrCode,
            paymentId: result.paymentId
          });
        }
        
        // Dispara o Píxel Final de Purchase!!!
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: amountWithDiscount.toFixed(2),
            currency: "BRL",
            content_name: kit.name
          });
        }
        
        setCheckoutComplete(true);
      } else {
        alert("Erro no Pagamento: " + (result.error || "Operadora recusou a transação."));
      }
    } catch (err: unknown) {
      const e = err as Error;
      alert("Falha de conexão com os servidores do gateway: " + e.message);
    } finally {
      setIsProcessingFull(false);
    }
  };

  if (isProcessingFull) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center h-[50vh]">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
        <h2 className="text-2xl font-bold mb-2">Conectando Operadora Bancária...</h2>
        <p className="text-text-muted max-w-sm">Os dados encriptados estão sendo validados. Por favor, não feche esta página.</p>
      </div>
    );
  }



  if (checkoutComplete) {
    if (pixData) {
      return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in max-w-lg mx-auto w-full">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Pedido Reservado!</h2>
          <p className="text-text-muted text-center mb-8 px-2">
            Pague via QR Code ou Copia-e-Cola abaixo e seu pedido será aprovado e faturado na hora.
          </p>
          
          <div className="bg-white p-6 rounded-2xl mb-6 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-56 h-56 object-contain" />
          </div>
          
          <div className="w-full bg-surface border border-white/10 p-4 rounded-xl text-center mb-4">
            <p className="text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Pix Copia e Cola:</p>
            <div className="flex bg-body rounded-lg overflow-hidden border border-white/5">
              <input 
                type="text" 
                readOnly 
                value={pixData.qrCode} 
                className="w-full bg-transparent p-3 text-sm text-center text-text-muted outline-none"
              />
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(pixData.qrCode || "");
                alert("Código Pix copiado!");
              }}
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              COPIAR CÓDIGO PIX
            </button>
          </div>
          
          <p className="text-xs text-text-muted/60 text-center font-bold">
            Aprovação instantânea em menos de 10 segundos.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-32 animate-fade-in text-center px-4">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black mb-4 tracking-tight">Compra Aprovada!</h2>
        <p className="text-text-muted text-center max-w-lg text-lg">
          Seu pagamento via Cartão de Crédito foi autorizado e processado com segurança pela operadora.
        </p>
        <p className="mt-4 text-sm text-text-secondary">
          Você receberá o rastreio e a nota fiscal no seu e-mail (ou número de WhatsApp se preferir) nos próximos 15 minutos!
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
