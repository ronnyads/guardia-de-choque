"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { StoreProduct } from "@/types";
import { Kit } from "@/types";
import OrderSummary from "./OrderSummary";
import CheckoutForm from "./CheckoutForm";
import UpsellModal from "./UpsellModal";
import { kwaiPurchase, kwaiCheckout } from "@/components/analytics/KwaiPixel";
import { gaBeginCheckout, gaPurchase } from "@/components/analytics/GoogleAnalytics";
import { metaInitiateCheckout, metaPurchase } from "@/lib/meta-events";

interface CheckoutConfig {
  enableStripeFallback: boolean;
  retryDelayMs: number;
  pixPollingMs: number;
  upsellPrice: number;
  upsellLabel?: string;
  downsellPrice?: number;
  downsellLabel?: string;
}

interface Props {
  kit: StoreProduct;
  qty?: number;
  orderBumpPrice: number;
  orderBumpLabel?: string;
  checkoutConfig: CheckoutConfig;
}

export default function ClientCheckout({ kit: kitProduct, qty: qtyProp = 1, orderBumpPrice, orderBumpLabel, checkoutConfig }: Props) {
  const qty = Math.max(1, qtyProp);
  const searchParams = useSearchParams();

  // Adapta StoreProduct para o shape que OrderSummary (Kit) espera
  const kit: Kit = {
    id: kitProduct.id,
    name: kitProduct.name,
    slug: kitProduct.slug,
    badge: kitProduct.badge ?? undefined,
    highlighted: kitProduct.slug === "kit-dupla",
    quantity: kitProduct.quantity ?? 1,
    items: [],
    originalPrice: kitProduct.originalPrice,
    promoPrice: kitProduct.price,
    perUnit: kitProduct.price / (kitProduct.quantity ?? 1),
    savings: kitProduct.originalPrice - kitProduct.price,
    savingsPercent: Math.round(
      ((kitProduct.originalPrice - kitProduct.price) / kitProduct.originalPrice) * 100
    ),
    installments: kitProduct.installments,
    pixPrice: kitProduct.pixPrice,
  };

  const checkoutFiredRef = useRef(false);
  useEffect(() => {
    if (checkoutFiredRef.current) return;
    checkoutFiredRef.current = true;
    // Meta Pixel + CAPI — InitiateCheckout com deduplicação
    metaInitiateCheckout({ productSlug: kit.slug, productName: kit.name, value: kit.promoPrice });
    kwaiCheckout(kit.promoPrice);
    gaBeginCheckout({ id: kit.slug, name: kit.name, value: kit.promoPrice });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertLead = (paymentId: string) => {
    const leadId = typeof window !== 'undefined' ? localStorage.getItem('lead_id') : null;
    if (!leadId) return;
    fetch('/api/leads/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, orderId: paymentId }),
    }).catch(() => {});
    localStorage.removeItem('lead_id');
  };

  const firePurchasePixel = (value: number, eventId?: string) => {
    // Meta Pixel + deduplicação com eventID do backend (CAPI já foi disparado pelo server)
    metaPurchase({ value, productName: kit.name, eventId: eventId ?? `purchase_${Date.now()}` });
    kwaiPurchase(value, eventId ?? "");
    if (eventId) gaPurchase({ transactionId: eventId, value, itemName: kit.name });
  };

  const [hasOrderBump, setHasOrderBump] = useState(false);
  const upsellPrice = checkoutConfig.upsellPrice;

  const [shippingOption, setShippingOption] = useState<{ name: string; price: number; deliveryDays: number } | null>(null);

  const [showUpsell, setShowUpsell] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isProcessingFull, setIsProcessingFull] = useState(false);

  const [paymentData, setPaymentData] = useState<any>(null);
  const [pixData, setPixData] = useState<{qrCodeBase64?: string, qrCode?: string, paymentId?: string, amount?: number} | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<string>("");

  // Calcula subtotais
  const itemsTotal = kit.promoPrice * qty;
  const shippingCost = shippingOption?.price ?? 0;
  const total = itemsTotal + (hasOrderBump ? orderBumpPrice : 0) + shippingCost;

  // Efeito Mágico de Polling do PIX
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (checkoutComplete && pixData?.paymentId) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/checkout/status?id=${pixData.paymentId}`);
          const data = await res.json();
          if (data.approved) {
            // PIX pago — agora dispara pixel e converte lead
            firePurchasePixel(pixData.amount ?? 0, pixData.paymentId);
            convertLead(pixData.paymentId ?? '');
            setPixData(null); // Remove a tela do PIX para cair na tela de Sucesso padrão
          }
        } catch (e) {
          console.error("Poller error", e);
        }
      }, checkoutConfig.pixPollingMs);
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
    setGatewayStatus("Conectando operadora bancária\u2026");

    const finalItemsTotal = itemsTotal + (hasOrderBump ? orderBumpPrice : 0) + (acceptedUpsell ? upsellPrice : 0);
    const finalShipping = paymentData.shippingCost ?? 0;
    const amountWithDiscount = paymentData.paymentMethod === 'pix'
      ? finalItemsTotal * 0.95 + finalShipping
      : finalItemsTotal + finalShipping;

    const recordDecline = (reason: string, amount: number) => {
      fetch('/api/leads/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          paymentData.personalData.name,
          email:         paymentData.personalData.email,
          phone:         paymentData.personalData.phone,
          productSlug:   kit.slug,
          productPrice:  amount,
          declineReason: reason,
        }),
      }).catch(() => {});
    };


    const basePayload = {
      amount: amountWithDiscount,
      kitId:     kit.slug,
      qty,
      hasBump:   hasOrderBump,
      hasUpsell: acceptedUpsell,
      email: paymentData.personalData.email,
      name: paymentData.personalData.name,
      phone: paymentData.personalData.phone,
      document: paymentData.document,
      address: paymentData.address,
      deviceId: paymentData.deviceId ?? null,
      shippingCost:   finalShipping,
      shippingMethod: paymentData.shippingMethod ?? null,
      itemsDescription: `${kit.name}${hasOrderBump ? ' + Garantia Premium' : ''}${acceptedUpsell ? ' + Mini Taser 12.000KV' : ''}`
    };

    try {
      // ── Gateway 1: Mercado Pago ──────────────────────────────
      if (paymentData.paymentMethod === 'pix') {
        const res = await fetch('/api/checkout/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basePayload),
        });
        const result = await res.json();
        if (result.success) {
          // PIX: não dispara pixel nem converte lead aqui — só quando o pagamento for confirmado (polling)
          setPixData({ qrCodeBase64: result.qrCodeBase64, qrCode: result.qrCode, paymentId: result.paymentId, amount: amountWithDiscount });
          setCheckoutComplete(true);
          return;
        }
        throw new Error(result.error || "PIX recusado.");
      }

      // Cartão — tenta MP primeiro
      const mpRes = await fetch('/api/checkout/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basePayload,
          token: paymentData.token,
          brand: paymentData.cardData?.brand || "visa",
          installments: paymentData.cardData?.installments || 1,
        }),
      });
      const mpResult = await mpRes.json();

      if (mpResult.success) {
        firePurchasePixel(amountWithDiscount, String(mpResult.paymentId || ''));
        convertLead(String(mpResult.paymentId || ''));
        setCheckoutComplete(true);
        return;
      }

      // ── Gateway 2: Stripe (fallback automático) ───────────────
      if (!checkoutConfig.enableStripeFallback) {
        recordDecline(mpResult.error || "Recusado MP (sem fallback)", amountWithDiscount);
        throw new Error(mpResult.error || "Pagamento recusado. Tente outro cartão.");
      }

      setGatewayStatus("Verificando com operadora alternativa\u2026");
      await new Promise(r => setTimeout(r, checkoutConfig.retryDelayMs));

      const [rawMonth, rawYear] = (paymentData.cardData?.expiry || "").split("/");
      const stripeRes = await fetch('/api/checkout/stripe-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basePayload,
          cardNumber: paymentData.cardData?.number?.replace(/\s/g, ''),
          cardExpMonth: rawMonth,
          cardExpYear: rawYear,
          cardCvc: paymentData.cardData?.cvv,
          cardName: paymentData.cardData?.name || paymentData.personalData.name,
        }),
      });
      const stripeResult = await stripeRes.json();

      if (stripeResult.success) {
        firePurchasePixel(amountWithDiscount, String(stripeResult.paymentId || ''));
        convertLead(String(stripeResult.paymentId || ''));
        setCheckoutComplete(true);
        return;
      }

      // Ambos falharam
      recordDecline(stripeResult.error || "Recusado MP + Stripe", amountWithDiscount);
      throw new Error(stripeResult.error || "Pagamento recusado. Tente outro cartão.");

    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || "Falha de conexão. Tente novamente.");
    } finally {
      setIsProcessingFull(false);
      setGatewayStatus("");
    }
  };

  if (isProcessingFull) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center h-[50vh]">
        <div className="w-12 h-12 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin mb-6 mx-auto" />
        <h2 className="text-[20px] font-bold text-[#0F172A] mb-2">
          {gatewayStatus || "Processando pagamento\u2026"}
        </h2>
        <p className="text-[#64748B] max-w-sm text-[14px]">Dados criptografados sendo validados. Não feche esta página.</p>
      </div>
    );
  }



  if (checkoutComplete) {
    if (pixData) {
      return (
        <div className="flex flex-col items-center py-12 max-w-lg mx-auto w-full">
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="font-playfair text-[28px] text-[#0F172A] mb-2">Pedido Reservado!</h2>
          <p className="text-[14px] text-[#64748B] text-center mb-8 px-2">
            Pague via QR Code ou Copia-e-Cola abaixo e seu pedido será aprovado na hora.
          </p>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-56 h-56 object-contain" />
          </div>
          <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-5 text-center mb-4">
            <p className="text-[11px] text-[#94A3B8] mb-2 font-bold uppercase tracking-wider">PIX Copia e Cola</p>
            <input type="text" readOnly value={pixData.qrCode}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-[13px] text-[#475569] text-center outline-none mb-3" />
            <button
              onClick={() => { navigator.clipboard.writeText(pixData.qrCode || ""); alert("Código Pix copiado!"); }}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-[14px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copiar Código PIX
            </button>
          </div>
          <p className="text-[12px] text-[#94A3B8] text-center">Aprovação em menos de 10 segundos após o pagamento.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-playfair text-[32px] text-[#0F172A] mb-4">Compra Aprovada!</h2>
        <p className="text-[#475569] max-w-md text-[15px] leading-relaxed">
          Seu pagamento foi autorizado e processado com segurança.
        </p>
        <p className="mt-3 text-[13px] text-[#94A3B8]">
          Você receberá o rastreio e a nota fiscal no seu e-mail nos próximos 15 minutos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-1">
            {[
              { n: "1", label: "Identificação", done: true },
              { n: "2", label: "Entrega",       done: true },
              { n: "3", label: "Pagamento",     done: true },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex items-center gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-[#0F172A] text-white text-[11px] font-bold flex items-center justify-center shrink-0">{step.n}</span>
                <span className="text-[12px] font-semibold text-[#0F172A] whitespace-nowrap">{step.label}</span>
                {i < arr.length - 1 && <span className="flex-1 h-px bg-[#E2E8F0] ml-1" />}
              </div>
            ))}
          </div>

          <CheckoutForm
            onFinish={handleFinishCheckout}
            hasOrderBump={hasOrderBump}
            setHasOrderBump={setHasOrderBump}
            orderBumpPrice={orderBumpPrice}
            kitSlug={kit.slug}
            kitPrice={kit.promoPrice}
            onShippingChange={setShippingOption}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <OrderSummary
            kit={kit}
            hasOrderBump={hasOrderBump}
            orderBumpPrice={orderBumpPrice}
            total={total}
            shippingOption={shippingOption}
          />
        </div>
      </div>

      {showUpsell && (
        <UpsellModal
          upsellPrice={upsellPrice}
          upsellLabel={checkoutConfig.upsellLabel}
          onDecision={handleCompleteAll}
        />
      )}
    </>
  );
}
