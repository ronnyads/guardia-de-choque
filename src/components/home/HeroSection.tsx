import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#F1F5F9]">
      <Link href="/loja" aria-label="Ver coleção — Frete grátis acima de R$ 199" className="block w-full cursor-pointer">
        <Image
          src="/images/product/banner-hero.png"
          alt="Frete grátis acima de R$ 199 · Ganhe 5% de desconto no pagamento via PIX — Os Oliveiras"
          width={1440}
          height={480}
          priority
          className="w-full h-auto object-cover"
          sizes="100vw"
        />
      </Link>
    </section>
  );
}
