import Link from "next/link";
import { Truck } from "lucide-react";

export default function ShippingBanner() {
  return (
    <section className="bg-[#111111] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-white" aria-hidden />
            </div>
            <div>
              <p className="text-white text-2xl font-bold tracking-tight">FRETE GRÁTIS</p>
              <p className="text-white/60 text-sm mt-0.5">Em compras acima de R$ 199 · Para todo o Brasil</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white/60 text-xs font-medium">Pague no PIX e ganhe</p>
            <p className="text-white text-xl font-bold">5% de desconto</p>
          </div>
          <Link
            href="/loja"
            className="bg-white text-[#111111] font-bold px-7 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors shrink-0"
          >
            Aproveitar Agora
          </Link>
        </div>
      </div>
    </section>
  );
}
