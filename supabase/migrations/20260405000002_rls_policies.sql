-- =============================================
-- RLS POLICIES — CommerceOS Multi-Tenant
-- Migration: 20260405000002
-- =============================================

-- Helper: retorna tenant_id do usuário autenticado atual
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id
  FROM public.tenant_users
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ── TENANTS ──────────────────────────────────
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_select_own" ON public.tenants
  FOR SELECT USING (id = public.get_user_tenant_id());

CREATE POLICY "tenants_update_own" ON public.tenants
  FOR UPDATE USING (owner_id = auth.uid());

-- ── TENANT_USERS ─────────────────────────────
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_users_select_own" ON public.tenant_users
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

-- ── TENANT_CONFIG ─────────────────────────────
ALTER TABLE public.tenant_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_config_select" ON public.tenant_config
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "tenant_config_all" ON public.tenant_config
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── TENANT_INTEGRATIONS ───────────────────────
ALTER TABLE public.tenant_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_integrations_select" ON public.tenant_integrations
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "tenant_integrations_all" ON public.tenant_integrations
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── PRODUCTS ──────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Admin (autenticado) vê apenas seus produtos
CREATE POLICY "products_admin_tenant" ON public.products
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- Storefront: leitura pública de produtos ativos
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (status = 'active');

-- ── UPSELL_RULES ──────────────────────────────
ALTER TABLE public.upsell_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upsell_rules_tenant" ON public.upsell_rules
  FOR ALL USING (tenant_id = public.get_user_tenant_id());

-- ── ORDERS ────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_tenant" ON public.orders
  FOR ALL USING (tenant_id = public.get_user_tenant_id());
