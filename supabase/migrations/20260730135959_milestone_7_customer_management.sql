-- Milestone 7 customer management.
-- Customers remain independent from all other business entities. Clerk remains
-- the sole authentication provider and Supabase Auth is not used.

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone_number text,
  email text,
  notes text,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_full_name_not_blank check (
    length(trim(full_name)) > 0
  ),
  constraint customers_full_name_length check (length(full_name) <= 120),
  constraint customers_phone_number_not_blank check (
    phone_number is null or length(trim(phone_number)) > 0
  ),
  constraint customers_phone_number_length check (
    phone_number is null or length(phone_number) <= 32
  ),
  constraint customers_email_not_blank check (
    email is null or length(trim(email)) > 0
  ),
  constraint customers_email_length check (
    email is null or length(email) <= 254
  ),
  constraint customers_email_lowercase check (
    email is null or email = lower(email)
  ),
  constraint customers_notes_not_blank check (
    notes is null or length(trim(notes)) > 0
  ),
  constraint customers_notes_length check (
    notes is null or length(notes) <= 2000
  )
);

create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

create index customers_current_status_name_idx
on public.customers (is_active, full_name, id)
where deleted_at is null;

create index customers_deleted_name_idx
on public.customers (full_name, id)
where deleted_at is not null;

alter table public.customers enable row level security;
