# ROADMAP — CommerceOS SaaS Multi-Tenant

Numeração contínua (Milestone 1 teve fases 1-7 do redesign UI).

---

## Fase 8 — Fundação Multi-Tenant (DB + Auth + Middleware)
**Goal:** Schema robusto, RLS configurado, auth com tenant context, middleware injetando tenant em todas as requests. A loja atual (Guardiã de Choque) funciona idêntica — migrada como primeiro tenant.

### Tarefas
1. **Migration SQL:** Criar tabelas `tenants`, `tenant_config`, `tenant_integrations`, `orders`. Adicionar coluna `tenant_id` em `products` e `upsell_rules`.
2. **RLS Policies:** Configurar Row Level Security em todas as tabelas com `tenant_id`. Policies baseadas em JWT claim `tenant_id`.
3. **Seed:** Migrar dados atuais (Guardiã de Choque) como tenant `guardia-de-choque` com todos os produtos, config e preços.
4. **`src/lib/tenant.ts`:** Helper para resolver `tenant_id` a partir do request (cookie, subdomínio ou path). Retorna `TenantContext`.
5. **`src/middleware.ts`:** Reescrever para extrair tenant + validar acesso + injetar no header `x-tenant-id`.
6. **`src/lib/supabase-server.ts`:** Atualizar para incluir `tenant_id` em queries via RLS.
7. **`src/types/tenant.ts`:** Tipos TypeScript para `Tenant`, `TenantConfig`, `TenantIntegration`, `Order`.

**Critério de sucesso:** `next build` 0 erros. Loja atual abre e funciona. RLS bloqueia queries sem tenant_id.

---

## Fase 9 — Admin: Configurações Completas da Loja
**Goal:** Lojista configura tudo (marca, contato, conteúdo, integrações) via painel admin. Server Actions para todas as mutations.

### Tarefas
1. **`src/app/admin/settings/page.tsx`:** Página principal com abas (Marca / Contato / Conteúdo / Integrações / SEO).
2. **Aba Marca:** Nome da loja, upload de logo (Supabase Storage), color picker primária + acento, seletor de fonte.
3. **Aba Contato & Conteúdo:** Telefone, email. CRUD inline para mensagens do announcement bar, trust badges e FAQs.
4. **Aba Integrações:** Formulários para Mercado Pago (public key + access token), Stripe (public + secret), Meta Pixel ID, Kwai Pixel ID. Chaves secretas criptografadas antes de salvar. Botão "Testar Conexão".
5. **Aba SEO:** Meta title, meta description, upload OG image.
6. **`src/app/admin/settings/actions.ts`:** Server Actions para salvar cada aba. Validação Zod.
7. **`src/lib/integrations.ts`:** `getIntegration(tenantId, provider)` — descriptografa e retorna credenciais (server-only).

**Critério de sucesso:** Salvar config no admin → valores refletem na loja imediatamente. Chave MP salva → checkout usa ela.

---

## Fase 10 — Storefront Dinâmica (Zero Hardcode)
**Goal:** Toda a loja lê config do banco. Remover todos os valores hardcoded de componentes e arquivos lib.

### Tarefas
1. **`src/lib/store-config.ts`:** `getStoreConfig(tenantId)` — busca `tenant_config` + `tenant_integrations` do banco. Cache com `unstable_cache` (Next.js).
2. **`src/components/providers/TenantProvider.tsx`:** Context Provider que injeta `StoreConfig` para toda a árvore de componentes. Hook `useStoreConfig()`.
3. **CSS vars dinâmicas:** `src/app/layout.tsx` injeta `--c-primary`, `--c-accent`, `--font-heading` como CSS vars inline baseado na config do tenant.
4. **Refatorar componentes:**
   - `Navbar.tsx` — marca + announcement messages do context
   - `Footer.tsx` — nome, telefone, email do context
   - `HeroSection.tsx` — trust pills, stats do context
   - `Testimonials.tsx` — reviews do DB (tabela `product_reviews`)
   - `TrustBar.tsx` — benefícios configuráveis
   - `ShippingBanner.tsx` — conteúdo configurável
5. **`src/app/layout.tsx`** — metadata dinâmico (title, description, OG) do banco.
6. **Deletar:** `src/lib/constants.ts`, `src/lib/categories.ts` (substituídos por DB queries).

**Critério de sucesso:** Mudar cor primária no admin → loja reflete em < 1s (ISR revalidation). Remover constants.ts → build passa.

---

## Fase 11 — Produtos e Preços Dinâmicos
**Goal:** Catálogo 100% no banco. Admin com CRUD completo funcional. Remover todos os valores hardcoded de produtos e preços.
**Plans:** 4 plans

Plans:
- [ ] 11-01-PLAN.md — Completar Admin CRUD de Produtos (campos faltantes + soft delete)
- [ ] 11-02-PLAN.md — Reescrever products.ts + pricing.ts para usar banco
- [ ] 11-03-PLAN.md — Checkout Dinamico (validateAmount async do banco)
- [ ] 11-04-PLAN.md — Limpar hardcodes restantes e build final

