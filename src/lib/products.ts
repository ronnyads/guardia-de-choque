import { StoreProduct } from "@/types";

export const storeProducts: StoreProduct[] = [
  {
    id: "guardia-de-choque",
    name: "Guardiã de Choque",
    slug: "guardia-de-choque",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Aparelho de defesa pessoal recarregável com arco elétrico potente, lanterna LED e trava de segurança. Coldre incluso.",
    longDescription: `A Guardiã de Choque é o equipamento de defesa pessoal mais completo do mercado. Com 16cm de comprimento, cabe na bolsa e no bolso com facilidade.\n\nO arco elétrico visível e o som intimidador neutralizam ameaças antes mesmo do contato. A trava dupla de segurança evita acionamentos acidentais, e a bateria recarregável via USB garante que você nunca fique sem proteção.\n\nLegal no Brasil para uso civil. Mais de 2.000 unidades vendidas com 4.7 estrelas de avaliação.`,
    images: [
      "/images/product/hero-product.png",
      "/images/product/kit-completo.png",
      "/images/product/choque-in-hand.png",
    ],
    price: 97.90,
    originalPrice: 129.90,
    pixPrice: 93.00,
    installments: { count: 3, value: 32.63 },
    rating: 4.7,
    reviewCount: 194,
    badge: "Mais Vendido",
    inStock: true,
    features: [
      { icon: "zap", title: "Arco Elétrico Potente", description: "Som e faísca visível que intimidam na hora" },
      { icon: "battery-charging", title: "Recarregável USB", description: "Bateria dura semanas. Nunca fique sem proteção" },
      { icon: "shield", title: "Trava de Segurança", description: "Dupla trava evita acionamentos acidentais" },
      { icon: "flashlight", title: "Lanterna LED", description: "Iluminação integrada para ambientes escuros" },
    ],
    specs: [
      { label: "Comprimento", value: "16 cm" },
      { label: "Peso", value: "180 g" },
      { label: "Bateria", value: "Recarregável USB" },
      { label: "Material", value: "ABS resistente a impacto" },
      { label: "Cor", value: "Preto" },
      { label: "Conteúdo", value: "Aparelho + Coldre + Cabo USB" },
      { label: "Garantia", value: "3 meses" },
    ],
  },
  {
    id: "mini-taser",
    name: "Mini Taser",
    slug: "mini-taser",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Versão compacta ultradiscreta. Cabe no bolso da calça. Perfeito para quem precisa de proteção sem chamar atenção.",
    longDescription: `O Mini Taser é a opção ideal para quem busca máxima discrição sem abrir mão da segurança. Com apenas 10cm, é o menor aparelho de defesa pessoal do nosso catálogo.\n\nApesar do tamanho reduzido, entrega o mesmo arco elétrico intimidador da linha Guardiã. Recarregável por USB e com trava de segurança integrada.\n\nIdeal como segundo aparelho de defesa ou presente para membros da família.`,
    images: [
      "/images/product/mini-taser.png",
      "/images/product/hero-product.png",
    ],
    price: 89.00,
    originalPrice: 109.00,
    pixPrice: 84.55,
    installments: { count: 3, value: 29.67 },
    rating: 4.5,
    reviewCount: 87,
    badge: "Oferta",
    inStock: true,
    features: [
      { icon: "minimize", title: "Ultra Compacto", description: "10cm — cabe no bolso da calça com facilidade" },
      { icon: "zap", title: "Arco Elétrico", description: "Potência suficiente para neutralizar qualquer ameaça" },
      { icon: "battery-charging", title: "Recarregável USB", description: "Carga completa em 1h30" },
      { icon: "shield", title: "Trava de Segurança", description: "Botão de segurança integrado" },
    ],
    specs: [
      { label: "Comprimento", value: "10 cm" },
      { label: "Peso", value: "95 g" },
      { label: "Bateria", value: "Recarregável USB" },
      { label: "Material", value: "ABS" },
      { label: "Cor", value: "Preto" },
      { label: "Conteúdo", value: "Aparelho + Cabo USB" },
      { label: "Garantia", value: "3 meses" },
    ],
  },
  {
    id: "kit-dupla",
    name: "Kit Dupla Guardiã",
    slug: "kit-dupla",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Dois aparelhos Guardiã de Choque completos. Proteja você e quem você ama. Coldre duplo incluso.",
    longDescription: `O Kit Dupla é a escolha de quem leva a segurança da família a sério. Dois aparelhos Guardiã de Choque completos, cada um com coldre e cabo USB.\n\nPague por dois e leve dois — com desconto especial de kit. Ideal para casais, mãe e filha, ou simplesmente ter um de reserva.\n\nR$ 84,95 por unidade. A melhor relação custo-benefício do catálogo.`,
    images: [
      "/images/product/kit-trio.png",
      "/images/product/kit-completo.png",
    ],
    price: 169.90,
    originalPrice: 259.80,
    pixPrice: 161.40,
    installments: { count: 6, value: 28.32 },
    rating: 4.8,
    reviewCount: 143,
    badge: "Kit",
    inStock: true,
    quantity: 2,
    features: [
      { icon: "users", title: "2 Aparelhos Completos", description: "Cada um com coldre e cabo USB inclusos" },
      { icon: "tag", title: "Preço de Kit", description: "R$ 84,95 por unidade — melhor custo-benefício" },
      { icon: "gift", title: "Presente Perfeito", description: "Ideal para presentear quem você ama" },
      { icon: "shield", title: "Dupla Proteção", description: "Você e sua família protegidos" },
    ],
    specs: [
      { label: "Conteúdo", value: "2x Guardiã de Choque + 2x Coldre + 2x Cabo USB" },
      { label: "Comprimento", value: "16 cm cada" },
      { label: "Bateria", value: "Recarregável USB" },
      { label: "Garantia", value: "3 meses cada" },
    ],
  },
];

export function getProductBySlug(slug: string): StoreProduct | undefined {
  return storeProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): StoreProduct[] {
  return storeProducts.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): StoreProduct[] {
  return storeProducts.filter((p) => p.badge === "Mais Vendido" || p.badge === "Kit");
}

export function getRelatedProducts(slug: string, limit = 3): StoreProduct[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  return storeProducts
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, limit);
}
