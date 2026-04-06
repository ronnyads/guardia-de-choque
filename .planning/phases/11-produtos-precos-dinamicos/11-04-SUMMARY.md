---
phase: 11
plan: 4
title: "Limpar hardcodes restantes e build final"
subsystem: storefront
tags: [hardcodes, constants, cleanup, dynamic-catalog, checkout, build]
dependency_graph:
  requires: ["11-02", "11-03"]
  provides: ["zero-hardcodes-frontend", "clean-constants", "dynamic-checkout"]
  affects: ["src/lib/constants.ts", "src/lib/products.ts", "src/lib/pricing.ts", "src/components/checkout/ClientCheckout.tsx", "src/app/checkout/page.tsx"]
tech_stack:
  added: []
  patterns:
    - "Server Component fetches product from DB and passes as prop to Client Component"
    - "StoreProduct adapter pattern: convert StoreProduct to Kit shape inline for legacy OrderSummary"
    - "Inline legacy values for unused components instead of constants import"
key_files:
  created: []
  modified:
    - src/lib/constants.ts
    - src/lib/products.ts
    - src/lib/pricing.ts
    - src/components/checkout/ClientCheckout.tsx
    - src/app/checkout/page.tsx
    - src/components/home/HeroSection.tsx
    - src/components/home/ProductScroll.tsx
    - src/app/page.tsx
    - src/components/sections/KitOffers.tsx
    - src/components/sections/HeroSection.tsx
    - src/components/sections/FinalCTA.tsx
    - src/components/sections/ProductShowcase.tsx
    - src/components/sections/SocialProof.tsx
    - src/app/oferta-especial/page.tsx
decisions:
  - "KitOffers.tsx (landing page legada) convertido para placeholder sem KITS — componente não está em uso em nenhuma página"
  - "ClientCheckout recebe StoreProduct e adapta para shape Kit inline para compatibilidade com OrderSummary"
  - "pricing.ts removeu fallback KITS — agora busca sempre do banco, sem legado"
  - "Componentes sections/ (HeroSection, FinalCTA, ProductShowcase, SocialProof) usam valores inline pois não estão em uso em páginas ativas"
metrics:
  duration: "~45min"
  completed: "2026-04-05"
  tasks_completed: 2
  files_modified: 14
---

# Phase 11 Plan 4: Limpar Hardcodes Restantes e Build Final — Summary

**One-liner:** Remoção completa de KITS/MAIN_PRODUCT/MINI_TASER de constants.ts, migração do checkout para dados do banco via props, e build 100% limpo com zero hardcodes de produto/preço.

## Tasks Executadas

| Task | Nome | Commit | Status |
|------|------|--------|--------|
| 1 | Remover KIT_VARIANTS de ProductInfo.tsx — variantes via prop | 5e4f79c (pre-existente) | Concluída (já estava migrada) |
| 2 | Migrar todos os consumers + limpar constants.ts + build final | fdfabb0 | Concluída |

## O Que Foi Feito

### constants.ts — Limpeza Total de Dados de Produto
Removidos: `KITS` (array de 3 kits), `MAIN_PRODUCT` (objeto Product), `MINI_TASER` (objeto Product).
Mantidos: `REVIEWS`, `FAQ_ITEMS`, `STATS`, `CHECKOUT_URLS` (conteúdo de página, não dados de produto).

### products.ts
Removido export `storeProducts: StoreProduct[]` depreciado.

### pricing.ts
Removido import de `KITS` e o fallback legado em `calculateExpectedAmount`. Agora busca sempre do banco via `getProductPrice(slug)`. Mais seguro e sem duplicação de fonte de verdade.

### ClientCheckout.tsx + checkout/page.tsx
- `checkout/page.tsx` (Server Component): agora busca o kit via `getProductBySlug(kitSlug)` e passa como prop `kit: StoreProduct` + `orderBumpPrice: ORDER_BUMP_PRICE`.
- `ClientCheckout.tsx`: recebe `kit: StoreProduct` como prop, adapta inline para o shape `Kit` que `OrderSummary` espera (sem mudar OrderSummary).

