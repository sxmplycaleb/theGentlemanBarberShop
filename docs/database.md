# Database

## Milestone 10 Scope

Milestone 10 adds exactly one forward migration for booking charge snapshots
and an immutable payment ledger. Supabase PostgreSQL is the approved primary
database, accessed through
the official
`@supabase/supabase-js` client from server-side application code.

Supabase Auth is not used. Clerk remains the sole authentication provider, and
Clerk-managed sessions continue without a database adapter, local user table,
profile records, staff role persistence, roles, permissions, or Clerk user
synchronization.

## Application Boundary

Database code is isolated under `src/lib/supabase/`:

- `config.ts` validates and exposes Supabase database configuration.
- `server.ts` creates server-side Supabase clients only.
- `database.types.ts` provides the typed database contract for the approved
  schema.

Services, Staff, Business Settings, Customer Management, and Booking Management
use feature-owned repositories, validation, presentation, and Server Actions.
Appointment Workflow uses the same boundary as an operational projection over
bookings.

Payment Management uses a feature-owned server-only repository. The repository
accesses `bookings`, `payments`, and the read-only
`booking_payment_totals` view with the service-role client.

## Business Settings Singleton

The `business_settings` table uses its constrained boolean primary key as a
singleton identifier. Milestone 6:

- Selects the row where `id = true`.
- Atomically upserts `id = true` with `business_name`, `timezone`, and
  `currency_code` when settings are saved.
- Does not expose or accept `id`, `created_at`, or `updated_at` in the form.
- Leaves `updated_at` maintenance to the existing database trigger.

No seed file is required. The first authenticated save initializes an empty
singleton.

## Customers

The Milestone 7 migration creates `public.customers` with a server-generated
UUID, full name, optional phone number, optional lowercase email, optional
internal notes, active status, soft-delete timestamp, and database-maintained
timestamps.

Customers are independent records. The table has no foreign keys or
relationships to services, service categories, staff, business settings,
bookings, appointments, or authentication identities.

Customer Management:

- Searches full name, phone number, and email using ordinary PostgreSQL
  `ILIKE`.
- Applies active and soft-delete filters, allow-listed sorting, exact-count
  pagination, and stable ordering in the repository.
- Preserves active status during soft delete and restore.
- Prevents edits and status changes while a record is soft deleted.
- Uses normal partial B-tree indexes for current and deleted customer listing.
- Uses no search extension, full-text search, or trigram index.

## Bookings

The `bookings` table references one customer, one staff member, and one service.
It stores the booking date, start time, lifecycle status, audit timestamps, and
an optional soft-delete timestamp.

Booking status is constrained to `pending`, `confirmed`, `completed`,
`cancelled`, or `no_show`. Foreign keys use restrictive deletion behavior. A
partial unique index enforces the approved exact-slot rule for current,
non-cancelled bookings with the same staff member, date, and start time.
Additional indexes support schedule ordering and customer, staff, service,
status, and soft-deletion filters.

Booking records are soft-deleted by setting `deleted_at`. Restoration clears
`deleted_at` after reference, state, and exact-slot validation. No hard-delete
path is exposed.

Appointment Workflow reads only current bookings for the selected business
date, with customer, staff, and service relationships loaded in the paginated
Booking query. Lifecycle updates change only `bookings.status` and condition on
booking ID, expected status, `deleted_at IS NULL`, and any applicable temporal
predicate. No appointment table, entity, DTO, trigger, index, constraint, or
RLS policy is added by Milestone 9.

Milestone 10 adds server-owned `charge_amount_cents` and
`charge_currency_code` snapshots to each booking. Existing bookings are
backfilled from the selected service and current business currency. A trigger
sets new snapshots, refreshes them when an unpaid booking changes service, and
rejects direct snapshot edits, paid-booking service changes, and paid-booking
soft deletion.

## Payments

`public.payments` is an append-only ledger. Each positive entry is either a
payment or refund. Refunds reference one original payment, include an
administrative reason, and cannot exceed the original payment's remaining
refundable amount.

Receipt-facing business, customer, staff, service, booking-date, start-time,
and currency values are copied into each entry at insertion. Refunds inherit
the original payment's snapshots. The payment UUID is the canonical receipt
identifier.

The ledger has no `updated_at`, `deleted_at`, update path, or delete path.
Table grants permit only service-role select and insert. RLS is enabled without
browser-facing policies. An immutable-ledger trigger rejects update and delete
attempts.

Before insertion, a trigger locks the parent booking row and recalculates
ledger totals. It rejects payments against deleted, cancelled, zero-charge, or
fully paid bookings and rejects refunds against invalid or exhausted original
payments. This serializes concurrent submissions without trusting
application-side calculations.

`booking_payment_totals` is a security-invoker view that calculates gross paid,
total refunded, net paid, and outstanding balance. No calculated financial
total is stored.

## Core Business Tables

The approved migrations create:

- `service_categories` for grouping business services.
- `services` for service definitions linked to categories.
- `staff` for business personnel records without roles, permissions, or
  authentication fields.
- `business_settings` for singleton business-level settings.
- `customers` for standalone customer profiles and contact details, added by
  Milestone 7.
- `bookings` for dated customer appointments linked to staff and services,
  added by Milestone 8.

The catalog and staff tables include nullable `deleted_at` columns for future
soft-delete workflows. Staff Management now uses `staff.deleted_at` for soft
delete and restore. `business_settings` does not include `deleted_at`.

Every table includes primary keys, timestamps, constraints, and Row Level
Security. The `services.category_id` column references
`service_categories.id`, and supporting indexes are included for future lookup
paths.

## Migrations

SQL migrations live in `supabase/migrations/`. The Milestone 2 baseline
migration creates no application tables. The Milestone 3 migration creates only
the approved foundational business schema.

Future migrations must be forward-only, reviewable SQL files and must be tied to
an explicitly approved milestone. Milestone 8 adds exactly one forward-only
migration that creates only `public.bookings`, its constraints, foreign keys,
indexes, existing `set_updated_at` trigger attachment, grants, and RLS. Existing
schema objects and migrations are unchanged.

No usable local or linked Supabase development environment was available during
implementation. The Milestone 8 migration was not applied, and authoritative
database types were not regenerated. Migration application, schema-drift
verification, database lint and advisor checks, and type regeneration remain
mandatory post-implementation verification steps.

Milestone 10 creates one forward migration and does not edit previous
migrations. No usable local or linked Supabase environment was available during
implementation, so the migration was not applied and authoritative database
types were not regenerated. Payment schema types remain isolated in the
feature-local temporary approach already established for bookings.

Migration replay, schema-drift verification, database lint/advisors, concurrency
checks, RLS/grant verification, and authoritative type regeneration remain
mandatory release prerequisites.

## Out of Scope

Online payment gateways, callbacks, webhooks, invoices, taxes, discounts, tips,
calendar UI and integrations, notifications, email, SMS, loyalty, reporting,
analytics, customer authentication, RBAC, Supabase Auth, Clerk user
synchronization, and Supabase Storage are not implemented in Milestone 10.
