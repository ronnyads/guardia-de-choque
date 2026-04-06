# PLAN — Fase 8: Fundação Multi-Tenant (DB + Auth + Middleware)

## Goal
Criar o schema de banco de dados multi-tenant robusto com RLS, middleware que resolve e injeta o tenant em toda requisição, tipos TypeScript para o domínio tenant, e migrar os dados atuais da Guardiã de Choque como o primeiro tenant. A loja atual deve continuar funcionando identicamente após esta fase.

## Contexto Crítico
- Stack: Next.js 16.2.1 App Router + Supabase (Postgres + Auth)
- Auth atual: Supabase email/password, protege `/admin/*`
- Dados atuais: produtos, upsell_rules sem tenant_id — todos pertencem ao tenant "guardia-de-choque"
- Estratégia RLS: `tenant_id = (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())`
- MVP routing: `/admin` scoped pelo tenant do usuário logado. Storefront em fases posteriores.

---

## TASK 1 — SQL Migration: Novas Tabelas Multi-Tenant

**Arquivo:** `supabase/migrations/20260405000001_multi_tenant_schema.sql`
**Criar diretório:** `supabase/migrations/` (se não existir)

```sql
-- =============================================
-- TENANTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  custom_domain TEXT,
  status      TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'inactive')),
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro')),
  owner_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TENANT_USERS (relação N:N user ↔ tenant)
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- =============================================
-- TENANT_CONFIG (branding, contato, conteúdo)
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenant_config (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  brand_name            TEXT,
  logo_url              TEXT,
  primary_color         TEXT DEFAULT '#0F172A',
  accent_color          TEXT DEFAULT '#059669',
  font_heading          TEXT DEFAULT 'Playfair Display',
  font_body             TEXT DEFAULT 'DM Sans',
  phone                 TEXT,
  email                 TEXT,
  domain_display        TEXT,
  announcement_messages JSONB DEFAULT '[]'::jsonb,
  trust_messages        JSONB DEFAULT '[]'::jsonb,
  faq_items             JSONB DEFAULT '[]'::jsonb,
  stats                 JSONB DEFAULT '[]'::jsonb,
  seo_title             TEXT,
  seo_description       TEXT,
  og_image_url          TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- TENANT_INTEGRATIONS (credenciais por tenant)
-- =============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.tenant_integrations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  provider     TEXT NOT NULL CHECK (provider IN ('mercadopago', 'stripe', 'meta_pixel', 'kwai_pixel')),
  public_key   TEXT,
  -- secret_key armazenado criptografado com pgcrypto usando SUPABASE_ENCRYPTION_KEY
  secret_key_encrypted TEXT,
  extra_config JSONB DEFAULT '{}'::jsonb,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, provider)
);

-- =============================================
-- ORDERS (pedidos por tenant — substitui leitura da API MP)
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_name       TEXT,
  customer_email      TEXT,
  customer_phone      TEXT,
  customer_address    JSONB,
  items               JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount        NUMERIC(10, 2) NOT NULL,
  payment_method      TEXT CHECK (payment_method IN ('pix', 'card')),
  payment_provider    TEXT CHECK (payment_provider IN ('mercadopago', 'stripe')),
  external_payment_id TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'failed', 'refunded', 'cancelled')),
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ADICIONAR tenant_id EM TABELAS EXISTENTES
-- =============================================
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.upsell_rules
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_upsell_rules_tenant_id ON public.upsell_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_tenant_provider ON public.tenant_integrations(tenant_id, provider);
```

---

## TASK 2 — SQL Migration: RLS Policies

**Arquivo:** `supabase/migrations/20260405000002_rls_policies.sql`

```sql
-- Helper function: retorna o tenant_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT tenant_id
  FROM public.tenant_users
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ── TENANTS ──────────────────────────────────────
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_select_own" ON public.tenants
  FOR SELECT USING (id = public.get_user_tenant_id());

CREATE POLICY "tenant_update_own" ON public.tenants
  FOR UPDATE USING (owner_id = auth.uid());

-- ── TENANT_USERS ─────────────────────────────────
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_users_select" ON public.tenant_users
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

-- ── TENANT_CONFIG ─────────────────────────────────
ALTER TABLE public.tenant_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_config_select" ON public.tenant_config
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "tenant_config_upsert" ON public.tenant_config
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── TENANT_INTEGRATIONS ───────────────────────────
ALTER TABLE public.tenant_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_integrations_select" ON public.tenant_integrations
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "tenant_integrations_upsert" ON public.tenant_integrations
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── PRODUCTS ──────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_tenant" ON public.products
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "products_all_tenant" ON public.products
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- Leitura pública de produtos ativos (para o storefront)
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'active');

-- ── UPSELL_RULES ──────────────────────────────────
ALTER TABLE public.upsell_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upsell_rules_tenant" ON public.upsell_rules
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── ORDERS ────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_tenant" ON public.orders
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- Service role bypassa RLS (usado nas APIs de checkout)
-- (service role key já tem BYPASSRLS por default no Supabase)
```

---

## TASK 3 — SQL Migration: Seed do Tenant Guardiã de Choque

