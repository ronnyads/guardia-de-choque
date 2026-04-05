"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const KWAI_PIXEL_ID = process.env.NEXT_PUBLIC_KWAI_PIXEL_ID || "";

// Script oficial Kwai Ads (SDK minificado)
const KWAI_SDK = '!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.install=t():e.install=t()}("undefined"!=typeof window?window:self,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=72)}({72:function(e,t,n){"use strict";var o=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var o,r=0,i=t.length;r<i;r++)!o&&r in t||(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return e.concat(o||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0});var r=function(e,t,n){var o,i=e.createElement("script");i.type="text/javascript",i.async=!0,i.src=t,n&&(i.onerror=function(){r(e,n)});var a=e.getElementsByTagName("script")[0];null===(o=a.parentNode)||void 0===o||o.insertBefore(i,a)};!function(e,t,n){e.KwaiAnalyticsObject=n;var i=e[n]=e[n]||[];i.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];var a=function(e,t){e[t]=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];var i=o([t],n,!0);e.push(i)}};i.methods.forEach((function(e){a(i,e)})),i.instance=function(e){var t,n=(null===(t=i._i)||void 0===t?void 0:t[e])||[];return i.methods.forEach((function(e){a(n,e)})),n},i.load=function(e,o){var a="https://s21-def.ap4r.com/kos/s101/nlav112572/pixel/events.js";i._i=i._i||{},i._i[e]=[],i._i[e]._u=a,i._t=i._t||{},i._t[e]=+new Date,i._o=i._o||{},i._o[e]=o||{};var c="?sdkid=".concat(e,"&lib=").concat(n);r(t,a+c,"https://s21-def.ks-la.net/kos/s101/nlav112572/pixel/events.js"+c)}}(window,document,"kwaiq")}})}));';

declare global {
  interface Window {
    KwaiAnalyticsObject: string;
    kwaiq: {
      load:     (pixelId: string, opts?: Record<string, unknown>) => void;
      page:     (params?: Record<string, unknown>) => void;
      track:    (event: string, params?: Record<string, unknown>) => void;
      instance: (pixelId: string) => {
        track: (event: string, params?: Record<string, unknown>) => void;
        page:  (params?: Record<string, unknown>) => void;
      };
      push: (...args: unknown[]) => void;
    };
  }
}

// ---------- Helpers ----------
export const kwaiInst = () =>
  typeof window !== "undefined" && window.kwaiq && KWAI_PIXEL_ID
    ? window.kwaiq.instance(KWAI_PIXEL_ID)
    : null;

export const kwaiPageView = () => {
  try {
    if (typeof window !== "undefined" && window.kwaiq) {
      window.kwaiq.page();
    }
  } catch { /* noop */ }
};

export const kwaiTrack = (event: string, params: Record<string, unknown> = {}) => {
  try { kwaiInst()?.track(event, params); } catch { /* noop */ }
};

export const kwaiViewContent = (id: string, name: string, value: number) =>
  kwaiTrack("EVENT_CONTENT_VIEW", { content_id: id, content_name: name, value, currency: "BRL" });

export const kwaiCheckout  = (v: number) => kwaiTrack("EVENT_INITIATED_CHECKOUT", { value: v, currency: "BRL" });
export const kwaiPurchase  = (v: number, id = "") => kwaiTrack("EVENT_PURCHASE", { value: v, currency: "BRL", order_id: id });
export const kwaiAddToCart = (v: number) => kwaiTrack("EVENT_ADD_TO_CART", { value: v, currency: "BRL" });

// ---------- Componente ----------
function KwaiPixelContent() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Dispara pageView + EVENT_CONTENT_VIEW em cada navegação
  useEffect(() => {
    // kwaiq.page() — registro interno do SDK
    kwaiPageView();
    // EVENT_CONTENT_VIEW — aparece no painel Test Events do Kwai Ads Manager
    kwaiTrack("EVENT_CONTENT_VIEW", {
      page_url: typeof window !== "undefined" ? window.location.href : "",
    });
  }, [pathname, searchParams]);

  if (!KWAI_PIXEL_ID) return null;

  const initScript =
    KWAI_SDK +
    "\nkwaiq.load('" + KWAI_PIXEL_ID + "');" +
    "\nkwaiq.page();";

  return (
    <Script
      id="kwai-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: initScript }}
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
