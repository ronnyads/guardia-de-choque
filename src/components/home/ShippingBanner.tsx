import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";

const PAYMENT_LOGOS = [
  { src: "/images/product/bandeiras/pix.png",       alt: "PIX",        w: 36, h: 36 },
  { src: "/images/product/bandeiras/visa.png",       alt: "Visa",       w: 48, h: 16 },
  { src: "/images/product/bandeiras/mastercard.png", alt: "Mastercard", w: 34, h: 26 },
  { src: "/images/product/bandeiras/elo.png",        alt: "Elo",        w: 36, h: 22 },
];

export default function ShippingBanner() {
  return (
    <section className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div className="flex flex-col gap-6">
            {/* Chip */}
            <span className="inline-flex items-center bg-white border border-[#E2E8F0] rounded-full px-4 py-2 text-[11px] font-bold text-[#475569] uppercase tracking-widest w-fit">
              Formas de Pagamento
            </span>

            <h2 className="font-playfair text-[28px] md:text-[36px] text-[#0F172A] leading-tight">
              Pague do jeito<br />que preferir
            </h2>

            <p className="text-[#475569] text-[15px] leading-relaxed max-w-sm">
              Aceitamos PIX com 5% de desconto, cartão de crédito em até 6x sem juros e muito mais.
            </p>

            {/* Payment logos */}
            <div className="flex flex-wrap items-center gap-3">
              {PAYMENT_LOGOS.map(({ src, alt, w, h }) => (
                <div
                  key={alt}
                  className="flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg px-3 py-2"
                >
                  <Image src={src} alt={alt} width={w} height={h} className="object-contain" />
                </div>
              ))}
            </div>

            <Link
              href="/loja"
              className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-7 py-3.5 rounded-full text-[13px] transition-colors duration-200 w-fit active:scale-[0.98] cursor-pointer"
            >
              Aproveitar Agora
            </Link>
          </div>

          {/* Right — navy PIX card */}
          <div className="bg-[#0F172A] rounded-3xl p-10 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" aria-hidden />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" aria-hidden />

            <div className="relative z-10 flex flex-col gap-5">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                Pagamento via PIX
              </p>
              <div>
                <p className="text-[56px] font-bold leading-none tabular-nums">5% OFF</p>
                <p className="text-white/70 text-[15px] mt-2">Instantâneo e Seguro</p>
              </div>

              {/* Inner card */}
              <div className="bg-white/10 rounded-2xl p-5 flex items-center gap-4 mt-2">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0" aria-hidden>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">Aprovação Imediata</p>
                  <p className="text-[12px] text-white/60">Seu pedido é processado na hora</p>
                </div>
              </div>

              <p className="text-[12px] text-white/40">
                Frete grátis em compras acima de R$ 199 · Entrega nacional
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
