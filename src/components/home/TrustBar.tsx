"use client";

import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import type { TrustBarConfig, TrustBarItem } from "@/types/sections";

const ICON_MAP: Record<string, React.ElementType> = {
  truck:      Truck,
  shield:     ShieldCheck,
  refresh:    RotateCcw,
  headphones: Headphones,
};

const DEFAULT_ITEMS: TrustBarItem[] = [
  { icon: 'truck',      title: 'Frete para todo o Brasil',  description: 'Enviamos para qualquer estado com código de rastreio. Prazo de até 12 dias úteis.' },
  { icon: 'shield',     title: 'Pagamento 100% Seguro',     description: 'Criptografia SSL e processamento via Mercado Pago. Seus dados protegidos.' },
  { icon: 'refresh',    title: '30 dias de garantia',       description: 'Não ficou satisfeito? Devolvemos o valor integral sem burocracia.' },
  { icon: 'headphones', title: 'Suporte humano rápido',     description: 'Atendimento via WhatsApp de segunda a sábado. Resposta em até 2 horas.' },
];

interface Props {
  config?: TrustBarConfig;
}

export default function TrustBar({ config }: Props) {
  const sectionTitle = config?.title    ?? 'Feito para você confiar.';
  const subtitle     = config?.subtitle ?? 'Por que comprar conosco';
  const items        = config?.items    ?? DEFAULT_ITEMS;

  return (
    <section style={{ background: "#09090B" }}>
      <div className="container-wide section-pad">

        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-bold tracking-[0.12em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {subtitle}
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
            {sectionTitle}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? ShieldCheck;
            return (
              <div
                key={item.title}
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
                    {item.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
