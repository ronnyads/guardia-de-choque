"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote } from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import StarRating from "@/components/ui/StarRating";
import { MAIN_PRODUCT, REVIEWS } from "@/lib/constants";

export default function SocialProof() {
  return (
    <ScrollSnapSection className="bg-surface">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center gap-3"
        >
          <div className="flex items-baseline gap-3">
            <span className="text-6xl md:text-7xl font-bold text-accent">
              {MAIN_PRODUCT.rating}
            </span>
            <span className="text-2xl text-text-muted">/5</span>
          </div>
          <StarRating rating={MAIN_PRODUCT.rating} size="lg" />
          <p className="text-text-secondary">
            <span className="text-white font-semibold">{MAIN_PRODUCT.reviewCount}</span>{" "}
            avaliações verificadas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {REVIEWS.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-2xl border border-white/5 p-6 flex flex-col gap-4"
            >
              <Quote className="w-6 h-6 text-accent/30" />
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-text-muted text-xs">{review.location}</p>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-success text-xs">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verificada
                  </span>
                )}
              </div>
              <StarRating rating={review.rating} size="sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollSnapSection>
  );
}
