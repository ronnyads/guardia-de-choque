"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Zap,
  Minimize2,
  Flashlight,
  BatteryCharging,
  ShieldCheck,
  Award,
  Truck,
  ArrowLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { REVIEWS } from "@/lib/constants";
import { getCheckoutUrl } from "@/lib/checkout";

// Dados inline do Mini Taser — página de oferta especial (downsell)
// MINI_TASER removido de constants.ts; valores mantidos aqui diretamente.
const MINI_TASER_NAME = "Mini Taser Defesa Pessoal";
const MINI_TASER_RATING = 4.5;
const MINI_TASER_REVIEW_COUNT = 87;
const MINI_TASER_ORIGINAL_PRICE = 109;
const MINI_TASER_PROMO_PRICE = 89;

const features = [
  { icon: Minimize2, title: "Ultra Compacto", desc: "Apenas 10cm — cabe no bolso" },
  { icon: Zap, title: "3.000KV", desc: "Descarga de alta potência" },
  { icon: BatteryCharging, title: "Recarregável", desc: "Bivolt 110/220V" },
];

export default function OfertaEspecial() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4">
        <a href="/" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </a>
      </header>

      <main className="px-6 md:px-12 lg:px-24 py-12 max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-6 mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Entendemos. Mas antes de ir...
          </h1>
          <p className="text-text-secondary text-lg max-w-lg">
            Sabemos que investir em segurança é uma decisão importante. Por
            isso, preparamos uma{" "}
            <span className="text-accent font-semibold">oferta especial</span>{" "}
            para você começar a se proteger hoje mesmo.
          </p>
        </motion.div>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface border border-accent/20 rounded-2xl p-8 flex flex-col items-center gap-6 mb-10"
        >
          {/* Product visual */}
          <div className="w-full max-w-sm rounded-2xl overflow-hidden">
            <Image
              src="/images/product/mini-taser.png"
              alt="Mini Taser Defesa Pessoal - 10cm"
              width={800}
              height={436}
              priority
              className="w-full h-auto"
            />
          </div>

          <h2 className="text-xl font-bold">{MINI_TASER_NAME}</h2>
          <StarRating rating={MINI_TASER_RATING} count={MINI_TASER_REVIEW_COUNT} size="sm" />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs font-semibold">{f.title}</p>
                <p className="text-[10px] text-text-muted">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-text-muted line-through">
              De R$ {MINI_TASER_ORIGINAL_PRICE.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-4xl font-bold text-accent">
              R$ {MINI_TASER_PROMO_PRICE.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-xs text-text-secondary">
              ou 3x de R$ 29,67 sem juros
            </span>
            <span className="mt-1 inline-flex items-center gap-1 bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full">
              Economize R$ 20,00 (18%)
            </span>
          </div>

          <Button href={getCheckoutUrl("downsell")} size="lg" pulse className="w-full max-w-sm">
            <Zap className="w-5 h-5" />
            QUERO ME PROTEGER AGORA
          </Button>

          <p className="text-text-muted text-xs">
            Pagamento 100% seguro | Garantia de 30 dias
          </p>
        </motion.div>

        {/* Trust + Reviews mini */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-center gap-6 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success" /> Garantia 30 Dias
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-accent" /> Envio Rápido
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" /> Compra Segura
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REVIEWS.slice(0, 2).map((review) => (
              <div
                key={review.id}
                className="bg-surface rounded-xl border border-white/5 p-5"
              >
                <p className="text-text-secondary text-sm mb-3">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                    {review.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold">{review.name}</span>
                  <span className="text-text-muted text-xs">— {review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer mini */}
      <footer className="px-6 py-8 text-center">
        <p className="text-text-muted text-xs">
          © {new Date().getFullYear()} Guardiã de Choque. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
