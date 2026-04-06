import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/catalog/ProductCard";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl text-foreground">
              Mais Vendidos
            </h2>
            <p className="text-text-secondary mt-2">
              Os favoritos da família Oliveira
            </p>
          </div>
          <Link
            href="/loja"
            className="text-sm font-semibold text-accent hover:underline hidden sm:block"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/loja"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Ver todos os produtos →
          </Link>
        </div>
      </div>
    </section>
  );
}