### Tarefas
1. **`src/lib/products.ts`** — Reescrever: remover array hardcoded. Todas as funções fazem queries Supabase com `tenant_id`.
2. **`src/lib/pricing.ts`** — Reescrever: `getProductPrices(tenantId, productSlug)` busca do banco. Remove KIT_PRICES hardcoded.
3. **Admin Produtos — Edit:** `src/app/admin/products/[id]/edit/page.tsx` com form completo + upload de imagens.
4. **Admin Produtos — Delete:** Implementar soft delete (status → 'archived').
5. **Admin Produtos — Imagens:** Upload para Supabase Storage. Retorna URL pública.
6. ~~**Admin Categorias:** `src/app/admin/categories/page.tsx` — CRUD de categorias por tenant.~~ → Movido para Fase 12 (campo `category_id` fica como texto livre no Fase 11).
7. **Checkout APIs** — `pix/route.ts` e `card/route.ts`: buscar preços do banco (não de pricing.ts).

**Critério de sucesso:** Criar produto no admin → aparece na loja. Mudar preço → checkout valida novo preço. Build com 0 erros.

---

## Fase 12 — Checkout e Pagamentos por Tenant
**Goal:** Cada tenant usa suas próprias chaves de pagamento. Pedidos salvos no banco.

### Tarefas
1. **`src/lib/integrations.ts`:** `getMercadoPagoClient(tenantId)` e `getStripeClient(tenantId)` — instanciam clients com as chaves do tenant.
2. **`src/app/api/checkout/pix/route.ts`** — Usar `getMercadoPagoClient(tenantId)`. Salvar pedido na tabela `orders` após criação.
3. **`src/app/api/checkout/card/route.ts`** — Idem.
4. **`src/app/api/checkout/stripe-card/route.ts`** — Usar `getStripeClient(tenantId)`. Salvar pedido.
5. **`src/app/api/checkout/status/route.ts`** — Atualizar status do pedido na tabela `orders`.
6. **Admin Pedidos** — `src/app/admin/pedidos/page.tsx`: Reescrever para ler da tabela `orders` (não MP API). Filtros por status/data. Export CSV.
7. **`src/lib/store.ts`** — localStorage key: `${tenantSlug}-cart` (dinâmico).

**Critério de sucesso:** Tenant A com suas chaves MP → pedido feito vai para a conta MP do Tenant A. Pedido salvo na tabela `orders`. Admin mostra pedidos corretos.

---

## Fase 13 — Analytics por Tenant
**Goal:** Cada tenant configura seus próprios pixels de rastreio.

### Tarefas
1. **`src/components/analytics/MetaPixel.tsx`** — Pixel ID vem do `TenantProvider` (não env var hardcoded).
2. **`src/components/analytics/KwaiPixel.tsx`** — Idem.
3. **`src/app/layout.tsx`** — Remover inicialização hardcoded do Kwai SDK. Delegar para `KwaiPixel` component.
4. **Eventos de analytics** — `addToCart`, `purchase`, `checkout` passam `tenantId` para garantir disparo correto por tenant.
5. **`src/lib/store.ts`** — Remover referências hardcoded a pixel IDs.

**Critério de sucesso:** Tenant A com seu Meta Pixel ID → eventos vão para a conta de anúncios do Tenant A. Tenant B sem pixel → nenhum evento disparado.

---

## Fase 14 — Onboarding de Lojistas + Super Admin
**Goal:** Qualquer pessoa cria sua loja em < 5 minutos. Dono da plataforma gerencia tudo.

### Tarefas
1. **`src/app/(public)/criar-loja/page.tsx`** — Landing pública de cadastro.
2. **Wizard de onboarding (3 steps):**
   - Step 1: Nome da loja, slug, email, senha
   - Step 2: Chaves Mercado Pago (pode pular)
   - Step 3: Logo + cores (pode pular, usa defaults)
3. **`src/app/api/tenants/route.ts`** — Cria tenant + user + config default em transação.
4. **URL da loja:** Após cadastro → `app.commerceos.com/loja/[slug]` (MVP) ou subdomínio configurável.
5. **`src/app/super-admin/`** — Painel do dono da plataforma:
   - Lista de todos os tenants (nome, slug, status, criado em)
   - Ativar / suspender / deletar tenant
   - Métricas: total de lojas, pedidos totais, GMV total
6. **Proteção super-admin:** Middleware verifica `role = 'super_admin'` no JWT.

**Critério de sucesso:** Criar nova loja pelo wizard → loja acessível e funcional. Super admin vê todos os tenants. Tenant suspenso não consegue acessar admin.

---

## Estado Atual
```
Fase 8:  [ ] Não iniciada
Fase 9:  [ ] Não iniciada
Fase 10: [ ] Não iniciada
Fase 11: [~] Planejada (4 plans)
Fase 12: [ ] Não iniciada
Fase 13: [ ] Não iniciada
Fase 14: [ ] Não iniciada
```

## Próximo passo
`/gsd:execute-phase 11`
