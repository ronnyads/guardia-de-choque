-- Campos de funil por produto (Order Bump, Upsell, Downsell)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS bump_label     TEXT,
  ADD COLUMN IF NOT EXISTS bump_price     DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS upsell_label   TEXT,
  ADD COLUMN IF NOT EXISTS upsell_price   DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS downsell_label TEXT,
  ADD COLUMN IF NOT EXISTS downsell_price DECIMAL(10,2);
