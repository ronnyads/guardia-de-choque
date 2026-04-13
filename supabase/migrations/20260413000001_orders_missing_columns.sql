-- Colunas usadas pelo código mas ausentes na tabela orders de produção
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_provider    TEXT,
  ADD COLUMN IF NOT EXISTS external_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS items               JSONB;
