import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Entrega Garantida",
    desc: "Rastreio em tempo real · Frete grátis acima de R$ 199",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro",
    desc: "PIX · Cartão de Crédito · Boleto Bancário",
  },
  {
    icon: ShieldCheck,
    title: "Compra Protegida",
    desc: "Garantia de 3 meses em todos os produtos",
  },
  {
    icon: Headphones,
    title: "Suporte ao Cliente",
    desc: "Segunda a Sábado das 8h às 18h",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#111111]" aria-hidden />
              </div>
              <div>
                <p className="font-semibold text-[#111111] text-sm">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