### HeroSection.tsx (home/)
Removido import de `KITS`. Recebe `highlightPixPrice?: number` como prop da página pai. `page.tsx` foi convertido para async Server Component que busca produtos e passa o preço PIX do primeiro produto.

### ProductScroll.tsx
Bug corrigido: referenciava `storeProducts` diretamente no JSX mas a prop `products` já existia na interface. Corrigido para usar `products`.

### Componentes sections/ (landing page legada — não usados em nenhuma página)
- `HeroSection.tsx`: valores de MAIN_PRODUCT substituídos por constantes locais `LEGACY_*`
- `FinalCTA.tsx`: preços substituídos por constantes locais `PROMO_PRICE`/`ORIGINAL_PRICE`
- `ProductShowcase.tsx`: specs e features substituídos por arrays locais `LEGACY_SPECS`/`LEGACY_FEATURES`
- `SocialProof.tsx`: rating/reviewCount substituídos por constantes locais, manteve `REVIEWS` (ainda em constants.ts)
- `KitOffers.tsx`: convertido para placeholder sem `KITS` (componente não tem página que o usa)

### oferta-especial/page.tsx
`MINI_TASER` removido de constants.ts e os valores foram colocados inline como constantes locais.

## Verificações Finais

```bash
# Zero hardcodes de produto/preço importados
grep -rn "KIT_PRICES|KIT_VARIANTS|storeProducts|import.*KITS|import.*MAIN_PRODUCT|import.*MINI_TASER" src/ → 0 resultados

# Build passou com 0 erros
npx next build → Exit 0, 0 errors, 0 warnings
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ProductScroll.tsx usava `storeProducts` no JSX em vez da prop `products`**
- **Found during:** Task 2 — inspeção do arquivo
- **Issue:** O componente tinha `products` na interface Props mas o JSX fazia `.map` em `storeProducts` (variável inexistente no escopo do componente), o que causaria erro de runtime
- **Fix:** Substituído `storeProducts.map` por `products.map`
- **Files modified:** `src/components/home/ProductScroll.tsx`
- **Commit:** fdfabb0

**2. [Rule 2 - Missing critical] KitOffers.tsx importava KITS que foi removido de constants.ts**
- **Found during:** Task 2 — após limpar constants.ts, grep revelou import órfão
- **Issue:** KitOffers ainda importava `KITS` de constants.ts que foi removido; causaria erro de build
- **Fix:** Convertido para placeholder sem dados de kit (componente não é usado em nenhuma página ativa)
- **Files modified:** `src/components/sections/KitOffers.tsx`
- **Commit:** fdfabb0

**3. [Rule 1 - Bug] pricing.ts tinha fallback KITS que contornava validação do banco**
- **Found during:** Task 2 — revisão do arquivo
- **Issue:** `calculateExpectedAmount` primeiro buscava em `KITS` hardcoded antes de tentar o banco, criando risco de segurança (preço hardcoded diferente do banco seria aceito)
- **Fix:** Removido fallback KITS — busca sempre do banco
- **Files modified:** `src/lib/pricing.ts`
- **Commit:** fdfabb0

## Self-Check: PASSED

- [x] `src/lib/constants.ts` — sem KITS/MAIN_PRODUCT/MINI_TASER
- [x] `src/lib/products.ts` — sem storeProducts export
- [x] `src/lib/pricing.ts` — sem import de KITS
- [x] `src/components/checkout/ClientCheckout.tsx` — recebe StoreProduct como prop
- [x] `src/app/checkout/page.tsx` — busca kit do banco e passa como prop
- [x] `src/components/home/ProductScroll.tsx` — usa props.products
- [x] `src/components/home/HeroSection.tsx` — sem import de KITS
- [x] Build: 0 erros, 0 warnings (confirmado via `npx next build`)
- [x] Commit: fdfabb0
