import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/analytics/MetaPixel";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guardiã de Choque | Aparelho de Defesa Pessoal — De R$129 por R$97,90",
  description:
    "Aparelho de choque 16cm recarregável com lanterna LED e trava de segurança. Coldre incluso. Legal no Brasil. Frete rápido. 4.7 estrelas, 194 avaliações.",
  keywords:
    "aparelho de choque, defesa pessoal, segurança pessoal, taser, choque elétrico, guardiã de choque",
  openGraph: {
    title: "Guardiã de Choque | Defesa Pessoal Profissional",
    description:
      "O aparelho de defesa pessoal mais vendido do Brasil. Compacto, recarregável e legal.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Guardiã de Choque - Aparelho de Defesa Pessoal",
              description:
                "Aparelho de choque profissional recarregável 16cm com lanterna LED e trava de segurança.",
              brand: { "@type": "Brand", name: "Guardiã" },
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "97.90",
                highPrice: "227.90",
                priceCurrency: "BRL",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.7",
                reviewCount: "194",
              },
            }),
          }}
        />
      </head>
      <body className={`${montserrat.className} min-h-full flex flex-col`}>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
