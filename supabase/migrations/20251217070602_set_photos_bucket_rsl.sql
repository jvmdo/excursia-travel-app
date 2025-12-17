-- INSERT
create policy "Authenticated users can upload photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'photos'
  and owner_id = auth.uid()::text
);

-- SELECT
create policy "Authenticated users can read their photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'photos'
  and owner_id = auth.uid()::text
);

-- DELETE
create policy "Authenticated users can delete their photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'photos'
  and owner_id = auth.uid()::text
);
