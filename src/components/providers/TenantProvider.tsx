'use client';

import { createContext, useContext } from 'react';
import type { TenantConfig } from '@/types/tenant';

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({
  config,
  children,
}: {
  config: TenantConfig;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={config}>
      {children}
    </TenantContext.Provider>
  );
}

export function useStoreConfig(): TenantConfig {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useStoreConfig deve ser usado dentro de <TenantProvider>');
  }
  return ctx;
}
