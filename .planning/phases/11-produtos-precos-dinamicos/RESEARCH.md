# Phase 11: Produtos e Precos Dinamicos — Research

**Pesquisado:** 2026-04-05
**Dominio:** Catalogo de produtos, precificacao servidor-side, CRUD admin, Supabase Storage
**Confianca geral:** HIGH (leitura direta do codigo-fonte)

---

## Resumo

O projeto tem **tres camadas de dados paralelas e incompativeis**: o array `storeProducts`
em `src/lib/products.ts` (storefront), a constante `KITS` em `src/lib/constants.ts`
(checkout legado) e a tabela `products` no Supabase (admin). A validacao anti-fraude do
checkout usa um quarto hardcode: `KIT_PRICES` em `src/lib/pricing.ts`. **O banco nao e
consultado em nenhum momento do checkout atual.**

O admin tem CRUD funcional (create/update/delete) mas sem campos `long_description`,
`features`, `specs`, `images`, `badge`, `rating`, `review_count` e `category_id` nos
formularios. Nao existe infraestrutura de upload de imagens.

**Recomendacao principal:** Migrar em quatro etapas sequenciais — preparar banco com seed
dos 4 produtos existentes, completar o form admin com todos os campos, substituir storefront
para usar banco, e por ultimo dinamizar a validacao de preco no checkout (ponto critico).

---

## Estado Atual — Hardcodes Identificados

### 1. `src/lib/products.ts` — `storeProducts`

Array com 4 produtos completos: `guardia-de-choque`, `kit-dupla`, `kit-familia`,
`mini-taser`. Cada produto tem: `name`, `slug`, `category`, `categoryName`,
`description`, `longDescription`, `images[]`, `price`, `originalPrice`, `pixPrice`,
`installments`, `rating`, `reviewCount`, `badge`, `inStock`, `features[]`, `specs[]`.

Funcoes existentes e seu comportamento:
- `getProductBySlug(slug)` — busca do banco mas faz **fallback para array local** em
  `images`, `features` e `specs` quando o banco retorna vazio.
- `getProductsByCategory(slug)` — retorna **somente do array local**, nunca consulta banco.
- `getFeaturedProducts()` — retorna **somente do array local**, nunca consulta banco.
- `getRelatedProducts(slug)` — busca do banco corretamente (sem fallback).

### 2. `src/lib/pricing.ts` — `KIT_PRICES`

```typescript
KIT_PRICES = {
  "kit-individual": 97.90,
  "kit-dupla":      169.90,
  "kit-familia":    227.90,
}
ORDER_BUMP_PRICE = 29.90
UPSELL_PRICE     = 69.90
PIX_DISCOUNT     = 0.05
```

`calculateExpectedAmount()` consulta esse dicionario e lanca excecao se o kitId nao
existir. `validateAmount()` e a guarda anti-fraude chamada por ambas as rotas de checkout.

### 3. `src/lib/constants.ts` — `KITS` e `MAIN_PRODUCT`

Estrutura `Kit[]` com campos diferentes de `StoreProduct` (tem `perUnit`, `savings`,
`savingsPercent`, `bonus`). Usada pelo `ClientCheckout` e `OrderSummary`. Tambem contem
`CHECKOUT_URLS` com os slugs de kit hardcoded.

### 4. `src/components/product/ProductInfo.tsx` — `KIT_VARIANTS` (descoberta nova)

```typescript
const KIT_VARIANTS = [
  { slug: "guardia-de-choque", label: "Individual",     qty: "1 aparelho",  price: 97.90  },
  { slug: "kit-dupla",         label: "Dupla Protecao", qty: "2 aparelhos", price: 169.90 },
  { slug: "kit-familia",       label: "Kit Familia",    qty: "3 aparelhos", price: 227.90 },
];
```

Quarto hardcode independente — exibe seletores de variante na pagina de produto.
Nao sincronizado com nenhuma das outras tres fontes.

---

## Schema da Tabela `products` no Supabase

A tabela foi criada antes das 3 migracoes existentes (que so fazem `ALTER TABLE` para
adicionar `tenant_id`). O schema real e inferido do codigo que ja consume a tabela:

