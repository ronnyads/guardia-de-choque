import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Rápido",
    desc: "Enviamos para todo o Brasil. Entrega em até 12 dias úteis com código de rastreio.",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    desc: "Seus dados protegidos com criptografia SSL. Pagamento 100% seguro via Mercado Pago.",
  },
  {
    icon: RotateCcw,
    title: "Garantia de 30 dias",
    desc: "Não ficou satisfeito? Devolvemos o valor integral sem perguntas dentro de 30 dias.",
  },
  {
    icon: Headphones,
    title: "Suporte Humano",
    desc: "Atendimento via WhatsApp de segunda a sábado. Respondemos em até 2 horas.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-[#09090B] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={[
                "bg-[#09090B] p-8 flex flex-col gap-4 hover:bg-white/[0.04] transition-colors duration-200",
                i < benefits.length - 1 ? "" : "",
              ].join(" ")}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/10"
                aria-hidden
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="text-[15px] font-semibold text-white leading-snug mb-2">
                  {title}
                </p>
                <p className="text-[13px] text-white/50 leading-relaxed">
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
