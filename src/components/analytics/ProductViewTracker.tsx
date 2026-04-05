"use client";

import { useEffect } from "react";
import { kwaiTrack } from "./KwaiPixel";

interface Props {
  productId: string;
  productName: string;
  price: number;
}

export default function ProductViewTracker({ productId, productName, price }: Props) {
  useEffect(() => {
    kwaiTrack("viewContent", { content_id: productId, content_name: productName, value: price, currency: "BRL", content_type: "product" });
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", { content_ids: [productId], content_type: "product", content_name: productName, value: price, currency: "BRL" });
    }
  }, []);
  return null;
}

