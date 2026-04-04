import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";

export default function CategoryGrid() {
  const visible = categories.filter((c) => c.productCount > 0);

  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-foreground">
            Nossas Categorias
          </h2>
          <p className="text-text-secondary mt-3 text-lg">
            Produtos selecionados para cada necessidade da família
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.length === 0
            ? categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)
            : visible.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat }: { cat: (typeof categories)[0] }) {
  return (
    <Link
      href={`/categoria/${cat.slug}`}
      className="group relative bg-background border border-border rounded-2xl p-8 hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col gap-3"
    >
      <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center mb-2">
        <span className="text-accent text-2xl">🛡️</span>
      </div>
      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
        {cat.name}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {cat.description}
      </p>
      {cat.productCount > 0 && (
        <p className="text-xs text-text-muted">{cat.productCount} produto{cat.productCount > 1 ? "s" : ""}</p>
      )}
      <div className="mt-auto flex items-center gap-1 text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Ver produtos <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
