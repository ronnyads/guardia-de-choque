import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/analytics/MetaPixel";
import ToastProvider from "@/components/ui/ToastProvider";

// UI/UX Pro Max: DM Sans — premium, modern, clean, sophisticated
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Headings: Playfair Display — tradição familiar brasileira
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
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
    <html lang="pt-BR" className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}>
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
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <MetaPixel />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
