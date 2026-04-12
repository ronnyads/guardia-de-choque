/* ─── Store product types ─────────────────────────────────────────── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  category: string;          // category slug
  categoryName: string;
  description: string;
  longDescription: string;
  images: string[];
  price: number;             // promo price
  originalPrice: number;
  pixPrice: number;
  installments: { count: number; value: number };
  rating: number;
  reviewCount: number;
  badge?: "Mais Vendido" | "Oferta" | "Novo" | "Kit";
  features: StoreFeature[];
  specs: Spec[];
  inStock: boolean;
  quantity?: number;         // if kit — units included
  bumpLabel?: string;
  bumpPrice?: number;
  upsellLabel?: string;
  upsellPrice?: number;
  downsellLabel?: string;
  downsellPrice?: number;
}

export interface StoreFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Spec {
  label: string;
  value: string;
}

/* ─── Cart ────────────────────────────────────────────────────────── */

export interface CartItem {
  product: StoreProduct;
  qty: number;
}

/* ─── Legacy types (sales page — keep for /checkout, /admin) ────── */

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  promoPrice: number;
  features: Feature[];
  specs: Spec[];
  images: string[];
  rating: number;
  reviewCount: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Kit {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  highlighted?: boolean;
  quantity: number;
  items: string[];
  originalPrice: number;
  promoPrice: number;
  perUnit: number;
  savings: number;
  savingsPercent: number;
  bonus?: KitBonus;
  installments: {
    count: number;
    value: number;
  };
  pixPrice: number;
}

export interface KitBonus {
  name: string;
  value: number;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  avatar?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  icon: string;
}
