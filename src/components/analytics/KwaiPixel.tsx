"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

declare global {
  interface Window {
    kwaiq: ((event: string, ...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

// ---------- Helpers ----------
export const kwaiPageView = () => {
  if (typeof window !== "undefined" && window.kwaiq) {
    window.kwaiq("track", "pageView");
  }
};

export const kwaiTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.kwaiq) {
    window.kwaiq("track", event, params ?? {});
  }
};

export const kwaiAddToCart    = (value: number) => kwaiTrack("addToCart",       { value, currency: "BRL" });
export const kwaiCheckout     = (value: number) => kwaiTrack("initiateCheckout",{ value, currency: "BRL" });
export const kwaiPurchase     = (value: number, orderId?: string) =>
  kwaiTrack("completePayment", { value, currency: "BRL", order_id: orderId ?? "" });

// ---------- Componente ----------
function KwaiPixelContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

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
          !function(e,t){
            var a={};a.queue=[];
            a.track=function(){a.queue.push(arguments)};
            window.kwaiq=a;
            var n=t.createElement("script");
            n.src="https://s.kwai-analytics.com/pixel.min.js";
            n.setAttribute("async","");
            t.head.appendChild(n)
          }(window,document);
          kwaiq("init","${KWAI_PIXEL_ID}");
          kwaiq("track","pageView");
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
