import { Star, Check, Package } from "lucide-react";
import type { TestimonialsConfig, TestimonialReview } from "@/types/sections";

const DEFAULT_REVIEWS: TestimonialReview[] = [
  { id: "1", name: "Mariana Silva",  initials: "MS", city: "São Paulo, SP",       date: "15/03/2025", rating: 5, product: "Guardiã Individual",  text: "Chegou rapidíssimo e o produto é exatamente como descrito. Minha filha adorou. Me sinto muito mais tranquila sabendo que ela está protegida.", verified: true },
  { id: "2", name: "Carlos Eduardo", initials: "CE", city: "Curitiba, PR",        date: "12/03/2025", rating: 5, product: "Kit Dupla Proteção",   text: "Comprei o Kit Dupla para mim e para minha esposa. Qualidade excelente, atendimento ótimo. Os Oliveiras é diferente — parece que você está comprando de uma família de verdade.", verified: true },
  { id: "3", name: "Ana Beatriz",    initials: "AB", city: "Belo Horizonte, MG",  date: "10/03/2025", rating: 5, product: "Kit Família",           text: "Produto chegou embalado com muito cuidado. Parece presente de família. O arco elétrico é potente e a lanterna é um bônus incrível.", verified: true },
];

interface Props {
  config?: TestimonialsConfig;
}

export default function Testimonials({ config }: Props) {
  const title    = config?.title    ?? 'O que a família diz';
  const subtitle = config?.subtitle ?? 'Mais de 2.000 pedidos entregues com 4.8 estrelas de avaliação';
  const reviews  = config?.reviews  ?? DEFAULT_REVIEWS;

  return (
    <section style={{ background: "#F9FAFB", borderTop: "1px solid #E4E4E7" }}>
      <div className="container-wide section-pad">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="flex gap-1 mb-4" aria-label="5 estrelas">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className="w-6 h-6 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
            ))}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              color: "#09090B",
              lineHeight: 1.2,
              fontWeight: 700,
            }}
            className="mb-3"
          >
            {title}
          </h2>
          <p className="text-[#94A3B8] text-[15px] max-w-md">
            {subtitle}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header: avatar + name + date + stars */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Navy avatar */}
                  <div
                    className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <span className="text-white text-[13px] font-bold">{r.initials}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                      {r.name}
                      {r.verified && (
                        <Check className="w-3.5 h-3.5 text-[#059669]" aria-label="Compra verificada" />
                      )}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{r.city} · {r.date}</p>
                  </div>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5 shrink-0" aria-label={`${r.rating} estrelas`}>
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= r.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}`}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              {/* Product tag */}
              <div className="flex items-center gap-1.5 text-[#475569] bg-[#F1F5F9] rounded-full px-3 py-1.5 w-fit">
                <Package className="w-3 h-3 shrink-0" aria-hidden />
                <span className="text-[11px] font-semibold">{r.product}</span>
              </div>

              {/* Review text */}
              <p className="text-[#475569] text-[13px] leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
