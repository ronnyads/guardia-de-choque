import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src="/images/product/kit-completo.png"
              alt="Produtos Os Oliveiras"
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Nossa História</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111111] leading-snug">
              Qualidade não precisa custar uma fortuna.
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              A família Oliveira acredita que todo brasileiro merece produtos de qualidade, com
              segurança garantida e atendimento humano. Cada item testado e aprovado antes de
              chegar até você.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:gap-3 transition-all duration-150 w-fit border-b border-[#111111] pb-0.5"
            >
              Conheça nossa história <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