**Arquivo:** `supabase/migrations/20260405000003_seed_guardia_tenant.sql`

```sql
-- IMPORTANTE: Substitua <OWNER_USER_ID> pelo UUID do usuário admin atual
-- Para encontrar: SELECT id FROM auth.users LIMIT 5;

DO $$
DECLARE
  v_tenant_id UUID;
  v_owner_id  UUID;
BEGIN
  -- Buscar o primeiro usuário admin existente
  SELECT id INTO v_owner_id FROM auth.users ORDER BY created_at LIMIT 1;

  -- Criar o tenant Guardiã de Choque
  INSERT INTO public.tenants (slug, name, status, plan, owner_id)
  VALUES ('guardia-de-choque', 'Guardiã de Choque', 'active', 'pro', v_owner_id)
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO v_tenant_id;

  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'guardia-de-choque';
  END IF;

  -- Criar relação tenant_users
  IF v_owner_id IS NOT NULL THEN
    INSERT INTO public.tenant_users (tenant_id, user_id, role)
    VALUES (v_tenant_id, v_owner_id, 'owner')
    ON CONFLICT (tenant_id, user_id) DO NOTHING;
  END IF;

  -- Criar configuração inicial da loja
  INSERT INTO public.tenant_config (
    tenant_id, brand_name, primary_color, accent_color,
    font_heading, font_body, phone, email, domain_display,
    seo_title, seo_description,
    announcement_messages, trust_messages
  ) VALUES (
    v_tenant_id,
    'Os Oliveiras',
    '#0F172A', '#059669',
    'Playfair Display', 'DM Sans',
    '(87) 99999-9944', 'contato@oliveiras.com', 'guardiadechoque.online',
    'Guardiã de Choque | Defesa Pessoal',
    'A defesa pessoal que sua família merece. Compre com segurança.',
    '["🚚 Frete grátis acima de R$ 199", "⚡ 5% OFF no PIX", "💳 Parcele em 6x sem juros", "🔒 Compra 100% segura"]',
    '["Compra 100% Segura", "Frete Grátis acima de R$ 199", "PIX com 5% OFF"]'
  )
  ON CONFLICT (tenant_id) DO NOTHING;

  -- Associar produtos existentes ao tenant
  UPDATE public.products SET tenant_id = v_tenant_id WHERE tenant_id IS NULL;

  -- Associar upsell_rules existentes ao tenant
  UPDATE public.upsell_rules SET tenant_id = v_tenant_id WHERE tenant_id IS NULL;

  RAISE NOTICE 'Tenant criado com sucesso: % (ID: %)', 'guardia-de-choque', v_tenant_id;
END;
$$;
```

---

## TASK 4 — Criar `src/types/tenant.ts`

**Arquivo:** `src/types/tenant.ts` (novo)

```typescript
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  custom_domain: string | null;
  status: 'trial' | 'active' | 'inactive';
  plan: 'free' | 'starter' | 'pro';
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'viewer';
  created_at: string;
}

export interface TenantConfig {
  id: string;
  tenant_id: string;
  brand_name: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  phone: string | null;
  email: string | null;
  domain_display: string | null;
  announcement_messages: string[];
  trust_messages: string[];
  faq_items: FaqItem[];
  stats: StatItem[];
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  updated_at: string;
}

export interface TenantIntegration {
  id: string;
  tenant_id: string;
  provider: 'mercadopago' | 'stripe' | 'meta_pixel' | 'kwai_pixel';
  public_key: string | null;
  secret_key_encrypted: string | null; // nunca exposto no client
  extra_config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: CustomerAddress | null;
  items: OrderItem[];
  total_amount: number;
  payment_method: 'pix' | 'card' | null;
  payment_provider: 'mercadopago' | 'stripe' | null;
  external_payment_id: string | null;
  status: 'pending' | 'approved' | 'failed' | 'refunded' | 'cancelled';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
}
```

---

## TASK 5 — Criar `src/lib/tenant.ts`

**Arquivo:** `src/lib/tenant.ts` (novo)
**Propósito:** Resolver `TenantContext` a partir do request. MVP: tenant do usuário logado.

```typescript
import { createServerSupabase } from '@/lib/supabase-server';
import type { TenantContext } from '@/types/tenant';

/**
 * Resolve o tenant do usuário autenticado.
 * Usado em Server Components e API Routes.
 * Retorna null se não houver usuário autenticado ou tenant associado.
 */
export async function getTenantFromSession(): Promise<TenantContext | null> {
  const supabase = await createServerSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: tenantUser, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, tenants(slug)')
    .eq('user_id', user.id)
    .single();

  if (error || !tenantUser) return null;

  const slug = (tenantUser.tenants as { slug: string } | null)?.slug;
  if (!slug) return null;

  return {
    tenantId: tenantUser.tenant_id,
    tenantSlug: slug,
  };
}

/**
 * Igual ao anterior mas lança erro se não encontrar tenant.
 * Use em páginas admin que requerem autenticação.
 */
export async function requireTenant(): Promise<TenantContext> {
  const ctx = await getTenantFromSession();
  if (!ctx) throw new Error('Tenant não encontrado para o usuário autenticado');
  return ctx;
}
```