| Coluna | Tipo inferido | Observacao |
|--------|--------------|-----------|
| `id` | UUID | PK, usado em admin pages |
| `tenant_id` | UUID | FK para tenants (migration 001) |
| `name` | TEXT | Obrigatorio |
| `slug` | TEXT | Unico por tenant |
| `description` | TEXT | Descricao curta |
| `long_description` | TEXT | Pode ser null — nao ha campo no form |
| `status` | TEXT | `active` ou `draft` |
| `original_price` | NUMERIC | Preco De (riscado) |
| `promo_price` | NUMERIC | Preco Por (promocional) |
| `cost_price` | NUMERIC | Mapeado erroneamente como `pixPrice` no codigo |
| `sku` | TEXT | Pode ser null |
| `inventory_count` | INTEGER | Default 100 |
| `category_id` | TEXT | Nao ha campo no form admin |
| `images` | JSONB | Array de URLs — nao ha campo no form admin |
| `features` | JSONB | Array de `{icon, title, description}` — sem campo no form |
| `specs` | JSONB | Array de `{label, value}` — sem campo no form |
| `rating` | NUMERIC | Sem campo no form |
| `review_count` | INTEGER | Sem campo no form |
| `badge` | TEXT | Sem campo no form |
| `created_at` | TIMESTAMPTZ | Para ordenacao na lista |

**Problema semantico critico:** `cost_price` (custo de producao) e mapeado como
`pixPrice` (preco com desconto PIX) em `getProductBySlug`. Esses sao conceitos diferentes.
O correto seria calcular `pixPrice = promo_price * (1 - 0.05)` ou adicionar coluna
`pix_price` separada.

**Campos sem form no admin:** `long_description`, `features`, `specs`, `images`,
`badge`, `rating`, `review_count`, `category_id` nao tem campos de edicao.

---

## Como o Checkout Obtem Precos

**Fluxo atual (100% hardcoded):**

```
Cliente -> /checkout?kit=kit-dupla
  -> ClientCheckout.tsx le KITS[] de constants.ts (hardcoded)
  -> Exibe preco kit.promoPrice (hardcoded)
  -> POST /api/checkout/pix ou /api/checkout/card com { kitId, amount }
     -> validateAmount() consulta KIT_PRICES{} em pricing.ts (hardcoded)
     -> Lanca erro se kitId invalido ou preco adulterado
     -> Cria pagamento no Mercado Pago com o amount validado
```

**O banco nao e consultado em nenhum momento do checkout.**

---

## Infraestrutura de Upload de Imagens

**Nao existe.** Nenhum arquivo no projeto tem logica de upload para Supabase Storage.

O `next.config.ts` ja tem `remotePatterns` configurado para o bucket Supabase:
```
hostname: "qfzkuqqusunsvqzjpaag.supabase.co"
pathname: "/storage/v1/object/public/**"
```

Imagens atuais sao servidas de `/public/images/product/` como arquivos estaticos.

**Opcoes para esta fase:**

1. **Simples (recomendado para nao bloquear):** Adicionar campo de texto "URL da Imagem"
   no form admin. Admin cola uma URL publica (pode ser `/images/product/nome.png` para
   imagens ja existentes). Zero nova infraestrutura.

2. **Completo:** Implementar upload para Supabase Storage bucket `product-images`. Requer:
   criar bucket com RLS, API route para upload com `createServiceSupabase()`, componente
   de file input com preview. Adiciona ~2 dias de trabalho.

A opcao 1 desbloqueia o objetivo "catalogo 100% no banco" rapidamente. Upload pode ser
uma sub-fase separada.

---

## Mapa Completo de Consumidores do Hardcode

### storeProducts (products.ts)

| Arquivo | Como usa | O que muda |
|---------|----------|-----------|
| `src/app/loja/page.tsx` | `ProductGrid products={storeProducts}` | Buscar do banco server-side |
| `src/app/produto/[slug]/page.tsx` | `generateStaticParams` via `storeProducts` | Buscar slugs do banco |
| `src/app/produto/[slug]/page.tsx` | `getProductBySlug(slug)` | Ja busca do banco — remover fallback |
| `src/app/categoria/[slug]/page.tsx` | `getProductsByCategory` + fallback | Reescrever getProductsByCategory |
| `src/components/home/ProductScroll.tsx` | `storeProducts` direto (client component) | Receber como prop da pagina pai |
| `src/lib/products.ts` | `getFeaturedProducts()` | Reescrever para banco |

### KITS (constants.ts) + KIT_PRICES (pricing.ts)

| Arquivo | Dado hardcoded | Impacto ao migrar |
|---------|---------------|-------------------|
| `ClientCheckout.tsx` | `KITS` de constants.ts | Buscar kits via API ou Server Component |
| `pricing.ts` | `KIT_PRICES` objeto literal | Substituir por lookup no banco |
| `api/checkout/pix/route.ts` | Usa `validateAmount()` | Indireto — muda quando pricing.ts muda |
| `api/checkout/card/route.ts` | Usa `validateAmount()` | Indireto — muda quando pricing.ts muda |
| `components/home/HeroSection.tsx` | `KITS[1]` para exibir preco do kit dupla | Receber como prop ou buscar |
| `components/sections/KitOffers.tsx` | `KITS` para renderizar cards | Receber como prop |

