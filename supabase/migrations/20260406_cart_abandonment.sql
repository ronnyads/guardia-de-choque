-- Tabela de leads / carrinho abandonado
-- Rode esse SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Dados do lead
  customer_name     TEXT,
  customer_email    TEXT,
  customer_phone    TEXT,

  -- Produto de interesse
  product_slug      TEXT,
  product_name      TEXT,
  product_price     NUMERIC(10,2),

  -- Status
  status            TEXT NOT NULL DEFAULT 'checkout_started'
                      CHECK (status IN ('checkout_started', 'converted', 'recovered')),

  -- Ligação com pedido (quando converte)
  order_id          UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Recuperação
  recovery_sent_at  TIMESTAMPTZ,
  recovery_channel  TEXT,

  -- UTM
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id     ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_status ON public.leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at    ON public.leads(created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Super admins e owners do tenant veem seus leads
CREATE POLICY "leads_tenant_isolation" ON public.leads
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
    )
  );

-- Template de recuperação WhatsApp no tenant_config
ALTER TABLE public.tenant_config
  ADD COLUMN IF NOT EXISTS recovery_whatsapp_template TEXT
    DEFAULT 'Olá {name}! Vi que você ficou interessado(a) na {product}. Podemos ajudar? Acesse: {link}';
