"use client";

import { useEffect } from "react";

interface Props {
  productId:   string;
  productName: string;
  price:       number;
}

/**
 * Tracker de produto — só dispara Meta Pixel ViewContent.
 * O Kwai já cobre page views via kwaiq.page() no KwaiPixel global.
 */
export default function ProductViewTracker({ productId, productName, price }: Props) {
  useEffect(() => {
    // Meta Pixel — ViewContent enriquecido com dados do produto
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
