"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Truck, Scale, CreditCard } from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";

const badges = [
  { icon: ShieldCheck, label: "Garantia 30 Dias", color: "text-success" },
  { icon: Lock, label: "Compra 100% Segura", color: "text-accent" },
  { icon: Truck, label: "Envio Todo Brasil", color: "text-accent" },
  { icon: Scale, label: "Produto Legalizado", color: "text-success" },
];

export default function TrustGuarantee() {
  return (
    <ScrollSnapSection className="bg-surface">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center gap-10">
        {/* Guarantee seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-24 h-24 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
            Compre com Total{" "}
            <span className="text-success">Segurança</span>
          </h2>
          <p className="text-text-secondary text-center max-w-lg">
            Se por qualquer motivo você não ficar satisfeito, devolvemos 100%
            do seu dinheiro em até 30 dias.{" "}
            <span className="text-white font-semibold">Sem perguntas.</span>
          </p>
        </motion.div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-surface-elevated rounded-xl border border-white/10 p-5 flex flex-col items-center text-center gap-3 shadow-md shadow-black/20"
            >
              <badge.icon className={`w-8 h-8 ${badge.color}`} />
              <p className="text-sm font-semibold">{badge.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Legal text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="bg-surface-light rounded-xl border border-white/5 p-5 text-center"
        >
          <p className="text-text-muted text-xs leading-relaxed">
            <Scale className="w-3.5 h-3.5 inline mr-1 text-success" />
            O aparelho de choque <strong className="text-white">NÃO</strong> é
            classificado como arma de fogo, pois não dispara projéteis. Seu uso
            é permitido para civis e profissionais de segurança em todo o
            território nacional, sem necessidade de registro ou autorização
            especial.
          </p>
        </motion.div>

        {/* Payment methods */}
        <div className="flex items-center gap-6 text-text-muted">
          <CreditCard className="w-6 h-6" />
          <span className="text-xs">
            PIX • Cartão de Crédito • Boleto Bancário
          </span>
        </div>
      </div>
    </ScrollSnapSection>
  );
}
