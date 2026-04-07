import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import type { FeaturedBannerConfig } from "@/types/sections";

interface Props {
  config?: FeaturedBannerConfig;
}

export default function FeaturedBanner({ config }: Props) {
  const eyebrow       = config?.eyebrow        ?? 'Destaque da semana';
  const badgeText     = config?.badge_text      ?? '-35% OFF';
  const title         = config?.title           ?? 'Kit Dupla Guardiã';
  const description   = config?.description     ?? 'Dois aparelhos completos com coldre e cabo USB. Proteja você e quem você ama com o melhor custo-benefício do catálogo.';
  const price         = config?.price           ?? 'R$ 169,90';
  const originalPrice = config?.original_price  ?? 'R$ 259,80';
  const ctaText       = config?.cta_text        ?? 'Comprar Agora';
  const ctaLink       = config?.cta_link        ?? '/produto/kit-dupla';
  const imageUrl      = config?.image_url       ?? '/images/product/kit-completo.png';

  return (
    <section style={{ background: "#FFFFFF" }}>
      <div className="container-wide" style={{ paddingBottom: "80px" }}>

        {/* Eyebrow */}
        <p
          className="text-center text-[11px] font-bold tracking-[0.12em] uppercase mb-8"
          style={{ color: "#A1A1AA" }}
        >
          {eyebrow}
        </p>

        {/* Banner card */}
        <div
          className="overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center"
          style={{
            background: "#F9FAFB",
            border: "1px solid #E4E4E7",
            borderRadius: "24px",
          }}
        >
          {/* ── Image ───────────────────────────────────────── */}
          <div
            className="relative flex items-center justify-center p-10"
            style={{ background: "#F0F2F5", minHeight: "280px" }}
          >
            <Image
              src={imageUrl}
              alt={`${title} — produto em destaque`}
              width={380}
              height={280}
              className="object-contain w-full h-auto"
              style={{ maxHeight: "260px" }}
            />

            {/* Sale badge */}
            {badgeText && (
              <span
                className="absolute top-5 left-5 badge badge-red"
                style={{ fontSize: "12px", padding: "5px 12px" }}
              >
                {badgeText}
              </span>
            )}
          </div>

          {/* ── Copy ────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 p-10 md:p-12">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" style={{ color: "#DC2626" }} aria-hidden />
              <span
                className="text-[11px] font-bold tracking-[0.10em] uppercase"
                style={{ color: "#DC2626" }}
              >
                Campeão de Vendas
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3vw, 36px)",
                color: "#09090B",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>

            {/* Description */}
            <p style={{ color: "#52525B", fontSize: "15px", lineHeight: 1.7 }}>
              {description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-bold tabular-nums" style={{ color: "#09090B", fontSize: "28px" }}>
                {price}
              </span>
              {originalPrice && (
                <span className="line-through tabular-nums" style={{ color: "#A1A1AA", fontSize: "15px" }}>
                  {originalPrice}
                </span>
              )}
            </div>

            {/* CTA */}
            <div>
              <Link href={ctaLink} className="btn btn-primary" style={{ width: "fit-content" }}>
                {ctaText}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
