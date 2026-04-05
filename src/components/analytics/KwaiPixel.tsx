"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

declare global {
  interface Window {
    KwaiAnalyticsObject: string;
    kwaiq: {
      load:     (pixelId: string, opts?: Record<string, unknown>) => void;
      page:     (params?: Record<string, unknown>) => void;
      track:    (event: string, params?: Record<string, unknown>) => void;
      instance: (pixelId: string) => { track: (event: string, params?: Record<string, unknown>) => void };
      push:     (...args: unknown[]) => void;
    };
  }
}

// ---------- Helpers ----------
const inst = () =>
  typeof window !== "undefined" && window.kwaiq
    ? window.kwaiq.instance(KWAI_PIXEL_ID)
    : null;

export const kwaiPageView   = ()                      => { try { window.kwaiq.page(); } catch {} };
export const kwaiTrack      = (e: string, p = {})     => { try { inst()?.track(e, p); } catch {} };
export const kwaiCheckout   = (value: number)         => kwaiTrack("EVENT_INITIATED_CHECKOUT", { value, currency: "BRL" });
export const kwaiPurchase   = (value: number, id = "") => kwaiTrack("EVENT_PURCHASE",           { value, currency: "BRL", order_id: id });
export const kwaiAddToCart  = (value: number)         => kwaiTrack("EVENT_ADD_TO_CART",         { value, currency: "BRL" });
export const kwaiViewContent = (id: string, name: string, value: number) =>
  kwaiTrack("EVENT_CONTENT_VIEW", { content_id: id, content_name: name, value, currency: "BRL" });

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
        __html: \$script
kwaiq.load('');
kwaiq.page();\,
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
