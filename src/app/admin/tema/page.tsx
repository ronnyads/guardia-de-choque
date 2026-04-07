'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Monitor, Tablet, Smartphone, CheckCircle, Loader2,
  GripVertical, Eye, EyeOff, Trash2, Plus, ChevronLeft,
  Layers, ShoppingBag, ShieldCheck, Star, MessageSquare, Heart,
  CreditCard, Mail, Type, Image, Minus, Settings2,
} from 'lucide-react';
import { updateBrandConfig } from '@/app/admin/settings/actions';
import { updatePageSections, updateHeaderConfig, updateFooterConfig } from '@/app/admin/settings/actions';
import {
  DEFAULT_SECTIONS, SECTION_META, SECTION_DEFAULTS,
  type PageSection, type SectionType,
  type HeroConfig, type TrustBarConfig, type TrustBarItem,
  type FeaturedBannerConfig, type TestimonialsConfig, type TestimonialReview,
  type BrandStoryConfig, type ShippingBannerConfig, type NewsletterConfig,
  type ProductScrollConfig, type DividerConfig, type RichTextConfig, type ImageBannerConfig,
  type HeaderConfig, type FooterConfig, type NavLink,
} from '@/types/sections';

// ── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { name: 'Onyx',    primary: '#09090B', accent: '#16A34A' },
  { name: 'Navy',    primary: '#0F172A', accent: '#059669' },
  { name: 'Rosa',    primary: '#BE185D', accent: '#DB2777' },
  { name: 'Vinho',   primary: '#7F1D1D', accent: '#DC2626' },
  { name: 'Ardósia', primary: '#1E293B', accent: '#0EA5E9' },
];

const FONTS = [
  'Playfair Display', 'DM Sans', 'Inter', 'Roboto', 'Lora',
  'Montserrat', 'Open Sans', 'Merriweather', 'Raleway',
];

const SECTION_ICONS: Record<SectionType, React.ElementType> = {
  'hero':            Layers,
  'product-scroll':  ShoppingBag,
  'trust-bar':       ShieldCheck,
  'featured-banner': Star,
  'testimonials':    MessageSquare,
  'brand-story':     Heart,
  'shipping-banner': CreditCard,
  'newsletter':      Mail,
  'divider':         Minus,
  'rich-text':       Type,
  'image-banner':    Image,
};

