# Testing

## Unit Tests

Vitest and Testing Library verify:

- Foundation presentation and semantic heading structure
- Loading, error, and not-found application states
- Health endpoint status, payload, cache policy, and method behavior
- Environment validation, site configuration, utilities, shared UI primitives,
  and security header configuration
- Supabase database configuration and server client creation
- Supabase database types compile against the approved business schema,
  including customers
- Clerk proxy configuration, authenticated account protection, and
  authentication presentation components
- Services and Staff feature validation, filter parsing, route composition,
  presentation behavior, and Server Action behavior
- Business Settings validation, singleton repository read/upsert behavior,
  protected Server Action behavior, route composition, approved select options,
  accessible form feedback, and presentation
- Customer validation and normalization, URL filter parsing, server-only
  repository queries and state guards, protected Server Actions, route
  composition, list and form presentation, accessible feedback, and account
  navigation
- Booking validation and normalization, URL filter parsing, server-only
  repository reference/state/collision checks, protected Server Actions, route
  composition, list and form presentation, accessible feedback, and account
  navigation
- Canonical booking lifecycle transitions and business-date temporal rules
- Appointment Workflow URL filter parsing, business-local date resolution,
  paginated Booking queue composition, joined relationship projection, and
  atomic expected-state transition predicates
- Appointment Workflow protected actions and routes, stable stale-state
  failures, server-derived controls, queue/detail/empty/terminal presentation,
  and account navigation

Coverage is collected with the V8 provider. The configured minimum is 80 percent
for statements, branches, functions, and lines across the Milestone 0 foundation
surface.

## End-to-End Tests

Playwright runs Chromium in desktop and mobile profiles. It verifies:

- The application renders the expected primary heading
- The viewport has no horizontal overflow
- Axe reports no automated accessibility violations
- The health endpoint responds successfully through the running application
- The sign-in page shell renders
- Anonymous visitors are redirected away from protected account access

Playwright starts the compiled Next.js production server. Run `npm run build`
before `npm run test:e2e` when executing the checks individually.

Milestone 9 keeps end-to-end coverage focused on foundation and authentication
surfaces. Anonymous access to `/account/settings`, `/account/customers`, and
`/account/bookings`, `/account/appointments`, and an appointment detail route is
verified as protected. Authenticated booking and lifecycle writes are
covered by deterministic repository, validation, presentation, page, and
Server Action tests rather than authenticated CRUD end-to-end tests.

Milestone 9 introduces no migration. Real-database migration status, schema
drift, generated type verification, database lint, and advisor checks remain
pending until the approved Supabase development environment is available.

## Local Commands

```bash
npm run test
npm run test:coverage
npm run build
npm run test:e2e
```

Generated coverage, reports, screenshots, traces, and test results are ignored by
Git.
