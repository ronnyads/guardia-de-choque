import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FeaturedBanner() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">

            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto md:h-72 bg-gray-50 flex items-center justify-center p-8">
              <Image
                src="/images/product/kit-completo.png"
                alt="Kit Dupla Guardiã — produto em destaque"
                width={400}
                height={300}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-4 p-8 md:p-10">
              <span className="text-xs font-bold text-[#E53E3E] tracking-widest uppercase">
                Campeão de Vendas
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-snug">
                Kit Dupla Guardiã
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Dois aparelhos completos com coldre e cabo USB. Proteja você e quem você
                ama com o melhor custo-benefício do catálogo.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#111111] tabular-nums">R$ 169,90</span>
                <span className="text-sm text-gray-400 line-through tabular-nums">R$ 259,80</span>
                <span className="text-xs font-bold text-[#E53E3E] bg-red-50 px-2 py-0.5 rounded-full">-35%</span>
              </div>
              <Link
                href="/produto/kit-dupla"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors w-fit"
              >
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
