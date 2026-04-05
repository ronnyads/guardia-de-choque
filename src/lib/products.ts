import { StoreProduct } from "@/types";

export const storeProducts: StoreProduct[] = [
  {
    id: "guardia-de-choque",
    name: "Guardiã de Choque — Individual",
    slug: "guardia-de-choque",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Aparelho de defesa pessoal recarregável com arco elétrico potente, lanterna LED e trava de segurança. Coldre incluso.",
    longDescription: `A Guardiã de Choque é o equipamento de defesa pessoal mais completo do mercado. Com 16cm de comprimento, cabe na bolsa e no bolso com facilidade.\n\nO arco elétrico visível e o som intimidador neutralizam ameaças antes mesmo do contato. A trava dupla de segurança evita acionamentos acidentais, e a bateria recarregável via USB garante que você nunca fique sem proteção.\n\nLegal no Brasil para uso civil. Mais de 2.000 unidades vendidas com 4.7 estrelas de avaliação.`,
    images: [
      "/images/product/kit-individual.png",
      "/images/product/guardia-1.png",
      "/images/product/hero-product.png",
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
    id: "kit-dupla",
    name: "Kit Dupla Proteção",
    slug: "kit-dupla",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Dois aparelhos Guardiã de Choque completos. Proteja você e quem você ama. Coldre duplo incluso.",
    longDescription: `O Kit Dupla é a escolha de quem leva a segurança da família a sério. Dois aparelhos Guardiã de Choque completos, cada um com coldre e cabo USB.\n\nPague por dois e leve dois — com desconto especial de kit. Ideal para casais, mãe e filha, ou simplesmente ter um de reserva.\n\nR$ 84,95 por unidade. A melhor relação custo-benefício do catálogo.`,
    images: [
      "/images/product/kit-dupla-foto.png",
      "/images/product/guardia-1.png",
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
      { icon: "tag", title: "R$ 84,95 por unidade", description: "Melhor custo-benefício do catálogo" },
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
  {
    id: "kit-familia",
    name: "Kit Família",
    slug: "kit-familia",
    category: "defesa-pessoal",
    categoryName: "Defesa Pessoal",
    description: "Três aparelhos Guardiã de Choque. Proteção completa para toda a família. O melhor custo-benefício do catálogo.",
    longDescription: `O Kit Família foi criado para quem leva a segurança de todos a sério. Três aparelhos Guardiã de Choque completos, cada um com coldre e cabo USB.\n\nR$ 75,96 por unidade — o menor preço por aparelho do catálogo. Ideal para toda a família estar protegida.\n\nEnvio rápido para todo o Brasil. Frete grátis incluso.`,
    images: [
      "/images/product/kit-familia-foto.png",
      "/images/product/guardia-1.png",
      "/images/product/kit-trio.png",
    ],
    price: 227.90,
    originalPrice: 389.70,
    pixPrice: 216.50,
    installments: { count: 6, value: 37.98 },
    rating: 4.9,
    reviewCount: 98,
    badge: "Kit",
    inStock: true,
    quantity: 3,
    features: [
      { icon: "users", title: "3 Aparelhos Completos", description: "Cada um com coldre e cabo USB inclusos" },
      { icon: "tag", title: "R$ 75,96 por unidade", description: "Menor preço por aparelho do catálogo" },
      { icon: "shield", title: "Família Protegida", description: "Proteção total para toda a família" },
      { icon: "gift", title: "Presente Ideal", description: "Surpreenda quem você ama com segurança" },
    ],
    specs: [
      { label: "Conteúdo", value: "3x Guardiã de Choque + 3x Coldre + 3x Cabo USB" },
      { label: "Comprimento", value: "16 cm cada" },
      { label: "Bateria", value: "Recarregável USB" },
      { label: "Garantia", value: "3 meses cada" },
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
];

import { supabase } from "./supabase";

export async function getProductBySlug(slug: string): Promise<StoreProduct | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  
  // Mapeamento pra manter a tipagem original do StoreProduct
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category: data.category_id,
    categoryName: "Categoria", // mock or join in the future
    description: data.description,
    longDescription: data.long_description || data.description,
    images: data.images,
    price: data.promo_price,
    originalPrice: data.original_price,
    pixPrice: data.cost_price, // temporarily storing it here
    installments: { count: 12, value: data.promo_price / 12 },
    rating: data.rating,
    reviewCount: data.review_count,
    badge: data.badge,
    inStock: true,
    features: data.features || [],
    specs: data.specs || []
  };
}

export function getProductsByCategory(categorySlug: string): StoreProduct[] {
  return storeProducts.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): StoreProduct[] {
  return storeProducts.filter((p) => p.inStock);
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<StoreProduct[]> {
  const product = await getProductBySlug(slug);
  if (!product) return [];
  
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category)
    .neq("slug", slug)
    .limit(limit);

  if (!data) return [];
  
  return data.map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.category_id,
    categoryName: "Categoria",
    description: d.description,
    longDescription: d.long_description || d.description,
    images: d.images,
    price: d.promo_price,
    originalPrice: d.original_price,
    pixPrice: d.cost_price,
    installments: { count: 12, value: d.promo_price / 12 },
    rating: d.rating,
    reviewCount: d.review_count,
    badge: d.badge,
    inStock: true,
    features: d.features || [],
    specs: d.specs || []
  }));
}
