-- Milestone 8 booking management.
-- Clerk remains the sole authentication provider. Bookings are managed only
-- through protected Server Actions and server-only service-role access.

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  staff_id uuid not null,
  service_id uuid not null,
  booking_date date not null,
  start_time time(0) without time zone not null,
  status text not null default 'pending',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_customer_id_fkey foreign key (customer_id)
    references public.customers(id)
    on delete restrict,
  constraint bookings_staff_id_fkey foreign key (staff_id)
    references public.staff(id)
    on delete restrict,
  constraint bookings_service_id_fkey foreign key (service_id)
    references public.services(id)
    on delete restrict,
  constraint bookings_status_allowed check (
    status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')
  )
);

create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

create unique index bookings_current_staff_slot_unique_idx
on public.bookings (staff_id, booking_date, start_time)
where deleted_at is null and status <> 'cancelled';

create index bookings_current_schedule_idx
on public.bookings (booking_date, start_time, id)
where deleted_at is null;

create index bookings_deleted_schedule_idx
on public.bookings (booking_date, start_time, id)
where deleted_at is not null;

create index bookings_current_status_schedule_idx
on public.bookings (status, booking_date, start_time, id)
where deleted_at is null;

create index bookings_current_customer_schedule_idx
on public.bookings (customer_id, booking_date, start_time, id)
where deleted_at is null;

create index bookings_current_staff_schedule_idx
on public.bookings (staff_id, booking_date, start_time, id)
where deleted_at is null;

create index bookings_current_service_schedule_idx
on public.bookings (service_id, booking_date, start_time, id)
where deleted_at is null;

alter table public.bookings enable row level security;

revoke all on table public.bookings from anon, authenticated;
grant select, insert, update on table public.bookings to service_role;
