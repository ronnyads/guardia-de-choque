"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Warm grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-bold px-4 py-2 rounded-full w-fit">
              <Star className="w-3.5 h-3.5 fill-accent" />
              +2.000 famílias protegidas
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Qualidade que a{" "}
              <span className="text-accent italic">família Oliveira</span>{" "}
              garante.
            </h1>

            <p className="text-text-body text-lg leading-relaxed max-w-lg">
              Produtos selecionados com cuidado para sua segurança e bem-estar.
              Confiança familiar em cada detalhe.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-sm text-text-body">
                <Shield className="w-4 h-4 text-success" />
                Compra garantida
              </div>
              <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 text-sm text-text-body">
                <Truck className="w-4 h-4 text-accent" />
                Frete rápido
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/loja"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-8 py-4 rounded-xl transition-colors text-base animate-pulse-glow"
              >
                Ver Coleção
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sobre"
                className="inline-flex items-center justify-center gap-2 border-2 border-border hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-4 rounded-xl transition-colors text-base"
              >
                Nossa História
              </Link>
            </div>
          </motion.div>

          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Background blob */}
              <div className="absolute inset-0 bg-accent-light rounded-[40%_60%_60%_40%/40%_40%_60%_60%] opacity-60 blur-2xl" />
              <Image
                src="/images/product/hero-product.png"
                alt="Guardiã de Choque — Defesa Pessoal"
                width={480}
                height={480}
                className="relative z-10 w-full h-auto animate-float drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
