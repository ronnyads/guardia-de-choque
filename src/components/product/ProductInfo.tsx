"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, ShieldCheck, Truck, Star, RefreshCw } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

const KIT_VARIANTS = [
  { slug: "guardia-de-choque", label: "Individual",       qty: "1 aparelho",  price: 97.90,  highlight: false },
  { slug: "kit-dupla",         label: "Dupla Proteção",   qty: "2 aparelhos", price: 169.90, highlight: true  },
  { slug: "kit-familia",       label: "Kit Família",      qty: "3 aparelhos", price: 227.90, highlight: false },
];

interface Props {
  product: StoreProduct;
  onAdd?: () => void;
}

export default function ProductInfo({ product, onAdd }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [qty, setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  function handleAdd() {
    addItem(product, qty);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    onAdd?.();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-[#94A3B8] flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/loja" className="hover:text-[#0F172A] transition-colors">Loja</Link>
        <span aria-hidden>/</span>
        <Link href={`/categoria/${product.category}`} className="hover:text-[#0F172A] transition-colors capitalize">
          {product.categoryName}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-[#475569]" aria-current="page">{product.name}</span>
      </nav>

      {/* Badge + Title */}
      <div className="flex flex-col gap-2">
        {product.badge && (
          <span className="inline-block bg-[#0F172A] text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit tracking-wide">
            {product.badge}
          </span>
        )}
        <h1 className="font-playfair text-[26px] md:text-[30px] text-[#0F172A] leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2" aria-label={`${product.rating} de 5 estrelas, ${product.reviewCount} avaliações`}>
        <div className="flex" aria-hidden>
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}`} />
          ))}
        </div>
        <span className="text-[13px] font-semibold text-[#0F172A]">{product.rating}</span>
        <span className="text-[12px] text-[#94A3B8]">({product.reviewCount} avaliações)</span>
      </div>

      {/* Price block */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-3">

        {/* Kit variant selector */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[#E2E8F0]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">Escolha seu kit</p>
          <div className="grid grid-cols-3 gap-2">
            {KIT_VARIANTS.map((v) => {
              const isActive = product.slug === v.slug;
              return (
                <Link
                  key={v.slug}
                  href={`/produto/${v.slug}`}
                  className={[
                    "relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 text-center transition-all",
                    isActive
                      ? "border-[#0F172A] bg-[#0F172A]"
                      : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]",
                  ].join(" ")}
                >
                  {v.highlight && !isActive && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Mais Escolhido
                    </span>
                  )}
                  <span className={`text-[12px] font-bold leading-tight ${isActive ? "text-white" : "text-[#0F172A]"}`}>
                    {v.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">{v.qty}</span>
                  <span className={`text-[11px] font-semibold tabular-nums ${isActive ? "text-white" : "text-[#475569]"}`}>
                    R$ {v.price.toFixed(2).replace(".", ",")}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-[32px] font-bold text-[#0F172A] tabular-nums leading-none">
            R$ {fmt(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[#94A3B8] line-through text-[13px] tabular-nums">
              R$ {fmt(product.originalPrice)}
            </span>
          )}
          {savings >= 5 && (
            <span className="bg-[#DC2626] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full tabular-nums">
              −{savings}%
            </span>
          )}
        </div>
        <p className="text-[13px] text-[#475569] tabular-nums">
          ou {product.installments.count}x de R$ {fmt(product.installments.value)} sem juros
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" aria-hidden />
          <p className="text-[13px] font-semibold text-[#059669] tabular-nums">
            PIX: R$ {fmt(product.pixPrice)} <span className="font-normal text-[#94A3B8]">(5% OFF)</span>
          </p>
        </div>
      </div>

      {/* Payment icons */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wide">Pagamento 100% seguro</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: "PIX",        bg: "#ECFDF5", text: "#059669" },
            { label: "Visa",       bg: "#EFF6FF", text: "#1D4ED8" },
            { label: "Master",     bg: "#FFF7ED", text: "#C2410C" },
            { label: "Elo",        bg: "#F5F3FF", text: "#6D28D9" },
            { label: "Boleto",     bg: "#F8FAFC", text: "#475569" },
          ].map(({ label, bg, text }) => (
            <span
              key={label}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#E2E8F0]"
              style={{ backgroundColor: bg, color: text }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Short description */}
      <p className="text-[#475569] text-[14px] leading-relaxed">{product.description}</p>

      {/* Qty + Add */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden shrink-0"
          role="group"
          aria-label="Quantidade"
        >
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-11 h-11 flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] transition-colors text-lg font-light"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-[#0F172A] tabular-nums text-sm" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-11 h-11 flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] transition-colors text-lg font-light"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={[
            "flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-[13px] tracking-wide transition-all duration-200 active:scale-[0.98]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F172A]",
            added
              ? "bg-[#059669] text-white"
              : "bg-[#0F172A] hover:bg-[#1E293B] text-white",
          ].join(" ")}
          aria-label={`Adicionar ${qty} ${qty > 1 ? "unidades" : "unidade"} ao carrinho`}
        >
          <ShoppingCart className="w-4 h-4" aria-hidden />
          {added ? "Adicionado!" : "Adicionar ao Carrinho"}
        </button>
      </div>

      {/* Buy now */}
      <Link
        href={`/checkout?produto=${product.slug}&qty=${qty}`}
        className="flex items-center justify-center gap-2 border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-[13px] tracking-wide active:scale-[0.98]"
      >
        <Zap className="w-4 h-4" aria-hidden />
        Comprar Agora
      </Link>

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[
          { icon: Truck,       label: "Entrega",   sub: "Garantida"  },
          { icon: ShieldCheck, label: "Compra",    sub: "Segura"     },
          { icon: RefreshCw,   label: "Troca",     sub: "Fácil"      },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
            <Icon className="w-4 h-4 text-[#059669] shrink-0" aria-hidden />
            <div>
              <p className="text-[11px] font-semibold text-[#0F172A] leading-tight">{label}</p>
              <p className="text-[10px] text-[#94A3B8] leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
