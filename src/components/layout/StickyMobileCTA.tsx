"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const container = document.querySelector(".snap-container");
      if (container) {
        setVisible(container.scrollTop > window.innerHeight * 0.7);
      }
    }

    const container = document.querySelector(".snap-container");
    container?.addEventListener("scroll", handleScroll, { passive: true });
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 px-4 py-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-text-muted">A partir de</p>
              <p className="text-lg font-bold text-accent">R$ 99,00</p>
            </div>
            <a
              href="#kits"
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              <Zap className="w-4 h-4" />
              COMPRAR
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
