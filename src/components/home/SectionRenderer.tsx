'use client';

import type { PageSection } from '@/types/sections';
import type { StoreProduct } from '@/types';

import HeroSection       from './HeroSection';
import ProductScroll     from './ProductScroll';
import TrustBar          from './TrustBar';
import FeaturedBanner    from './FeaturedBanner';
import Testimonials      from './Testimonials';
import BrandStory        from './BrandStory';
import ShippingBanner    from './ShippingBanner';
import NewsletterSection from './NewsletterSection';

import type { HeroConfig, ProductScrollConfig, TrustBarConfig, FeaturedBannerConfig, TestimonialsConfig, BrandStoryConfig, ShippingBannerConfig, NewsletterConfig, DividerConfig, RichTextConfig, ImageBannerConfig } from '@/types/sections';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  section: PageSection;
  products?: StoreProduct[];
  highlightPixPrice?: number;
}

export default function SectionRenderer({ section, products = [], highlightPixPrice }: Props) {
  const { type, config } = section;

  switch (type) {
    case 'hero':
      return <HeroSection config={config as HeroConfig} highlightPixPrice={highlightPixPrice} />;

    case 'product-scroll': {
      const c = config as ProductScrollConfig;
      return (
        <ProductScroll
          title={c.title ?? 'Produtos'}
          subtitle={c.subtitle ?? ''}
          products={products}
        />
      );
    }

    case 'trust-bar':
      return <TrustBar config={config as TrustBarConfig} />;

    case 'featured-banner':
      return <FeaturedBanner config={config as FeaturedBannerConfig} />;

    case 'testimonials':
      return <Testimonials config={config as TestimonialsConfig} />;

    case 'brand-story':
      return <BrandStory config={config as BrandStoryConfig} />;

    case 'shipping-banner':
      return <ShippingBanner config={config as ShippingBannerConfig} />;

    case 'newsletter':
      return <NewsletterSection config={config as NewsletterConfig} />;

    case 'divider': {
      const c = config as DividerConfig;
      if (c.style === 'line') return <hr className="border-[#E2E8F0] mx-8 md:mx-16" />;
      if (c.style === 'wave') return (
        <div className="h-12 w-full overflow-hidden" aria-hidden>
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-full" fill="#F9FAFB">
            <path d="M0,48L60,42.7C120,37,240,27,360,26.7C480,27,600,37,720,40C840,43,960,37,1080,32C1200,27,1320,21,1380,18.7L1440,16L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
          </svg>
        </div>
      );
      return <div className="h-16" aria-hidden />;
    }

    case 'rich-text': {
      const c = config as RichTextConfig;
      return (
        <section className="bg-white">
          <div
            className="container-wide section-pad prose prose-slate max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: c.content ?? '' }}
          />
        </section>
      );
    }

    case 'image-banner': {
      const c = config as ImageBannerConfig;
      if (!c.image_url) return null;
      return (
        <section className="relative w-full overflow-hidden" style={{ minHeight: '320px' }}>
          <Image
            src={c.image_url}
            alt={c.headline ?? 'Banner'}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: `rgba(0,0,0,${c.overlay_opacity ?? 0.4})` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[320px] text-center px-6 py-16 gap-4">
            {c.headline && (
              <h2 className="text-white font-bold text-3xl md:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
                {c.headline}
              </h2>
            )}
            {c.subheadline && (
              <p className="text-white/80 text-lg max-w-xl">{c.subheadline}</p>
            )}
            {c.cta_text && c.cta_link && (
              <Link href={c.cta_link} className="btn btn-white mt-2">
                {c.cta_text}
              </Link>
            )}
          </div>
        </section>
      );
    }

    default:
      return null;
  }
}
