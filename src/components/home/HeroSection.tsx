"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px] items-center py-12 lg:py-0">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 lg:py-20 order-2 lg:order-1"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">4.8 · 424 avaliações</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl text-[#111111] leading-[1.1] tracking-tight">
              Qualidade que a{" "}
              <span className="italic text-[#111111]">família Oliveira</span>{" "}
              garante.
            </h1>

            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Produtos selecionados com cuidado para sua segurança e bem-estar.
              Confiança familiar em cada detalhe — do pedido à entrega.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/loja"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 text-sm"
              >
                Ver Coleção
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/categoria/defesa-pessoal"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-400 text-[#111111] font-semibold px-7 py-3.5 rounded-full transition-colors duration-200 text-sm"
              >
                Defesa Pessoal
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-5 pt-2">
              {["Entrega garantida", "Parcele em 6x", "PIX com 5% OFF"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden />
                  <span className="text-xs text-gray-500 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[380px]">
              {/* BG shape */}
              <div className="absolute inset-0 bg-gray-50 rounded-3xl" />
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque — defesa pessoal"
                width={480}
                height={480}
                priority
                className="relative z-10 w-full h-auto animate-float"
              />

              {/* Floating review card */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111111]">+2.000 pedidos</p>
                  <p className="text-[11px] text-gray-400">Entregues com sucesso</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="border-t border-gray-100" />
    </section>
  );
}
