import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStory from "@/components/home/BrandStory";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStory />
        <Testimonials />
      </main>
      <StoreFooter />
    </>
  );
}
