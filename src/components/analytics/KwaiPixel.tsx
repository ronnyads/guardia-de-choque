"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

declare global {
  interface Window {
    KwaiAnalyticsObject: string;
    kwaiq: {
      load:     (pixelId: string, opts?: Record<string, unknown>) => void;
      page:     (params?: Record<string, unknown>) => void;
      track:    (event: string, params?: Record<string, unknown>) => void;
      ready:    (callback: () => void) => void;
      instance: (pixelId: string) => {
        track: (event: string, params?: Record<string, unknown>) => void;
        page:  (params?: Record<string, unknown>) => void;
      };
      push: (...args: unknown[]) => void;
    };
  }
}

// ---------- Helpers exportáveis ----------
export const kwaiPageView = () => {
  try {
    if (typeof window !== "undefined" && window.kwaiq) window.kwaiq.page();
  } catch { /* noop */ }
};

export const kwaiTrack = (event: string, params: Record<string, unknown> = {}) => {
  try {
    if (typeof window !== "undefined" && window.kwaiq) {
      window.kwaiq.track(event, params);
    }
  } catch { /* noop */ }
};

export const kwaiViewContent = (id: string, name: string, value: number) =>
  kwaiTrack("EVENT_CONTENT_VIEW", { content_id: id, content_name: name, value, currency: "BRL" });

export const kwaiCheckout  = (v: number) => kwaiTrack("EVENT_INITIATED_CHECKOUT", { value: v, currency: "BRL" });
export const kwaiPurchase  = (v: number, id = "") => kwaiTrack("EVENT_PURCHASE", { value: v, currency: "BRL", order_id: id });
export const kwaiAddToCart = (v: number) => kwaiTrack("EVENT_ADD_TO_CART", { value: v, currency: "BRL" });

// ---------- Tracker de rotas (client-side navigation) ----------
function KwaiPixelContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.kwaiq) return;

    // Espera o SDK externo (events.js) estar pronto antes de disparar eventos
    window.kwaiq.ready(function () {
      window.kwaiq.page();
      window.kwaiq.track("EVENT_CONTENT_VIEW", {
        page_url: window.location.href,
      });
    });
  }, [pathname, searchParams]);

  return null;
}

export default function KwaiPixel() {
  return (
    <Suspense fallback={null}>
      <KwaiPixelContent />
    </Suspense>
  );
}
