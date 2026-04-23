insert into job_ppo.categories (id, slug, name, description, sort_order)
values
  ('10000000-0000-0000-0000-000000000001', 'editorial-glam', 'Editorial Glam', 'Perfis com recorte editorial e campanha premium.', 1),
  ('10000000-0000-0000-0000-000000000002', 'soft-boudoir', 'Soft Boudoir', 'Atmosfera suave, elegante e intimista.', 2),
  ('10000000-0000-0000-0000-000000000003', 'late-night-club', 'Late Night Club', 'Energia de noite, clube e colecoes de alta conversao.', 3)
on conflict (id) do nothing;

insert into job_ppo.tags (id, slug, name)
values
  ('11000000-0000-0000-0000-000000000001', 'editorial', 'Editorial'),
  ('11000000-0000-0000-0000-000000000002', 'luxo', 'Luxo'),
  ('11000000-0000-0000-0000-000000000003', 'trending', 'Trending'),
  ('11000000-0000-0000-0000-000000000004', 'teaser', 'Teaser')
on conflict (id) do nothing;

insert into job_ppo.users (id, email, role, status, full_name)
values
  ('20000000-0000-0000-0000-000000000001', 'clara@jobppo.com', 'subscriber', 'active', 'Clara Mendes'),
  ('20000000-0000-0000-0000-000000000002', 'ayla@jobppo.com', 'creator', 'active', 'Ayla Noir'),
  ('20000000-0000-0000-0000-000000000003', 'helena@jobppo.com', 'admin', 'active', 'Helena Costa'),
  ('20000000-0000-0000-0000-000000000004', 'marina@jobppo.com', 'super_admin', 'active', 'Marina Vale')
on conflict (id) do nothing;

insert into job_ppo.profiles (user_id, username, display_name, bio)
values
  ('20000000-0000-0000-0000-000000000001', 'clara', 'Clara Mendes', 'Assinante premium com foco em discovery e colecao privada.'),
  ('20000000-0000-0000-0000-000000000002', 'ayla-noir', 'Ayla Noir', 'Criadora com editorial intimista, backstage e drops premium.'),
  ('20000000-0000-0000-0000-000000000003', 'helena-ops', 'Helena Costa', 'Admin operacional da plataforma.'),
  ('20000000-0000-0000-0000-000000000004', 'marina-governance', 'Marina Vale', 'Super admin responsavel por governanca.')
on conflict (user_id) do nothing;

insert into job_ppo.creators (
  id,
  user_id,
  primary_category_id,
  artistic_name,
  slug,
  tagline,
  teaser_text,
  status,
  verification_status,
  base_subscription_price,
  is_featured,
  is_new,
  is_trending,
  published_at
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'Ayla Noir',
    'ayla-noir',
    'Editorial intimista com atmosfera premium.',
    'Galerias teaser, backstage e series premium semanais.',
    'approved',
    'approved',
    59.00,
    true,
    false,
    true,
    timezone('utc', now())
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000003',
    'Marina Nights',
    'marina-nights',
    'Colecoes after hours com posicionamento aspiracional.',
    'Drops noturnos, destaque editorial e CTA de assinatura fixo.',
    'approved',
    'approved',
    74.00,
    true,
    true,
    true,
    timezone('utc', now())
  )
on conflict (id) do nothing;

insert into job_ppo.profile_tags (creator_id, tag_id)
values
  ('30000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000003')
on conflict do nothing;

insert into job_ppo.creator_verification (
  id,
  creator_id,
  document_type,
  status,
  reviewed_at,
  reviewed_by,
  review_notes
)
values
  (
    '31000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'documento_identidade',
    'approved',
    timezone('utc', now()),
    '20000000-0000-0000-0000-000000000003',
    'Documentacao conferida e validada.'
  )
on conflict (id) do nothing;

insert into job_ppo.plans (
  id,
  creator_id,
  name,
  description,
  price_monthly,
  currency,
  sort_order,
  is_active,
  is_featured
)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Velvet Circle',
    'Acesso premium a editoriais e drops privados.',
    79.00,
    'BRL',
    1,
    true,
    true
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'Night Club',
    'Assinatura premium para colecoes after hours.',
    74.00,
    'BRL',
    1,
    true,
    true
  )
on conflict (id) do nothing;

insert into job_ppo.subscriptions (
  id,
  subscriber_id,
  creator_id,
  plan_id,
  provider,
  provider_customer_id,
  provider_subscription_id,
  status,
  current_period_start,
  current_period_end
)
values
  (
    '50000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    'stripe',
    'cus_demo_clara',
    'sub_demo_ayla',
    'active',
    timezone('utc', now()) - interval '10 days',
    timezone('utc', now()) + interval '20 days'
  )
