"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Truck, Award } from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";

// Preços inline — componente legado (landing page antiga), não está em uso em nenhuma página
const PROMO_PRICE = 97.9;
const ORIGINAL_PRICE = 129;

export default function FinalCTA() {
  return (
    <ScrollSnapSection className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-8 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
        >
          Não Espere Algo Acontecer
          <br />
          Para <span className="text-accent">Se Proteger</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-secondary text-lg"
        >
          Garanta sua Guardiã de Choque com desconto exclusivo antes que acabe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-baseline gap-3"
        >
          <span className="text-text-muted text-lg line-through">
            R$ {ORIGINAL_PRICE.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-4xl md:text-5xl font-bold text-accent">
            R$ {PROMO_PRICE.toFixed(2).replace(".", ",")}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button href="#kits" size="lg" pulse>
            <Zap className="w-5 h-5" />
            QUERO ME PROTEGER AGORA
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-text-muted text-sm">Oferta por tempo limitado:</p>
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 text-xs text-text-secondary"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" /> Garantia 30 Dias
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-accent" /> Envio em 24h
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-accent" /> Compra Segura
          </span>
        </motion.div>

        <p className="text-text-muted/50 text-xs">
          Restam poucas unidades com este preço
        </p>
      </div>
    </ScrollSnapSection>
  );
}
