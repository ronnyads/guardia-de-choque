"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, Search, X, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/",                         label: "Início"          },
  { href: "/loja",                     label: "Loja"            },
  { href: "/categoria/defesa-pessoal", label: "Defesa Pessoal"  },
  { href: "/sobre",                    label: "Nossa História"  },
  { href: "/rastreio",                 label: "Rastrear Pedido" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const count      = useCartStore((s) => s.count());
  const openCart   = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Announcement strip */}
      <div className="bg-[#0F172A] text-white text-[11px] font-medium text-center py-2 tracking-widest uppercase">
        Frete grátis acima de R$ 199 &nbsp;·&nbsp; 5% OFF no PIX &nbsp;·&nbsp; Parcele em até 6x sem juros
      </div>

      <header
        className={[
          "sticky top-0 z-50 bg-white transition-shadow duration-200",
          scrolled ? "shadow-[0_1px_0_0_#E2E8F0]" : "border-b border-[#F1F5F9]",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Os Oliveiras — início">
            <span className="font-playfair italic text-[20px] font-bold text-[#0F172A] tracking-tight">
              Os Oliveiras
            </span>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Navegação">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-150",
                    active
                      ? "text-[#0F172A] font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A]",
                  ].join(" ")}
                >
                  {label}
                  {active && (
                    <span className="block h-0.5 bg-[#0F172A] mt-0.5 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Buscar"
            >
              {searchOpen ? <X className="w-[17px] h-[17px]" /> : <Search className="w-[17px] h-[17px]" />}
            </button>

            <button
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Minha conta"
            >
              <User className="w-[17px] h-[17px]" />
            </button>

            <button
              onClick={openCart}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              aria-label={`Carrinho${count > 0 ? ` (${count} ${count === 1 ? "item" : "itens"})` : ""}`}
            >
              <ShoppingCart className="w-[17px] h-[17px]" />
              {count > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#0F172A] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums"
                  aria-hidden
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div className="border-t border-[#F1F5F9] bg-white px-4 md:px-6 py-3">
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} currentPath={pathname} />
      {isCartOpen && <CartDrawer />}
    </>
  );
}
