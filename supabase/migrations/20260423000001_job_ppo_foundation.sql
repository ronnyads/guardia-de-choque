create extension if not exists pgcrypto;
create extension if not exists citext;

create schema if not exists job_ppo;

create type job_ppo.user_role as enum ('subscriber', 'creator', 'admin', 'super_admin');
create type job_ppo.account_status as enum ('active', 'pending', 'suspended', 'banned');
create type job_ppo.creator_status as enum ('draft', 'pending_review', 'approved', 'rejected', 'suspended');
create type job_ppo.verification_status as enum ('pending', 'approved', 'rejected', 'expired');
create type job_ppo.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'paused');
create type job_ppo.payment_status as enum ('pending', 'paid', 'failed', 'refunded', 'chargeback');
create type job_ppo.payout_status as enum ('pending', 'processing', 'paid', 'failed');
create type job_ppo.post_visibility as enum ('public', 'premium');
create type job_ppo.post_status as enum ('draft', 'scheduled', 'pending_review', 'published', 'rejected', 'archived');
create type job_ppo.media_kind as enum ('image', 'video', 'audio');
create type job_ppo.media_access as enum ('public', 'teaser', 'premium', 'private');
create type job_ppo.report_target as enum ('profile', 'post', 'media', 'message');
create type job_ppo.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type job_ppo.setting_scope as enum ('platform', 'creator');

