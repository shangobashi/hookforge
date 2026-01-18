create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  is_pro boolean default false,
  tier text default 'free',
  created_at timestamp with time zone default now()
);

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  handle text,
  created_at timestamp with time zone default now()
);
