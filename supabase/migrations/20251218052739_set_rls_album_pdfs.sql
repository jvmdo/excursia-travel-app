create policy "Authenticated users can upload album PDFs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'album-pdfs'
  and auth.uid()::text = owner_id
);

create policy "Authenticated users can read their album PDFs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'album-pdfs'
  and auth.uid()::text = owner_id
);

create policy "Authenticated users can delete their album PDFs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'album-pdfs'
  and auth.uid()::text = owner_id
);
