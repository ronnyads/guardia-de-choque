"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, Search, X, Heart, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useStoreConfig } from "@/components/providers/TenantProvider";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const navLinks = [
  { href: "/",        label: "Início"          },
  { href: "/loja",    label: "Loja"            },
  { href: "/sobre",   label: "Nossa História"  },
  { href: "/rastreio",label: "Rastrear Pedido" },
];

export default function Navbar() {
  const pathname   = usePathname();
  const config     = useStoreConfig();

  const STRIP_ITEMS = config.announcement_messages.length > 0
    ? config.announcement_messages
    : ["🔒 Compra 100% segura"];
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const count      = useCartStore((s) => s.count());
  const openCart   = useCartStore((s) => s.openCart);
  const isCartOpen = useCartStore((s) => s.isOpen);
  const wishCount  = useWishlistStore((s) => s.count());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Navbar visual state */
  const navBg = scrolled
    ? "glass-nav"
    : isHero
      ? "bg-[#09090B]/90 border-transparent"
      : "bg-white border-b border-[#E4E4E7]";

  const textColor    = (!scrolled && isHero) ? "rgba(255,255,255,0.75)" : "#71717A";
  const textActive   = (!scrolled && isHero) ? "#FFFFFF"                : "#09090B";
  const iconColor    = (!scrolled && isHero) ? "rgba(255,255,255,0.80)" : "#52525B";
  const logoColor    = (!scrolled && isHero) ? "#FFFFFF"                : "#09090B";

  return (
    <>
      {/* ── Announcement strip ────────────────────────────────── */}
      <div
        style={{ background: "var(--store-primary, #09090B)", color: "rgba(255,255,255,0.8)", fontSize: "11px" }}
        className="py-2.5 overflow-hidden"
        aria-label="Informações de frete e pagamento"
      >
        <div className="animate-marquee inline-flex gap-16 whitespace-nowrap select-none">
          {[...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS].map((t, i) => (
            <span key={i} className="font-medium tracking-wider uppercase">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${navBg}`}
        style={scrolled ? {} : isHero ? { borderColor: "rgba(255,255,255,0.10)" } : {}}
      >
        <div className="container-wide h-[62px] flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5" aria-label={`${config.brand_name ?? 'Minha Loja'} — início`}>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
              style={{ background: logoColor === "#FFFFFF" ? "rgba(255,255,255,0.15)" : "#09090B" }}
            >
              <Package className="w-4 h-4" style={{ color: logoColor }} aria-hidden />
            </div>
            <span
              className="font-bold text-[18px] tracking-tight transition-colors duration-300"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: logoColor }}
            >
              {config.brand_name ?? 'Minha Loja'}
            </span>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Navegação principal">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="relative px-3.5 py-2 text-[13px] font-medium rounded-xl transition-all duration-200"
                  style={{
                    color: active ? textActive : textColor,
                    fontWeight: active ? 600 : 500,
                    background: active
                      ? (!scrolled && isHero ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.04)")
                      : "transparent",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = textActive; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = active ? textActive : textColor; }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5 ml-auto">

            {/* Search */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{ color: iconColor }}
              aria-label={searchOpen ? "Fechar busca" : "Buscar"}
            >
              {searchOpen ? <X className="w-[17px] h-[17px]" /> : <Search className="w-[17px] h-[17px]" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/loja"
              className="relative w-9 h-9 hidden md:flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{ color: iconColor }}
              aria-label={`Favoritos${mounted && wishCount > 0 ? ` (${wishCount})` : ""}`}
            >
              <Heart className="w-[17px] h-[17px]" />
              {mounted && wishCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 tabular-nums"
                  style={{ background: "#DC2626" }}
                  aria-hidden
                >
                  {wishCount > 9 ? "9+" : wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{ color: iconColor }}
              aria-label={`Carrinho${mounted && count > 0 ? ` (${count} itens)` : ""}`}
            >
              <ShoppingCart className="w-[17px] h-[17px]" />
              {mounted && count > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[16px] h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums"
                  style={{ background: "#09090B" }}
                  aria-hidden
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-200"
              style={{ color: iconColor }}
              aria-label="Abrir menu"
            >
              <Menu className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>

        {/* Search bar expandable */}
        {searchOpen && (
          <div
            className="border-t px-4 md:px-6 py-3"
            style={{ background: "rgba(255,255,255,0.98)", borderColor: "#E4E4E7" }}
          >
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#A1A1AA" }} aria-hidden />
              <input
                autoFocus
                type="search"
                placeholder="Buscar produtos..."
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none transition-all"
                style={{
                  background: "#F4F4F5",
                  border: "1px solid #E4E4E7",
                  color: "#09090B",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#09090B"; e.target.style.boxShadow = "0 0 0 3px rgba(9,9,11,0.08)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "#E4E4E7"; e.target.style.boxShadow = "none"; }}
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
