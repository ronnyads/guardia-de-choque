"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

declare global {
  interface Window {
    kwaiq: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export const kwaiTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.kwaiq === "function") {
    window.kwaiq("track", event, params ?? {});
  }
};

export const kwaiAddToCart = (v: number) => kwaiTrack("addToCart",        { value: v, currency: "BRL" });
export const kwaiCheckout  = (v: number) => kwaiTrack("initiateCheckout", { value: v, currency: "BRL" });
export const kwaiPurchase  = (v: number, id?: string) =>
  kwaiTrack("completePayment", { value: v, currency: "BRL", order_id: id ?? "" });

function KwaiPixelContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.kwaiq === "function") {
      window.kwaiq("track", "pageView");
    }
  }, [pathname, searchParams]);

  if (!KWAI_PIXEL_ID) return null;

  return (
    <Script
      id="kwai-pixel"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          !function(e,t){
            var a=function(){(a.q=a.q||[]).push(arguments)};
            window.kwaiq=a;
            var s=t.createElement("script");
            s.src="https://s.kwai-analytics.com/pixel.min.js";
            s.async=true;
            t.head.appendChild(s);
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
