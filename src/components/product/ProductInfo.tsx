"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, ShieldCheck, Truck, Star, ChevronDown } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

interface Props {
  product: StoreProduct;
}

export default function ProductInfo({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty]           = useState(1);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [added, setAdded]       = useState(false);

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted flex items-center gap-1.5" aria-label="Breadcrumb">
        <Link href="/loja" className="hover:text-accent transition-colors">Loja</Link>
        <span aria-hidden>/</span>
        <Link
          href={`/categoria/${product.category}`}
          className="hover:text-accent transition-colors capitalize"
        >
          {product.categoryName}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-text-secondary" aria-current="page">{product.name}</span>
      </nav>

      {/* Badge + Title */}
      <div>
        {product.badge && (
          <span className="inline-block bg-accent/15 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {product.badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl text-foreground leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      <div
        className="flex items-center gap-2"
        aria-label={`${product.rating} de 5 estrelas, ${product.reviewCount} avaliações`}
      >
        <div className="flex" aria-hidden>
          {[1,2,3,4,5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${
                s <= Math.round(product.rating)
                  ? "fill-accent text-accent"
                  : "fill-surface-elevated text-surface-elevated"
              }`}
            />
          ))}
        </div>
        <span className="font-semibold text-foreground">{product.rating}</span>
        <span className="text-text-muted text-sm">({product.reviewCount} avaliações)</span>
      </div>

      {/* Price block */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-5 flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-bold text-foreground tabular-nums">
            R$ {fmt(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-text-muted line-through text-sm tabular-nums">
              R$ {fmt(product.originalPrice)}
            </span>
          )}
          {savings >= 5 && (
            <span className="bg-danger/15 text-danger text-xs font-bold px-2 py-0.5 rounded-full">
              -{savings}%
            </span>
          )}
        </div>
        <p className="text-text-muted text-sm tabular-nums">
          ou {product.installments.count}x de R$ {fmt(product.installments.value)} sem juros
        </p>
        <p className="text-accent font-semibold text-sm tabular-nums">
          PIX: R$ {fmt(product.pixPrice)} (5% OFF)
        </p>
      </div>

      {/* Description */}
      <p className="text-text-body leading-relaxed">{product.description}</p>

      {/* Qty + Add */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center border border-border rounded-xl overflow-hidden"
          role="group"
          aria-label="Quantidade"
        >
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface-elevated transition-colors text-xl"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-foreground tabular-nums text-sm" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface-elevated transition-colors text-xl"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={[
            "flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl text-sm transition-all duration-200",
            "active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            added
              ? "bg-success text-white"
              : "bg-accent hover:bg-accent-hover text-white hover:shadow-lg hover:shadow-accent/20",
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
        className="flex items-center justify-center gap-2 border border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]"
      >
        <Zap className="w-4 h-4" aria-hidden />
        Comprar Agora
      </Link>

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, label: "Compra\nGarantida",   color: "text-success" },
          { icon: Truck,       label: "Entrega\nRápida",     color: "text-accent"  },
          { icon: Star,        label: "4.8★\n424 avaliações", color: "text-accent" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-2 bg-surface-elevated border border-border rounded-xl p-3 text-center">
            <Icon className={`w-4 h-4 ${color} shrink-0`} aria-hidden />
            <span className="text-[10px] text-text-muted leading-tight whitespace-pre-line">{label}</span>
          </div>
        ))}
      </div>

      {/* Specs accordion */}
      {product.specs.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-surface-elevated transition-colors"
            aria-expanded={specsOpen}
            aria-controls="specs-panel"
          >
            Especificações Técnicas
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform duration-200 ${specsOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          {specsOpen && (
            <div id="specs-panel" className="border-t border-border divide-y divide-border">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex px-5 py-3 text-sm">
                  <span className="w-40 text-text-secondary font-medium shrink-0">{spec.label}</span>
                  <span className="text-text-body">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
