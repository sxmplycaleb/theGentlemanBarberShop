# Database

## Milestone 5 Scope

Milestone 5 uses the existing core business schema. Supabase PostgreSQL is the
approved primary database, accessed through the official
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

Services Management and Staff Management use feature-owned repositories,
validation, presentation, and Server Actions. Staff Management uses only the
existing `public.staff` table.

## Core Business Tables

The approved Milestone 3 migration creates:

- `service_categories` for grouping business services.
- `services` for service definitions linked to categories.
- `staff` for business personnel records without roles, permissions, or
  authentication fields.
- `business_settings` for singleton business-level settings.

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
an explicitly approved milestone. Milestone 5 did not add or modify migrations,
tables, columns, constraints, indexes, RLS policies, or generated database
types.

## Out of Scope

Customer profiles, booking tables, appointments, payments, dashboard data,
analytics, notifications, gallery, uploads, RBAC, Supabase Auth, Clerk user
synchronization, and Supabase Storage are not implemented in Milestone 5.
