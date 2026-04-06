---
phase: "10"
plan: "01"
subsystem: storefront-dinamica
tags: [store-config, tenant-provider, context, react]
dependency_graph:
  requires: [src/types/tenant.ts, src/lib/supabase-server.ts]
  provides: [src/lib/store-config.ts, src/components/providers/TenantProvider.tsx]
  affects: [storefront layouts, server components que precisam de config]
tech_stack:
  added: []
  patterns: [React Context + hook pattern, server-side config fetch com fallback]
key_files:
  created:
    - src/lib/store-config.ts
    - src/components/providers/TenantProvider.tsx
  modified: []
decisions:
  - DEFAULT_CONFIG usa brand_name e seo_title como string (nao null) pois sao defaults validos
metrics:
  duration: "~5min"
  completed: "2026-04-05"
  tasks: 3
  files: 2
---

# Phase 10 Plan 01: Foundation — store-config.ts + TenantProvider Summary

**One-liner:** Busca de config do tenant via Supabase service role com fallback DEFAULT_CONFIG e provider React com hook useStoreConfig().

## O que foi feito

### Task 1 — src/lib/store-config.ts
Função `getStoreConfig(slug?)` que:
1. Resolve o slug (argumento > env STORE_SLUG > 'guardia-de-choque')
2. Busca o tenant por slug na tabela `tenants`
3. Busca a config na tabela `tenant_config` pelo tenant_id
4. Retorna DEFAULT_CONFIG em qualquer falha (tenant não encontrado, config ausente, erro de rede)

O `DEFAULT_CONFIG` foi alinhado exatamente com os campos reais de `TenantConfig` em `src/types/tenant.ts`, incluindo `brand_name: string | null` e `seo_title: string | null`.

### Task 2 — src/components/providers/TenantProvider.tsx
Componente client-side `TenantProvider` que envolve a árvore com o contexto de config. Hook `useStoreConfig()` com erro descritivo se usado fora do provider.

### Task 3 — TypeScript
Zero erros de compilação.

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Mensagem |
|------|----------|
| 3c755ee | feat(storefront): add store-config.ts + TenantProvider [10-01] |

## Self-Check: PASSED

- [x] src/lib/store-config.ts existe e exporta getStoreConfig()
- [x] src/components/providers/TenantProvider.tsx existe com 'use client'
- [x] useStoreConfig() exportado pelo TenantProvider
- [x] TypeScript compila com 0 erros
