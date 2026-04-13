-- Adiciona 'superfrete' como provider válido em tenant_integrations
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
    'google_tag_manager',
    'superfrete'
  ));
