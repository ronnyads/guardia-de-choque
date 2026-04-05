-- =============================================
-- SEED — Tenant: Guardiã de Choque
-- Migration: 20260405000003
-- =============================================
-- Migra a loja atual como primeiro tenant da plataforma.
-- Todos os produtos e upsell_rules existentes são associados.

DO $$
DECLARE
  v_tenant_id UUID;
  v_owner_id  UUID;
BEGIN
  -- Busca o primeiro usuário admin existente
  SELECT id INTO v_owner_id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1;

  -- Cria o tenant Guardiã de Choque
  INSERT INTO public.tenants (slug, name, status, plan, owner_id)
  VALUES ('guardia-de-choque', 'Guardiã de Choque', 'active', 'pro', v_owner_id)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE slug = 'guardia-de-choque';

  -- Cria relação tenant_users para o owner
  IF v_owner_id IS NOT NULL THEN
    INSERT INTO public.tenant_users (tenant_id, user_id, role)
    VALUES (v_tenant_id, v_owner_id, 'owner')
    ON CONFLICT (tenant_id, user_id) DO NOTHING;
  END IF;

  -- Configuração inicial da loja
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
    '(87) 99999-9944', 'contato@oliveiras.com',
    'guardiadechoque.online',
    'Guardiã de Choque | Defesa Pessoal',
    'A defesa pessoal que sua família merece. Compre com segurança.',
    '["🚚 Frete grátis acima de R$ 199", "⚡ 5% OFF no PIX", "💳 Parcele em 6x sem juros", "🔒 Compra 100% segura"]'::jsonb,
    '["Compra 100% Segura", "Frete Grátis acima de R$ 199", "PIX com 5% OFF"]'::jsonb
  )
  ON CONFLICT (tenant_id) DO NOTHING;

  -- Associa produtos existentes (sem tenant_id) ao tenant
  UPDATE public.products
  SET tenant_id = v_tenant_id
  WHERE tenant_id IS NULL;

  -- Associa upsell_rules existentes ao tenant
  UPDATE public.upsell_rules
  SET tenant_id = v_tenant_id
  WHERE tenant_id IS NULL;

  RAISE NOTICE 'Seed concluído: tenant % (ID: %)', 'guardia-de-choque', v_tenant_id;
END;
$$;
