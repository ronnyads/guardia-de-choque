-- =============================================
-- MULTI-TENANT SCHEMA — CommerceOS
-- Migration: 20260405000001
-- =============================================

-- ── TENANTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  custom_domain TEXT,
  status        TEXT NOT NULL DEFAULT 'trial'
                  CHECK (status IN ('trial', 'active', 'inactive')),
  plan          TEXT NOT NULL DEFAULT 'free'
                  CHECK (plan IN ('free', 'starter', 'pro')),
  owner_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── TENANT_USERS ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'owner'
                CHECK (role IN ('owner', 'admin', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- ── TENANT_CONFIG ─────────────────────────────
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

-- ── TENANT_INTEGRATIONS ───────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.tenant_integrations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  provider             TEXT NOT NULL
                         CHECK (provider IN ('mercadopago', 'stripe', 'meta_pixel', 'kwai_pixel')),
  public_key           TEXT,
  secret_key_encrypted TEXT,
  extra_config         JSONB DEFAULT '{}'::jsonb,
  is_active            BOOLEAN NOT NULL DEFAULT true,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, provider)
);

-- ── ORDERS ────────────────────────────────────
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
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'approved', 'failed', 'refunded', 'cancelled')),
  metadata            JSONB DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── ADICIONAR tenant_id EM TABELAS EXISTENTES ─
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.upsell_rules
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- ── INDEXES ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_tenant_id
  ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_upsell_rules_tenant_id
  ON public.upsell_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id
  ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status
  ON public.orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id
  ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integrations_tenant_provider
  ON public.tenant_integrations(tenant_id, provider);
