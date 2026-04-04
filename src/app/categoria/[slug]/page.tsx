import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductGrid from "@/components/catalog/ProductGrid";
import { getCategoryBySlug, categories } from "@/lib/categories";
import { getProductsByCategory, storeProducts } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | Os Oliveiras`,
    description: cat.description,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const products = getProductsByCategory(slug);
  const fallback = products.length === 0 ? storeProducts : products;

  return (
    <>
      <Navbar />
      <main>
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <p className="text-[#94A3B8] text-[12px] mb-1">Loja → {cat.name}</p>
            <h1 className="font-playfair text-[32px] text-[#0F172A]">{cat.name}</h1>
            <p className="text-[#475569] mt-2 text-[14px]">{cat.description}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <ProductGrid products={fallback} />
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
