import { Zap, BatteryCharging, ShieldCheck, Scale } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Arco Elétrico Potente",
    desc: "Som e faísca visível que intimidam antes mesmo do contato físico.",
  },
  {
    icon: BatteryCharging,
    title: "Recarregável via USB",
    desc: "Bateria dura semanas. Carregue no celular — nunca fique sem proteção.",
  },
  {
    icon: ShieldCheck,
    title: "Trava de Segurança",
    desc: "Dupla trava evita acionamentos acidentais — segura para o dia a dia.",
  },
  {
    icon: Scale,
    title: "Legal no Brasil",
    desc: "Aprovado para uso civil. Pode carregar na bolsa sem nenhuma restrição.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-t border-[#E2E8F0] py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
            Diferenciais
          </p>
          <h2 className="font-playfair text-[28px] md:text-[34px] text-[#0F172A] leading-tight">
            Por que escolher a Guardiã de Choque?
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#94A3B8] hover:shadow-sm transition-all duration-200"
            >
              {/* Icon box */}
              <div
                className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0"
                aria-hidden
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="text-[14px] font-semibold text-[#0F172A] leading-snug mb-1.5">
                  {title}
                </p>
                <p className="text-[13px] text-[#475569] leading-relaxed">
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