on conflict (id) do nothing;

insert into job_ppo.payments (
  id,
  subscription_id,
  subscriber_id,
  creator_id,
  amount_gross,
  platform_fee,
  creator_net,
  currency,
  status,
  provider,
  provider_payment_id,
  paid_at
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    79.00,
    11.85,
    67.15,
    'BRL',
    'paid',
    'stripe',
    'pi_demo_ayla_01',
    timezone('utc', now()) - interval '9 days'
  )
on conflict (id) do nothing;

insert into job_ppo.payouts (
  id,
  creator_id,
  period_start,
  period_end,
  gross_amount,
  fees_amount,
  net_amount,
  status,
  external_reference,
  paid_at
)
values
  (
    '70000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    current_date - 30,
    current_date - 1,
    7900.00,
    1185.00,
    6715.00,
    'processing',
    'payout_demo_ayla_01',
    null
  )
on conflict (id) do nothing;

insert into job_ppo.posts (
  id,
  creator_id,
  title,
  slug,
  excerpt,
  body,
  visibility,
  status,
  published_at
)
values
  (
    '80000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Editorial Velvet Room',
    'editorial-velvet-room',
    'Backstage premium da semana.',
    'Conteudo editorial premium com teaser e CTA de assinatura.',
    'premium',
    'published',
    timezone('utc', now()) - interval '3 days'
  ),
  (
    '80000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    'Rose Dust Morning',
    'rose-dust-morning',
    'Preview publico para discovery.',
    'Post publico para aquecer conversao.',
    'public',
    'published',
    timezone('utc', now()) - interval '1 day'
  )
on conflict (id) do nothing;

insert into job_ppo.media (
  id,
  creator_id,
  post_id,
  kind,
  access_level,
  storage_bucket,
  storage_path,
  thumbnail_url,
  mime_type
)
values
  (
    '81000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000001',
    'image',
    'premium',
    'job-ppo-private',
    'creators/ayla/editorial-velvet-room/cover.jpg',
    'https://example.com/thumb-ayla-cover.jpg',
    'image/jpeg'
  ),
  (
    '81000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000000002',
    'image',
    'public',
    'job-ppo-public',
    'creators/ayla/rose-dust-morning/teaser.jpg',
    'https://example.com/thumb-ayla-teaser.jpg',
    'image/jpeg'
  )
on conflict (id) do nothing;

insert into job_ppo.favorites (subscriber_id, creator_id)
values ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into job_ppo.messages (id, creator_id, sender_id, recipient_id, subject, body)
values
  (
    '90000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'Novo drop',
    'Amei o editorial novo, quando sai a proxima parte?'
  )
on conflict (id) do nothing;

insert into job_ppo.notifications (id, user_id, type, title, message, payload)
values
  (
    '91000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'subscription_renewal',
    'Renovacao confirmada',
    'Sua assinatura de Ayla Noir foi renovada com sucesso.',
    '{"creator_slug":"ayla-noir"}'::jsonb
  ),
  (
    '91000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'verification_update',
    'Verificacao aprovada',
    'Sua conta esta aprovada e pronta para publicar.',
    '{"status":"approved"}'::jsonb
  )
on conflict (id) do nothing;

insert into job_ppo.reports (
  id,
  reporter_user_id,
  target_type,
  target_id,
  reason,
  description,
  status,
  assigned_to
)
values
  (
    '92000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'post',
    '80000000-0000-0000-0000-000000000002',
    'conteudo inadequado',
    'Solicito revisao do teaser publicado.',
    'reviewing',
    '20000000-0000-0000-0000-000000000003'
  )
on conflict (id) do nothing;

insert into job_ppo.admin_logs (
  id,
  admin_user_id,
  action,
  entity_type,
  entity_id,
  description,
  metadata
)
values
  (
    '93000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000003',
    'creator.approved',
    'creator_verification',
    '31000000-0000-0000-0000-000000000001',
    'Criadora aprovada apos revisao documental.',
    '{"creator_slug":"ayla-noir"}'::jsonb
  )
on conflict (id) do nothing;

insert into job_ppo.settings (id, scope, key, value, is_public)
values
  (
    '94000000-0000-0000-0000-000000000001',
    'platform',
    'homepage.hero',
    '{"headline":"Descoberta premium e assinatura recorrente","cta":"Explorar perfis"}'::jsonb,
    true
  ),
  (
    '94000000-0000-0000-0000-000000000002',
    'platform',
    'billing.platform_fee_percent',
    '{"value":15}'::jsonb,
    false
  )
on conflict (id) do nothing;
