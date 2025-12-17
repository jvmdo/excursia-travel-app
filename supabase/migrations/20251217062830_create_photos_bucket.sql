insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'photos',
  'photos',
  false,
  10485760, -- 10 MB
  array[
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/heic'
  ]
);
