"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/",                         label: "Início"          },
  { href: "/loja",                     label: "Loja"            },
  { href: "/categoria/defesa-pessoal", label: "Defesa Pessoal"  },
  { href: "/sobre",                    label: "Nossa História"  },
  { href: "/rastreio",                 label: "Rastrear Pedido" },
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
            aria-hidden
          />
          <motion.nav
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
            aria-label="Menu mobile"
          >
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <span
                className="text-base font-bold text-[#111111]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                Os Oliveiras
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2">
              {links.map((link) => {
                const active = currentPath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-colors group",
                      active
                        ? "bg-gray-100 text-[#111111] font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#111111]",
                    ].join(" ")}
                  >
                    <span className="text-sm font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </Link>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">© 2025 Os Oliveiras</p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
