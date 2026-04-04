"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-surface rounded-2xl overflow-hidden border border-border">
        <Image
          src={images[active]}
          alt={name}
          fill
          className="object-contain p-6"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-accent shadow-sm"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
