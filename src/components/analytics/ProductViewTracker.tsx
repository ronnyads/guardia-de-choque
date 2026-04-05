"use client";

import { useEffect } from "react";
import { kwaiViewContent } from "./KwaiPixel";

interface Props {
  productId: string;
  productName: string;
  price: number;
}

export default function ProductViewTracker({ productId, productName, price }: Props) {
  useEffect(() => {
    kwaiViewContent(productId, productName, price);
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", { content_ids: [productId], content_type: "product", content_name: productName, value: price, currency: "BRL" });
    }
  }, []);
  return null;
}

