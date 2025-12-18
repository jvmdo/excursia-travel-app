alter table public.album_exports enable row level security;

create policy "Users can manage their own album exports"
on public.album_exports for all
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );
