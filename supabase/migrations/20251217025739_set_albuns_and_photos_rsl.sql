alter table albums enable row level security;
alter table photos enable row level security;

create policy "User creates your own albums"
on albums for insert
to authenticated                      
with check ( (select auth.uid()) = user_id );

create policy "User read your own albums"
on albums
for select using ( (select auth.uid()) = user_id );

create policy "User updates your own albums"
on albums for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

create policy "User deletes your own albums"
on albums for delete
to authenticated
using ( (select auth.uid()) = user_id );

create policy "User adds photos to your albums"
on photos for insert
to authenticated
with check (
  (select auth.uid()) = (select user_id from albums where id = photos.album_id)
);

create policy "User reads photos from your albums"
on photos
for select
to authenticated
using (
   (select auth.uid()) = (select user_id from albums where id = photos.album_id)
);

create policy "User deletes photos from your albums"
on photos
for delete
to authenticated
using (
  (select auth.uid()) = (select user_id from albums where id = photos.album_id)
);
