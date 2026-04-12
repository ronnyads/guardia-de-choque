"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// ── Global gtag helpers ───────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag:      (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function gtagEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// ── E-commerce event helpers (GA4 enhanced e-commerce) ───────────────────────

export function gaViewItem(opts: { id: string; name: string; value: number; currency?: string }) {
  gtagEvent("view_item", {
    currency: opts.currency ?? "BRL",
    value:    opts.value,
    items: [{
      item_id:   opts.id,
      item_name: opts.name,
      price:     opts.value,
      quantity:  1,
    }],
  });
}

export function gaAddToCart(opts: { id: string; name: string; price: number; quantity?: number; currency?: string }) {
  gtagEvent("add_to_cart", {
    currency: opts.currency ?? "BRL",
    value:    opts.price * (opts.quantity ?? 1),
    items: [{
      item_id:   opts.id,
      item_name: opts.name,
      price:     opts.price,
      quantity:  opts.quantity ?? 1,
    }],
  });
}

export function gaBeginCheckout(opts: { id: string; name: string; value: number; currency?: string }) {
  gtagEvent("begin_checkout", {
    currency: opts.currency ?? "BRL",
    value:    opts.value,
    items: [{
      item_id:   opts.id,
      item_name: opts.name,
      price:     opts.value,
      quantity:  1,
    }],
  });
}

export function gaAddPaymentInfo(opts: { paymentType: string; value?: number; currency?: string }) {
  gtagEvent("add_payment_info", {
    currency:     opts.currency ?? "BRL",
    value:        opts.value ?? 0,
    payment_type: opts.paymentType,
  });
}

export function gaPurchase(opts: { transactionId: string; value: number; itemName: string; currency?: string }) {
  gtagEvent("purchase", {
    transaction_id: opts.transactionId,
    currency:       opts.currency ?? "BRL",
    value:          opts.value,
    items: [{
      item_id:   opts.transactionId,
      item_name: opts.itemName,
      price:     opts.value,
      quantity:  1,
    }],
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

function GoogleAnalyticsContent({ gaId }: { gaId: string }) {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window === "undefined" || !window.gtag) return;
    window.gtag("config", gaId, { page_path: pathname });
  }, [pathname, searchParams, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent gaId={gaId} />
    </Suspense>
  );
}
