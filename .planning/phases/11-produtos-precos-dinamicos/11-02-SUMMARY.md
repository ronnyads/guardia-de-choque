---
phase: 11
plan: 2
subsystem: lib/products + lib/pricing
tags: [products, pricing, supabase, dynamic-data, bug-fix]
dependency_graph:
  requires: ["11-01"]
  provides: ["11-03", "11-04"]
  affects: ["src/app/loja", "src/app/produto", "src/app/categoria", "src/app/api/checkout"]
tech_stack:
  added: []
  patterns: ["async server functions", "supabase service role for pricing", "DB-driven catalog"]
key_files:
  created: []
  modified:
    - src/lib/products.ts
    - src/lib/pricing.ts
    - src/app/loja/page.tsx
    - src/app/produto/[slug]/page.tsx
    - src/app/categoria/[slug]/page.tsx
    - src/components/home/FeaturedProducts.tsx
decisions:
  - "badge field cast to union type literal via StoreProduct['badge'] to satisfy TypeScript strict typing"
  - "FeaturedProducts.tsx converted to async Server Component — same pattern as loja/page.tsx"
  - "storeProducts kept as empty deprecated export to avoid breaking ProductScroll.tsx (client component) until plan 11-04"
metrics:
  duration: "~15 minutes"
  completed: "2026-04-05"
  tasks_completed: 2
  files_modified: 6
---

# Phase 11 Plan 02: Reescrever products.ts e pricing.ts para usar banco — Summary

Reescrita completa de `products.ts` e `pricing.ts` para eliminar dados hardcoded e buscar tudo do Supabase. Corrigido bug semântico crítico onde `pixPrice` usava `cost_price` em vez de `promo_price * 0.95`.

## What Was Built

### Task 1: Reescrita de products.ts

- Removido array `storeProducts` com 4 produtos hardcoded (~150 linhas)
- Adicionado `mapDbToStoreProduct()` — helper interno que converte row do DB para `StoreProduct`
- **Bug corrigido:** `pixPrice = promo_price * 0.95` (antes usava `cost_price` — semanticamente errado)
- `getProductBySlug()` — agora busca apenas do banco, sem fallback para array local
- `getProductsByCategory()` — convertido de sync para async, busca do banco por `category_id`
- `getFeaturedProducts()` — convertido de sync para async, busca produtos `status = active`
- `getRelatedProducts()` — mantido async, agora usa `mapDbToStoreProduct` (bug do pixPrice corrigido)
- `getAllProductSlugs()` — novo export para uso em `generateStaticParams`
- `storeProducts = []` — export vazio deprecated para não quebrar `ProductScroll.tsx` até plan 11-04

### Task 2: Reescrita de pricing.ts

- Removido `KIT_PRICES` hardcoded (era: kit-individual=97.90, kit-dupla=169.90, kit-familia=227.90)
- Adicionado `getProductPrice(slug)` — função interna async que busca `promo_price` via `createServiceSupabase()` (bypassa RLS)
- `calculateExpectedAmount()` — convertido para async, usa `getProductPrice()` em vez do dicionário local
- `validateAmount()` — convertido para async (quebra checkout routes intencionalmente — será corrigido em 11-03)
- Constantes mantidas: `ORDER_BUMP_PRICE`, `UPSELL_PRICE`, `PIX_DISCOUNT`, `AMOUNT_TOLERANCE`
- Funções de sanitize mantidas intactas: `sanitizeString`, `sanitizeEmail`, `sanitizeDocument`, `sanitizeAmount`

### Páginas atualizadas

| Arquivo | Mudança |
|---|---|
| `src/app/loja/page.tsx` | `storeProducts` → `await getFeaturedProducts()`, função tornou-se `async` |
| `src/app/produto/[slug]/page.tsx` | `generateStaticParams` usa `await getAllProductSlugs()` em vez de `storeProducts.map()` |
| `src/app/categoria/[slug]/page.tsx` | `getProductsByCategory(slug)` → `await getProductsByCategory(slug)`, removido fallback para `storeProducts` |
| `src/components/home/FeaturedProducts.tsx` | Componente tornou-se `async`, `getFeaturedProducts()` com `await` |

## Verification

- `npx tsc --noEmit` — zero erros (compilação limpa)
- `KIT_PRICES` — não existe mais em nenhum arquivo
- `cost_price` — não existe mais em products.ts ou pricing.ts
- `pixPrice` calculado como `promo_price * (1 - 0.05)` em todos os mapeamentos

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tipo literal do campo `badge` incompatível com TypeScript**
- **Found during:** Task 1, verificação tsc
- **Issue:** `String(d.badge || '')` retorna `string` genérico, mas `StoreProduct.badge` é union type `"Mais Vendido" | "Oferta" | "Novo" | "Kit" | undefined`
- **Fix:** Cast direto: `(d.badge as StoreProduct["badge"]) ?? undefined`
- **Files modified:** `src/lib/products.ts`
- **Commit:** 837e0c4

**2. [Rule 1 - Bug] FeaturedProducts.tsx chamava getFeaturedProducts() sem await**
- **Found during:** Task 1, verificação tsc
- **Issue:** `FeaturedProducts.tsx` é Server Component que chamava `getFeaturedProducts()` (agora async) sem `await`, causando erro TS2339 (`.map` não existe em `Promise`)
- **Fix:** Componente convertido para `async function`, adicionado `await`
- **Files modified:** `src/components/home/FeaturedProducts.tsx`
- **Commit:** 837e0c4

## Commits

| Hash | Message |
|---|---|
| 837e0c4 | feat(lib): rewrite products.ts + pricing.ts to fetch from DB [11-02] |

## Known Issues / Next Steps

- Checkout routes (`pix/route.ts`, `card/route.ts`, `stripe-card/route.ts`) têm erros de tipo porque `validateAmount` agora é async — será corrigido em **plan 11-03**
- `ProductScroll.tsx` ainda importa `storeProducts` (array vazio) — será corrigido em **plan 11-04**
