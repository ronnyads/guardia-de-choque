export type SectionType =
  | 'hero'
  | 'product-scroll'
  | 'trust-bar'
  | 'featured-banner'
  | 'testimonials'
  | 'brand-story'
  | 'shipping-banner'
  | 'newsletter'
  | 'divider'
  | 'rich-text'
  | 'image-banner';

export interface PageSection {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

// ── Per-section config interfaces ──────────────────────────────────────────

export interface TrustPill {
  label: string;
}

export interface StatCard {
  value: string;
  label: string;
}

export interface HeroConfig {
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  cta_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  trust_pills?: TrustPill[];
  stat_cards?: StatCard[];
}

export interface ProductScrollConfig {
  title?: string;
  subtitle?: string;
}

export interface TrustBarItem {
  icon: string; // 'truck' | 'shield' | 'refresh' | 'headphones'
  title: string;
  description: string;
}

export interface TrustBarConfig {
  title?: string;
  subtitle?: string;
  items?: TrustBarItem[];
}

export interface FeaturedBannerConfig {
  eyebrow?: string;
  badge_text?: string;
  title?: string;
  description?: string;
  price?: string;
  original_price?: string;
  cta_text?: string;
  cta_link?: string;
  image_url?: string;
}

export interface TestimonialReview {
  id: string;
  name: string;
  initials: string;
  city: string;
  date: string;
  rating: number;
  product: string;
  text: string;
  verified: boolean;
}

export interface TestimonialsConfig {
  title?: string;
  subtitle?: string;
  reviews?: TestimonialReview[];
}

export interface BrandStoryConfig {
  eyebrow?: string;
  headline?: string;
  body?: string;
  cta_text?: string;
  cta_link?: string;
  image_url?: string;
}

export interface ShippingBannerConfig {
  eyebrow?: string;
  title?: string;
  body?: string;
  pix_headline?: string;
  pix_subtitle?: string;
}

export interface NewsletterConfig {
  headline?: string;
  subtext?: string;
  button_text?: string;
  placeholder?: string;
}

export interface DividerConfig {
  style?: 'line' | 'space' | 'wave';
}

export interface RichTextConfig {
  content?: string;
}

export interface ImageBannerConfig {
  image_url?: string;
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  cta_link?: string;
  overlay_opacity?: number;
}

// ── Header / Footer ─────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderConfig {
  links?: NavLink[];
  announcement_messages?: string[];
  show_cart?: boolean;
  show_search?: boolean;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface FooterConfig {
  tagline?: string;
  columns?: FooterColumn[];
  social?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  show_payment_badges?: boolean;
}

// ── Section metadata for the editor gallery ─────────────────────────────────

export interface SectionMeta {
  type: SectionType;
  label: string;
  description: string;
  icon: string; // lucide icon name
  defaultConfig: Record<string, unknown>;
}

export const SECTION_DEFAULTS: Record<SectionType, Record<string, unknown>> = {
  'hero': {
    headline: 'Produtos que fazem diferença na sua vida.',
    subheadline: 'Selecionados com critério, entregues com agilidade.',
    cta_text: 'Ver Coleção',
    cta_link: '/loja',
    cta_secondary_text: 'Mais Vendidos',
    cta_secondary_link: '/loja',
    trust_pills: [
      { label: 'Compra 100% Segura' },
      { label: 'Frete Grátis acima de R$ 199' },
      { label: 'PIX com 5% OFF' },
    ],
    stat_cards: [
      { value: '2.000+', label: 'Pedidos entregues' },
      { value: '4.8 ★',  label: 'Avaliação média' },
      { value: '48h',    label: 'Envio expresso' },
    ],
  },
  'product-scroll': {
    title: 'Mais Vendidos',
    subtitle: 'Os favoritos de quem já comprou',
  },
  'trust-bar': {
    title: 'Feito para você confiar.',
    subtitle: 'Por que comprar conosco',
    items: [
      { icon: 'truck',       title: 'Frete para todo o Brasil',   description: 'Enviamos para qualquer estado com código de rastreio. Prazo de até 12 dias úteis.' },
      { icon: 'shield',      title: 'Pagamento 100% Seguro',      description: 'Criptografia SSL e processamento via Mercado Pago. Seus dados protegidos.' },
      { icon: 'refresh',     title: '30 dias de garantia',        description: 'Não ficou satisfeito? Devolvemos o valor integral sem burocracia.' },
      { icon: 'headphones',  title: 'Suporte humano rápido',      description: 'Atendimento via WhatsApp de segunda a sábado. Resposta em até 2 horas.' },
    ],
  },
  'featured-banner': {
    eyebrow: 'Destaque da semana',
    badge_text: '-35% OFF',
    title: 'Kit Dupla Guardiã',
    description: 'Dois aparelhos completos com coldre e cabo USB. Proteja você e quem você ama.',
    price: 'R$ 169,90',
    original_price: 'R$ 259,80',
    cta_text: 'Comprar Agora',
    cta_link: '/produto/kit-dupla',
    image_url: '/images/product/kit-completo.png',
  },
  'testimonials': {
    title: 'O que a família diz',
    subtitle: 'Mais de 2.000 pedidos entregues com 4.8 estrelas de avaliação',
    reviews: [
      { id: '1', name: 'Mariana Silva', initials: 'MS', city: 'São Paulo, SP', date: '15/03/2025', rating: 5, product: 'Guardiã Individual', text: 'Chegou rapidíssimo e o produto é exatamente como descrito. Minha filha adorou.', verified: true },
      { id: '2', name: 'Carlos Eduardo', initials: 'CE', city: 'Curitiba, PR', date: '12/03/2025', rating: 5, product: 'Kit Dupla Proteção', text: 'Comprei o Kit Dupla para mim e para minha esposa. Qualidade excelente.', verified: true },
      { id: '3', name: 'Ana Beatriz', initials: 'AB', city: 'Belo Horizonte, MG', date: '10/03/2025', rating: 5, product: 'Kit Família', text: 'Produto chegou embalado com muito cuidado. O arco elétrico é potente.', verified: true },
    ],
  },
  'brand-story': {
    eyebrow: 'Nossa História',
    headline: 'Qualidade não precisa custar uma fortuna.',
    body: 'A família Oliveira acredita que todo brasileiro merece produtos de qualidade, com segurança garantida e atendimento humano.',
    cta_text: 'Conheça nossa história',
    cta_link: '/sobre',
    image_url: '/images/product/banner-historia.png',
  },
  'shipping-banner': {
    eyebrow: 'Formas de Pagamento',
    title: 'Pague do jeito que preferir',
    body: 'Aceitamos PIX com 5% de desconto, cartão de crédito em até 6x sem juros e muito mais.',
    pix_headline: '5% OFF',
    pix_subtitle: 'Instantâneo e Seguro',
  },
  'newsletter': {
    headline: 'Receba ofertas antes de todo mundo.',
    subtext: 'Mais de 1.200 pessoas já recebem nossas promoções exclusivas. Sem spam.',
    button_text: 'Quero receber',
    placeholder: 'seu@email.com',
  },
  'divider': { style: 'space' },
  'rich-text': { content: '<p>Escreva seu conteúdo aqui...</p>' },
  'image-banner': {
    image_url: '',
    headline: 'Título do Banner',
    subheadline: 'Subtítulo do banner',
    cta_text: 'Saiba mais',
    cta_link: '/loja',
    overlay_opacity: 0.4,
  },
};

export const SECTION_META: SectionMeta[] = [
  { type: 'hero',           label: 'Hero',             description: 'Seção principal com headline e CTA',    icon: 'Layers',         defaultConfig: SECTION_DEFAULTS['hero'] },
  { type: 'product-scroll', label: 'Produtos',         description: 'Grade/scroll de produtos',              icon: 'ShoppingBag',    defaultConfig: SECTION_DEFAULTS['product-scroll'] },
  { type: 'trust-bar',      label: 'Benefícios',       description: 'Barra de diferenciais da loja',         icon: 'ShieldCheck',    defaultConfig: SECTION_DEFAULTS['trust-bar'] },
  { type: 'featured-banner',label: 'Banner Destaque',  description: 'Banner com produto em destaque',        icon: 'Star',           defaultConfig: SECTION_DEFAULTS['featured-banner'] },
  { type: 'testimonials',   label: 'Depoimentos',      description: 'Grade de avaliações de clientes',       icon: 'MessageSquare',  defaultConfig: SECTION_DEFAULTS['testimonials'] },
  { type: 'brand-story',    label: 'Nossa História',   description: 'Bloco storytelling da marca',           icon: 'Heart',          defaultConfig: SECTION_DEFAULTS['brand-story'] },
  { type: 'shipping-banner',label: 'Pagamentos',       description: 'Formas de pagamento e benefícios',     icon: 'CreditCard',     defaultConfig: SECTION_DEFAULTS['shipping-banner'] },
  { type: 'newsletter',     label: 'Newsletter',       description: 'Captura de e-mail / leads',             icon: 'Mail',           defaultConfig: SECTION_DEFAULTS['newsletter'] },
  { type: 'rich-text',      label: 'Texto Livre',      description: 'Bloco de texto rico personalizável',   icon: 'Type',           defaultConfig: SECTION_DEFAULTS['rich-text'] },
  { type: 'image-banner',   label: 'Banner Imagem',    description: 'Banner com imagem de fundo e CTA',     icon: 'Image',          defaultConfig: SECTION_DEFAULTS['image-banner'] },
  { type: 'divider',        label: 'Separador',        description: 'Espaço ou linha entre seções',         icon: 'Minus',          defaultConfig: SECTION_DEFAULTS['divider'] },
];

export const DEFAULT_SECTIONS: PageSection[] = [
  { id: 'default-hero',      type: 'hero',            enabled: true, order: 0,  config: SECTION_DEFAULTS['hero'] },
  { id: 'default-scroll1',   type: 'product-scroll',  enabled: true, order: 1,  config: { title: 'Mais Vendidos', subtitle: 'Os favoritos de quem já comprou' } },
  { id: 'default-trust',     type: 'trust-bar',       enabled: true, order: 2,  config: SECTION_DEFAULTS['trust-bar'] },
  { id: 'default-banner',    type: 'featured-banner', enabled: true, order: 3,  config: SECTION_DEFAULTS['featured-banner'] },
  { id: 'default-scroll2',   type: 'product-scroll',  enabled: true, order: 4,  config: { title: 'Novidades', subtitle: 'Confira o que acabou de chegar' } },
  { id: 'default-shipping',  type: 'shipping-banner', enabled: true, order: 5,  config: SECTION_DEFAULTS['shipping-banner'] },
  { id: 'default-testimonials', type: 'testimonials', enabled: true, order: 6, config: SECTION_DEFAULTS['testimonials'] },
  { id: 'default-story',     type: 'brand-story',     enabled: true, order: 7,  config: SECTION_DEFAULTS['brand-story'] },
  { id: 'default-newsletter',type: 'newsletter',      enabled: true, order: 8,  config: SECTION_DEFAULTS['newsletter'] },
];
