-- Peso e dimensões nos produtos (defaults razoáveis para a Guardiã de Choque)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS weight_g    INT NOT NULL DEFAULT 500,
  ADD COLUMN IF NOT EXISTS length_cm   INT NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS width_cm    INT NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS height_cm   INT NOT NULL DEFAULT 5;

-- Config de frete no tenant_config
ALTER TABLE public.tenant_config
  ADD COLUMN IF NOT EXISTS shipping_origin_cep TEXT,
  ADD COLUMN IF NOT EXISTS shipping_free        BOOLEAN NOT NULL DEFAULT true;

-- Colunas no orders para registrar o frete escolhido
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS shipping_cost   NUMERIC(10,2) NOT NULL DEFAULT 0;

NOTIFY pgrst, 'reload schema';
