---
phase: 10-storefront-dinamica
verified: 2026-04-05T00:00:00Z
status: gaps_found
score: 9/11 must-haves verified
gaps:
  - truth: "generateMetadata() usa config.seo_title e config.seo_description dinamicamente — sem strings hardcoded de tenant"
    status: partial
    reason: "Os campos config.seo_title e config.seo_description são lidos corretamente, mas os fallbacks (operador ??) contêm strings hardcoded com nomes de tenant específico: 'Os Oliveiras | Produtos de Qualidade para sua Família', 'A loja da família Oliveira...', 'familia oliveira' em keywords, e 'Guardiã de Choque' no JSON-LD do schema.org — violando o goal da fase."
    artifacts:
      - path: "src/app/layout.tsx"
        issue: "Linhas 28, 31, 33, 35, 38: fallbacks com nomes de tenant hardcoded. Linha 91: JSON-LD com name: 'Guardiã de Choque' hardcoded e não usa config."
    missing:
      - "Substituir fallbacks hardcoded de seo_title/seo_description pelo DEFAULT_CONFIG.seo_title e DEFAULT_CONFIG.seo_description (já definidos em store-config.ts)"
      - "Corrigir JSON-LD no layout.tsx para usar config.brand_name ao invés de 'Guardiã de Choque' literal"
      - "Remover 'familia oliveira' das keywords hardcoded (usar string genérica ou campo do config)"
human_verification: []
---

# Phase 10: Storefront Dinamica — Relatório de Verificacao

**Phase Goal:** Tornar a storefront dinamica — nome da marca, cores e mensagens de anuncio lidos do banco via TenantProvider, sem strings hardcoded de tenant especifico.
**Verificado:** 2026-04-05
**Status:** GAPS FOUND
**Re-verificacao:** Nao — verificacao inicial

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                 | Status      | Evidencia                                                                                              |
|----|-----------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------|
| 1  | `src/lib/store-config.ts` existe e exporta `getStoreConfig()` async  | VERIFICADO  | Arquivo existe, funcao async exportada na linha 26                                                     |
| 2  | `getStoreConfig()` usa `createServiceSupabase()` + fallback defaults  | VERIFICADO  | `createServiceSupabase()` chamado na linha 30; DEFAULT_CONFIG definido nas linhas 4-24                 |
| 3  | `TenantProvider.tsx` existe com `'use client'`                        | VERIFICADO  | Arquivo existe, diretiva `'use client'` na linha 1                                                     |
| 4  | `TenantProvider` exporta `useStoreConfig()` hook                      | VERIFICADO  | Funcao exportada nas linhas 22-28                                                                      |
| 5  | `layout.tsx` chama `getStoreConfig()` e envolve filhos com TenantProvider | VERIFICADO | `getStoreConfig()` na linha 62; `<TenantProvider config={config}>` na linha 102                    |
| 6  | `generateMetadata()` usa `config.seo_title` e `config.seo_description` sem hardcodes de tenant | FALHOU | Config lido dinamicamente, mas fallbacks e JSON-LD contem strings de tenant hardcoded ("Os Oliveiras", "familia Oliveira", "Guardia de Choque") |
| 7  | CSS vars `--store-primary` e `--store-accent` injetados no html      | VERIFICADO  | Linhas 69-71 em layout.tsx: `style={{ '--store-primary': config.primary_color, '--store-accent': config.accent_color }}`  |
| 8  | `Navbar.tsx` usa `useStoreConfig()` — sem brand name hardcoded        | VERIFICADO  | `useStoreConfig()` na linha 9; `config.brand_name` nas linhas 80 e 91                                |
| 9  | `Footer.tsx` usa `useStoreConfig()` — sem brand name hardcoded        | VERIFICADO  | `useStoreConfig()` na linha 7; `brandName` derivado de `config.brand_name` nas linhas 8, 19, 38      |
| 10 | TypeScript compila com 0 erros                                        | VERIFICADO  | `npx tsc --noEmit` retornou exit code 0, sem saida de erros                                          |
| 11 | Build passa                                                           | VERIFICADO  | `npx next build` retornou exit code 0, 28 paginas geradas sem erros                                  |

**Score:** 10/11 truths verificadas (must-have 6 parcialmente atendido — logica dinamica existe, mas fallbacks violam o goal)

---

## Required Artifacts

| Artefato                                         | Esperado                                    | Status     | Detalhes                                                   |
|--------------------------------------------------|---------------------------------------------|------------|------------------------------------------------------------|
| `src/lib/store-config.ts`                        | Exporta `getStoreConfig()` async            | VERIFICADO | 52 linhas, substancial, exportado e importado em layout.tsx |
| `src/components/providers/TenantProvider.tsx`    | `'use client'`, Context, `useStoreConfig()` | VERIFICADO | 29 linhas, todos exports presentes                         |
| `src/app/layout.tsx`                             | Integra config + TenantProvider + CSS vars  | PARCIAL    | Integrado mas com fallbacks hardcoded de tenant especifico |
| `src/components/layout/Navbar.tsx`               | Usa `useStoreConfig()` sem hardcodes        | VERIFICADO | Importa e usa `config.brand_name` e `announcement_messages` |
| `src/components/layout/Footer.tsx`               | Usa `useStoreConfig()` sem hardcodes        | VERIFICADO | Importa e usa `config.brand_name` em todos os lugares      |

---

## Key Link Verification

