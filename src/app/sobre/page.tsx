import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Heart, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";

export const metadata: Metadata = {
  title: "Nossa História | Os Oliveiras",
  description: "Conheça a história da família Oliveira e nossa missão de oferecer produtos de qualidade acessível para todos os brasileiros.",
};

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-surface border-b border-border py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl text-foreground leading-tight mb-6">
              A história por trás do{" "}
              <em className="text-accent">nome Oliveira</em>
            </h1>
            <p className="text-text-body text-lg leading-relaxed">
              Uma família que acredita que qualidade não deve ser privilégio de poucos.
              Nossa missão é simples: trazer produtos que a gente mesmo usaria para a
              sua casa.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Image
                  src="/images/product/kit-completo.png"
                  alt="Produtos Os Oliveiras"
                  width={600}
                  height={450}
                  className="rounded-2xl w-full h-auto"
                />
              </div>
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl text-foreground">
                  Começou com uma preocupação familiar
                </h2>
                <p className="text-text-body leading-relaxed">
                  Tudo começou quando percebemos que produtos de qualidade eram caros demais
                  e os baratos não mereciam confiança. Decidimos fazer diferente: selecionar
                  cada produto com o rigor que usaríamos para nossa própria família.
                </p>
                <p className="text-text-body leading-relaxed">
                  Hoje, cada produto que chega ao nosso catálogo passou por nós primeiro.
                  Se não usaríamos, não vendemos. É simples assim.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { icon: Shield, label: "Qualidade Garantida", value: "100%" },
                    { icon: Star, label: "Avaliação Média", value: "4.8★" },
                    { icon: Heart, label: "Famílias Atendidas", value: "+2k" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="text-center bg-surface rounded-2xl p-4">
                      <Icon className="w-6 h-6 text-accent mx-auto mb-2" />
                      <p className="font-bold text-foreground text-xl">{value}</p>
                      <p className="text-xs text-text-muted mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-surface py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl text-foreground text-center mb-12">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Confiança",
                  text: "Só vendemos o que testamos e aprovamos. Nossa reputação é construída um produto de cada vez.",
                },
                {
                  title: "Qualidade Acessível",
                  text: "Qualidade não deveria ser luxo. Trabalhamos para que produtos bons sejam acessíveis para todo brasileiro.",
                },
                {
                  title: "Atendimento Humano",
                  text: "Você fala com uma pessoa real. Respondemos com cuidado porque nos importamos de verdade.",
                },
              ].map((v) => (
                <div key={v.title} className="bg-background border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
                  <p className="text-text-body leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-3xl text-foreground mb-4">
              Venha conhecer nossos produtos
            </h2>
            <p className="text-text-secondary mb-8">
              Cada item selecionado com o cuidado de família.
            </p>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-10 py-4 rounded-xl transition-colors"
            >
              Ver Loja <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <StoreFooter />
    </>
  );
}
