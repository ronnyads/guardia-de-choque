-- =============================================
-- Adiciona suporte a cartão recusado nos leads
-- Migration: 20260412000002
-- =============================================

-- Adiciona coluna para motivo da recusa
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS decline_reason TEXT;

-- Recria o CHECK constraint incluindo o novo status card_declined
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN ('checkout_started', 'converted', 'recovered', 'card_declined'));
