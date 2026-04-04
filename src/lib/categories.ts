import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "defesa-pessoal",
    name: "Defesa Pessoal",
    slug: "defesa-pessoal",
    description: "Equipamentos confiáveis para sua segurança e da sua família.",
    image: "/images/product/hero-product.png",
    productCount: 3,
  },
  {
    id: "tecnologia",
    name: "Tecnologia",
    slug: "tecnologia",
    description: "Gadgets e acessórios que facilitam o seu dia a dia.",
    image: "/images/categories/tecnologia.jpg",
    productCount: 0,
  },
  {
    id: "casa",
    name: "Casa & Vida",
    slug: "casa",
    description: "Produtos que tornam o lar mais confortável e organizado.",
    image: "/images/categories/casa.jpg",
    productCount: 0,
  },
  {
    id: "bem-estar",
    name: "Bem-Estar",
    slug: "bem-estar",
    description: "Cuide de você e de quem você ama.",
    image: "/images/categories/bem-estar.jpg",
    productCount: 0,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
