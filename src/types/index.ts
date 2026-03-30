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

export interface Spec {
  label: string;
  value: string;
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
