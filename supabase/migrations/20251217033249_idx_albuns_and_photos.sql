create index if not exists idx_albums_user_id on public.albums(user_id);
create index if not exists idx_photos_album_id on public.photos(album_id);