### KIT_VARIANTS (ProductInfo.tsx)

| Arquivo | Dado hardcoded | Impacto ao migrar |
|---------|---------------|-------------------|
| `components/product/ProductInfo.tsx` | `KIT_VARIANTS` array com precos | Buscar variantes do banco ou do produto pai |

---

## Caminho Mais Simples Sem Quebrar a Loja

### Etapa 1 — Seed do banco (prerequisito)

Criar migration que insere os 4 produtos do `storeProducts` no banco para o tenant
`guardia-de-choque`. Sem isso, nenhuma outra etapa funciona. Campos necessarios:

```sql
INSERT INTO products (tenant_id, name, slug, status, original_price, promo_price,
  category_id, description, long_description, images, features, specs, rating,
  review_count, badge, inventory_count, sku)
VALUES (...) ON CONFLICT (tenant_id, slug) DO NOTHING;
```

Nota: `pix_price` deve ser calculado ou `cost_price` deve ter o valor correto do PIX
(nao o custo de producao).

### Etapa 2 — Completar form admin

Adicionar ao form `new/page.tsx` e `[id]/edit/page.tsx`:
- URL da imagem principal (text input)
- Descricao longa (textarea)
- Badge (select: Mais Vendido / Oferta / Novo / Kit)
- Categoria (text input ou select)
- Avaliacao (number 0-5) e Contagem de avaliacoes (number)
- Features (textarea JSON ou campos repetidos)
- Specs (textarea JSON ou campos repetidos)

Atualizar server actions para persistir esses campos.

### Etapa 3 — Substituir storefront para usar banco

1. Adicionar `getProductsForTenant(tenantId): Promise<StoreProduct[]>` em products.ts.
2. Tornar `LojaPage` async, buscar do banco, passar para `ProductGrid`.
3. `ProductScroll` e Client Component (tem hooks) — a pagina pai (server) busca e passa
   como prop `products`. Adicionar `interface Props { products: StoreProduct[] }`.
4. `generateStaticParams` em `produto/[slug]/page.tsx`: buscar slugs do banco, manter
   array local como fallback apenas durante transicao.
5. Reescrever `getProductsByCategory()` e `getFeaturedProducts()` para banco.
6. Remover fallback de `images`/`features`/`specs` em `getProductBySlug()` apos seed.

### Etapa 4 — Dinamizar validacao do checkout (mais critico)

1. Criar `getPriceBySlug(slug): Promise<number>` usando `createServiceSupabase()`.
2. Em `pricing.ts`, substituir lookup em `KIT_PRICES` por chamada async ao banco.
3. Mudar assinatura de `validateAmount` para async.
4. Atualizar rotas de checkout para `await validateAmount(...)`.
5. Manter `KIT_PRICES` como fallback de emergencia via env var ou constante comentada.
6. Atualizar `ClientCheckout.tsx` para buscar dados do kit via API route dedicada ou
   receber do Server Component pai.

---

## Riscos e Dependencias

| Risco | Severidade | Mitigacao |
|-------|-----------|-----------|
| `validateAmount()` se torna async — rotas de checkout precisam de await | CRITICO | Atualizar assinatura e todos os callers em sequencia, testar manualmente |
| Banco sem dados — `generateStaticParams` retorna vazio — paginas 404 no build | ALTO | Sempre executar seed antes de qualquer outro passo |
| `cost_price` mapeado como `pixPrice` — dado errado no banco | ALTO | Seed deve calcular `pix_price = promo_price * 0.95` ou popular `cost_price` corretamente |
| `KIT_VARIANTS` em `ProductInfo.tsx` nao sincronizado — exibe preco antigo | MEDIO | Migrar junto com storefront (Etapa 3) |
| Features/Specs como JSON no form — JSON invalido quebra insert | MEDIO | Validar no server action antes do insert, tratar erro |
| `ProductScroll` e Client Component — nao pode buscar server-side diretamente | MEDIO | Pagina pai busca e passa como prop (padrao Next.js) |
| Supabase fora — checkout para completamente se lookup for online | ALTO | Manter `KIT_PRICES` como fallback hardcoded por seguranca |
| Next.js bloqueia imagens de dominios nao configurados | BAIXO | `remotePatterns` ja esta configurado para Supabase Storage |

---

## Padrao de Codigo Existente

### Server Action (padrao do projeto)

```typescript
// src/app/admin/products/[id]/edit/actions.ts
'use server';
export async function updateProduct(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();
  // parse, update, revalidatePath('/admin/products'), redirect('/admin/products')
}
```

