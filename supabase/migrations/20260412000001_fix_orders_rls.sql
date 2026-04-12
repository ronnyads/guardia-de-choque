-- =============================================
-- Fix: RLS policies da tabela orders
-- Migration: 20260412000001
--
-- PROBLEMA: A policy "orders_tenant" usava FOR ALL USING (...) sem WITH CHECK.
-- Isso faz o PostgreSQL aplicar USING como filtro de linha em INSERTs também,
-- retornando 0 rows afetadas (sem erro) quando auth.uid() é NULL — como acontece
-- nas API routes de checkout que rodam fora de sessão autenticada.
-- =============================================

DROP POLICY IF EXISTS "orders_tenant" ON public.orders;

-- SELECT: admin vê apenas pedidos do seu tenant
CREATE POLICY "orders_select_tenant" ON public.orders
  FOR SELECT USING (tenant_id = public.get_user_tenant_id());

-- INSERT: permitido para service role (checkout API) — sem restrição de linha
CREATE POLICY "orders_insert_open" ON public.orders
  FOR INSERT WITH CHECK (true);

-- UPDATE: permitido para service role (polling PIX, webhooks futuros)
CREATE POLICY "orders_update_open" ON public.orders
  FOR UPDATE USING (true) WITH CHECK (true);
