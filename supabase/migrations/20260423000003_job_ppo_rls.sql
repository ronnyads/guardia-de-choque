grant usage on schema job_ppo to authenticated;
grant select, insert, update, delete on all tables in schema job_ppo to authenticated;

create or replace function job_ppo.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = job_ppo
as $$
  select id
  from job_ppo.users
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function job_ppo.current_app_role()
returns job_ppo.user_role
language sql
stable
security definer
set search_path = job_ppo
as $$
  select role
  from job_ppo.users
  where auth_user_id = auth.uid()
  limit 1
$$;

grant execute on function job_ppo.current_app_user_id() to authenticated;
grant execute on function job_ppo.current_app_role() to authenticated;

alter table job_ppo.users enable row level security;
alter table job_ppo.profiles enable row level security;
alter table job_ppo.creators enable row level security;
alter table job_ppo.plans enable row level security;
alter table job_ppo.subscriptions enable row level security;
alter table job_ppo.payments enable row level security;
alter table job_ppo.posts enable row level security;
alter table job_ppo.media enable row level security;
alter table job_ppo.favorites enable row level security;
alter table job_ppo.notifications enable row level security;
alter table job_ppo.messages enable row level security;
alter table job_ppo.reports enable row level security;
alter table job_ppo.settings enable row level security;
alter table job_ppo.admin_logs enable row level security;

create policy "users self or admin select"
on job_ppo.users
for select
to authenticated
using (
  id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "users self update"
on job_ppo.users
for update
to authenticated
using (
  id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "profiles public read"
on job_ppo.profiles
for select
to authenticated
using (
  is_public = true
  or user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "profiles own write"
on job_ppo.profiles
for all
to authenticated
using (
  user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "creators public approved read"
on job_ppo.creators
for select
to authenticated
using (
  status = 'approved'
  or user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "creators own write"
on job_ppo.creators
for all
to authenticated
using (
  user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  user_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "plans public active read"
on job_ppo.plans
for select
to authenticated
using (
  is_active = true
  or creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "plans creator write"
on job_ppo.plans
for all
to authenticated
using (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "subscriptions own creator admin read"
on job_ppo.subscriptions
for select
to authenticated
using (
  subscriber_id = job_ppo.current_app_user_id()
  or creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "subscriptions subscriber write"
on job_ppo.subscriptions
for insert
to authenticated
with check (
  subscriber_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "payments own creator admin read"
on job_ppo.payments
for select
to authenticated
using (
  subscriber_id = job_ppo.current_app_user_id()
  or creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "posts public or entitled read"
on job_ppo.posts
for select
to authenticated
using (
  (
    status = 'published'
    and visibility = 'public'
  )
  or creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
  or (
    status = 'published'
    and visibility = 'premium'
    and exists (
      select 1
      from job_ppo.subscriptions s
      where s.creator_id = posts.creator_id
        and s.subscriber_id = job_ppo.current_app_user_id()
        and s.status = 'active'
    )
  )
);

create policy "posts creator write"
on job_ppo.posts
for all
to authenticated
using (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "media entitled read"
on job_ppo.media
for select
to authenticated
using (
  access_level in ('public', 'teaser')
  or creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
  or (
    access_level = 'premium'
    and exists (
      select 1
      from job_ppo.subscriptions s
      where s.creator_id = media.creator_id
        and s.subscriber_id = job_ppo.current_app_user_id()
        and s.status = 'active'
    )
  )
);

create policy "media creator write"
on job_ppo.media
for all
to authenticated
using (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
)
with check (
  creator_id in (
    select id from job_ppo.creators where user_id = job_ppo.current_app_user_id()
  )
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "favorites own read write"
on job_ppo.favorites
for all
to authenticated
using (subscriber_id = job_ppo.current_app_user_id())
with check (subscriber_id = job_ppo.current_app_user_id());

create policy "notifications own read"
on job_ppo.notifications
for select
to authenticated
using (user_id = job_ppo.current_app_user_id());

create policy "notifications own update"
on job_ppo.notifications
for update
to authenticated
using (user_id = job_ppo.current_app_user_id())
with check (user_id = job_ppo.current_app_user_id());

create policy "messages thread members read"
on job_ppo.messages
for select
to authenticated
using (
  sender_id = job_ppo.current_app_user_id()
  or recipient_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "messages sender write"
on job_ppo.messages
for insert
to authenticated
with check (
  sender_id = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "reports reporter read"
on job_ppo.reports
for select
to authenticated
using (
  reporter_user_id = job_ppo.current_app_user_id()
  or assigned_to = job_ppo.current_app_user_id()
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "reports reporter insert"
on job_ppo.reports
for insert
to authenticated
with check (reporter_user_id = job_ppo.current_app_user_id());

create policy "reports admin update"
on job_ppo.reports
for update
to authenticated
using (job_ppo.current_app_role() in ('admin', 'super_admin'))
with check (job_ppo.current_app_role() in ('admin', 'super_admin'));

create policy "settings public read or admin"
on job_ppo.settings
for select
to authenticated
using (
  is_public = true
  or job_ppo.current_app_role() in ('admin', 'super_admin')
);

create policy "settings admin write"
on job_ppo.settings
for all
to authenticated
using (job_ppo.current_app_role() in ('admin', 'super_admin'))
with check (job_ppo.current_app_role() in ('admin', 'super_admin'));

create policy "admin logs admin only"
on job_ppo.admin_logs
for select
to authenticated
using (job_ppo.current_app_role() in ('admin', 'super_admin'));
