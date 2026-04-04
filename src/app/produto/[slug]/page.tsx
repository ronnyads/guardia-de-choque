import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";
import ProductImages from "@/components/product/ProductImages";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import StickyMobileCTA from "@/components/product/StickyMobileCTA";
import { storeProducts, getProductBySlug } from "@/lib/products";
import {
  Zap, BatteryCharging, ShieldCheck, Lightbulb,
  Minimize2, Users, Tag, Gift, Star
} from "lucide-react";

interface Props {
  params: { slug: string };
}

/* Map feature icon strings → Lucide components */
const featureIconMap: Record<string, React.ElementType> = {
  "zap":              Zap,
  "battery-charging": BatteryCharging,
  "shield":           ShieldCheck,
  "flashlight":       Lightbulb,
  "minimize":         Minimize2,
  "users":            Users,
  "tag":              Tag,
  "gift":             Gift,
};

/* Static reviews per product (extends product.rating / reviewCount as source of truth) */
const staticReviews: Record<string, Array<{ name: string; city: string; date: string; rating: number; text: string }>> = {
  "guardia-de-choque": [
    { name: "Fernanda O.",  city: "São Paulo, SP",    date: "Mar 2025", rating: 5, text: "Chegou bem embalado, exatamente como descrito. O som do arco intimida de verdade, me sinto muito mais segura saindo à noite." },
    { name: "Marcos R.",    city: "Belo Horizonte, MG", date: "Fev 2025", rating: 5, text: "Comprei para minha esposa. A trava de segurança funciona bem e o coldre é de qualidade. Recomendo demais!" },
    { name: "Juliana S.",   city: "Curitiba, PR",     date: "Jan 2025", rating: 4, text: "Produto ótimo. Só achei que poderia ter vindo com as instruções impressas, mas funcionou perfeitamente após ver o vídeo." },
    { name: "Carlos M.",    city: "Rio de Janeiro, RJ", date: "Jan 2025", rating: 5, text: "Entrega super rápida, em 3 dias estava na minha porta. Produto conforme o anúncio, bateria carregou rápido." },
  ],
  "mini-taser": [
    { name: "Ana P.",       city: "Campinas, SP",     date: "Mar 2025", rating: 5, text: "Minúsculo! Cabe no bolso do short. Arco elétrico forte para o tamanho. Muito bom." },
    { name: "Roberto S.",   city: "Salvador, BA",     date: "Fev 2025", rating: 4, text: "Bom produto, veio bem embalado. O arco faz bastante barulho, o que é ótimo para intimidar." },
  ],
  "kit-dupla": [
    { name: "Patricia L.",  city: "Fortaleza, CE",    date: "Mar 2025", rating: 5, text: "Comprei para mim e para minha filha. Ambos chegaram perfeitos, com coldre e cabo. Vale cada centavo." },
    { name: "Gustavo N.",   city: "Manaus, AM",       date: "Fev 2025", rating: 5, text: "Ótimo custo-benefício. Por esse preço, dois aparelhos de qualidade. Chegou em 4 dias." },
  ],
};

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

  const reviews    = staticReviews[params.slug] ?? [];
  const fmt        = (v: number) => v.toFixed(2).replace(".", ",");
  const lifestyleImages = product.images.slice(1); // skip first (shown in gallery)

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* ── Hero: gallery + info ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            <ProductImages images={product.images} name={product.name} />
            <div className="lg:sticky lg:top-24">
              <ProductInfo product={product} />
            </div>
          </div>
        </section>

        {/* ── Lifestyle photo grid ── */}
        {lifestyleImages.length > 0 && (
          <section className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="font-playfair text-[26px] text-[#0F172A] mb-8">Como usar</h2>
              {lifestyleImages.length === 1 ? (
                <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
                  <Image src={lifestyleImages[0]} alt={`${product.name} — uso`} fill className="object-cover" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lifestyleImages.map((img, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] ${
                        i === 0 && lifestyleImages.length >= 3 ? "col-span-2 md:col-span-1 row-span-2 aspect-[3/4]" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} — foto ${i + 2}`}
                        fill
                        className="object-contain p-6"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Features ── */}
        {product.features && product.features.length > 0 && (
          <section className="py-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="font-playfair text-[26px] text-[#0F172A] mb-8">Por que escolher a Guardiã?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {product.features.map((f) => {
                  const Icon = featureIconMap[f.icon] ?? ShieldCheck;
                  return (
                    <div key={f.title} className="flex gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" aria-hidden />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A] text-[14px] mb-1">{f.title}</p>
                        <p className="text-[13px] text-[#64748B] leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Long description ── */}
        {product.longDescription && (
          <section className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-14">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="font-playfair text-[26px] text-[#0F172A] mb-6">Sobre o Produto</h2>
              <div className="pl-5 border-l-2 border-[#0F172A] flex flex-col gap-4">
                {product.longDescription.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i} className="text-[15px] text-[#475569] leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Specifications ── */}
        {product.specs && product.specs.length > 0 && (
          <section className="py-14">
            <div className="max-w-3xl mx-auto px-4 md:px-6">
              <h2 className="font-playfair text-[26px] text-[#0F172A] mb-6">Especificações</h2>
              <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden">
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex px-6 py-3.5 text-[14px] ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}
                  >
                    <span className="w-44 text-[#475569] font-medium shrink-0">{spec.label}</span>
                    <span className="text-[#0F172A]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Reviews ── */}
        {reviews.length > 0 && (
          <section className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-14">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
              <h2 className="font-playfair text-[26px] text-[#0F172A] mb-8">Avaliações dos clientes</h2>

              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-10 p-6 bg-white border border-[#E2E8F0] rounded-2xl">
                <div className="text-center shrink-0">
                  <p className="text-[56px] font-bold text-[#0F172A] leading-none tabular-nums">{product.rating}</p>
                  <div className="flex justify-center mt-1" aria-hidden>
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1 tabular-nums">{product.reviewCount} avaliações</p>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  {[5,4,3,2,1].map((star) => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const pct   = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[11px] text-[#94A3B8] w-4 tabular-nums">{star}</span>
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B] shrink-0" aria-hidden />
                        <div className="flex-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-[#94A3B8] w-7 tabular-nums text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#0F172A] text-[13px]">{r.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{r.city}</p>
                      </div>
                      <span className="text-[11px] text-[#94A3B8]">{r.date}</span>
                    </div>
                    <div className="flex" aria-label={`${r.rating} estrelas`}>
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#E2E8F0] text-[#E2E8F0]"}`} />
                      ))}
                    </div>
                    <p className="text-[13px] text-[#475569] leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related products ── */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <RelatedProducts currentSlug={params.slug} />
          </div>
        </section>
      </main>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA product={product} />

      <StoreFooter />
    </>
  );
}
