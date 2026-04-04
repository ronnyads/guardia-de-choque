import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCategoryBySlug, categories } from "@/lib/categories";
import { getProductsByCategory, storeProducts } from "@/lib/products";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | Os Oliveiras`,
    description: cat.description,
  };
}

export default function CategoriaPage({ params }: Props) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const products = getProductsByCategory(params.slug);
  const fallback = products.length === 0 ? storeProducts : products;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-surface border-b border-border py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <p className="text-text-muted text-sm mb-1">Loja → {cat.name}</p>
            <h1 className="text-3xl md:text-4xl text-foreground">{cat.name}</h1>
            <p className="text-text-secondary mt-2">{cat.description}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <ProductGrid products={fallback} />
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
