import { Product, Kit, Review, FAQItem, Stat } from "@/types";

export const MAIN_PRODUCT: Product = {
  id: "guardia-choque-pro",
  name: "Guardiã de Choque",
  slug: "guardia-de-choque",
  description:
    "Aparelho de choque profissional recarregável para defesa pessoal. Corpo emborrachado, lanterna LED integrada e trava de segurança. Ideal para sua proteção diária.",
  originalPrice: 129,
  promoPrice: 97.9,
  features: [
    {
      icon: "Zap",
      title: "16cm de Potência",
      description: "Descarga elétrica de alta voltagem que neutraliza qualquer ameaça",
    },
    {
      icon: "BatteryCharging",
      title: "Recarregável USB",
      description: "Bateria bivolt 110/220V, sempre pronto quando você precisar",
    },
    {
      icon: "Flashlight",
      title: "Lanterna LED Cree",
      description: "Alta luminosidade com baixo consumo de energia",
    },
    {
      icon: "ShieldCheck",
      title: "Trava de Segurança",
      description: "Botão de trava impede acionamento acidental",
    },
    {
      icon: "Package",
      title: "Coldre Incluso",
      description: "Coldre protetor para transporte seguro e discreto",
    },
    {
      icon: "Scale",
      title: "Legal no Brasil",
      description: "Não é arma de fogo — livre para uso civil em todo território",
    },
  ],
  specs: [
    { label: "Tamanho", value: "16cm" },
    { label: "Alimentação", value: "Bivolt 110/220V" },
    { label: "Lanterna", value: "LED Cree alta potência" },
    { label: "Material", value: "Corpo emborrachado (grau militar)" },
    { label: "Segurança", value: "Trava anti-acionamento" },
    { label: "Acessórios", value: "Coldre + Cabo de recarga" },
  ],
  images: [
    "/images/product/choque-1.webp",
    "/images/product/choque-2.webp",
    "/images/product/choque-3.webp",
    "/images/product/choque-4.webp",
  ],
  rating: 4.7,
  reviewCount: 194,
};

export const MINI_TASER: Product = {
  id: "mini-taser",
  name: "Mini Taser Defesa Pessoal",
  slug: "mini-taser",
  description:
    "Arma de choque compacta de 10cm. 3.000KV de descarga elétrica. Perfeita para carregar no bolso ou bolsa.",
  originalPrice: 109,
  promoPrice: 89,
  features: [
    {
      icon: "Minimize2",
      title: "Ultra Compacto",
      description: "Apenas 10cm — cabe no bolso ou bolsa",
    },
    {
      icon: "Zap",
      title: "3.000KV",
      description: "Descarga elétrica de altíssima voltagem",
    },
    {
      icon: "Flashlight",
      title: "Lanterna LED",
      description: "Iluminação integrada de alta potência",
    },
  ],
  specs: [
    { label: "Tamanho", value: "10cm" },
    { label: "Voltagem", value: "3.000KV" },
    { label: "Alimentação", value: "Bivolt 110/220V" },
  ],
  images: ["/images/product/mini-taser-1.webp"],
  rating: 4.5,
  reviewCount: 87,
};

