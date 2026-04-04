"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Zap, Shield, Truck, ArrowRight } from "lucide-react";
import { KITS } from "@/lib/constants";

const TRUST_PILLS = [
  { icon: Shield, label: "Compra 100% Segura" },
  { icon: Truck,  label: "Frete Grátis acima de R$ 199" },
  { icon: Zap,    label: "PIX com 5% OFF" },
];

const STAT_CARDS = [
  { value: "2.000+", label: "Pedidos entregues" },
  { value: "4.8 ★",  label: "Avaliação média" },
  { value: "48h",    label: "Envio expresso" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const featured = KITS[1]; // Kit Dupla — mais vendido
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(145deg,#09090B 0%,#1C1C1E 55%,#2D2D30 100%)" }}
    >
      {/* ── Background texture / grid overlay ── */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(255,255,255,1) 47px,rgba(255,255,255,1) 48px),repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(255,255,255,1) 47px,rgba(255,255,255,1) 48px)",
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div aria-hidden className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/[0.03] blur-3xl" />
      <div aria-hidden className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-3xl" />

      {/* ── Main grid ── */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl w-full py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ══ LEFT — Copy ══ */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Social proof pill */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
                <div className="flex gap-0.5" aria-label="4.8 estrelas">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </div>
                <span className="text-white/80 text-[12px] font-medium">
                  4.8 &nbsp;·&nbsp; <span className="text-white font-semibold">424 avaliações verificadas</span>
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp}>
              <h1
                className="text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(42px,5.5vw,72px)" }}
              >
                Produtos que{" "}
                <em className="not-italic text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg,#F8FAFC,#94A3B8)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  fazem diferença
                </em>
                <br />na sua vida.
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-[17px] leading-relaxed max-w-md"
            >
              Selecionados com critério, entregues com agilidade.
              Qualidade que a família garante — direto para a sua casa.
            </motion.p>

            {/* Trust pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {TRUST_PILLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 rounded-full px-3.5 py-1.5"
                >
                  <Icon className="w-3 h-3 text-white/60 shrink-0" aria-hidden />
                  <span className="text-white/70 text-[11px] font-medium">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/loja"
                className="btn btn-primary animate-pulse-ring text-[15px] px-7 py-4"
              >
                Ver Coleção
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/loja"
                className="inline-flex items-center gap-2 border border-white/25 text-white hover:bg-white/10 font-semibold px-7 py-4 rounded-full text-[15px] transition-all duration-200"
              >
                Mais Vendidos
              </Link>
            </motion.div>

            {/* Stat cards row */}
            <motion.div variants={fadeUp} className="flex gap-4 pt-4 border-t border-white/10 mt-2">
              {STAT_CARDS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-white font-bold text-[20px] tabular-nums leading-none">{value}</span>
                  <span className="text-white/45 text-[11px]">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ══ RIGHT — Product visual ══ */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="relative flex items-center justify-center"
          >
            {/* Background shape */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl"
              style={{ background: "radial-gradient(ellipse at 60% 40%,rgba(255,255,255,0.07) 0%,transparent 70%)" }}
            />

            {/* Badge — Mais Vendido */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="absolute top-4 right-4 z-20 bg-white text-[#09090B] text-[11px] font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" aria-hidden />
              Mais Vendido
            </motion.div>

            {/* Product image */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div
                className="absolute inset-6 rounded-3xl"
                style={{ background: "radial-gradient(ellipse,rgba(255,255,255,0.08) 0%,transparent 70%)" }}
                aria-hidden
              />
              <Image
                src="/images/product/kit-dupla-foto.png"
                alt="Produto em destaque — Kit mais vendido"
                fill
                priority
                className="object-contain animate-float drop-shadow-2xl"
                sizes="(max-width:768px) 90vw, 480px"
              />
            </div>

            {/* Badge — Compra Segura */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="absolute bottom-6 left-0 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-semibold px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-xl"
            >
              <Shield className="w-4 h-4 text-green-400 shrink-0" aria-hidden />
              <div>
                <p className="font-bold text-[13px]">✓ Compra 100% Segura</p>
                <p className="text-white/50 text-[10px] font-normal">Dados protegidos · Garantia 30 dias</p>
              </div>
            </motion.div>

            {/* Price badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.45, ease: [0.34,1.56,0.64,1] }}
              className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-2xl px-4 py-3 shadow-2xl hidden lg:flex flex-col items-center"
            >
              <p className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">A partir de</p>
              <p className="text-[22px] font-bold text-[#09090B] tabular-nums leading-tight">
                {fmt(featured.pixPrice)}
              </p>
              <p className="text-[10px] text-green-600 font-semibold">PIX · 5% OFF</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          aria-hidden
        >
          <span className="text-white/30 text-[10px] font-medium uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce-dot" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
