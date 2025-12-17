 create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
