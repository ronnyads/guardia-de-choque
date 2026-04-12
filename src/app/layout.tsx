export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/analytics/MetaPixel";
import KwaiPixel from "@/components/analytics/KwaiPixel";
import ToastProvider from "@/components/ui/ToastProvider";
import { getStoreConfig, getPixelIds } from '@/lib/store-config';
import { TenantProvider } from '@/components/providers/TenantProvider';
import ThemePreviewBridge from '@/components/admin/ThemePreviewBridge';

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig();
  return {
    title: config.seo_title ?? "Minha Loja",
    description: config.seo_description ?? "A melhor loja online. Frete rápido, pagamento seguro.",
    openGraph: {
      title: config.seo_title ?? "Minha Loja",
      description: config.seo_description ?? "A melhor loja online. Qualidade garantida.",
      type: "website",
      locale: "pt_BR",
    },
  };
}

// SDK minificado do Kwai — roda ANTES do React para garantir window.kwaiq disponível
const KWAI_SDK = '!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.install=t():e.install=t()}("undefined"!=typeof window?window:self,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=72)}({72:function(e,t,n){"use strict";var o=this&&this.__spreadArray||function(e,t,n){if(n||2===arguments.length)for(var o,r=0,i=t.length;r<i;r++)!o&&r in t||(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return e.concat(o||Array.prototype.slice.call(t))};Object.defineProperty(t,"__esModule",{value:!0});var r=function(e,t,n){var o,i=e.createElement("script");i.type="text/javascript",i.async=!0,i.src=t,n&&(i.onerror=function(){r(e,n)});var a=e.getElementsByTagName("script")[0];null===(o=a.parentNode)||void 0===o||o.insertBefore(i,a)};!function(e,t,n){e.KwaiAnalyticsObject=n;var i=e[n]=e[n]||[];i.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];var a=function(e,t){e[t]=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];var i=o([t],n,!0);e.push(i)}};i.methods.forEach((function(e){a(i,e)})),i.instance=function(e){var t,n=(null===(t=i._i)||void 0===t?void 0:t[e])||[];return i.methods.forEach((function(e){a(n,e)})),n},i.load=function(e,o){var a="https://s21-def.ap4r.com/kos/s101/nlav112572/pixel/events.js";i._i=i._i||{},i._i[e]=[],i._i[e]._u=a,i._t=i._t||{},i._t[e]=+new Date,i._o=i._o||{},i._o[e]=o||{};var c="?sdkid=".concat(e,"&lib=").concat(n);r(t,a+c,"https://s21-def.ks-la.net/kos/s101/nlav112572/pixel/events.js"+c)}}(window,document,"kwaiq")}})}));';
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [config, { metaPixelId, kwaiPixelId }] = await Promise.all([
    getStoreConfig(),
    getPixelIds(),
  ]);

  const kwaiInitScript = kwaiPixelId
    ? KWAI_SDK +
      "\nkwaiq.load('" + kwaiPixelId + "');" +
      "\nkwaiq.page();" +
      "\nwindow.addEventListener('load',function(){" +
      "kwaiq.instance('" + kwaiPixelId + "').track('EVENT_CONTENT_VIEW',{page_url:location.href});" +
      "});"
    : "";

  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
      style={{
        '--store-primary':      config.primary_color    ?? '#09090B',
        '--store-accent':       config.accent_color     ?? '#16A34A',
        '--store-font-heading': `'${config.font_heading ?? 'Playfair Display'}', serif`,
        '--store-font-body':    `'${config.font_body    ?? 'DM Sans'}', sans-serif`,
      } as React.CSSProperties}
    >
      <head>
        {/* Kwai Ads SDK — roda antes do React, garante window.kwaiq disponível em qualquer useEffect */}
        {kwaiInitScript && (
          <script dangerouslySetInnerHTML={{ __html: kwaiInitScript }} />
        )}

        {/* Google Fonts dinâmico — carrega a fonte selecionada no tema */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${(config.font_heading ?? 'Playfair+Display').replace(/ /g, '+')}:wght@400;700&family=${(config.font_body ?? 'DM+Sans').replace(/ /g, '+')}:wght@400;500;600;700&display=swap`}
          rel="stylesheet"
        />

        {/* Preconnect */}
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.facebook.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://s21-def.ap4r.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://s21-def.ap4r.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: config.brand_name ?? "Minha Loja",
              description: config.seo_description ?? "A melhor loja online.",
              url: config.domain_display ? `https://${config.domain_display}` : undefined,
            }),
          }}
        />
      </head>
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <ThemePreviewBridge />
        <MetaPixel pixelId={metaPixelId} />
        <KwaiPixel />
        <ToastProvider />
        <TenantProvider config={config}>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
