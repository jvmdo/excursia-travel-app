create table if not exists public.album_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  album_id text not null, -- Local album ID (dexie)
  storage_path text not null, -- Bucket path (ex: userId/albumId.pdf)
  size_bytes integer,
  created_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null,
  unique (user_id, album_id) -- ensure overwrite
);
