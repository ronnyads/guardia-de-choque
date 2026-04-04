"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/",        label: "Início"          },
  { href: "/loja",    label: "Loja"             },
  { href: "/categoria/defesa-pessoal", label: "Defesa Pessoal" },
  { href: "/sobre",   label: "Nossa História"   },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const count      = useCartStore((s) => s.count());
  const openCart   = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm shadow-black/20"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Os Oliveiras — início"
          >
            {/* Monogram badge */}
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent-hover transition-colors">
              <span className="text-white font-bold text-xs select-none">OO</span>
            </div>
            <span
              className="text-lg text-foreground group-hover:text-accent transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Os Oliveiras
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                    active
                      ? "text-accent bg-accent/10"
                      : "text-text-body hover:text-foreground hover:bg-surface-elevated",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label={`Carrinho de compras${count > 0 ? `, ${count} ${count === 1 ? "item" : "itens"}` : ", vazio"}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums"
                  aria-hidden
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-md px-4 md:px-8 py-3">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
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
