-- Campos extras para gestão de pedidos no admin
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_code   TEXT,
  ADD COLUMN IF NOT EXISTS internal_notes  TEXT;
