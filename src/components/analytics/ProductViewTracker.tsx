"use client";

import { useEffect } from "react";
import { kwaiViewContent } from "./KwaiPixel";
import { gaViewItem } from "./GoogleAnalytics";
import { metaViewContent } from "@/lib/meta-events";

interface Props {
  productId:   string;
  productName: string;
  price:       number;
}

export default function ProductViewTracker({ productId, productName, price }: Props) {
  useEffect(() => {
    // Meta Pixel + CAPI — ViewContent com deduplicação por eventID
    metaViewContent({ productSlug: productId, productName, value: price });
    // Kwai — EVENT_CONTENT_VIEW
    kwaiViewContent(productId, productName, price);
    // GA4 — view_item
    gaViewItem({ id: productId, name: productName, value: price });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
