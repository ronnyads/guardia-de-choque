"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-background"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className="text-xl tracking-tight text-foreground"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Os Oliveiras<span className="text-accent not-italic">.</span>
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-text-body hover:text-accent transition-colors">
              Início
            </Link>
            <Link href="/loja" className="text-sm font-medium text-text-body hover:text-accent transition-colors">
              Loja
            </Link>
            <Link href="/categoria/defesa-pessoal" className="text-sm font-medium text-text-body hover:text-accent transition-colors">
              Defesa Pessoal
            </Link>
            <Link href="/sobre" className="text-sm font-medium text-text-body hover:text-accent transition-colors">
              Nossa História
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-accent transition-colors"
              aria-label="Buscar"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-accent transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-4 md:px-8 py-3">
            <input
              autoFocus
              type="search"
              placeholder="Buscar produtos..."
              className="w-full max-w-xl bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        )}
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {isCartOpen && <CartDrawer />}
    </>
  );
}
