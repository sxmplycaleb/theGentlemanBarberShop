# Database

## Milestone 7 Scope

Milestone 7 adds one standalone customer table to the existing core business
schema. Supabase PostgreSQL is the approved primary database, accessed through
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

Services, Staff, Business Settings, and Customer Management use feature-owned
repositories, validation, presentation, and Server Actions. Customer Management
accesses only `public.customers`.

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

## Core Business Tables

The approved migrations create:

- `service_categories` for grouping business services.
- `services` for service definitions linked to categories.
- `staff` for business personnel records without roles, permissions, or
  authentication fields.
- `business_settings` for singleton business-level settings.
- `customers` for standalone customer profiles and contact details, added by
  Milestone 7.

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
an explicitly approved milestone. Milestone 7 adds exactly one forward-only
migration that creates only `public.customers`, its constraints and indexes, an
existing `set_updated_at` trigger attachment, and RLS. Existing schema objects
and migrations are unchanged.

## Out of Scope

Bookings, appointments, calendars, payments, invoices, notifications, email,
SMS, loyalty, analytics, dashboards, inventory, gallery, uploads, customer
authentication, RBAC, Supabase Auth, Clerk user synchronization, public APIs,
mobile features, and Supabase Storage are not implemented in Milestone 7.
