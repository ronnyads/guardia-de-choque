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
  title: "Os Oliveiras | Produtos de Qualidade para sua Família",
  description:
    "A loja da família Oliveira. Produtos selecionados com qualidade garantida — defesa pessoal, tecnologia e mais. Frete rápido, pagamento seguro.",
  keywords:
    "loja online, produtos qualidade, defesa pessoal, familia oliveira, comprar online brasil",
  openGraph: {
    title: "Os Oliveiras | Qualidade que a família garante",
    description:
      "Produtos selecionados com a confiança da família Oliveira. Qualidade garantida, entrega rápida.",
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
              "@type": "Store",
              name: "Os Oliveiras",
              description: "Loja de produtos selecionados com qualidade garantida pela família Oliveira.",
              url: "https://os-oliveiras.vercel.app",
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
