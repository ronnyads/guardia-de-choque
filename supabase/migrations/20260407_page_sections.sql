-- Add page builder columns to tenant_config
ALTER TABLE public.tenant_config
  ADD COLUMN IF NOT EXISTS page_sections JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS header_config  JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_config  JSONB DEFAULT '{}'::jsonb;
