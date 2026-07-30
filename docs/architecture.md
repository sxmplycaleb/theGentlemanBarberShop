# Architecture

## Scope

Milestone 5 adds authenticated Staff Management on top of the established
foundation, Clerk authentication, Supabase database foundation, and Services
Management architecture.

## Runtime

The application uses Next.js App Router and React Server Components by default.
Client Components are limited to browser-dependent behavior such as the
framework error boundary. Next.js emits an optimized production build that can
run on a supported Node.js host or managed Next.js platform.

## Source Boundaries

```text
src/
|-- app/             Routing, layouts, route states, and route handlers
|-- components/ui/   shadcn-owned presentation primitives
|-- config/          Validated runtime and site configuration
|-- constants/       Shared immutable values
|-- features/        Feature-owned presentation, types, and constants
|-- lib/             Framework-neutral utilities
|-- test/            Shared test setup
`-- types/           Cross-feature contracts
```

The `app` directory composes features and exposes HTTP routes. Feature modules
own feature-specific code. UI primitives contain no business rules. Shared
configuration is validated before use, and cross-feature contracts live in
`types`.

The foundation feature contains only milestone status presentation.

The auth feature owns Clerk-backed presentation and authenticated account entry
points only. Clerk remains the sole authentication provider, and Clerk-managed
sessions are used without a database adapter or custom user persistence.

The services feature owns service-category and service management actions, data
access, validation, types, and presentation. The staff feature mirrors that
boundary for Staff Management under `src/features/staff/`.

Generic management presentation primitives that are shared by Services and
Staff live under `src/components/management/`. The `app` directory remains a
composition layer: account staff routes protect the page with Clerk, parse route
input, load feature data, and render feature presentation.

## Import Policy

Application code uses the `@/*` absolute alias, mapped to `src/*`. Relative
imports are reserved for files within the same tightly coupled module when they
improve readability.

## API Contract

Successful API responses use the shared `ApiSuccess<TData>` envelope. The health
route is deliberately dependency-free and reports application liveness only.

## Decision Record

- Next.js App Router provides file-based routing, Server Components, route
  handlers, and production build optimization.
- TypeScript strictness includes unchecked-index and exact-optional-property
  checks to surface boundary errors early.
- Tailwind CSS uses CSS variables as design tokens; shadcn/ui source remains
  locally owned and accessible.
- Vitest covers deterministic module behavior. Playwright verifies the browser,
  HTTP boundary, responsive layout, and automated accessibility.
- GitHub Actions executes the same quality commands documented for local use.
- Staff Management uses the existing `public.staff` table through server-only
  Supabase service-role access and does not introduce migrations, Supabase Auth,
  RBAC, uploads, booking, appointments, payments, dashboards, or analytics.
