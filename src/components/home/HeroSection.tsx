"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#F1F5F9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[520px] items-center py-14 lg:py-0">

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6 order-2 lg:order-1"
          >
            {/* Social proof row */}
            <div className="flex items-center gap-2.5">
              <div className="flex" aria-label="4.8 de 5 estrelas">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
                ))}
              </div>
              <span className="text-[13px] text-[#64748B]">4.8 · <strong className="text-[#0F172A]">424</strong> avaliações verificadas</span>
            </div>

            {/* Heading */}
            <h1 className="font-playfair text-[40px] md:text-[54px] text-[#0F172A] leading-[1.08] tracking-tight">
              Sua segurança<br />
              começa aqui —<br />
              <span className="italic">com quem você ama.</span>
            </h1>

            {/* Body */}
            <p className="text-[#475569] text-[15px] leading-relaxed max-w-[440px]">
              Produtos selecionados com o cuidado que só uma família pode oferecer.
              Defesa pessoal acessível, confiável e legal no Brasil.
            </p>

            {/* Trust dots */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {["Entrega garantida", "Parcele em 6x", "PIX com 5% OFF", "Legal no Brasil"].map((item) => (
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
                className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-7 py-3.5 rounded-full text-[13px] transition-colors duration-200 active:scale-[0.98] cursor-pointer"
              >
                Ver Coleção
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </Link>
              <Link
                href="/produto/guardia-de-choque"
                className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:border-[#94A3B8] text-[#0F172A] font-semibold px-7 py-3.5 rounded-full text-[13px] transition-colors duration-200 cursor-pointer"
              >
                Comprar Agora
              </Link>
            </div>
          </motion.div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[380px]">
              {/* BG shape */}
              <div className="absolute inset-4 bg-[#F1F5F9] rounded-3xl" aria-hidden />

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute top-4 -right-4 bg-[#0F172A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wide shadow-lg z-20 hidden sm:block"
                aria-hidden
              >
                Mais Vendido
              </motion.div>

              {/* Product image */}
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque — aparelho de defesa pessoal"
                width={480}
                height={480}
                priority
                className="relative z-10 w-full h-auto motion-safe:animate-float"
              />

              {/* Floating badge — bottom left: orders */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-4 -left-4 bg-white border border-[#E2E8F0] shadow-md rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 bg-[#ECFDF5] rounded-full flex items-center justify-center shrink-0" aria-hidden>
                  <span className="text-[#059669] text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0F172A]">+2.000 pedidos</p>
                  <p className="text-[11px] text-[#94A3B8]">entregues com sucesso</p>
                </div>
              </motion.div>

              {/* Floating badge — bottom right: security */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-2 -right-2 bg-white border border-[#E2E8F0] shadow-md rounded-2xl px-4 py-3 hidden sm:flex items-center gap-2 z-20"
              >
                <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" aria-hidden />
                <p className="text-[11px] font-semibold text-[#0F172A]">Compra 100% Segura</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center gap-2 pb-6 motion-safe:animate-bounce" aria-hidden>
        <span className="text-[10px] text-[#CBD5E1] uppercase tracking-[3px]">Scroll</span>
        <div className="w-5 h-8 border border-[#E2E8F0] rounded-full relative flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-[#94A3B8] rounded-full motion-safe:animate-float" />
        </div>
      </div>
    </section>
  );
}
