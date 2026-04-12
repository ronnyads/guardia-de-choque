-- =============================================
-- Adiciona Google Analytics 4 e Google Tag Manager
-- Migration: 20260412000003
-- =============================================

ALTER TABLE public.tenant_integrations
  DROP CONSTRAINT IF EXISTS tenant_integrations_provider_check;

ALTER TABLE public.tenant_integrations
  ADD CONSTRAINT tenant_integrations_provider_check
  CHECK (provider IN (
    'mercadopago',
    'stripe',
    'meta_pixel',
    'kwai_pixel',
    'google_analytics',
    'google_tag_manager'
  ));
