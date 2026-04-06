---
phase: 10
plan: "02"
subsystem: storefront
tags: [layout, metadata, css-vars, tenant, seo]
key-files:
  modified:
    - src/app/layout.tsx
decisions:
  - Mantidos todos os providers e scripts existentes (MetaPixel, KwaiPixel, ToastProvider, Kwai SDK)
  - CSS vars injetadas via style prop no elemento html com cast React.CSSProperties
  - generateMetadata usa ?? para fallback nos campos seo_title e seo_description
---

# Phase 10 Plan 02: Layout Dinâmico — Metadata + CSS Vars + TenantProvider Summary

**One-liner:** Layout raiz agora é async e carrega configuração do tenant do Supabase para metadata SEO dinâmica, CSS vars de cor e contexto React via TenantProvider.

## O que foi feito

- `export const metadata` removido e substituído por `export async function generateMetadata()` que chama `getStoreConfig()` e usa `config.seo_title` / `config.seo_description` com fallback para os valores estáticos anteriores.
- `RootLayout` convertido para `async function` que chama `getStoreConfig()` uma vez (a segunda chamada é independente; o Next.js deduplica via cache de fetch/render).
- CSS vars `--store-primary` e `--store-accent` injetadas via `style` prop no elemento `<html>`, usando `primary_color` e `accent_color` do config com fallback para as cores padrão.
- Children envoltos com `<TenantProvider config={config}>` dentro do `<body>`, mantendo MetaPixel, KwaiPixel e ToastProvider no lugar correto.
- Todos os imports, fontes, scripts Kwai, preconnects e JSON-LD preservados sem alteração.

## Verificações

- TypeScript: 0 erros (`npx tsc --noEmit`)
- Build: 0 erros, 0 warnings (`next build`)

## Deviations from Plan

None — plano executado exatamente como escrito.

## Commits

- `eeadeef` — feat(storefront): dynamic layout with metadata + CSS vars + TenantProvider [10-02]

## Self-Check: PASSED
