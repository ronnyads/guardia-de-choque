'use client';

import { useEffect } from 'react';

export default function ThemePreviewBridge() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // CSS variable updates
      if (e.data?.type === 'THEME_UPDATE') {
        const root = document.documentElement;
        const vars = e.data.vars as Record<string, string>;
        Object.entries(vars).forEach(([k, v]) => {
          root.style.setProperty(k, v);
        });
        return;
      }

      // Page sections update — store in window for SSR-less preview
      if (e.data?.type === 'SECTIONS_UPDATE') {
        (window as unknown as Record<string, unknown>).__previewSections = e.data.sections;
        // Dispatch custom event so the homepage SectionsPreview component can react
        window.dispatchEvent(new CustomEvent('preview-sections-update', { detail: e.data.sections }));
        return;
      }

      // Header config update
      if (e.data?.type === 'HEADER_UPDATE') {
        (window as unknown as Record<string, unknown>).__previewHeader = e.data.config;
        window.dispatchEvent(new CustomEvent('preview-header-update', { detail: e.data.config }));
        return;
      }

      // Footer config update
      if (e.data?.type === 'FOOTER_UPDATE') {
        (window as unknown as Record<string, unknown>).__previewFooter = e.data.config;
        window.dispatchEvent(new CustomEvent('preview-footer-update', { detail: e.data.config }));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return null;
}
