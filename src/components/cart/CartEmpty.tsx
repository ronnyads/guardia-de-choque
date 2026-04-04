import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center">
        <ShoppingCart className="w-10 h-10 text-text-muted" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Seu carrinho está vazio</h2>
        <p className="text-text-secondary mt-2">Explore nossos produtos e adicione ao carrinho.</p>
      </div>
      <Link
        href="/loja"
        className="bg-accent hover:bg-accent-hover text-white font-bold px-8 py-3 rounded-xl transition-colors"
      >
        Ver Produtos
      </Link>
    </div>
  );
}
