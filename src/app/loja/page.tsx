import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Loja | Os Oliveiras",
  description: "Todos os produtos selecionados pela família Oliveira. Defesa pessoal, tecnologia e mais.",
};

export default async function LojaPage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-surface border-b border-border py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl text-foreground">Nossa Loja</h1>
            <p className="text-text-secondary mt-2">
              {products.length} produtos selecionados com a confiança Oliveira
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <ProductGrid products={products} />
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
