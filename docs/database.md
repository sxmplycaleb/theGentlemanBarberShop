# Database

## Milestone 2 Scope

Milestone 2 introduces the database foundation only. Supabase PostgreSQL is the
approved primary database, accessed through the official
`@supabase/supabase-js` client.

Supabase Auth is not used. Clerk remains the sole authentication provider, and
Clerk-managed sessions continue without a database adapter, local user table,
profile records, staff role persistence, or Clerk user synchronization.

## Application Boundary

Database code is isolated under `src/lib/supabase/`:

- `config.ts` validates and exposes Supabase database configuration.
- `server.ts` creates server-side Supabase clients only.
- `database.types.ts` provides an empty typed database contract for the
  foundation milestone.

The foundation intentionally does not introduce repositories, services, CRUD
endpoints, business validation layers, or database-backed workflows.

## Migrations

SQL migrations live in `supabase/migrations/`. The Milestone 2 baseline
migration creates no application tables and documents the boundary for future
schema work.

Future migrations must be forward-only, reviewable SQL files and must be tied to
an explicitly approved milestone.

## Out of Scope

Booking tables, payments, dashboard data, analytics, notifications, gallery,
uploads, staff management, RBAC, business logic, and Supabase Storage are not
implemented in Milestone 2.