create or replace function job_ppo.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists job_ppo.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email citext not null unique,
  role job_ppo.user_role not null,
  status job_ppo.account_status not null default 'active',
  full_name text not null,
  phone text,
  birth_date date,
  country_code char(2) default 'BR',
  last_login_at timestamptz,
  fraud_score numeric(5,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.profiles (
  user_id uuid primary key references job_ppo.users(id) on delete cascade,
  username citext not null unique,
  display_name text not null,
  avatar_url text,
  cover_url text,
  bio text,
  city text,
  state text,
  instagram_handle text,
  website_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.categories (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  name text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.tags (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references job_ppo.users(id) on delete cascade,
  primary_category_id uuid references job_ppo.categories(id) on delete set null,
  artistic_name text not null,
  slug citext not null unique,
  tagline text,
  teaser_text text,
  hero_media_url text,
  status job_ppo.creator_status not null default 'draft',
  verification_status job_ppo.verification_status not null default 'pending',
  base_subscription_price numeric(12,2) not null default 0,
  is_featured boolean not null default false,
  is_new boolean not null default true,
  is_trending boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.profile_tags (
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  tag_id uuid not null references job_ppo.tags(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (creator_id, tag_id)
);

create table if not exists job_ppo.creator_verification (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  document_type text not null,
  document_front_url text,
  document_back_url text,
  selfie_url text,
  status job_ppo.verification_status not null default 'pending',
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  reviewed_by uuid references job_ppo.users(id) on delete set null,
  review_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.plans (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  name text not null,
  description text,
  price_monthly numeric(12,2) not null,
  currency char(3) not null default 'BRL',
  billing_interval text not null default 'month',
  stripe_product_id text unique,
  stripe_price_id text unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  trial_days integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint plans_positive_price check (price_monthly >= 0)
);

create table if not exists job_ppo.subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references job_ppo.users(id) on delete cascade,
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  plan_id uuid not null references job_ppo.plans(id) on delete restrict,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_subscription_id text unique,
  status job_ppo.subscription_status not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint subscriptions_unique_active_plan unique (subscriber_id, creator_id, plan_id)
);

create table if not exists job_ppo.payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references job_ppo.subscriptions(id) on delete set null,
  subscriber_id uuid not null references job_ppo.users(id) on delete cascade,
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  amount_gross numeric(12,2) not null,
  platform_fee numeric(12,2) not null default 0,
  creator_net numeric(12,2) not null default 0,
  currency char(3) not null default 'BRL',
  status job_ppo.payment_status not null default 'pending',
  provider text not null default 'stripe',
  provider_payment_id text unique,
  failure_reason text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payments_non_negative check (
    amount_gross >= 0 and platform_fee >= 0 and creator_net >= 0
  )
);

create table if not exists job_ppo.payouts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  gross_amount numeric(12,2) not null,
  fees_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null,
  status job_ppo.payout_status not null default 'pending',
  external_reference text unique,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint payouts_period check (period_end >= period_start)
);

create table if not exists job_ppo.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  title text not null,
  slug citext not null,
  excerpt text,
  body text,
  visibility job_ppo.post_visibility not null default 'premium',
  status job_ppo.post_status not null default 'draft',
  cover_media_url text,
  scheduled_at timestamptz,
  published_at timestamptz,
  moderated_by uuid references job_ppo.users(id) on delete set null,
  moderated_at timestamptz,
  moderation_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (creator_id, slug)
);

create table if not exists job_ppo.media (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  post_id uuid references job_ppo.posts(id) on delete cascade,
  kind job_ppo.media_kind not null,
  access_level job_ppo.media_access not null default 'premium',
  storage_bucket text not null default 'job-ppo-private',
  storage_path text not null unique,
  thumbnail_url text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  duration_seconds integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.favorites (
  subscriber_id uuid not null references job_ppo.users(id) on delete cascade,
  creator_id uuid not null references job_ppo.creators(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (subscriber_id, creator_id)
);

create table if not exists job_ppo.messages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references job_ppo.creators(id) on delete set null,
  sender_id uuid not null references job_ppo.users(id) on delete cascade,
  recipient_id uuid not null references job_ppo.users(id) on delete cascade,
  subject text,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references job_ppo.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references job_ppo.users(id) on delete set null,
  target_type job_ppo.report_target not null,
  target_id uuid not null,
  reason text not null,
  description text,
  status job_ppo.report_status not null default 'open',
  assigned_to uuid references job_ppo.users(id) on delete set null,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references job_ppo.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists job_ppo.settings (
  id uuid primary key default gen_random_uuid(),
  scope job_ppo.setting_scope not null default 'platform',
  scope_id uuid,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (scope, scope_id, key)
);

create index if not exists idx_job_ppo_users_role on job_ppo.users(role);
create index if not exists idx_job_ppo_users_status on job_ppo.users(status);
create index if not exists idx_job_ppo_profiles_username on job_ppo.profiles(username);
create index if not exists idx_job_ppo_categories_sort on job_ppo.categories(sort_order);
create index if not exists idx_job_ppo_creators_status on job_ppo.creators(status, verification_status);
create index if not exists idx_job_ppo_creators_category on job_ppo.creators(primary_category_id);
create index if not exists idx_job_ppo_plans_creator on job_ppo.plans(creator_id, is_active, is_featured);
create index if not exists idx_job_ppo_subscriptions_status on job_ppo.subscriptions(status, current_period_end);
create index if not exists idx_job_ppo_payments_paid_at on job_ppo.payments(status, paid_at desc);
create index if not exists idx_job_ppo_payouts_status on job_ppo.payouts(status, paid_at desc);
create index if not exists idx_job_ppo_posts_creator_status on job_ppo.posts(creator_id, status, published_at desc);
create index if not exists idx_job_ppo_media_creator_access on job_ppo.media(creator_id, access_level);
create index if not exists idx_job_ppo_notifications_user on job_ppo.notifications(user_id, read_at);
create index if not exists idx_job_ppo_reports_status on job_ppo.reports(status, created_at desc);
create index if not exists idx_job_ppo_admin_logs_admin on job_ppo.admin_logs(admin_user_id, created_at desc);

create trigger trg_job_ppo_users_updated_at
before update on job_ppo.users
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_profiles_updated_at
before update on job_ppo.profiles
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_categories_updated_at
before update on job_ppo.categories
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_creators_updated_at
before update on job_ppo.creators
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_creator_verification_updated_at
before update on job_ppo.creator_verification
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_plans_updated_at
before update on job_ppo.plans
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_subscriptions_updated_at
before update on job_ppo.subscriptions
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_payments_updated_at
before update on job_ppo.payments
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_payouts_updated_at
before update on job_ppo.payouts
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_posts_updated_at
before update on job_ppo.posts
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_media_updated_at
before update on job_ppo.media
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_reports_updated_at
before update on job_ppo.reports
for each row execute function job_ppo.touch_updated_at();

create trigger trg_job_ppo_settings_updated_at
before update on job_ppo.settings
for each row execute function job_ppo.touch_updated_at();
