import { Suspense } from "react";
import { Lock } from "lucide-react";
import ClientCheckout from "@/components/checkout/ClientCheckout";

export const metadata = {
  title: "Checkout Seguro | Os Oliveiras",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-playfair italic text-[18px] font-bold text-[#0F172A]">Os Oliveiras</span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#059669] font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Checkout 100% Seguro
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ClientCheckout />
        </Suspense>
      </main>
    </div>
  );
}
