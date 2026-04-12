"use client";

import { useEffect } from "react";
import { kwaiViewContent } from "./KwaiPixel";
import { gaViewItem } from "./GoogleAnalytics";

interface Props {
  productId:   string;
  productName: string;
  price:       number;
}

export default function ProductViewTracker({ productId, productName, price }: Props) {
  useEffect(() => {
    // Kwai — EVENT_CONTENT_VIEW com dados do produto
    kwaiViewContent(productId, productName, price);
    // GA4 — view_item
    gaViewItem({ id: productId, name: productName, value: price });

    // Meta Pixel — ViewContent com dados do produto
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", {
        content_ids:  [productId],
        content_type: "product",
        content_name: productName,
        value:        price,
        currency:     "BRL",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
