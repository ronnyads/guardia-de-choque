"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LockOpen, Zap, Shield } from "lucide-react";
// Zap is used for steps icon AND for the CTA button below
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import Button from "@/components/ui/Button";

const steps = [
  {
    icon: LockOpen,
    number: "01",
    title: "Destrave",
    description: "Deslize a trava de segurança para liberar o acionamento",
  },
  {
    icon: Zap,
    number: "02",
    title: "Pressione",
    description: "Mantenha o botão de ativação pressionado para gerar o arco elétrico",
  },
  {
    icon: Shield,
    number: "03",
    title: "Proteja-se",
    description: "O som e o arco elétrico neutralizam a ameaça instantaneamente",
  },
];

export default function HowItWorks() {
  return (
    <ScrollSnapSection>
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Simples de Usar.{" "}
            <span className="text-accent">Eficaz Quando Precisa.</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Três passos é tudo que separa você de estar protegido
          </p>
        </motion.div>

        {/* In-hand product image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/10"
        >
          <Image
            src="/images/product/choque-in-hand.png"
            alt="Guardiã de Choque sendo segurado"
            width={800}
            height={436}
            className="w-full h-auto"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-accent/50 via-accent to-accent/50" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="flex flex-col items-center text-center gap-4 relative"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-accent/30 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-black text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-text-body text-sm max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA intermediário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            href="#kits"
            variant="primary"
            size="md"
            pulse={true}
          >
            <Zap className="w-4 h-4" />
            GARANTA O SEU AGORA
          </Button>
        </motion.div>
      </div>
    </ScrollSnapSection>
  );
}
