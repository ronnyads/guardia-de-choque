import { Suspense } from "react";
import { Lock, Truck, ShieldCheck, Star } from "lucide-react";
import ClientCheckout from "@/components/checkout/ClientCheckout";
import { getProductBySlug } from "@/lib/products";
import { ORDER_BUMP_PRICE, UPSELL_PRICE } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export const metadata = {
  title: "Checkout Seguro | Guardia de Choque",
  description: "Finalize sua compra com seguranca. Frete gratis para todo o Brasil.",
};

// Mapa de produto-slug para kit-slug (para compatibilidade com ?produto=guardia-de-choque)
const slugToKit: Record<string, string> = {
  "guardia-de-choque": "guardia-de-choque",
  "kit-individual":    "guardia-de-choque",
  "kit-dupla":         "kit-dupla",
  "kit-familia":       "kit-familia",
  "mini-taser":        "guardia-de-choque",
};

interface PageProps {
  searchParams: Promise<{ kit?: string; produto?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawKit     = params.kit;
  const rawProduto = params.produto;
  const kitSlug    = rawKit || (rawProduto ? slugToKit[rawProduto] : null) || "guardia-de-choque";

  const [kitProduct, storeConfig] = await Promise.all([
    getProductBySlug(kitSlug),
    getStoreConfig(),
  ]);

  // Fallback: se não encontrar no banco, usa guardia-de-choque
  const resolvedKit = kitProduct ?? await getProductBySlug("guardia-de-choque");

  const checkoutConfig = {
    enableStripeFallback: storeConfig.checkout_enable_stripe_fallback ?? true,
    retryDelayMs:         storeConfig.checkout_retry_delay_ms ?? 900,
    pixPollingMs:         storeConfig.checkout_pix_polling_ms ?? 3000,
    // Upsell: usa o valor do produto se configurado, senão cai no global do tenant
    upsellPrice: resolvedKit?.upsellPrice ?? storeConfig.checkout_upsell_price ?? UPSELL_PRICE,
    upsellLabel: resolvedKit?.upsellLabel,
    downsellPrice: resolvedKit?.downsellPrice,
    downsellLabel: resolvedKit?.downsellLabel,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Frete gratis announcement bar */}
      <div className="bg-[#059669] text-white text-center py-2 text-[12px] font-bold tracking-wide">
        <Truck className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
        FRETE GRATIS para todo o Brasil • Entrega em 5-12 dias uteis via Correios
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-[18px] text-[#0F172A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Guardia de Choque
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#64748B]">
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              4.7/5 • 194 avaliações
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-[#059669] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Checkout 100% Seguro
            </span>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <div className="bg-[#F0FDF4] border-b border-[#BBF7D0]">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-[12px] text-[#166534] font-medium">
            <Truck className="w-3.5 h-3.5 text-[#16A34A]" />
            Frete Grátis
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#166534] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            Garantia 30 dias
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#166534] font-medium">
            <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
            Dados 100% seguros
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {resolvedKit ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ClientCheckout
                kit={resolvedKit}
                orderBumpPrice={resolvedKit.bumpPrice ?? storeConfig.checkout_order_bump_price ?? ORDER_BUMP_PRICE}
                orderBumpLabel={resolvedKit.bumpLabel}
                checkoutConfig={checkoutConfig}
              />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="text-[#64748B]">Produto não encontrado. Verifique o link e tente novamente.</p>
          </div>
        )}
      </main>
    </div>
  );
}
