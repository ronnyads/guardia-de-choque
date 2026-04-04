import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-elevated aspect-[4/3]">
            <Image
              src="/images/product/kit-completo.png"
              alt="Produtos Os Oliveiras"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <span className="text-accent text-sm font-bold tracking-widest uppercase">
              Nossa História
            </span>
            <h2 className="text-3xl md:text-4xl text-foreground leading-snug">
              Qualidade não precisa{" "}
              <em className="text-accent">custar uma fortuna.</em>
            </h2>
            <p className="text-text-body leading-relaxed text-lg">
              A família Oliveira acredita que todo brasileiro merece ter acesso a produtos
              de qualidade, com segurança garantida e atendimento humano.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Cada produto no nosso catálogo é cuidadosamente selecionado, testado e
              aprovado antes de chegar até você. Porque quando a família Oliveira
              recomenda — você pode confiar.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
            >
              Conheça nossa história <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