| From                   | To                          | Via                         | Status     | Detalhes                                              |
|------------------------|-----------------------------|-----------------------------|------------|-------------------------------------------------------|
| `layout.tsx`           | `store-config.ts`           | `import { getStoreConfig }` | WIRED      | Import na linha 7, chamada nas linhas 26 e 62         |
| `layout.tsx`           | `TenantProvider.tsx`        | `import { TenantProvider }` | WIRED      | Import na linha 8, uso na linha 102                   |
| `Navbar.tsx`           | `TenantProvider.tsx`        | `import { useStoreConfig }` | WIRED      | Import na linha 9, uso na linha 22                    |
| `Footer.tsx`           | `TenantProvider.tsx`        | `import { useStoreConfig }` | WIRED      | Import na linha 4, uso na linha 7                     |
| `store-config.ts`      | `supabase-server.ts`        | `createServiceSupabase()`   | WIRED      | Import na linha 1, chamada na linha 30                |
| `store-config.ts`      | `types/tenant`              | `TenantConfig` type         | WIRED      | Import na linha 2, usado como tipo de retorno         |

---

## Requirements Coverage

| Requisito                                    | Status     | Evidencia                                                                 |
|----------------------------------------------|------------|---------------------------------------------------------------------------|
| Brand name dinamico (Navbar/Footer)          | SATISFEITO | Navbar e Footer leem `config.brand_name` via `useStoreConfig()`           |
| Cores dinamicas via CSS vars                 | SATISFEITO | `--store-primary` e `--store-accent` injetados no `<html>` via config     |
| Announcement messages dinamicos             | SATISFEITO | Navbar usa `config.announcement_messages` com fallback                    |
| SEO metadata dinamico                        | PARCIAL    | Campos do config sao lidos, mas fallbacks hardcoded contem nomes de tenant|
| TenantProvider como provider global          | SATISFEITO | Envolve todos os children em `RootLayout`                                  |
| Zero strings hardcoded de tenant em layout/navbar/footer | PARCIAL | Navbar e Footer ok; layout.tsx ainda tem "Os Oliveiras", "familia Oliveira", "Guardia de Choque" |

---

## Anti-Patterns Encontrados

| Arquivo            | Linha | Pattern                                        | Severidade | Impacto                                                                 |
|--------------------|-------|------------------------------------------------|------------|-------------------------------------------------------------------------|
| `src/app/layout.tsx` | 28  | `?? "Os Oliveiras | Produtos de Qualidade..."` | BLOQUEIO   | Fallback hardcoded de tenant especifico no SEO title                    |
| `src/app/layout.tsx` | 31  | `?? "A loja da familia Oliveira..."`           | BLOQUEIO   | Fallback hardcoded de tenant especifico na SEO description              |
| `src/app/layout.tsx` | 33  | `"...familia oliveira..."` em keywords         | AVISO      | Keyword fixa com nome de tenant — nao usara config nunca                |
| `src/app/layout.tsx` | 35  | `?? "Os Oliveiras | Qualidade que a familia..."` | BLOQUEIO  | Fallback hardcoded de tenant no OpenGraph title                         |
| `src/app/layout.tsx` | 38  | `?? "Produtos selecionados com a confianca da familia Oliveira..."` | BLOQUEIO | Fallback hardcoded de tenant no OpenGraph description |
| `src/app/layout.tsx` | 91  | `name: "Guardia de Choque"` no JSON-LD         | BLOQUEIO   | Schema.org nao usa `config.brand_name` — sempre mostra tenant hardcoded |

**Nota:** Os anti-patterns acima sao todos no mesmo arquivo (`layout.tsx`) e todos no bloco de metadados/JSON-LD — um problema concentrado e facil de corrigir substituindo pelas variaveis do config.

**Nota sobre outros arquivos:** Os hardcodes encontrados em `ProductShowcase.tsx`, `HeroSection.tsx`, `BrandStory.tsx`, `loja/page.tsx`, `sobre/page.tsx` etc. sao content/copy especifico de produto, nao do tenant como marca — estao fora do escopo do must-have desta fase que foca em Navbar, Footer e layout.tsx.

---

## Gaps Summary

O unico gap da fase e concentrado em `src/app/layout.tsx` na funcao `generateMetadata()` e no bloco JSON-LD. A infraestrutura esta correta e funcional: `getStoreConfig()` busca do banco, `DEFAULT_CONFIG` tem fallbacks genericos, `TenantProvider` distribui o config, Navbar e Footer sao completamente dinamicos.

O problema: os fallbacks do operador `??` em `generateMetadata()` usam strings com nomes de tenant hardcoded ("Os Oliveiras", "familia Oliveira") em vez de usar `DEFAULT_CONFIG.seo_title` / `DEFAULT_CONFIG.seo_description`. Se `config.seo_title` for null (tenant sem config), o metadata exibira "Os Oliveiras" mesmo para outro tenant.

**Correcao necessaria (minimal):**
- Em `generateMetadata()`, substituir os fallbacks hardcoded por `DEFAULT_CONFIG.seo_title`, `DEFAULT_CONFIG.seo_description` (ou strings genericas)
- No JSON-LD (linha 91), substituir `name: "Guardia de Choque"` por `name: config.brand_name`
- Remover/genericizar a keyword `"familia oliveira"`

---

_Verificado: 2026-04-05_
_Verificador: Claude (gsd-verifier)_
