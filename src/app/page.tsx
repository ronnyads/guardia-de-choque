"use client";

import ScrollSnapContainer from "@/components/layout/ScrollSnapContainer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyMobileCTA from "@/components/layout/StickyMobileCTA";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ProductShowcase from "@/components/sections/ProductShowcase";
import HowItWorks from "@/components/sections/HowItWorks";
import SocialProof from "@/components/sections/SocialProof";
import KitOffers from "@/components/sections/KitOffers";
import TrustGuarantee from "@/components/sections/TrustGuarantee";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTA from "@/components/sections/FinalCTA";
import ExitIntentModal from "@/components/downsell/ExitIntentModal";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollSnapContainer>
        <HeroSection />
        <ProblemSection />
        <ProductShowcase />
        <HowItWorks />
        <SocialProof />
        <KitOffers />
        <TrustGuarantee />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </ScrollSnapContainer>
      <StickyMobileCTA />
      <ExitIntentModal />
    </>
  );
}
