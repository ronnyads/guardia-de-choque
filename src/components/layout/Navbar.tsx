"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, Search, X, Heart, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/",                         label: "Início"          },
  { href: "/loja",                     label: "Loja"            },
  { href: "/categoria/defesa-pessoal", label: "Categorias"      },
  { href: "/sobre",                    label: "Nossa História"  },
  { href: "/rastreio",                 label: "Rastrear Pedido" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);

  const count      = useCartStore((s) => s.count());
  const openCart   = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const wishCount  = useWishlistStore((s: { count: () => number }) => s.count());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHeroPage = pathname === "/";

  return (
    <>
      {/* ── Announcement strip ── */}
      <div className="bg-[#09090B] text-white text-[11px] font-medium text-center py-2.5 tracking-widest uppercase">
        <div className="overflow-hidden">
          <div className="animate-marquee inline-flex gap-16 whitespace-nowrap">
            {[
              "🚚 Frete grátis acima de R$ 199",
              "⚡ 5% OFF no PIX",
              "💳 Parcele em até 6x sem juros",
              "🔒 Compra 100% segura",
              "🚚 Frete grátis acima de R$ 199",
              "⚡ 5% OFF no PIX",
              "💳 Parcele em até 6x sem juros",
              "🔒 Compra 100% segura",
            ].map((t, i) => (
              <span key={i} className="opacity-80 hover:opacity-100 transition-opacity">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header
        className={[
          "sticky top-0 z-50 transition-all duration-300",
          scrolled || !isHeroPage
            ? "glass shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : isHeroPage
            ? "bg-transparent border-b border-white/10"
            : "bg-white border-b border-[#E4E4E7]",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[60px] flex items-center gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0"
            aria-label="Os Oliveiras — página inicial"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#09090B] rounded-lg flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-white" aria-hidden />
              </div>
              <span
                className={[
                  "font-bold text-[18px] tracking-tight transition-colors duration-300",
                  scrolled || !isHeroPage ? "text-[#09090B]" : isHeroPage ? "text-white" : "text-[#09090B]",
                ].join(" ")}
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
              >
                Os Oliveiras
              </span>
            </div>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Navegação principal">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              const light = !scrolled && isHeroPage;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 group",
                    active
                      ? light ? "text-white font-semibold" : "text-[#09090B] font-semibold"
                      : light
                      ? "text-white/65 hover:text-white hover:bg-white/10"
                      : "text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]",
                  ].join(" ")}
                >
                  {label}
                  {active && (
                    <span
                      className={[
                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full transition-all",
                        light ? "bg-white" : "bg-[#09090B]",
                      ].join(" ")}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={[
                "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
                !scrolled && isHeroPage
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]",
              ].join(" ")}
              aria-label={searchOpen ? "Fechar busca" : "Buscar"}
            >
              {searchOpen
                ? <X className="w-[17px] h-[17px]" />
                : <Search className="w-[17px] h-[17px]" />
              }
            </button>

            {/* Wishlist */}
            <Link
              href="/favoritos"
              className={[
                "relative w-9 h-9 hidden md:flex items-center justify-center rounded-lg transition-all duration-200",
                !scrolled && isHeroPage
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]",
              ].join(" ")}
              aria-label={`Favoritos${wishCount > 0 ? ` (${wishCount})` : ""}`}
            >
              <Heart className="w-[17px] h-[17px]" />
              {wishCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 tabular-nums"
                  aria-hidden
                >
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className={[
                "relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
                !scrolled && isHeroPage
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]",
              ].join(" ")}
              aria-label={`Carrinho${count > 0 ? ` (${count} ${count === 1 ? "item" : "itens"})` : ""}`}
            >
              <ShoppingCart className="w-[17px] h-[17px]" />
              {count > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#09090B] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums"
                  aria-hidden
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(true)}
              className={[
                "lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
                !scrolled && isHeroPage
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5]",
              ].join(" ")}
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[#E4E4E7]/60 bg-white/95 backdrop-blur-md px-4 md:px-6 py-3 animate-slide-down">
            <div className="max-w-xl mx-auto relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none"
                aria-hidden
              />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="w-full bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#09090B]/20 focus:border-[#09090B] transition-all"
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
