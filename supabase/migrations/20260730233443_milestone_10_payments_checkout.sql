-- Milestone 10 payments and checkout.
-- Clerk remains the sole authentication provider. Financial writes are
-- available only through protected Server Actions and server-only service-role
-- access. Payment and refund entries form an immutable append-only ledger.

alter table public.bookings
add column charge_amount_cents integer,
add column charge_currency_code char(3);

update public.bookings as bookings
set charge_amount_cents = services.price_cents
from public.services as services
where services.id = bookings.service_id;

update public.bookings
set charge_currency_code = coalesce(
  (
    select business_settings.currency_code
    from public.business_settings
    where business_settings.id = true
  ),
  'KES'
);

alter table public.bookings
alter column charge_amount_cents set not null,
alter column charge_currency_code set not null,
add constraint bookings_charge_amount_cents_non_negative
  check (charge_amount_cents >= 0),
add constraint bookings_charge_currency_code_uppercase
  check (
    length(charge_currency_code) = 3
    and charge_currency_code = upper(charge_currency_code)
  );

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null,
  entry_type text not null,
  amount_cents integer not null,
  payment_method text not null,
  payment_date timestamptz not null,
  reference_number text,
  original_payment_id uuid,
  refund_reason text,
  currency_code char(3) not null,
  receipt_business_name text not null,
  receipt_customer_name text not null,
  receipt_staff_name text not null,
  receipt_service_name text not null,
  receipt_booking_date date not null,
  receipt_start_time time(0) without time zone not null,
  created_at timestamptz not null default now(),
  constraint payments_booking_id_fkey foreign key (booking_id)
    references public.bookings(id)
    on delete restrict,
  constraint payments_original_payment_id_fkey foreign key (original_payment_id)
    references public.payments(id)
    on delete restrict,
  constraint payments_entry_type_allowed
    check (entry_type in ('payment', 'refund')),
  constraint payments_amount_cents_positive check (amount_cents > 0),
  constraint payments_method_allowed
    check (payment_method in ('cash', 'mpesa', 'card', 'bank_transfer')),
  constraint payments_reference_number_valid check (
    reference_number is null
    or (
      length(reference_number) between 1 and 120
      and reference_number = btrim(reference_number)
    )
  ),
  constraint payments_currency_code_uppercase check (
    length(currency_code) = 3
    and currency_code = upper(currency_code)
  ),
  constraint payments_refund_shape check (
    (
      entry_type = 'payment'
      and original_payment_id is null
      and refund_reason is null
    )
    or
    (
      entry_type = 'refund'
      and original_payment_id is not null
      and original_payment_id <> id
      and refund_reason is not null
      and length(refund_reason) between 1 and 500
      and refund_reason = btrim(refund_reason)
    )
  )
);

create index payments_booking_date_id_idx
on public.payments (booking_id, payment_date desc, id desc);

create index payments_entry_type_date_id_idx
on public.payments (entry_type, payment_date desc, id desc);

create index payments_method_date_id_idx
on public.payments (payment_method, payment_date desc, id desc);

create index payments_date_id_idx
on public.payments (payment_date desc, id desc);

create index payments_original_payment_id_idx
on public.payments (original_payment_id)
where original_payment_id is not null;

create index payments_reference_number_lower_idx
on public.payments (lower(reference_number))
where reference_number is not null;

create function public.set_booking_charge_snapshot()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  snapshot_amount integer;
  snapshot_currency char(3);
begin
  if tg_op = 'INSERT' or new.service_id is distinct from old.service_id then
    if tg_op = 'UPDATE' and exists (
      select 1
      from public.payments
      where payments.booking_id = old.id
    ) then
      raise exception using
        errcode = 'P0001',
        message = 'booking_has_financial_history';
    end if;

    select services.price_cents
    into snapshot_amount
    from public.services
    where services.id = new.service_id;

    if snapshot_amount is null then
      raise exception using
        errcode = '23503',
        message = 'booking_service_not_found';
    end if;

    select coalesce(
      (
        select business_settings.currency_code
        from public.business_settings
        where business_settings.id = true
      ),
      'KES'
    )
    into snapshot_currency;

    new.charge_amount_cents := snapshot_amount;
    new.charge_currency_code := snapshot_currency;
  elsif
    new.charge_amount_cents is distinct from old.charge_amount_cents
    or new.charge_currency_code is distinct from old.charge_currency_code
  then
    raise exception using
      errcode = 'P0001',
      message = 'booking_charge_snapshot_is_server_owned';
  end if;

  if
    tg_op = 'UPDATE'
    and old.deleted_at is null
    and new.deleted_at is not null
    and exists (
      select 1
      from public.payments
      where payments.booking_id = old.id
    )
  then
    raise exception using
      errcode = 'P0001',
      message = 'booking_has_financial_history';
  end if;

  return new;
end;
$$;

create trigger bookings_set_charge_snapshot
before insert or update on public.bookings
for each row
execute function public.set_booking_charge_snapshot();

create function public.validate_payment_ledger_entry()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  booking_record record;
  original_record public.payments%rowtype;
  gross_paid bigint;
  gross_refunded bigint;
  refunded_from_original bigint;
