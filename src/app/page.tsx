import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import HeroSection from "@/components/home/HeroSection";
import ProductScroll from "@/components/home/ProductScroll";
import TrustBar from "@/components/home/TrustBar";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import ShippingBanner from "@/components/home/ShippingBanner";
import Testimonials from "@/components/home/Testimonials";
import BrandStory from "@/components/home/BrandStory";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AnnouncementBar />
        <ProductScroll title="Mais Vendidos" subtitle="Os favoritos da família Oliveira" />
        <TrustBar />
        <FeaturedBanner />
        <ProductScroll title="Novidades" subtitle="Confira o que acabou de chegar" />
        <ShippingBanner />
        <Testimonials />
        <BrandStory />
      </main>
      <StoreFooter />
    </>
  );
}
