insert into storage.buckets (
  id, 
  name, 
  public, 
  allowed_mime_types
)
values (
  'album-pdfs', 
  'album-pdfs', 
  false, 
  array['application/pdf']
)
on conflict (id) do nothing;
