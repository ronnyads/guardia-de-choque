"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/",                          label: "Início"          },
  { href: "/loja",                      label: "Loja"            },
  { href: "/categoria/defesa-pessoal",  label: "Defesa Pessoal"  },
  { href: "/sobre",                     label: "Nossa História"  },
  { href: "/rastreio",                  label: "Rastrear Pedido" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  currentPath?: string;
}

export default function MobileMenu({ open, onClose, currentPath }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer — slides from right */}
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface flex flex-col shadow-2xl"
            aria-label="Menu mobile"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
              <span
                className="text-base text-foreground"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                Os Oliveiras
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-3 px-2">
              {links.map((link) => {
                const active = currentPath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={[
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-colors group",
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-text-body hover:bg-surface-elevated hover:text-foreground",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="font-medium text-sm">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-80 transition-opacity" />
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-border shrink-0">
              <p className="text-xs text-text-muted text-center">
                © 2025 Os Oliveiras
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
