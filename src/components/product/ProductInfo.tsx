"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Shield, Truck, Star, ChevronDown } from "lucide-react";
import { StoreProduct } from "@/types";
import { useCartStore } from "@/lib/store";

interface Props {
  product: StoreProduct;
}

export default function ProductInfo({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [specsOpen, setSpecsOpen] = useState(false);

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");
  const savings = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted flex items-center gap-1">
        <Link href="/loja" className="hover:text-accent transition-colors">Loja</Link>
        <span>/</span>
        <Link href={`/categoria/${product.category}`} className="hover:text-accent transition-colors capitalize">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{product.name}</span>
      </nav>

      {/* Title */}
      <div>
        {product.badge && (
          <span className="inline-block bg-accent-light text-accent text-xs font-bold px-3 py-1 rounded-full mb-2">
            {product.badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl text-foreground leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${s <= Math.round(product.rating) ? "fill-accent text-accent" : "fill-surface-elevated text-surface-elevated"}`}
            />
          ))}
        </div>
        <span className="font-bold text-foreground">{product.rating}</span>
        <span className="text-text-muted text-sm">({product.reviewCount} avaliações)</span>
      </div>

      {/* Price */}
      <div className="bg-surface-elevated rounded-2xl p-5 flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">R$ {fmt(product.price)}</span>
          <span className="text-text-muted line-through text-sm">R$ {fmt(product.originalPrice)}</span>
          <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-full">-{savings}%</span>
        </div>
        <p className="text-text-muted text-sm">
          ou {product.installments.count}x de R$ {fmt(product.installments.value)} sem juros
        </p>
        <p className="text-accent font-semibold text-sm">
          5% OFF no PIX: R$ {fmt(product.pixPrice)}
        </p>
      </div>

      {/* Description */}
      <p className="text-text-body leading-relaxed">{product.description}</p>

      {/* Qty + Add to cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface transition-colors text-xl"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-foreground">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface transition-colors text-xl"
          >
            +
          </button>
        </div>

        <button
          onClick={() => addItem(product, qty)}
          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </button>
      </div>

      {/* Buy now */}
      <Link
        href={`/checkout?produto=${product.slug}&qty=${qty}`}
        className="flex items-center justify-center gap-2 border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold py-3.5 rounded-xl transition-all"
      >
        <Zap className="w-4 h-4" />
        Comprar Agora
      </Link>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <span className="text-xs text-text-muted leading-tight">Compra<br />Garantida</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs text-text-muted leading-tight">Entrega<br />Rápida</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs text-text-muted leading-tight">4.8 ★<br />424 avaliações</span>
        </div>
      </div>

      {/* Specs accordion */}
      {product.specs.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-foreground hover:bg-surface transition-colors"
          >
            Especificações Técnicas
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${specsOpen ? "rotate-180" : ""}`} />
          </button>
          {specsOpen && (
            <div className="border-t border-border divide-y divide-border">
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