---

## TASK 6 — Reescrever `src/middleware.ts`

**Arquivo:** `src/middleware.ts` (reescrever)
**Mudanças:** Mantém proteção admin existente + adiciona header `x-tenant-id` para o request.

```typescript
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Redirecionar não-autenticados para login
  if (isAdminRoute && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirecionar autenticados que estão na página de login
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Injetar tenant_id no header para uso em Server Components
  if (user && isAdminRoute) {
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single();

    if (tenantUser?.tenant_id) {
      response.headers.set('x-tenant-id', tenantUser.tenant_id);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

## TASK 7 — Atualizar `src/lib/supabase-server.ts`

**Arquivo:** `src/lib/supabase-server.ts` (atualizar export name para consistência)

Renomear a função de `createClient` para `createServerSupabase` para evitar conflito com o client-side:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — ignorar
          }
        },
      },
    }
  );
}

/**
 * Cliente com service role — bypassa RLS.
 * Use APENAS em API routes de checkout e webhooks.
 * NUNCA em Server Components ou Client Components.
 */
export function createServiceSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

---

## TASK 8 — Atualizar imports quebrados após renomear supabase-server

Após renomear a função, atualizar todos os arquivos que importam de `supabase-server`:

**Buscar:** `grep -r "supabase-server" src/ --include="*.ts" --include="*.tsx"`

Arquivos esperados a atualizar:
- `src/middleware.ts` — já atualizado acima (usa `createServerClient` diretamente)
- `src/app/admin/page.tsx` — trocar `createClient()` por `createServerSupabase()`
- `src/app/admin/products/page.tsx` — idem
- `src/app/admin/pedidos/page.tsx` — idem
- `src/app/admin/products/new/page.tsx` — idem

**Padrão de mudança em cada arquivo:**
```typescript
// ANTES
import { createClient } from '@/lib/supabase-server';
const supabase = createClient();

// DEPOIS
import { createServerSupabase } from '@/lib/supabase-server';
const supabase = await createServerSupabase();
```

---

## TASK 9 — Adicionar tenant_id nas queries do Admin

Após criar a função helper `requireTenant()`, atualizar as páginas admin para filtrar por tenant:

### `src/app/admin/page.tsx` (Dashboard)
```typescript
// Server Component
import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';

export default async function AdminDashboard() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const [{ count: productsCount }, { count: upsellCount }, { count: ordersCount }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase.from('upsell_rules').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    ]);

  // ... render
}
```

### `src/app/admin/products/page.tsx` (Lista de Produtos)
```typescript
const { tenantId } = await requireTenant();
const { data: products } = await supabase
  .from('products')
  .select('id, name, sku, status, inventory_count, promo_price, images')
  .eq('tenant_id', tenantId)
  .order('created_at', { ascending: false });
```

### `src/app/admin/products/new/page.tsx` (Novo Produto)
Converter de Client Component para Server Action:
```typescript
// src/app/admin/products/new/actions.ts
'use server';
import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { error } = await supabase.from('products').insert({
    tenant_id: tenantId,
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    status: formData.get('status') as string,
    original_price: parseFloat(formData.get('original_price') as string),
    promo_price: parseFloat(formData.get('promo_price') as string),
    sku: formData.get('sku') as string,
    inventory_count: parseInt(formData.get('inventory_count') as string),
    description: formData.get('description') as string,
  });

  if (error) throw new Error(error.message);
  redirect('/admin/products');
}
```

---

## Ordem de Execução

1. Criar arquivo `supabase/migrations/20260405000001_multi_tenant_schema.sql`
2. Criar arquivo `supabase/migrations/20260405000002_rls_policies.sql`
3. Criar arquivo `supabase/migrations/20260405000003_seed_guardia_tenant.sql`
4. Criar `src/types/tenant.ts`
5. Criar `src/lib/tenant.ts`
6. Reescrever `src/middleware.ts`
7. Reescrever `src/lib/supabase-server.ts` (renomear export)
8. Atualizar imports em todos os arquivos admin (Task 8)
9. Atualizar queries do admin com `.eq('tenant_id', tenantId)` (Task 9)
10. Verificar: `rtk next build` — 0 erros TypeScript

## Critérios de Aceitação
- [ ] `next build` passa com 0 erros TypeScript
- [ ] Admin dashboard carrega os dados do tenant correto
- [ ] Tabela `tenants` existe com o tenant "guardia-de-choque" seedado
- [ ] Tabela `orders` existe (vazia por enquanto)
- [ ] `tenant_integrations` existe (vazia por enquanto — será preenchida na Fase 9)
- [ ] Produtos existentes têm `tenant_id` preenchido (não nulo)
- [ ] Função `get_user_tenant_id()` existe no banco
- [ ] RLS ativado em todas as novas tabelas
- [ ] `src/types/tenant.ts` exporta todos os tipos necessários
- [ ] `src/lib/tenant.ts` exporta `getTenantFromSession()` e `requireTenant()`
