create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  url text not null,
  name text not null,
  size integer not null,
  created_at timestamptz not null default now()
);
