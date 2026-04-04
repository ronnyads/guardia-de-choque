"use client";

import { useState, useMemo } from "react";
import { StoreProduct } from "@/types";
import ProductCard from "./ProductCard";

type SortKey = "relevance" | "price-asc" | "price-desc" | "rating";

interface Props {
  products: StoreProduct[];
}

export default function ProductGrid({ products }: Props) {
  const [sort, setSort] = useState<SortKey>("relevance");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, sort, category]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === "all"
                ? "bg-accent text-white"
                : "bg-surface border border-border text-text-body hover:border-accent"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                category === cat
                  ? "bg-accent text-white"
                  : "bg-surface border border-border text-text-body hover:border-accent"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text-body focus:outline-none focus:border-accent"
        >
          <option value="relevance">Relevância</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="rating">Melhor avaliados</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-text-secondary">
          Nenhum produto encontrado para esta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-text-muted text-center">
        {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