begin
  if new.payment_date > now() then
    raise exception using
      errcode = 'P0001',
      message = 'payment_date_in_future';
  end if;

  select
    bookings.id,
    bookings.charge_amount_cents,
    bookings.charge_currency_code,
    bookings.status,
    bookings.deleted_at,
    bookings.booking_date,
    bookings.start_time,
    customers.full_name as customer_name,
    staff.display_name as staff_name,
    services.name as service_name,
    coalesce(
      business_settings.business_name,
      'The Gentleman BarberShop and Spa'
    ) as business_name
  into booking_record
  from public.bookings
  join public.customers on customers.id = bookings.customer_id
  join public.staff on staff.id = bookings.staff_id
  join public.services on services.id = bookings.service_id
  left join public.business_settings on business_settings.id = true
  where bookings.id = new.booking_id
  for update of bookings;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'payment_booking_not_found';
  end if;

  select
    coalesce(sum(amount_cents) filter (where entry_type = 'payment'), 0),
    coalesce(sum(amount_cents) filter (where entry_type = 'refund'), 0)
  into gross_paid, gross_refunded
  from public.payments
  where payments.booking_id = new.booking_id;

  if new.currency_code <> booking_record.charge_currency_code then
    raise exception using
      errcode = 'P0001',
      message = 'payment_currency_changed';
  end if;

  if new.entry_type = 'payment' then
    if booking_record.deleted_at is not null then
      raise exception using
        errcode = 'P0001',
        message = 'payment_booking_deleted';
    end if;

    if booking_record.status = 'cancelled' then
      raise exception using
        errcode = 'P0001',
        message = 'payment_booking_cancelled';
    end if;

    if booking_record.charge_amount_cents = 0 then
      raise exception using
        errcode = 'P0001',
        message = 'payment_booking_zero_charge';
    end if;

    if new.amount_cents > (
      booking_record.charge_amount_cents - (gross_paid - gross_refunded)
    ) then
      raise exception using
        errcode = 'P0001',
        message = 'payment_exceeds_outstanding_balance';
    end if;

    new.receipt_business_name := booking_record.business_name;
    new.receipt_customer_name := booking_record.customer_name;
    new.receipt_staff_name := booking_record.staff_name;
    new.receipt_service_name := booking_record.service_name;
    new.receipt_booking_date := booking_record.booking_date;
    new.receipt_start_time := booking_record.start_time;
  else
    select *
    into original_record
    from public.payments
    where payments.id = new.original_payment_id
    for update;

    if
      not found
      or original_record.entry_type <> 'payment'
      or original_record.booking_id <> new.booking_id
    then
      raise exception using
        errcode = 'P0001',
        message = 'refund_original_payment_invalid';
    end if;

    select coalesce(sum(amount_cents), 0)
    into refunded_from_original
    from public.payments
    where
      payments.entry_type = 'refund'
      and payments.original_payment_id = new.original_payment_id;

    if new.amount_cents > (
      original_record.amount_cents - refunded_from_original
    ) then
      raise exception using
        errcode = 'P0001',
        message = 'refund_exceeds_refundable_amount';
    end if;

    new.currency_code := original_record.currency_code;
    new.receipt_business_name := original_record.receipt_business_name;
    new.receipt_customer_name := original_record.receipt_customer_name;
    new.receipt_staff_name := original_record.receipt_staff_name;
    new.receipt_service_name := original_record.receipt_service_name;
    new.receipt_booking_date := original_record.receipt_booking_date;
    new.receipt_start_time := original_record.receipt_start_time;
  end if;

  return new;
end;
$$;

create trigger payments_validate_ledger_entry
before insert on public.payments
for each row
execute function public.validate_payment_ledger_entry();

create function public.reject_payment_ledger_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception using
    errcode = 'P0001',
    message = 'payment_ledger_is_immutable';
end;
$$;

create trigger payments_reject_mutation
before update or delete on public.payments
for each row
execute function public.reject_payment_ledger_mutation();

create view public.booking_payment_totals
with (security_invoker = true)
as
select
  bookings.id as booking_id,
  bookings.charge_amount_cents,
  bookings.charge_currency_code as currency_code,
  coalesce(
    sum(payments.amount_cents)
      filter (where payments.entry_type = 'payment'),
    0
  )::bigint as gross_paid_cents,
  coalesce(
    sum(payments.amount_cents)
      filter (where payments.entry_type = 'refund'),
    0
  )::bigint as total_refunded_cents,
  (
    coalesce(
      sum(payments.amount_cents)
        filter (where payments.entry_type = 'payment'),
      0
    )
    -
    coalesce(
      sum(payments.amount_cents)
        filter (where payments.entry_type = 'refund'),
      0
    )
  )::bigint as net_paid_cents,
  greatest(
    bookings.charge_amount_cents
    -
    (
      coalesce(
        sum(payments.amount_cents)
          filter (where payments.entry_type = 'payment'),
        0
      )
      -
      coalesce(
        sum(payments.amount_cents)
          filter (where payments.entry_type = 'refund'),
        0
      )
    ),
    0
  )::bigint as outstanding_balance_cents
from public.bookings
left join public.payments on payments.booking_id = bookings.id
group by
  bookings.id,
  bookings.charge_amount_cents,
  bookings.charge_currency_code;

alter table public.payments enable row level security;

revoke all on table public.payments from public, anon, authenticated;
grant select, insert on table public.payments to service_role;

revoke all on table public.booking_payment_totals
from public, anon, authenticated;
grant select on table public.booking_payment_totals to service_role;

revoke all on function public.set_booking_charge_snapshot()
from public, anon, authenticated;
revoke all on function public.validate_payment_ledger_entry()
from public, anon, authenticated;
revoke all on function public.reject_payment_ledger_mutation()
from public, anon, authenticated;

grant execute on function public.set_booking_charge_snapshot()
to service_role;
grant execute on function public.validate_payment_ledger_entry()
to service_role;
grant execute on function public.reject_payment_ledger_mutation()
to service_role;
