-- Adiciona colunas de configuração de checkout ao tenant_config
-- Rode esse SQL no Supabase SQL Editor

ALTER TABLE public.tenant_config
  ADD COLUMN IF NOT EXISTS checkout_enable_stripe_fallback BOOLEAN      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS checkout_retry_delay_ms          INTEGER      NOT NULL DEFAULT 900,
  ADD COLUMN IF NOT EXISTS checkout_pix_polling_ms          INTEGER      NOT NULL DEFAULT 3000,
  ADD COLUMN IF NOT EXISTS checkout_upsell_price            NUMERIC(10,2) NOT NULL DEFAULT 69.90,
  ADD COLUMN IF NOT EXISTS checkout_order_bump_price        NUMERIC(10,2) NOT NULL DEFAULT 29.90;
