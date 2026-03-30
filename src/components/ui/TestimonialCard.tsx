import { BadgeCheck, Quote } from "lucide-react";
import StarRating from "./StarRating";
import { Review } from "@/types";

export default function TestimonialCard({ review }: { review: Review }) {
  return (
    <div className="bg-surface rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
      <Quote className="w-6 h-6 text-accent/30" />
      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold">{review.name}</p>
            <p className="text-text-muted text-xs">{review.location}</p>
          </div>
        </div>
        {review.verified && (
          <span className="flex items-center gap-1 text-success text-xs">
            <BadgeCheck className="w-3.5 h-3.5" /> Verificada
          </span>
        )}
      </div>
      <StarRating rating={review.rating} size="sm" />
    </div>
  );
}
