export interface Tenant {
  id: string;
  slug: string;
  name: string;
  custom_domain: string | null;
  status: 'trial' | 'active' | 'inactive';
  plan: 'free' | 'starter' | 'pro';
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'viewer';
  created_at: string;
}

export interface TenantConfig {
  id: string;
  tenant_id: string;
  brand_name: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  phone: string | null;
  email: string | null;
  domain_display: string | null;
  announcement_messages: string[];
  trust_messages: string[];
  faq_items: FaqItem[];
  stats: StatItem[];
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  checkout_enable_stripe_fallback: boolean;
  checkout_retry_delay_ms: number;
  checkout_pix_polling_ms: number;
  checkout_upsell_price: number;
  checkout_order_bump_price: number;
  recovery_whatsapp_template: string | null;
  updated_at: string;
}

export interface TenantIntegration {
  id: string;
  tenant_id: string;
  provider: 'mercadopago' | 'stripe' | 'meta_pixel' | 'kwai_pixel';
  public_key: string | null;
  /** Nunca exposto no client — apenas no servidor */
  secret_key_encrypted: string | null;
  extra_config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: CustomerAddress | null;
  items: OrderItem[];
  total_amount: number;
  payment_method: 'pix' | 'card' | null;
  payment_provider: 'mercadopago' | 'stripe' | null;
  external_payment_id: string | null;
  status: 'pending' | 'approved' | 'failed' | 'refunded' | 'cancelled';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
}
