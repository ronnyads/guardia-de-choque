"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] items-center py-14 lg:py-0">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6 order-2 lg:order-1"
          >
            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex" aria-label="4.8 de 5 estrelas">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
                ))}
              </div>
              <span className="text-[13px] text-[#64748B]">4.8 · 424 avaliações verificadas</span>
            </div>

            {/* Heading — Playfair Display (skill: heading font) */}
            <h1 className="font-playfair text-[40px] md:text-[52px] text-[#0F172A] leading-[1.1] tracking-tight">
              Qualidade que a{" "}
              <span className="italic">família Oliveira</span>{" "}
              garante.
            </h1>

            {/* Body — DM Sans (skill: body font) */}
            <p className="text-[#475569] text-base leading-relaxed max-w-[440px]">
              Produtos selecionados com cuidado para a segurança e bem-estar da sua família.
              Confiança em cada detalhe — do pedido à entrega.
            </p>

            {/* Trust dots */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["Entrega garantida", "Parcele em 6x", "PIX com 5% OFF"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden />
                  <span className="text-[13px] text-[#475569] font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/loja"
                className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-6 py-3 rounded-full text-[13px] transition-colors duration-200 active:scale-[0.98]"
              >
                Ver Coleção
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
              <Link
                href="/categoria/defesa-pessoal"
                className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] font-semibold px-6 py-3 rounded-full text-[13px] transition-colors duration-200"
              >
                Defesa Pessoal
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[360px]">
              {/* BG shape — Swiss Modernism: clean geometric, no decorations */}
              <div className="absolute inset-4 bg-[#F8FAFC] rounded-3xl" />
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque — aparelho de defesa pessoal"
                width={480}
                height={480}
                priority
                className="relative z-10 w-full h-auto animate-float"
              />

              {/* Floating badge */}
              <div className="absolute bottom-2 -left-4 bg-white border border-[#E2E8F0] shadow-md rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ECFDF5] rounded-full flex items-center justify-center shrink-0" aria-hidden>
                  <span className="text-[#059669] text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0F172A]">+2.000 pedidos</p>
                  <p className="text-[11px] text-[#94A3B8]">entregues com sucesso</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