export const KITS: Kit[] = [
  {
    id: "kit-individual",
    name: "Kit Individual",
    slug: "kit-individual",
    quantity: 1,
    items: ["1x Guardiã de Choque", "1x Coldre Protetor", "1x Cabo de Recarga"],
    originalPrice: 129,
    promoPrice: 97.9,
    perUnit: 97.9,
    savings: 31.1,
    savingsPercent: 24,
    installments: { count: 3, value: 32.63 },
    pixPrice: 93.0,
  },
  {
    id: "kit-dupla",
    name: "Kit Dupla",
    slug: "kit-dupla",
    badge: "MAIS VENDIDO",
    highlighted: true,
    quantity: 2,
    items: [
      "2x Guardiã de Choque",
      "2x Coldre Protetor",
      "2x Cabo de Recarga",
    ],
    originalPrice: 258,
    promoPrice: 159.9,
    perUnit: 79.95,
    savings: 98.1,
    savingsPercent: 38,
    bonus: {
      name: "Mini Taser Defesa Pessoal",
      value: 89,
      image: "/images/product/mini-taser-1.webp",
    },
    installments: { count: 3, value: 53.3 },
    pixPrice: 151.9,
  },
  {
    id: "kit-familia",
    name: "Kit Família",
    slug: "kit-familia",
    badge: "MELHOR CUSTO-BENEFÍCIO",
    quantity: 3,
    items: [
      "3x Guardiã de Choque",
      "3x Coldre Protetor",
      "3x Cabo de Recarga",
    ],
    originalPrice: 387,
    promoPrice: 197.9,
    perUnit: 65.97,
    savings: 189.1,
    savingsPercent: 49,
    bonus: {
      name: "Mini Taser Defesa Pessoal",
      value: 89,
      image: "/images/product/mini-taser-1.webp",
    },
    installments: { count: 3, value: 65.97 },
    pixPrice: 188.0,
  },
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Carlos M.",
    location: "São Paulo, SP",
    rating: 5,
    text: "Comprei para minha esposa e ela se sente muito mais segura agora. O produto é excelente, bem acabado e a lanterna é um bônus incrível. Recomendo demais!",
    verified: true,
  },
  {
    id: "2",
    name: "Ana L.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Pequeno, discreto e potente. Trabalho à noite e agora me sinto protegida. A trava de segurança me dá tranquilidade para carregar na bolsa.",
    verified: true,
  },
  {
    id: "3",
    name: "Marcos R.",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Já tenho há 3 meses, funciona perfeitamente. O arco elétrico é impressionante — só o barulho já afasta qualquer pessoa mal-intencionada.",
    verified: true,
  },
  {
    id: "4",
    name: "Juliana S.",
    location: "Curitiba, PR",
    rating: 4,
    text: "Comprei o Kit Dupla e dei um para minha mãe. As duas estamos muito satisfeitas. O mini taser de brinde foi uma surpresa excelente!",
    verified: true,
  },
  {
    id: "5",
    name: "Roberto F.",
    location: "Salvador, BA",
    rating: 5,
    text: "Sou segurança particular e uso profissionalmente. Qualidade excelente, bateria dura bastante e o coldre é muito prático.",
    verified: true,
  },
  {
    id: "6",
    name: "Fernanda C.",
    location: "Brasília, DF",
    rating: 5,
    text: "Entrega rápida, produto bem embalado e funciona exatamente como descrito. Melhor investimento em segurança que já fiz.",
    verified: true,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "O aparelho de choque é legal no Brasil?",
    answer:
      "Sim! O aparelho de choque NÃO é classificado como arma de fogo, pois não dispara projéteis. Seu uso é permitido para civis e profissionais de segurança em todo o território nacional, sem necessidade de registro ou autorização.",
  },
  {
    question: "Como funciona a recarga?",
    answer:
      "O aparelho vem com cabo de recarga bivolt (110/220V). Basta conectar em qualquer tomada comum. Uma carga completa dura semanas em modo standby, garantindo que esteja sempre pronto quando você precisar.",
  },
  {
    question: "A lanterna LED é potente?",
    answer:
      "Sim! Utilizamos LED Cree de alta potência com baixo consumo de energia. A lanterna é ideal para iluminar ambientes escuros, servindo também como ferramenta de uso diário.",
  },
  {
    question: "O aparelho pode machucar gravemente alguém?",
    answer:
      "O aparelho foi projetado para imobilizar temporariamente, causando contração muscular involuntária sem danos permanentes. O efeito é temporário e não deixa sequelas. Importante: não deve ser utilizado por pessoas com condições cardíacas.",
  },
  {
    question: "Qual o tamanho do aparelho?",
    answer:
      "O Guardiã de Choque tem 16cm de comprimento, tamanho ideal para segurar com firmeza e transportar discretamente no coldre que acompanha o produto.",
  },
  {
    question: "O que vem incluso na compra?",
    answer:
      "Cada unidade vem com: 1x Aparelho de Choque Guardiã, 1x Coldre protetor para transporte, 1x Cabo de recarga bivolt. Nos Kits Dupla e Família, você ainda recebe um Mini Taser de brinde!",
  },
  {
    question: "Qual a política de garantia?",
    answer:
      "Oferecemos garantia de 30 dias contra defeitos de fabricação. Se o produto apresentar qualquer problema, entre em contato conosco que faremos a troca ou devolução do valor integral.",
  },
  {
    question: "Como funciona a entrega?",
    answer:
      "Enviamos para todo o Brasil via transportadora. O prazo médio é de 5 a 12 dias úteis dependendo da região. Você receberá o código de rastreio assim que o pedido for despachado.",
  },
];

export const STATS: Stat[] = [
  {
    value: "50.000+",
    numericValue: 50000,
    suffix: "+",
    label: "assaltos registrados por ano no Brasil",
    icon: "AlertTriangle",
  },
  {
    value: "1 a cada 10",
    numericValue: 10,
    suffix: " min",
    label: "uma pessoa é vítima de roubo a cada 10 minutos",
    icon: "Clock",
  },
  {
    value: "87%",
    numericValue: 87,
    suffix: "%",
    label: "das vítimas estavam completamente desprevenidas",
    icon: "ShieldOff",
  },
];

export const CHECKOUT_URLS = {
  "kit-individual": "/checkout?kit=kit-individual",
  "kit-dupla": "/checkout?kit=kit-dupla",
  "kit-familia": "/checkout?kit=kit-familia",
  "downsell": "/checkout?kit=kit-individual",
};
