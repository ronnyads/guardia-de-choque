"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Início" },
  { href: "/loja", label: "Loja" },
  { href: "/categoria/defesa-pessoal", label: "Defesa Pessoal" },
  { href: "/sobre", label: "Nossa História" },
  { href: "/rastreio", label: "Rastrear Pedido" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <span
                className="text-lg text-foreground"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                Os Oliveiras<span className="text-accent not-italic">.</span>
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface text-text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-text-body hover:bg-surface hover:text-accent transition-colors group"
                >
                  <span className="font-medium">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                </Link>
              ))}
            </nav>

            <div className="px-6 py-6 border-t border-border">
              <p className="text-xs text-text-muted text-center">
                © 2025 Os Oliveiras. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
