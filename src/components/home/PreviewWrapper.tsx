'use client';

import { useState, useEffect } from 'react';
import SectionRenderer from './SectionRenderer';
import type { PageSection } from '@/types/sections';
import type { StoreProduct } from '@/types';

interface Props {
  children: React.ReactNode;
  products: StoreProduct[];
  highlightPixPrice?: number;
}

export default function PreviewWrapper({ children, products, highlightPixPrice }: Props) {
  const [previewSections, setPreviewSections] = useState<PageSection[] | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = (window as unknown as Record<string, unknown>).__previewSections;
    return Array.isArray(existing) ? (existing as PageSection[]) : null;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      setPreviewSections((e as CustomEvent<PageSection[]>).detail);
    };
    window.addEventListener('preview-sections-update', handler);
    return () => window.removeEventListener('preview-sections-update', handler);
  }, []);

  if (previewSections) {
    return (
      <>
        {previewSections
          .filter((s) => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              products={products}
              highlightPixPrice={highlightPixPrice}
            />
          ))}
      </>
    );
  }

  return <>{children}</>;
}
