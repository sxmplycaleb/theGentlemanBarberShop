-- Milestone 3 core business schema foundation.
-- Supabase PostgreSQL remains the approved database.
-- Clerk remains the sole authentication provider; no authentication, role, or
-- permission fields are introduced in this migration.
--
-- This migration intentionally creates schema only. Customer profiles, booking,
-- appointments, payments, notifications, dashboards, analytics, gallery,
-- uploads, CRUD endpoints, forms, UI, server actions, and repositories belong
-- to future explicitly approved milestones.

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_categories_name_not_blank check (length(trim(name)) > 0),
  constraint service_categories_slug_not_blank check (length(trim(slug)) > 0),
  constraint service_categories_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint service_categories_description_not_blank check (
    description is null or length(trim(description)) > 0
  ),
  constraint service_categories_display_order_non_negative check (
    display_order >= 0
  ),
  constraint service_categories_slug_unique unique (slug)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  duration_minutes integer not null,
  price_cents integer not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_category_id_fkey foreign key (category_id)
    references public.service_categories(id)
    on delete restrict,
  constraint services_name_not_blank check (length(trim(name)) > 0),
  constraint services_slug_not_blank check (length(trim(slug)) > 0),
  constraint services_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint services_description_not_blank check (
    description is null or length(trim(description)) > 0
  ),
  constraint services_image_url_not_blank check (
    image_url is null or length(trim(image_url)) > 0
  ),
  constraint services_duration_minutes_positive check (duration_minutes > 0),
  constraint services_price_cents_non_negative check (price_cents >= 0),
  constraint services_display_order_non_negative check (display_order >= 0),
  constraint services_slug_unique unique (slug)
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null,
  bio text,
  phone_number text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_display_name_not_blank check (
    length(trim(display_name)) > 0
  ),
  constraint staff_slug_not_blank check (length(trim(slug)) > 0),
  constraint staff_slug_format check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint staff_bio_not_blank check (
    bio is null or length(trim(bio)) > 0
  ),
  constraint staff_phone_number_not_blank check (
    phone_number is null or length(trim(phone_number)) > 0
  ),
  constraint staff_display_order_non_negative check (display_order >= 0),
  constraint staff_slug_unique unique (slug)
);

create table public.business_settings (
  id boolean primary key default true,
  business_name text not null,
  timezone text not null default 'Africa/Nairobi',
  currency_code char(3) not null default 'KES',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_settings_singleton check (id),
  constraint business_settings_business_name_not_blank check (
    length(trim(business_name)) > 0
  ),
  constraint business_settings_timezone_not_blank check (
    length(trim(timezone)) > 0
  ),
  constraint business_settings_currency_code_uppercase check (
    currency_code = upper(currency_code)
  )
);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger service_categories_set_updated_at
before update on public.service_categories
for each row
execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

create trigger staff_set_updated_at
before update on public.staff
for each row
execute function public.set_updated_at();

create trigger business_settings_set_updated_at
before update on public.business_settings
for each row
execute function public.set_updated_at();

create index service_categories_active_order_idx
on public.service_categories (is_active, display_order)
where deleted_at is null;

create index services_category_id_idx
on public.services (category_id);

create index services_category_active_order_idx
on public.services (category_id, is_active, display_order)
where deleted_at is null;

create index services_active_order_idx
on public.services (is_active, display_order)
where deleted_at is null;

create index staff_active_order_idx
on public.staff (is_active, display_order)
where deleted_at is null;

alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.business_settings enable row level security;
