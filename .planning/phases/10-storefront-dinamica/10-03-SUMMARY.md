---
phase: 10
plan: "03"
subsystem: storefront
tags: [navbar, footer, tenant, dynamic-brand, client-components]
dependency_graph:
  requires: [10-01, 10-02]
  provides: [dynamic-layout-components]
  affects: [Navbar, Footer, MobileMenu, StoreFooter]
tech_stack:
  added: []
  patterns: [useStoreConfig hook, lazy Stripe init]
key_files:
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/MobileMenu.tsx
    - src/components/layout/StoreFooter.tsx
    - src/app/api/checkout/stripe-card/route.ts
decisions:
  - Lazy Stripe initialization to prevent build failure when STRIPE_SECRET_KEY is absent
  - MobileMenu and StoreFooter also updated (found in grep scan, same scope as plan)
metrics:
  duration: ~15min
  completed: "2026-04-05"
  tasks_completed: 4
  files_modified: 5
---

# Phase 10 Plan 03: Components Dinâmicos — Navbar + Footer Summary

Dynamic brand name and announcement messages wired into all layout components (Navbar, Footer, MobileMenu, StoreFooter) via `useStoreConfig()` hook from TenantProvider.

## Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| 1 | Navbar.tsx — brand_name + announcement_messages dinâmicos | Done |
| 2 | Footer.tsx — convertido para Client Component, brand_name dinâmico | Done |
| 3 | Grep scan + MobileMenu.tsx e StoreFooter.tsx atualizados | Done |
| 4 | Build final — 0 erros TypeScript, 0 erros de build | Done |

## Commits

| Hash | Message |
|------|---------|
| 509df2b | feat(storefront): dynamic Navbar + Footer with brand name from DB [10-03] |

## Verification

- Navbar exibe `config.brand_name ?? 'Minha Loja'` (nao hardcoded)
- Navbar exibe `config.announcement_messages` do DB (fallback: "Compra 100% segura")
- Footer exibe `config.brand_name` do TenantProvider
- MobileMenu exibe `config.brand_name` do TenantProvider
- StoreFooter exibe `config.brand_name` do TenantProvider
- TypeScript: 0 erros
- Build: passou com 0 erros

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stripe lazy initialization**
- **Found during:** Task 4 (build final)
- **Issue:** `new Stripe(process.env.STRIPE_SECRET_KEY || "")` em module scope falhava no build quando a env var estava ausente — Stripe rejeita string vazia como apiKey
- **Fix:** Substituido por função `getStripe()` que instancia o cliente Stripe somente dentro do handler POST, após verificar que a key existe
- **Files modified:** `src/app/api/checkout/stripe-card/route.ts`
- **Commit:** 509df2b

**2. [Rule 2 - Scope expansion] MobileMenu.tsx e StoreFooter.tsx**
- **Found during:** Task 3 (grep scan)
- **Issue:** Dois componentes de layout adicionais tinham brand name hardcoded ("Os Oliveiras")
- **Fix:** Adicionado `useStoreConfig()` e substituidas as strings literais por `brandName`
- **Files modified:** `src/components/layout/MobileMenu.tsx`, `src/components/layout/StoreFooter.tsx`
- **Commit:** 509df2b

### Deferred (out of scope — product content)

Os seguintes arquivos contêm "Guardiã de Choque" como nome do produto (não nome da loja) — deixados para fase futura:
- `src/components/home/BrandStory.tsx`
- `src/components/home/Testimonials.tsx`
- `src/components/sections/FinalCTA.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/HowItWorks.tsx`
- `src/components/sections/KitOffers.tsx`
- `src/components/sections/ProductShowcase.tsx`

## Self-Check: PASSED

- [x] `src/components/layout/Navbar.tsx` — modificado, usa `useStoreConfig()`
- [x] `src/components/layout/Footer.tsx` — convertido para 'use client', usa `useStoreConfig()`
- [x] `src/components/layout/MobileMenu.tsx` — usa `useStoreConfig()`
- [x] `src/components/layout/StoreFooter.tsx` — convertido para 'use client', usa `useStoreConfig()`
- [x] `src/app/api/checkout/stripe-card/route.ts` — lazy Stripe init corrigido
- [x] Commit 509df2b existe
- [x] Build passa com 0 erros
