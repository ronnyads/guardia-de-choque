import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";

export default function FeaturedBanner() {
  return (
    <section style={{ background: "#FFFFFF" }}>
      <div className="container-wide" style={{ paddingBottom: "80px" }}>

        {/* Eyebrow */}
        <p
          className="text-center text-[11px] font-bold tracking-[0.12em] uppercase mb-8"
          style={{ color: "#A1A1AA" }}
        >
          Destaque da semana
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
              src="/images/product/kit-completo.png"
              alt="Kit Dupla Guardiã — produto em destaque"
              width={380}
              height={280}
              className="object-contain w-full h-auto"
              style={{ maxHeight: "260px" }}
            />

            {/* Sale badge */}
            <span
              className="absolute top-5 left-5 badge badge-red"
              style={{ fontSize: "12px", padding: "5px 12px" }}
            >
              -35% OFF
            </span>
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
              Kit Dupla Guardiã
            </h2>

            {/* Description */}
            <p style={{ color: "#52525B", fontSize: "15px", lineHeight: 1.7 }}>
              Dois aparelhos completos com coldre e cabo USB. Proteja você e quem você
              ama com o melhor custo-benefício do catálogo.
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-bold tabular-nums"
                style={{ color: "#09090B", fontSize: "28px" }}
              >
                R$ 169,90
              </span>
              <span
                className="line-through tabular-nums"
                style={{ color: "#A1A1AA", fontSize: "15px" }}
              >
                R$ 259,80
              </span>
            </div>

            {/* CTA */}
            <div>
              <Link href="/produto/kit-dupla" className="btn btn-primary" style={{ width: "fit-content" }}>
                Comprar Agora
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
