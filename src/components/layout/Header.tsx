"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const container = document.querySelector(".snap-container");
      if (container) {
        setScrolled(container.scrollTop > window.innerHeight * 0.5);
      }
    }

    const container = document.querySelector(".snap-container");
    container?.addEventListener("scroll", handleScroll, { passive: true });
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-16">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Guardiã<span className="text-accent">.</span>
          </span>
        </a>

        <AnimatePresence>
          {scrolled && (
            <motion.a
              href="#kits"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              <Zap className="w-4 h-4" />
              COMPRAR AGORA
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
