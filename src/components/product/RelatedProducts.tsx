import { getRelatedProducts } from "@/lib/products";
import ProductCard from "@/components/catalog/ProductCard";

interface Props {
  currentSlug: string;
}

export default function RelatedProducts({ currentSlug }: Props) {
  const products = getRelatedProducts(currentSlug, 3);

  if (products.length === 0) return null;

  return (
    <>
      <h2 className="font-playfair text-[26px] text-[#0F172A] mb-8">Você também pode gostar</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </>
  );
}
