import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";
import type { ShippingBannerConfig } from "@/types/sections";

const PAYMENT_LOGOS = [
  { src: "/images/product/bandeiras/pix.png",        alt: "PIX",        w: 36, h: 36 },
  { src: "/images/product/bandeiras/visa.png",        alt: "Visa",       w: 48, h: 16 },
  { src: "/images/product/bandeiras/mastercard.png",  alt: "Mastercard", w: 34, h: 26 },
  { src: "/images/product/bandeiras/elo.png",         alt: "Elo",        w: 36, h: 22 },
];

interface Props {
  config?: ShippingBannerConfig;
}

export default function ShippingBanner({ config }: Props) {
  const eyebrow     = config?.eyebrow      ?? 'Formas de Pagamento';
  const title       = config?.title        ?? 'Pague do jeito que preferir';
  const body        = config?.body         ?? 'Aceitamos PIX com 5% de desconto, cartão de crédito em até 6x sem juros e muito mais.';
  const pixHeadline = config?.pix_headline ?? '5% OFF';
  const pixSubtitle = config?.pix_subtitle ?? 'Instantâneo e Seguro';
  return (
    <section style={{ background: "#F9FAFB", borderTop: "1px solid #E4E4E7" }}>
      <div className="container-wide section-pad">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left — Copy ─────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            {/* Eyebrow */}
            <p
              className="text-[11px] font-bold tracking-[0.12em] uppercase"
              style={{ color: "#A1A1AA" }}
            >
              {eyebrow}
            </p>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: "#09090B",
                lineHeight: 1.15,
                fontWeight: 700,
              }}
            >
              {title}
            </h2>

            {/* Body */}
            <p style={{ color: "#52525B", fontSize: "15px", lineHeight: 1.7, maxWidth: "380px" }}>
              {body}
            </p>

            {/* Payment logos */}
            <div className="flex flex-wrap items-center gap-3">
              {PAYMENT_LOGOS.map(({ src, alt, w, h }) => (
                <div
                  key={alt}
                  className="flex items-center justify-center"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E4E4E7",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    minWidth: "60px",
                  }}
                >
                  <Image src={src} alt={alt} width={w} height={h} className="object-contain" />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link href="/loja" className="btn btn-primary" style={{ width: "fit-content" }}>
                Aproveitar Agora
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>

          {/* ── Right — PIX card ───────────────────────────────── */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "#09090B",
              borderRadius: "24px",
              padding: "44px",
            }}
          >
            {/* Decorative orbs */}
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />

            <div className="relative z-10 flex flex-col gap-6">
              <p
                className="text-[11px] font-bold tracking-[0.12em] uppercase"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                Pagamento via PIX
              </p>

              <div>
                <p
                  className="font-bold tabular-nums leading-none"
                  style={{ color: "#FFFFFF", fontSize: "clamp(48px,7vw,64px)" }}
                >
                  {pixHeadline}
                </p>
                <p
                  className="mt-2"
                  style={{ color: "rgba(255,255,255,0.60)", fontSize: "15px" }}
                >
                  {pixSubtitle}
                </p>
              </div>

              {/* Inner benefit card */}
              <div
                className="flex items-center gap-4"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(255,255,255,0.10)",
                    borderRadius: "12px",
                  }}
                  aria-hidden
                >
                  <Zap className="w-5 h-5" style={{ color: "#FFFFFF" }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#FFFFFF", fontSize: "14px" }}>
                    Aprovação Imediata
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>
                    Seu pedido é processado na hora
                  </p>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.30)", fontSize: "12px" }}>
                Frete grátis acima de R$ 199 · Entrega nacional
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
