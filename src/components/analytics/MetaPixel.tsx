"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1062080060323171";

// Declare fbq globally for TS
declare global {
  interface Window {
    fbq: any;
  }
}

export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const trackEvent = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

function MetaPixelContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only fire on route changes (Base pixel fires on initial load)
    pageview();
  }, [pathname, searchParams]);

  if (!FB_PIXEL_ID) return null;

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

export default function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelContent />
    </Suspense>
  );
}
