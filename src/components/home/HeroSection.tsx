"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";

const trustPills = [
  { icon: ShieldCheck, label: "Compra 100% garantida" },
  { icon: Truck,       label: "Frete rápido"           },
  { icon: Star,        label: "4.8 ★  · 424 avaliações" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Blue radial glow — top-right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,111,235,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Text ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-7"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                Os Oliveiras · Loja Oficial
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight"
            >
              Qualidade que a{" "}
              <span className="text-gradient italic">família Oliveira</span>{" "}
              garante.
            </h1>

            {/* Body */}
            <p className="text-text-body text-lg leading-relaxed max-w-md">
              Produtos selecionados com cuidado para sua segurança e bem-estar.
              Confiança familiar em cada detalhe — do pedido à entrega.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2">
              {trustPills.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-xs font-medium text-text-body"
                >
                  <Icon className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden />
                  {label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/loja"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/25 active:translate-y-0 active:scale-[0.98] text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Ver Coleção
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-accent text-text-body hover:text-foreground font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-surface-elevated text-sm"
              >
                Nossa História
              </Link>
            </div>
          </motion.div>

          {/* ── Product image ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Card frame */}
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Glow ring */}
              <div
                className="absolute inset-8 rounded-full blur-3xl opacity-30"
                style={{ background: "radial-gradient(circle, #1D6FEB 0%, transparent 70%)" }}
              />

              {/* Product */}
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque — aparelho de defesa pessoal"
                width={480}
                height={480}
                priority
                className="relative z-10 w-full h-auto animate-float drop-shadow-2xl"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-8 -right-4 bg-surface border border-border rounded-xl px-3 py-2 shadow-xl hidden sm:flex flex-col items-start gap-0.5"
              >
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-accent text-accent" aria-hidden />
                  ))}
                </div>
                <span className="text-xs font-semibold text-foreground">4.7 estrelas</span>
                <span className="text-[10px] text-text-muted">194 avaliações</span>
              </motion.div>

              {/* Price badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75, duration: 0.4 }}
                className="absolute bottom-8 -left-4 bg-accent text-white rounded-xl px-3 py-2 shadow-xl hidden sm:block"
              >
                <p className="text-[10px] font-medium opacity-80">A partir de</p>
                <p className="text-lg font-bold">R$ 89,00</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
