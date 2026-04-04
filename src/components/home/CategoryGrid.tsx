import Link from "next/link";
import { ShieldCheck, Cpu, Home, Heart } from "lucide-react";
import { categories } from "@/lib/categories";

const categoryIcons: Record<string, React.ElementType> = {
  "defesa-pessoal": ShieldCheck,
  "tecnologia":     Cpu,
  "casa":           Home,
  "bem-estar":      Heart,
};

export default function CategoryGrid() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#111111] mb-6">Categorias</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] ?? ShieldCheck;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col gap-3 bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <Icon className="w-5 h-5 text-[#111111]" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-[#111111] text-sm group-hover:underline underline-offset-2">
                    {cat.name}
                  </p>
                  {cat.productCount > 0 ? (
                    <p className="text-xs text-gray-400 mt-0.5">{cat.productCount} produto{cat.productCount > 1 ? "s" : ""}</p>
                  ) : (
                    <p className="text-xs text-gray-300 mt-0.5">Em breve</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
