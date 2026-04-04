import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { storeProducts, getProductBySlug } from "@/lib/products";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return storeProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | Os Oliveiras`,
    description: product.description,
  };
}

export default function ProdutoPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ProductImages images={product.images} name={product.name} />
            <ProductInfo product={product} />
          </div>

          {/* Long description */}
          {product.longDescription && (
            <div className="mt-16 max-w-3xl">
              <h2 className="text-2xl text-foreground mb-4">Sobre o Produto</h2>
              <div className="prose text-text-body leading-relaxed">
                {product.longDescription.split("\n").map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            </div>
          )}

          <RelatedProducts currentSlug={params.slug} />
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
