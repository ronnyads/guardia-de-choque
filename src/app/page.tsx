import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import HeroSection from "@/components/home/HeroSection";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import ProductScroll from "@/components/home/ProductScroll";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ShippingBanner from "@/components/home/ShippingBanner";
import Testimonials from "@/components/home/Testimonials";
import BrandStory from "@/components/home/BrandStory";
import TrustBar from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* pt-[104px] = 40px announcement strip + 56px navbar */}
      <main className="pt-[104px]">
        <HeroSection />
        <AnnouncementBar />
        <ProductScroll title="Mais Vendidos" subtitle="Os favoritos da família Oliveira" />
        <FeaturedBanner />
        <CategoryGrid />
        <ProductScroll title="Novidades" subtitle="Confira o que acabou de chegar" />
        <ShippingBanner />
        <Testimonials />
        <BrandStory />
        <TrustBar />
      </main>
      <StoreFooter />
    </>
  );
}
