import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-white border-t border-[#E2E8F0]">

      {/* Mobile: stack vertical */}
      <div className="lg:hidden">
        <Image
          src="/images/product/banner-historia.png"
          alt="Família Os Oliveiras"
          width={1920}
          height={480}
          className="w-full h-48 object-cover object-center"
          sizes="100vw"
        />
        <div className="px-5 py-8 flex flex-col gap-4">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Nossa História</span>
          <h2
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "24px",
              color: "#0F172A",
              lineHeight: 1.25,
              fontWeight: 700,
            }}
          >
            Qualidade não precisa custar uma fortuna.
          </h2>
          <p className="text-[#475569] text-[13px] leading-relaxed">
            A família Oliveira acredita que todo brasileiro merece produtos de qualidade,
            com segurança garantida e atendimento humano. Cada item testado e aprovado
            antes de chegar até você.
          </p>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F172A] hover:gap-3 transition-all duration-150 w-fit border-b border-[#0F172A] pb-0.5"
          >
            Conheça nossa história <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Desktop: overlay */}
      <div className="hidden lg:block relative w-full overflow-hidden">
        <Image
          src="/images/product/banner-historia.png"
          alt="Família Os Oliveiras — qualidade e segurança para quem você ama"
          width={1920}
          height={480}
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="max-w-[400px] mr-20 xl:mr-32 bg-white/85 backdrop-blur-sm rounded-2xl p-9 flex flex-col gap-4 shadow-lg">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Nossa História</span>
            <h2
              style={{
                fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
                fontSize: "28px",
                color: "#0F172A",
                lineHeight: 1.25,
                fontWeight: 700,
              }}
            >
              Qualidade não precisa custar uma fortuna.
            </h2>
            <p className="text-[#475569] text-[13px] leading-relaxed">
              A família Oliveira acredita que todo brasileiro merece produtos de qualidade,
              com segurança garantida e atendimento humano. Cada item testado e aprovado
              antes de chegar até você.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F172A] hover:gap-3 transition-all duration-150 w-fit border-b border-[#0F172A] pb-0.5"
            >
              Conheça nossa história <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
