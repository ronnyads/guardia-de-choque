"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, Truck, ShieldCheck, Award } from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import Button from "@/components/ui/Button";
import PriceTag from "@/components/ui/PriceTag";
import StarRating from "@/components/ui/StarRating";
import CountdownTimer from "@/components/ui/CountdownTimer";

// Valores inline — componente legado (landing page antiga), não está em uso em nenhuma página
const LEGACY_RATING = 4.7;
const LEGACY_REVIEW_COUNT = 194;
const LEGACY_ORIGINAL_PRICE = 129;
const LEGACY_PROMO_PRICE = 97.9;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HeroSection() {
  return (
    <ScrollSnapSection id="hero" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-20 lg:py-0">
        {/* Text Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 text-center lg:text-left order-1"
        >
          <motion.div variants={item}>
            <StarRating
              rating={LEGACY_RATING}
              count={LEGACY_REVIEW_COUNT}
              size="sm"
            />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            <span className="animate-shimmer">Guardiã de Choque</span>
            <br />
            <span className="text-white">Sua Segurança na</span>
            <br />
            <span className="text-white">Palma da Mão</span>
          </motion.h1>

          <motion.p variants={item} className="text-text-secondary text-lg max-w-lg mx-auto lg:mx-0">
            O aparelho de defesa pessoal mais vendido do Brasil. Compacto,
            recarregável e pronto para te proteger em qualquer situação.
          </motion.p>

          <motion.div variants={item}>
            <PriceTag
              original={LEGACY_ORIGINAL_PRICE}
              promo={LEGACY_PROMO_PRICE}
            />
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
            <Button href="#kits" size="lg" pulse>
              <Zap className="w-5 h-5" />
              GARANTIR O MEU AGORA
            </Button>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <span>Oferta encerra em:</span>
            </div>
            <CountdownTimer />
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-4 text-xs text-text-secondary"
          >
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-accent" /> Envio Rápido
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" /> Compra Segura
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" /> Garantia 30 Dias
            </span>
          </motion.div>
        </motion.div>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl scale-75" />
            <div className="animate-float relative">
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque - Aparelho de Defesa Pessoal"
                width={600}
                height={400}
                priority
                className="w-56 md:w-80 lg:w-96 h-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </ScrollSnapSection>
  );
}
