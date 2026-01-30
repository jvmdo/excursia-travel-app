CREATE TABLE IF NOT EXISTS public.customers ( 
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), 
  email text UNIQUE not null, 
  name text, 
  lastname text, 
  document text, 
  phone text, 
  cell text, 
  created_at timestamp with time zone default timezone('utc', now()) not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null
);