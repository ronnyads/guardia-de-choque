import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import HeroSection from "@/components/home/HeroSection";
import ProductScroll from "@/components/home/ProductScroll";
import TrustBar from "@/components/home/TrustBar";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import ShippingBanner from "@/components/home/ShippingBanner";
import Testimonials from "@/components/home/Testimonials";
import BrandStory from "@/components/home/BrandStory";
import NewsletterSection from "@/components/home/NewsletterSection";
import { getFeaturedProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero cinematic — dark, full viewport */}
        <HeroSection highlightPixPrice={products[0]?.pixPrice} />

        {/* Produtos mais vendidos */}
        <ProductScroll title="Mais Vendidos" subtitle="Os favoritos de quem já comprou" products={products} />

        {/* Trust pillars — dark section */}
        <TrustBar />

        {/* Banner destaque */}
        <FeaturedBanner />

        {/* Novidades */}
        <ProductScroll title="Novidades" subtitle="Confira o que acabou de chegar" products={products} />

        {/* Formas de pagamento */}
        <ShippingBanner />

        {/* Avaliações */}
        <Testimonials />

        {/* Nossa História — banner da família */}
        <BrandStory />

        {/* Newsletter — captura de lead */}
        <NewsletterSection />
      </main>
      <StoreFooter />
    </>
  );
}
