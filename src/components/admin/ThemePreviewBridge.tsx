'use client';

import { useEffect } from 'react';

export default function ThemePreviewBridge() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== 'THEME_UPDATE') return;
      const root = document.documentElement;
      const vars = e.data.vars as Record<string, string>;
      Object.entries(vars).forEach(([k, v]) => {
        root.style.setProperty(k, v);
      });
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return null;
}