// ── Styled helpers ───────────────────────────────────────────────────────────

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] w-full bg-white transition-colors';
const labelCls = 'block text-[10px] font-bold text-[#374151] mb-1 uppercase tracking-wider';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </Field>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <Field label={label}>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${inputCls} resize-none`} />
    </Field>
  );
}

// ── Section config panels ────────────────────────────────────────────────────

function HeroPanel({ config, onChange }: { config: HeroConfig; onChange: (c: HeroConfig) => void }) {
  const c = config;
  const set = (key: keyof HeroConfig, val: unknown) => onChange({ ...c, [key]: val });

  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Headline" value={c.headline ?? ''} onChange={v => set('headline', v)} placeholder="Produtos que fazem diferença…" />
      <TextArea label="Subheadline" value={c.subheadline ?? ''} onChange={v => set('subheadline', v)} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Texto do CTA" value={c.cta_text ?? ''} onChange={v => set('cta_text', v)} placeholder="Ver Coleção" />
        <TextInput label="Link do CTA" value={c.cta_link ?? ''} onChange={v => set('cta_link', v)} placeholder="/loja" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="CTA secundário" value={c.cta_secondary_text ?? ''} onChange={v => set('cta_secondary_text', v)} placeholder="Mais Vendidos" />
        <TextInput label="Link secundário" value={c.cta_secondary_link ?? ''} onChange={v => set('cta_secondary_link', v)} placeholder="/loja" />
      </div>

      {/* Trust pills */}
      <div>
        <label className={labelCls}>Pills de confiança</label>
        <div className="flex flex-col gap-1.5 mt-1">
          {(c.trust_pills ?? []).map((p, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input type="text" value={p.label} onChange={e => {
                const pills = [...(c.trust_pills ?? [])];
                pills[i] = { label: e.target.value };
                set('trust_pills', pills);
              }} className={inputCls} />
              <button onClick={() => {
                const pills = (c.trust_pills ?? []).filter((_, j) => j !== i);
                set('trust_pills', pills);
              }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={() => set('trust_pills', [...(c.trust_pills ?? []), { label: 'Nova pill' }])}
            className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar pill
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div>
        <label className={labelCls}>Cards de estatísticas</label>
        <div className="flex flex-col gap-1.5 mt-1">
          {(c.stat_cards ?? []).map((s, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input type="text" value={s.value} onChange={e => {
                const cards = [...(c.stat_cards ?? [])];
                cards[i] = { ...cards[i], value: e.target.value };
                set('stat_cards', cards);
              }} className={inputCls} placeholder="2.000+" />
              <input type="text" value={s.label} onChange={e => {
                const cards = [...(c.stat_cards ?? [])];
                cards[i] = { ...cards[i], label: e.target.value };
                set('stat_cards', cards);
              }} className={inputCls} placeholder="Pedidos" />
              <button onClick={() => {
                const cards = (c.stat_cards ?? []).filter((_, j) => j !== i);
                set('stat_cards', cards);
              }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={() => set('stat_cards', [...(c.stat_cards ?? []), { value: '', label: '' }])}
            className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar card
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductScrollPanel({ config, onChange }: { config: ProductScrollConfig; onChange: (c: ProductScrollConfig) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Título" value={config.title ?? ''} onChange={v => onChange({ ...config, title: v })} placeholder="Mais Vendidos" />
      <TextInput label="Subtítulo" value={config.subtitle ?? ''} onChange={v => onChange({ ...config, subtitle: v })} placeholder="Os favoritos de quem já comprou" />
    </div>
  );
}

function TrustBarPanel({ config, onChange }: { config: TrustBarConfig; onChange: (c: TrustBarConfig) => void }) {
  const c = config;
  const items = c.items ?? [];
  const ICONS = ['truck', 'shield', 'refresh', 'headphones'];

  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Título" value={c.title ?? ''} onChange={v => onChange({ ...c, title: v })} />
      <TextInput label="Subtítulo (eyebrow)" value={c.subtitle ?? ''} onChange={v => onChange({ ...c, subtitle: v })} />
      <div>
        <label className={labelCls}>Itens de benefício</label>
        <div className="flex flex-col gap-3 mt-1">
          {items.map((item, i) => (
            <div key={i} className="border border-[#E2E8F0] rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <select value={item.icon} onChange={e => {
                  const next = [...items]; next[i] = { ...next[i], icon: e.target.value };
                  onChange({ ...c, items: next });
                }} className={`${inputCls} w-auto`}>
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <button onClick={() => onChange({ ...c, items: items.filter((_, j) => j !== i) })}
                  className="p-1 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <input type="text" value={item.title} onChange={e => {
                const next = [...items]; next[i] = { ...next[i], title: e.target.value };
                onChange({ ...c, items: next });
              }} placeholder="Título" className={inputCls} />
              <textarea value={item.description} onChange={e => {
                const next = [...items]; next[i] = { ...next[i], description: e.target.value };
                onChange({ ...c, items: next });
              }} placeholder="Descrição" rows={2} className={`${inputCls} resize-none`} />
            </div>
          ))}
          <button onClick={() => onChange({ ...c, items: [...items, { icon: 'shield', title: '', description: '' } as TrustBarItem] })}
            className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar item
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedBannerPanel({ config, onChange }: { config: FeaturedBannerConfig; onChange: (c: FeaturedBannerConfig) => void }) {
  const c = config;
  const s = (key: keyof FeaturedBannerConfig, val: string) => onChange({ ...c, [key]: val });
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Eyebrow" value={c.eyebrow ?? ''} onChange={v => s('eyebrow', v)} placeholder="Destaque da semana" />
      <TextInput label="Badge (ex: -35% OFF)" value={c.badge_text ?? ''} onChange={v => s('badge_text', v)} />
      <TextInput label="Título" value={c.title ?? ''} onChange={v => s('title', v)} />
      <TextArea label="Descrição" value={c.description ?? ''} onChange={v => s('description', v)} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Preço" value={c.price ?? ''} onChange={v => s('price', v)} placeholder="R$ 169,90" />
        <TextInput label="Preço original" value={c.original_price ?? ''} onChange={v => s('original_price', v)} placeholder="R$ 259,80" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Texto do CTA" value={c.cta_text ?? ''} onChange={v => s('cta_text', v)} />
        <TextInput label="Link do CTA" value={c.cta_link ?? ''} onChange={v => s('cta_link', v)} />
      </div>
      <TextInput label="URL da imagem" value={c.image_url ?? ''} onChange={v => s('image_url', v)} placeholder="/images/product/..." />
    </div>
  );
}

function TestimonialsPanel({ config, onChange }: { config: TestimonialsConfig; onChange: (c: TestimonialsConfig) => void }) {
  const c = config;
  const reviews = c.reviews ?? [];

  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Título" value={c.title ?? ''} onChange={v => onChange({ ...c, title: v })} />
      <TextInput label="Subtítulo" value={c.subtitle ?? ''} onChange={v => onChange({ ...c, subtitle: v })} />
      <div>
        <label className={labelCls}>Depoimentos ({reviews.length})</label>
        <div className="flex flex-col gap-3 mt-1">
          {reviews.map((r, i) => (
            <details key={r.id} className="border border-[#E2E8F0] rounded-xl">
              <summary className="px-3 py-2.5 cursor-pointer text-[13px] font-medium text-[#0F172A] flex items-center justify-between">
                <span>{r.name || `Depoimento ${i + 1}`}</span>
                <button onClick={(e) => { e.preventDefault(); onChange({ ...c, reviews: reviews.filter((_, j) => j !== i) }); }}
                  className="text-red-400 hover:bg-red-50 p-1 rounded-lg"><Trash2 className="w-3 h-3" /></button>
              </summary>
              <div className="px-3 pb-3 flex flex-col gap-2 border-t border-[#F1F5F9] pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={r.name} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], name: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="Nome" className={inputCls} />
                  <input type="text" value={r.initials} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], initials: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="Iniciais" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={r.city} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], city: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="Cidade, UF" className={inputCls} />
                  <input type="text" value={r.product} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], product: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="Produto" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={r.date} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], date: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="15/03/2025" className={inputCls} />
                  <select value={r.rating} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], rating: Number(e.target.value) }; onChange({ ...c, reviews: next }); }} className={inputCls}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                  </select>
                </div>
                <textarea value={r.text} onChange={e => { const next = [...reviews]; next[i] = { ...next[i], text: e.target.value }; onChange({ ...c, reviews: next }); }} placeholder="Texto do depoimento" rows={3} className={`${inputCls} resize-none`} />
              </div>
            </details>
          ))}
          <button onClick={() => onChange({ ...c, reviews: [...reviews, { id: crypto.randomUUID(), name: '', initials: '', city: '', date: '', rating: 5, product: '', text: '', verified: true } as TestimonialReview] })}
            className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
            <Plus className="w-3.5 h-3.5" /> Adicionar depoimento
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandStoryPanel({ config, onChange }: { config: BrandStoryConfig; onChange: (c: BrandStoryConfig) => void }) {
  const c = config;
  const s = (key: keyof BrandStoryConfig, val: string) => onChange({ ...c, [key]: val });
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Eyebrow" value={c.eyebrow ?? ''} onChange={v => s('eyebrow', v)} />
      <TextInput label="Headline" value={c.headline ?? ''} onChange={v => s('headline', v)} />
      <TextArea label="Corpo" value={c.body ?? ''} onChange={v => s('body', v)} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Texto do CTA" value={c.cta_text ?? ''} onChange={v => s('cta_text', v)} />
        <TextInput label="Link do CTA" value={c.cta_link ?? ''} onChange={v => s('cta_link', v)} />
      </div>
      <TextInput label="URL da imagem" value={c.image_url ?? ''} onChange={v => s('image_url', v)} placeholder="/images/product/..." />
    </div>
  );
}

function ShippingBannerPanel({ config, onChange }: { config: ShippingBannerConfig; onChange: (c: ShippingBannerConfig) => void }) {
  const c = config;
  const s = (key: keyof ShippingBannerConfig, val: string) => onChange({ ...c, [key]: val });
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Eyebrow" value={c.eyebrow ?? ''} onChange={v => s('eyebrow', v)} />
      <TextInput label="Título" value={c.title ?? ''} onChange={v => s('title', v)} />
      <TextArea label="Corpo" value={c.body ?? ''} onChange={v => s('body', v)} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Headline PIX" value={c.pix_headline ?? ''} onChange={v => s('pix_headline', v)} placeholder="5% OFF" />
        <TextInput label="Subtítulo PIX" value={c.pix_subtitle ?? ''} onChange={v => s('pix_subtitle', v)} placeholder="Instantâneo e Seguro" />
      </div>
    </div>
  );
}

function NewsletterPanel({ config, onChange }: { config: NewsletterConfig; onChange: (c: NewsletterConfig) => void }) {
  const c = config;
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Headline" value={c.headline ?? ''} onChange={v => onChange({ ...c, headline: v })} />
      <TextArea label="Subtexto" value={c.subtext ?? ''} onChange={v => onChange({ ...c, subtext: v })} />
      <TextInput label="Texto do botão" value={c.button_text ?? ''} onChange={v => onChange({ ...c, button_text: v })} placeholder="Quero receber" />
      <TextInput label="Placeholder do input" value={c.placeholder ?? ''} onChange={v => onChange({ ...c, placeholder: v })} placeholder="seu@email.com" />
    </div>
  );
}

function DividerPanel({ config, onChange }: { config: DividerConfig; onChange: (c: DividerConfig) => void }) {
  return (
    <Field label="Estilo">
      <select value={config.style ?? 'space'} onChange={e => onChange({ style: e.target.value as DividerConfig['style'] })} className={inputCls}>
        <option value="space">Espaço</option>
        <option value="line">Linha</option>
        <option value="wave">Onda</option>
      </select>
    </Field>
  );
}

function RichTextPanel({ config, onChange }: { config: RichTextConfig; onChange: (c: RichTextConfig) => void }) {
  return (
    <Field label="Conteúdo HTML">
      <textarea value={config.content ?? ''} onChange={e => onChange({ content: e.target.value })} rows={8} className={`${inputCls} resize-y font-mono text-[11px]`} placeholder="<p>Seu conteúdo aqui...</p>" />
    </Field>
  );
}

function ImageBannerPanel({ config, onChange }: { config: ImageBannerConfig; onChange: (c: ImageBannerConfig) => void }) {
  const c = config;
  return (
    <div className="flex flex-col gap-4">
      <TextInput label="URL da imagem" value={c.image_url ?? ''} onChange={v => onChange({ ...c, image_url: v })} placeholder="https://..." />
      <TextInput label="Headline" value={c.headline ?? ''} onChange={v => onChange({ ...c, headline: v })} />
      <TextInput label="Subheadline" value={c.subheadline ?? ''} onChange={v => onChange({ ...c, subheadline: v })} />
      <div className="grid grid-cols-2 gap-2">
        <TextInput label="Texto do CTA" value={c.cta_text ?? ''} onChange={v => onChange({ ...c, cta_text: v })} />
        <TextInput label="Link do CTA" value={c.cta_link ?? ''} onChange={v => onChange({ ...c, cta_link: v })} />
      </div>
      <Field label={`Opacidade do overlay (${Math.round((c.overlay_opacity ?? 0.4) * 100)}%)`}>
        <input type="range" min={0} max={1} step={0.05} value={c.overlay_opacity ?? 0.4}
          onChange={e => onChange({ ...c, overlay_opacity: parseFloat(e.target.value) })}
          className="w-full" />
      </Field>
    </div>
  );
}

function SectionConfigPanel({ section, onChange }: { section: PageSection; onChange: (config: Record<string, unknown>) => void }) {
  const type = section.type;
  const config = section.config;

  switch (type) {
    case 'hero':           return <HeroPanel config={config as HeroConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'product-scroll': return <ProductScrollPanel config={config as ProductScrollConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'trust-bar':      return <TrustBarPanel config={config as TrustBarConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'featured-banner':return <FeaturedBannerPanel config={config as FeaturedBannerConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'testimonials':   return <TestimonialsPanel config={config as TestimonialsConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'brand-story':    return <BrandStoryPanel config={config as BrandStoryConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'shipping-banner':return <ShippingBannerPanel config={config as ShippingBannerConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'newsletter':     return <NewsletterPanel config={config as NewsletterConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'divider':        return <DividerPanel config={config as DividerConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'rich-text':      return <RichTextPanel config={config as RichTextConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    case 'image-banner':   return <ImageBannerPanel config={config as ImageBannerConfig} onChange={c => onChange(c as Record<string, unknown>)} />;
    default:               return <p className="text-[13px] text-[#94A3B8]">Sem configurações disponíveis.</p>;
  }
}

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'sections' | 'style' | 'header-footer';
type SidebarView = 'list' | 'config' | 'gallery';
type HFTab = 'header' | 'footer';
type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
};

export default function ThemeEditorPage() {
  // ── Theme ──
  const [primary,     setPrimary]     = useState('#09090B');
  const [accent,      setAccent]      = useState('#16A34A');
  const [fontHeading, setFontHeading] = useState('Playfair Display');
  const [fontBody,    setFontBody]    = useState('DM Sans');
  const [brandName,   setBrandName]   = useState('');

  // ── Sections ──
  const [sections,    setSections]    = useState<PageSection[]>(DEFAULT_SECTIONS);
  const [selId,       setSelId]       = useState<string | null>(null);
  const [sideView,    setSideView]    = useState<SidebarView>('list');

  // ── Header / Footer ──
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    links: [
      { label: 'Início', href: '/' },
      { label: 'Loja', href: '/loja' },
      { label: 'Nossa História', href: '/sobre' },
      { label: 'Rastrear Pedido', href: '/rastreio' },
    ],
    announcement_messages: [],
    show_cart: true,
    show_search: true,
  });
  const [footerConfig, setFooterConfig] = useState<FooterConfig>({
    tagline: 'Produtos selecionados com o cuidado que só uma família pode oferecer.',
    social: {},
    show_payment_badges: true,
  });
  const [hfTab, setHfTab] = useState<HFTab>('header');

  // ── UI ──
  const [tab,        setTab]       = useState<Tab>('sections');
  const [viewport,   setViewport]  = useState<Viewport>('desktop');
  const [publishing, setPublishing]= useState(false);
  const [published,  setPublished] = useState(false);
  const [iframeKey,  setIframeKey] = useState(0);
  const [iframeReady,setIframeReady] = useState(false);

  // ── Drag ──
  const [dragIdx,     setDragIdx]     = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load config on mount
  useEffect(() => {
    fetch('/api/admin/theme-config')
      .then(r => r.json())
      .then(d => {
        if (d.primary_color)  setPrimary(d.primary_color);
        if (d.accent_color)   setAccent(d.accent_color);
        if (d.font_heading)   setFontHeading(d.font_heading);
        if (d.font_body)      setFontBody(d.font_body);
        if (d.brand_name)     setBrandName(d.brand_name);
        if (d.page_sections?.length) setSections(d.page_sections);
        if (d.header_config && Object.keys(d.header_config).length) setHeaderConfig(d.header_config);
        if (d.footer_config && Object.keys(d.footer_config).length) setFooterConfig(d.footer_config);
      })
      .catch(() => {});
  }, []);

  // postMessage helpers
  const pushTheme = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'THEME_UPDATE',
      vars: {
        '--store-primary':      primary,
        '--store-accent':       accent,
        '--store-font-heading': `'${fontHeading}', serif`,
        '--store-font-body':    `'${fontBody}', sans-serif`,
      },
    }, '*');
  }, [primary, accent, fontHeading, fontBody]);

  const pushSections = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SECTIONS_UPDATE', sections }, '*');
  }, [sections]);

  useEffect(() => { if (iframeReady) pushTheme(); }, [primary, accent, fontHeading, fontBody, iframeReady, pushTheme]);
  useEffect(() => { if (iframeReady) pushSections(); }, [sections, iframeReady, pushSections]);

  const handleIframeLoad = () => {
    setIframeReady(true);
    setTimeout(() => { pushTheme(); pushSections(); }, 100);
  };

  // Section helpers
  const selSection = sections.find(s => s.id === selId) ?? null;

  const updateConfig = (id: string, config: Record<string, unknown>) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, config } : s));

  const toggleEnabled = (id: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selId === id) { setSelId(null); setSideView('list'); }
  };

  const addSection = (type: SectionType) => {
    const sec: PageSection = { id: crypto.randomUUID(), type, enabled: true, order: sections.length, config: { ...SECTION_DEFAULTS[type] } };
    setSections(prev => [...prev, sec]);
    setSelId(sec.id);
    setSideView('config');
  };

  // Drag & drop
  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setSections(reordered.map((s, i) => ({ ...s, order: i })));
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // Publish
  const publish = async () => {
    setPublishing(true);
    try {
      const fd = new FormData();
      fd.set('primary_color', primary);
      fd.set('accent_color',  accent);
      fd.set('font_heading',  fontHeading);
      fd.set('font_body',     fontBody);
      if (brandName) fd.set('brand_name', brandName);
      await Promise.all([
        updateBrandConfig(fd),
        updatePageSections(sections),
        updateHeaderConfig(headerConfig),
        updateFooterConfig(footerConfig),
      ]);
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
    } catch (e) {
      alert('Erro ao publicar: ' + (e instanceof Error ? e.message : 'Tente novamente'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">

      {/* ── Topbar ─────────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
          </Link>
          <div>
            <p className="font-semibold text-[#0F172A] text-sm">Editor de Tema</p>
            <p className="text-xs text-[#94A3B8]">Alterações ao vivo — publique para salvar</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1">
          {([['sections', 'Seções'], ['style', 'Cores & Fontes'], ['header-footer', 'Header/Footer']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${tab === id ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#0F172A]'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Viewport */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as [Viewport, React.ElementType][]).map(([id, Icon]) => (
            <button key={id} onClick={() => setViewport(id)}
              className={`p-1.5 rounded-lg transition-colors ${viewport === id ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#0F172A]'}`}
              title={id}><Icon className="w-4 h-4" /></button>
          ))}
        </div>

        {/* Publish */}
        <button onClick={publish} disabled={publishing}
          className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm">
          {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : published ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : null}
          {published ? 'Publicado!' : publishing ? 'Publicando…' : 'Publicar'}
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="w-72 bg-white border-r border-[#E2E8F0] overflow-y-auto shrink-0 flex flex-col">

          {/* ── TAB: Seções ── */}
          {tab === 'sections' && (
            <>
              {/* List view */}
              {sideView === 'list' && (
                <>
                  <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
                    <p className="text-[11px] font-bold text-[#374151] uppercase tracking-wider">Seções da página</p>
                    <button onClick={() => setSideView('gallery')}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-1.5 rounded-lg transition-colors">
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {sections.sort((a, b) => a.order - b.order).map((sec, idx) => {
                      const Icon = SECTION_ICONS[sec.type] ?? Settings2;
                      const meta = SECTION_META.find(m => m.type === sec.type);
                      return (
                        <div
                          key={sec.id}
                          draggable
                          onDragStart={() => setDragIdx(idx)}
                          onDragOver={e => { e.preventDefault(); setDragOverIdx(idx); }}
                          onDrop={() => handleDrop(idx)}
                          onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                          className={`flex items-center gap-2.5 px-3 py-3 border-b border-[#F8FAFC] cursor-pointer transition-colors group ${selId === sec.id ? 'bg-[#F1F5F9]' : 'hover:bg-[#FAFAFA]'} ${dragOverIdx === idx ? 'border-t-2 border-t-[#0F172A]' : ''}`}
                          onClick={() => { setSelId(sec.id); setSideView('config'); }}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0 cursor-grab" />
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sec.enabled ? 'bg-[#F1F5F9]' : 'bg-[#F8FAFC]'}`}>
                            <Icon className={`w-3.5 h-3.5 ${sec.enabled ? 'text-[#0F172A]' : 'text-[#CBD5E1]'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-medium truncate ${sec.enabled ? 'text-[#0F172A]' : 'text-[#CBD5E1]'}`}>
                              {meta?.label ?? sec.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); toggleEnabled(sec.id); }}
                              className="p-1 hover:bg-[#E2E8F0] rounded-md text-[#64748B]" title={sec.enabled ? 'Ocultar' : 'Mostrar'}>
                              {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={e => { e.stopPropagation(); deleteSection(sec.id); }}
                              className="p-1 hover:bg-red-50 rounded-md text-red-400" title="Remover">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4">
                    <button onClick={() => { setIframeReady(false); setIframeKey(k => k + 1); }}
                      className="w-full py-2 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors">
                      Recarregar preview
                    </button>
                  </div>
                </>
              )}

              {/* Config view */}
              {sideView === 'config' && selSection && (
                <>
                  <div className="p-4 border-b border-[#F1F5F9] flex items-center gap-2">
                    <button onClick={() => { setSelId(null); setSideView('list'); }}
                      className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                      <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                    </button>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0F172A]">
                        {SECTION_META.find(m => m.type === selSection.type)?.label ?? selSection.type}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">{SECTION_META.find(m => m.type === selSection.type)?.description}</p>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    {/* Visibility toggle */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <span className="text-[12px] font-medium text-[#374151]">Visível na loja</span>
                      <button onClick={() => toggleEnabled(selSection.id)}
                        className={`w-10 h-5.5 rounded-full relative transition-colors ${selSection.enabled ? 'bg-[#0F172A]' : 'bg-[#CBD5E1]'}`}
                        style={{ width: 40, height: 22 }}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${selSection.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} style={{ width: 18, height: 18 }} />
                      </button>
                    </div>
                    <SectionConfigPanel
                      section={selSection}
                      onChange={config => updateConfig(selSection.id, config)}
                    />
                    <button onClick={() => deleteSection(selSection.id)}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-[12px] font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Remover seção
                    </button>
                  </div>
                </>
              )}

              {/* Gallery view */}
              {sideView === 'gallery' && (
                <>
                  <div className="p-4 border-b border-[#F1F5F9] flex items-center gap-2">
                    <button onClick={() => setSideView('list')}
                      className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors">
                      <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                    </button>
                    <p className="text-[13px] font-semibold text-[#0F172A]">Adicionar seção</p>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    {SECTION_META.map(meta => {
                      const Icon = SECTION_ICONS[meta.type] ?? Settings2;
                      return (
                        <button key={meta.type} onClick={() => addSection(meta.type)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#0F172A] hover:bg-[#F8FAFC] transition-all text-left group">
                          <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] group-hover:bg-[#E2E8F0] flex items-center justify-center shrink-0 transition-colors">
                            <Icon className="w-4 h-4 text-[#0F172A]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#0F172A] truncate">{meta.label}</p>
                            <p className="text-[11px] text-[#94A3B8] truncate">{meta.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── TAB: Cores & Fontes ── */}
          {tab === 'style' && (
            <>
              {/* Presets */}
              <div className="p-5 border-b border-[#F1F5F9]">
                <p className="block text-[10px] font-bold text-[#374151] mb-2 uppercase tracking-wider">Presets</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {PRESETS.map(p => (
                    <button key={p.name} onClick={() => { setPrimary(p.primary); setAccent(p.accent); }}
                      title={p.name}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:border-[#0F172A] ${primary === p.primary ? 'border-[#0F172A]' : 'border-[#E2E8F0]'}`}>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ background: p.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: p.accent }} />
                      </div>
                      <span className="text-[10px] font-medium text-[#64748B]">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="p-5 border-b border-[#F1F5F9]">
                <p className="block text-[10px] font-bold text-[#374151] mb-2 uppercase tracking-wider">Cores</p>
                <div className="flex flex-col gap-3 mt-2">
                  {([['Cor Principal', primary, setPrimary], ['Cor de Destaque', accent, setAccent]] as [string, string, (v: string) => void][]).map(([label, val, setter]) => (
                    <div key={label}>
                      <label className="text-xs text-[#64748B] mb-1 block">{label}</label>
                      <div className="flex items-center gap-2 p-2 border border-[#E2E8F0] rounded-lg bg-white">
                        <input type="color" value={val} onChange={e => setter(e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer shrink-0" />
                        <span className="text-xs font-mono text-[#475569]">{val}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl flex flex-col gap-2">
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Preview</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold" style={{ background: primary }}>Principal</div>
                    <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold" style={{ background: accent }}>Destaque</div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="p-5 border-b border-[#F1F5F9]">
                <p className="block text-[10px] font-bold text-[#374151] mb-2 uppercase tracking-wider">Tipografia</p>
                <div className="flex flex-col gap-3 mt-2">
                  {([['Fonte — Títulos', fontHeading, setFontHeading], ['Fonte — Corpo', fontBody, setFontBody]] as [string, string, (v: string) => void][]).map(([label, val, setter]) => (
                    <div key={label}>
                      <label className="text-xs text-[#64748B] mb-1 block">{label}</label>
                      <select value={val} onChange={e => setter(e.target.value)} className={inputCls}>
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand name */}
              <div className="p-5">
                <p className="block text-[10px] font-bold text-[#374151] mb-2 uppercase tracking-wider">Loja</p>
                <div className="mt-2">
                  <label className="text-xs text-[#64748B] mb-1 block">Nome da Loja</label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} className={inputCls} placeholder="Ex: Guardiã de Choque" />
                </div>
              </div>
            </>
          )}

          {/* ── TAB: Header/Footer ── */}
          {tab === 'header-footer' && (
            <>
              <div className="flex border-b border-[#E2E8F0]">
                {(['header', 'footer'] as HFTab[]).map(t => (
                  <button key={t} onClick={() => setHfTab(t)}
                    className={`flex-1 py-3 text-[12px] font-semibold transition-colors ${hfTab === t ? 'text-[#0F172A] border-b-2 border-[#0F172A]' : 'text-[#94A3B8]'}`}>
                    {t === 'header' ? 'Header' : 'Footer'}
                  </button>
                ))}
              </div>

              {hfTab === 'header' && (
                <div className="p-4 flex flex-col gap-5">
                  {/* Nav links */}
                  <div>
                    <label className={labelCls}>Links de navegação</label>
                    <div className="flex flex-col gap-1.5 mt-1">
                      {(headerConfig.links ?? []).map((link, i) => (
                        <div key={i} className="flex gap-1.5 items-center">
                          <input type="text" value={link.label} onChange={e => {
                            const links = [...(headerConfig.links ?? [])];
                            links[i] = { ...links[i], label: e.target.value };
                            setHeaderConfig({ ...headerConfig, links });
                          }} placeholder="Rótulo" className={inputCls} />
                          <input type="text" value={link.href} onChange={e => {
                            const links = [...(headerConfig.links ?? [])];
                            links[i] = { ...links[i], href: e.target.value };
                            setHeaderConfig({ ...headerConfig, links });
                          }} placeholder="/loja" className={inputCls} />
                          <button onClick={() => setHeaderConfig({ ...headerConfig, links: (headerConfig.links ?? []).filter((_, j) => j !== i) })}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                      <button onClick={() => setHeaderConfig({ ...headerConfig, links: [...(headerConfig.links ?? []), { label: '', href: '/' } as NavLink] })}
                        className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
                        <Plus className="w-3.5 h-3.5" /> Adicionar link
                      </button>
                    </div>
                  </div>

                  {/* Announcement messages */}
                  <div>
                    <label className={labelCls}>Mensagens do banner (topo)</label>
                    <div className="flex flex-col gap-1.5 mt-1">
                      {(headerConfig.announcement_messages ?? []).map((msg, i) => (
                        <div key={i} className="flex gap-1.5 items-center">
                          <input type="text" value={msg} onChange={e => {
                            const msgs = [...(headerConfig.announcement_messages ?? [])];
                            msgs[i] = e.target.value;
                            setHeaderConfig({ ...headerConfig, announcement_messages: msgs });
                          }} className={inputCls} />
                          <button onClick={() => setHeaderConfig({ ...headerConfig, announcement_messages: (headerConfig.announcement_messages ?? []).filter((_, j) => j !== i) })}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                      <button onClick={() => setHeaderConfig({ ...headerConfig, announcement_messages: [...(headerConfig.announcement_messages ?? []), ''] })}
                        className="flex items-center gap-1.5 text-[12px] text-[#64748B] hover:text-[#0F172A] py-1">
                        <Plus className="w-3.5 h-3.5" /> Adicionar mensagem
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {hfTab === 'footer' && (
                <div className="p-4 flex flex-col gap-5">
                  <TextArea label="Tagline" value={footerConfig.tagline ?? ''} onChange={v => setFooterConfig({ ...footerConfig, tagline: v })} placeholder="Produtos selecionados com cuidado…" rows={2} />

                  {/* Social */}
                  <div>
                    <label className={labelCls}>Redes sociais</label>
                    <div className="flex flex-col gap-2 mt-1">
                      {([['instagram', 'Instagram'], ['facebook', 'Facebook'], ['whatsapp', 'WhatsApp']] as [keyof NonNullable<FooterConfig['social']>, string][]).map(([key, label]) => (
                        <div key={key}>
                          <label className="text-[10px] text-[#94A3B8] mb-0.5 block">{label}</label>
                          <input type="text" value={footerConfig.social?.[key] ?? ''} onChange={e => setFooterConfig({ ...footerConfig, social: { ...footerConfig.social, [key]: e.target.value } })} className={inputCls} placeholder={`URL do ${label}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment badges toggle */}
                  <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    <span className="text-[12px] font-medium text-[#374151]">Mostrar bandeiras de pagamento</span>
                    <button onClick={() => setFooterConfig({ ...footerConfig, show_payment_badges: !footerConfig.show_payment_badges })}
                      className={`relative transition-colors rounded-full`}
                      style={{ width: 40, height: 22, background: footerConfig.show_payment_badges ? '#0F172A' : '#CBD5E1' }}>
                      <span className={`absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${footerConfig.show_payment_badges ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </aside>

        {/* ── Preview iframe ──────────────────────────────────── */}
        <div className="flex-1 bg-[#E2E8F0] overflow-auto flex items-start justify-center p-4">
          <div
            className="bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 h-full"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              minWidth: viewport === 'desktop' ? '800px' : undefined,
              maxWidth: '100%',
            }}
          >
            {!iframeReady && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
              </div>
            )}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src="/"
              className="w-full border-0"
              style={{ height: 'calc(100vh - 120px)', display: iframeReady ? 'block' : 'none' }}
              onLoad={handleIframeLoad}
              title="Preview da loja"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
