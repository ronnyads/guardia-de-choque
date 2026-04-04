import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Users } from "lucide-react";

const stats = [
  { icon: ShieldCheck, value: "100%",  label: "Qualidade garantida" },
  { icon: Star,        value: "4.8★",  label: "Avaliação média"     },
  { icon: Users,       value: "+2 mil", label: "Famílias atendidas"  },
];

export default function BrandStory() {
  return (
    <section className="bg-surface border-y border-border py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-elevated aspect-[4/3] border border-border">
            <Image
              src="/images/product/kit-completo.png"
              alt="Produtos Os Oliveiras — kit completo"
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay badge */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-text-muted">Aprovado pela família</p>
              <p className="font-bold text-foreground text-sm">Os Oliveiras</p>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                Nossa História
              </span>
              <h2 className="text-3xl md:text-4xl text-foreground mt-3 leading-snug">
                Qualidade não precisa{" "}
                <em className="text-accent">custar uma fortuna.</em>
              </h2>
            </div>

            <p className="text-text-body leading-relaxed">
              A família Oliveira acredita que todo brasileiro merece ter acesso a produtos
              de qualidade, com segurança garantida e atendimento humano. Cada item no
              nosso catálogo é testado e aprovado antes de chegar até você.
            </p>

            <p className="text-text-secondary leading-relaxed text-sm">
              Porque quando a família Oliveira recomenda — você pode confiar.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 bg-background border border-border rounded-xl p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-accent" aria-hidden />
                  <span className="font-bold text-foreground text-lg">{value}</span>
                  <span className="text-xs text-text-muted leading-tight">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:gap-3 transition-all duration-150 w-fit"
            >
              Conheça nossa história
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
