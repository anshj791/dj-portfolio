create table if not exists public.portfolio_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Public can read portfolio content" on public.portfolio_content;
create policy "Public can read portfolio content"
on public.portfolio_content
for select
to anon
using (true);

-- Writes are handled by the Next.js API route using SUPABASE_SERVICE_ROLE_KEY.
-- Do not add anon insert/update policies for this table.