### Busca no banco com service role (para checkout)

```typescript
// Para validateAmount dinamico — usar service role para bypass RLS
import { createServiceSupabase } from '@/lib/supabase-server';

async function getPriceBySlug(slug: string): Promise<number> {
  const supabase = createServiceSupabase();
  const { data } = await supabase
    .from('products')
    .select('promo_price')
    .eq('slug', slug)
    .single();
  return data?.promo_price ?? 0;
}
```

### Mapeamento de colunas do banco para StoreProduct

Mapeamento atual em `getProductBySlug` (com bugs identificados):

| Coluna DB | Campo StoreProduct | Status |
|-----------|-------------------|--------|
| `data.promo_price` | `price` | Correto |
| `data.original_price` | `originalPrice` | Correto |
| `data.cost_price` | `pixPrice` | **INCORRETO** — deve ser `promo_price * 0.95` |
| `data.rating` | `rating` | Correto |
| `data.review_count` | `reviewCount` | Correto |
| `data.badge` | `badge` | Correto |
| `data.features` | `features` | Com fallback para array local |
| `data.specs` | `specs` | Com fallback para array local |
| `data.images` | `images` | Com fallback para array local |
| `data.category_id` | `category` | Correto |

---

## Validacao

> `workflow.nyquist_validation` nao esta definido no config.json — secao incluida.

### Framework de Testes

Nenhum framework de testes configurado no projeto.

| Property | Value |
|----------|-------|
| Framework | Nenhum detectado |
| Config file | Nenhum |
| Quick run | N/A |
| Full suite | N/A |

### Checklist de Validacao Manual por Etapa

| Comportamento | Tipo | Como verificar |
|---------------|------|---------------|
| Seed popula 4 produtos corretamente | smoke | Admin /admin/products lista 4 produtos |
| Produto criado no admin aparece em /loja | smoke | Criar produto, acessar /loja |
| PIX price correto (5% desconto) | security | Verificar exibicao na PDP apos seed |
| generateStaticParams inclui produtos do banco | build | `next build` sem erro 404 |
| Checkout aceita preco do banco | security | Alterar preco no admin, tentar checkout com preco antigo (deve falhar) |
| Features/Specs renderizam corretamente | visual | PDP deve mostrar grid de features |
| KIT_VARIANTS na PDP reflete precos do banco | visual | Seletor de variante com precos corretos |

### Wave 0 Gaps

- [ ] Nenhum framework de testes instalado — para esta fase, testes manuais sao obrigatorios.
  Risco maior e no checkout (dinheiro real). Adicionar `vitest` e opcional mas recomendado
  para testar `calculateExpectedAmount` e `validateAmount` isoladamente.

---

## Fontes

### Primarias (HIGH confidence — leitura direta do codigo-fonte)

- `src/lib/products.ts` — array storeProducts, funcoes getProductBySlug, getRelatedProducts
- `src/lib/pricing.ts` — KIT_PRICES, validateAmount, calculateExpectedAmount
- `src/lib/constants.ts` — KITS, MAIN_PRODUCT, MINI_TASER, CHECKOUT_URLS
- `src/components/product/ProductInfo.tsx` — KIT_VARIANTS hardcoded
- `src/app/admin/products/` — CRUD existente (list, new/page, new/actions, [id]/edit/page, [id]/edit/actions)
- `src/app/api/checkout/pix/route.ts` — fluxo validacao preco PIX
- `src/app/api/checkout/card/route.ts` — fluxo validacao preco cartao
- `supabase/migrations/20260405000001_multi_tenant_schema.sql` — schema multi-tenant
- `src/types/index.ts` — StoreProduct, Kit, Product interfaces
- `src/types/tenant.ts` — Tenant, Order, OrderItem interfaces
- `next.config.ts` — remotePatterns para Supabase Storage ja configurado
- `src/app/loja/page.tsx`, `src/app/produto/[slug]/page.tsx`, `src/app/categoria/[slug]/page.tsx`
- `src/components/home/HeroSection.tsx`, `ProductScroll.tsx`
- `src/components/sections/KitOffers.tsx`

---

## Metadata

**Breakdown de confianca:**
- Estado atual do codigo: HIGH — lido diretamente dos arquivos
- Schema da tabela products: MEDIUM — inferido do codigo (nao ha migration DDL original)
- Riscos identificados: HIGH — baseados na analise do fluxo real de checkout
- Infraestrutura de upload: HIGH — ausencia confirmada pela busca em todos os arquivos

**Data da pesquisa:** 2026-04-05
**Valido ate:** 2026-05-05 (codigo estavel, sem dependencias de terceiros em evolucao rapida)
