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
  const pathname   = usePathname();
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
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200",
          scrolled ? "shadow-sm" : "border-b border-gray-100",
        ].join(" ")}
      >
        {/* Top strip — announcement */}
        <div className="bg-[#111111] text-white text-[11px] font-medium text-center py-2 tracking-wide">
          🚚 Frete grátis acima de R$ 199 · 5% OFF no PIX · Parcele em até 6x sem juros
        </div>

        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2" aria-label="Os Oliveiras — início">
            <span
              className="text-xl font-bold text-[#111111] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Os Oliveiras
            </span>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150",
                    active
                      ? "text-[#111111] underline underline-offset-4 decoration-2"
                      : "text-gray-500 hover:text-[#111111]",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors"
              aria-label="Buscar"
            >
              {searchOpen ? <X className="w-4.5 h-4.5" /> : <Search className="w-[18px] h-[18px]" />}
            </button>

            <button
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors"
              aria-label="Minha conta"
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors"
              aria-label={`Carrinho${count > 0 ? ` (${count})` : ""}`}
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {count > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#111111] hover:bg-gray-50 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 md:px-6 py-3">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-gray-50"
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
