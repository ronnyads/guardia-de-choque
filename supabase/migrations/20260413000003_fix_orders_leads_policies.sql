-- =============================================
-- Fix: Orders RLS + Leads upsert constraint
-- Migration: 20260413000003
-- =============================================

-- ── ORDERS: recriar políticas limpas ─────────────────────────────

-- Drop todas as políticas existentes de orders
DROP POLICY IF EXISTS "orders_tenant"        ON public.orders;
DROP POLICY IF EXISTS "orders_select_tenant" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_open"   ON public.orders;
DROP POLICY IF EXISTS "orders_update_open"   ON public.orders;

-- SELECT: admin vê pedidos do seu tenant (via tenant_users OU via tenants.owner_id)
CREATE POLICY "orders_select_tenant" ON public.orders
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- INSERT: aberto — checkout API sem sessão pode inserir
CREATE POLICY "orders_insert_open" ON public.orders
  FOR INSERT WITH CHECK (true);

-- UPDATE: aberto — polling PIX, webhooks, server actions
CREATE POLICY "orders_update_open" ON public.orders
  FOR UPDATE USING (true) WITH CHECK (true);

-- DELETE: apenas admin do tenant
CREATE POLICY "orders_delete_tenant" ON public.orders
  FOR DELETE USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
      UNION
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- ── LEADS: adicionar unique constraint para upsert ────────────────

-- Remove constraint antiga se existir
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_tenant_email_product_unique;

-- Adiciona unique constraint para deduplicação por tenant + email + produto
ALTER TABLE public.leads
  ADD CONSTRAINT leads_tenant_email_product_unique
  UNIQUE (tenant_id, customer_email, product_slug);
