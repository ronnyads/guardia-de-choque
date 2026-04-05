"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

// Tipagem global para TS
declare global {
  interface Window {
    kwai_pixel: ((...args: unknown[]) => void) & { q?: unknown[]; l?: number };
  }
}

// ---------- Helpers exportaveis ----------

export const kwaiPageView = () => {
  if (typeof window !== "undefined" && window.kwai_pixel) {
    window.kwai_pixel("track", "ViewContent");
  }
};

export const kwaiTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.kwai_pixel) {
    window.kwai_pixel("track", event, params ?? {});
  }
};

// Eventos padrao Kwai Ads
export const kwaiAddToCart    = (value: number) => kwaiTrack("AddToCart",         { value, currency: "BRL" });
export const kwaiCheckout     = (value: number) => kwaiTrack("InitiateCheckout",  { value, currency: "BRL" });
export const kwaiPurchase     = (value: number, orderId?: string) =>
  kwaiTrack("CompletePayment", { value, currency: "BRL", order_id: orderId ?? "" });

// ---------- Componente ----------

function KwaiPixelContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Dispara ViewContent em cada mudanca de rota
  useEffect(() => {
    kwaiPageView();
  }, [pathname, searchParams]);

  if (!KWAI_PIXEL_ID) return null;

  return (
    <Script
      id="kwai-pixel"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          !function(e,t,n,c,a){
            e.KWAIAnalyticsObject=a;
            e[a]=e[a]||function(){(e[a].q=e[a].q||[]).push(arguments)};
            e[a].l=1*new Date();
            var i=t.createElement('script'),r=t.getElementsByTagName('script')[0];
            i.async=!0;
            i.src='https://s.kwai-analytics.com/kwai-pixel.js';
            r.parentNode.insertBefore(i,r)
          }(window,document,'script',0,'kwai_pixel');
          kwai_pixel('init', { pixel_id: '${KWAI_PIXEL_ID}' });
          kwai_pixel('track', 'ViewContent');
        `,
      }}
    />
  );
}

export default function KwaiPixel() {
  return (
    <Suspense fallback={null}>
      <KwaiPixelContent />
    </Suspense>
  );
}
