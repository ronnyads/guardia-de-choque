"use client";

import { useEffect } from "react";
import { kwaiViewContent } from "./KwaiPixel";
import { gaViewItem } from "./GoogleAnalytics";
import { metaViewContent } from "@/lib/meta-events";

interface Props {
  productSlug: string;
  productName: string;
  price:       number;
}

export default function ProductViewTracker({ productSlug, productName, price }: Props) {
  useEffect(() => {
    // Meta Pixel + CAPI — ViewContent com deduplicação por eventID
    metaViewContent({ productSlug, productName, value: price });
    // Kwai — EVENT_CONTENT_VIEW
    kwaiViewContent(productSlug, productName, price);
    // GA4 — view_item
    gaViewItem({ id: productSlug, name: productName, value: price });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
