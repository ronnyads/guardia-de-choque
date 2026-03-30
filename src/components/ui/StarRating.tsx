import { Star } from "lucide-react";

interface Props {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({ rating, count, size = "md" }: Props) {
  const sizes = {
    sm: { star: 14, text: "text-xs" },
    md: { star: 18, text: "text-sm" },
    lg: { star: 22, text: "text-base" },
  };

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={sizes[size].star}
            className={
              i < fullStars
                ? "text-accent fill-accent"
                : i === fullStars && hasHalf
                ? "text-accent fill-accent/50"
                : "text-text-muted"
            }
          />
        ))}
      </div>
      <span className={`${sizes[size].text} font-semibold text-accent`}>
        {rating}
      </span>
      {count && (
        <span className={`${sizes[size].text} text-text-secondary`}>
          ({count} avaliações)
        </span>
      )}
    </div>
  );
}
