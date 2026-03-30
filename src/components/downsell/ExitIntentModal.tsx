"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useExitIntent } from "@/hooks/useExitIntent";

export default function ExitIntentModal() {
  const { showModal, close } = useExitIntent();

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-surface border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>

              <h3 className="text-2xl font-bold">
                Espere! Temos uma{" "}
                <span className="text-accent">oferta especial</span>
              </h3>

              <p className="text-text-secondary text-sm">
                Sabemos que investir em segurança é uma decisão importante.
                Por isso, preparamos uma oferta exclusiva para você.
              </p>

              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 w-full">
                <p className="text-xs text-text-muted">Mini Taser Defesa Pessoal</p>
                <div className="flex items-baseline justify-center gap-2 mt-1">
                  <span className="text-sm text-text-muted line-through">R$ 109,00</span>
                  <span className="text-2xl font-bold text-accent">R$ 89,00</span>
                </div>
              </div>

              <Button href="/oferta-especial" size="md" pulse className="w-full">
                <Zap className="w-4 h-4" />
                VER OFERTA ESPECIAL
              </Button>

              <button
                onClick={close}
                className="text-text-muted text-xs hover:text-white transition-colors cursor-pointer"
              >
                Não, obrigado. Quero sair.
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
