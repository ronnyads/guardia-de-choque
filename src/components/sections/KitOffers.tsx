"use client";

import { motion } from "framer-motion";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import KitCard from "@/components/ui/KitCard";
import { KITS } from "@/lib/constants";

export default function KitOffers() {
  return (
    <ScrollSnapSection id="kits" noSnap>
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center gap-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Escolha Seu Kit de{" "}
            <span className="text-accent">Proteção</span>
          </h2>
          <p className="text-text-secondary text-lg">
            Proteja você e quem você ama. Quanto mais unidades, maior a economia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-start">
          {KITS.map((kit, i) => (
            <KitCard key={kit.id} kit={kit} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-text-muted text-xs text-center"
        >
          Pagamento 100% seguro | Envio em até 24h úteis | Garantia de 30 dias
        </motion.p>
      </div>
    </ScrollSnapSection>
  );
}
