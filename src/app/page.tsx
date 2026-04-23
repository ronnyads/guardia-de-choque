import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import SectionRenderer from "@/components/home/SectionRenderer";
import PreviewWrapper from "@/components/home/PreviewWrapper";
import { getFeaturedProducts } from "@/lib/products";
import { getStoreConfig } from "@/lib/store-config";
import { DEFAULT_SECTIONS } from "@/types/sections";
import type { PageSection } from "@/types/sections";

export default async function HomePage() {
  const [products, config] = await Promise.all([
    getFeaturedProducts(),
    getStoreConfig(),
  ]);

  const sections: PageSection[] =
    config.page_sections && config.page_sections.length > 0
      ? [...config.page_sections].sort((a, b) => a.order - b.order)
      : DEFAULT_SECTIONS;

  const highlightPixPrice = products[0]?.pixPrice;

  return (
    <>
      <Navbar />
      <main>
        <PreviewWrapper products={products} highlightPixPrice={highlightPixPrice}>
          {sections
            .filter((s) => s.enabled)
            .map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                products={products}
                highlightPixPrice={highlightPixPrice}
              />
            ))}
        </PreviewWrapper>
      </main>
      <StoreFooter />
    </>
  );
}
