"use client";

import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const BENEFITS = [
  {
    Icon: Truck,
    title: "Frete para todo o Brasil",
    desc: "Enviamos para qualquer estado com código de rastreio. Prazo de até 12 dias úteis.",
  },
  {
    Icon: ShieldCheck,
    title: "Pagamento 100% Seguro",
    desc: "Criptografia SSL e processamento via Mercado Pago. Seus dados protegidos.",
  },
  {
    Icon: RotateCcw,
    title: "30 dias de garantia",
    desc: "Não ficou satisfeito? Devolvemos o valor integral sem burocracia.",
  },
  {
    Icon: Headphones,
    title: "Suporte humano rápido",
    desc: "Atendimento via WhatsApp de segunda a sábado. Resposta em até 2 horas.",
  },
];

export default function TrustBar() {
  return (
    <section style={{ background: "#09090B" }}>
      <div className="container-wide section-pad">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Por que comprar conosco
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "#FFFFFF",
              lineHeight: 1.2,
            }}
          >
            Feito para você confiar.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-5 p-8 rounded-2xl transition-colors duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "#FFFFFF" }} aria-hidden />
              </div>

              {/* Text */}
              <div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: "#FFFFFF", fontSize: "16px", lineHeight: 1.3, fontFamily: "var(--font-sans)" }}
                >
                  {title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
