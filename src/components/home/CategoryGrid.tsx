import Link from "next/link";
import { ShieldCheck, Cpu, Home, Heart, ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";

/* Map slug → Lucide icon component (NO EMOJI — rule: no-emoji-icons) */
const categoryIcons: Record<string, React.ElementType> = {
  "defesa-pessoal": ShieldCheck,
  "tecnologia":     Cpu,
  "casa":           Home,
  "bem-estar":      Heart,
};

export default function CategoryGrid() {
  return (
    <section className="bg-surface border-y border-border py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-accent text-xs font-semibold tracking-widest uppercase">
              Categorias
            </span>
            <h2 className="text-3xl md:text-4xl text-foreground mt-2">
              Produtos para cada necessidade
            </h2>
          </div>
        </div>

        {/* Grid — 2 cols mobile, 4 desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.slug] ?? ShieldCheck;
            const hasProducts = cat.productCount > 0;

            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative flex flex-col gap-4 bg-background border border-border rounded-2xl p-6 hover:border-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" aria-hidden />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1 flex-1">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {hasProducts ? (
                    <span className="text-[11px] text-text-muted">
                      {cat.productCount} produto{cat.productCount > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-[11px] text-text-muted italic">Em breve</span>
                  )}
                  <ArrowRight
                    className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-150"
                    aria-hidden
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
