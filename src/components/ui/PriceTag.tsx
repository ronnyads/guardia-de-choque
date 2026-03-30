interface Props {
  original: number;
  promo: number;
  size?: "sm" | "md" | "lg";
}

export default function PriceTag({ original, promo, size = "md" }: Props) {
  const sizes = {
    sm: { original: "text-sm", promo: "text-2xl" },
    md: { original: "text-base", promo: "text-3xl md:text-4xl" },
    lg: { original: "text-lg", promo: "text-4xl md:text-5xl" },
  };

  return (
    <div className="flex items-baseline gap-3">
      <span className={`${sizes[size].original} text-text-muted line-through`}>
        R$ {original.toFixed(2).replace(".", ",")}
      </span>
      <span className={`${sizes[size].promo} font-bold text-accent`}>
        R$ {promo.toFixed(2).replace(".", ",")}
      </span>
    </div>
  );
}
