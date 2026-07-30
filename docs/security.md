# Security

## Milestone 6 Controls

- Strict environment parsing prevents malformed configuration from being used.
- Clerk's strict Content Security Policy integration applies per-request script
  nonces while preserving foundation restrictions that block framing and object
  embedding.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy` are applied to all routes.
- The framework disclosure header is disabled.
- The health response is non-cacheable and exposes no environment or
  infrastructure details.
- Clerk-managed sessions provide authentication state for browser requests.
- Google authentication is handled through Clerk's managed Google OAuth social
  connection.
- The account route is protected by Clerk proxy middleware before rendering.
- Staff Management routes under `/account/staff` inherit Clerk proxy protection
  and call `auth.protect()` in every page before loading data.
- Staff Management Server Actions call Clerk protection before validation or
  database mutation.
- Supabase PostgreSQL access is configured for server-side database use without
  enabling Supabase Auth.
- Supabase service-role access, when configured, remains server-only and must
  never be exposed through `NEXT_PUBLIC_` variables.
- Staff Management uses server-only Supabase service-role access through the
  existing database client and does not expose public CRUD routes.
- The Business Settings page inherits Clerk proxy protection and calls
  `auth.protect()` before loading the singleton.
- The Business Settings Server Action calls `auth.protect()` before reading or
  validating `FormData`.
- Business Settings uses the server-only service-role client and accesses only
  `public.business_settings`; no client-side database write is available.
- The singleton identifier is owned by the repository and is never accepted
  from the client.
- Business Settings validation errors are structured while database details are
  replaced with stable user-safe messages.
- Milestone 3 business schema tables have Row Level Security enabled and no
  permissive public access policies.
- CI runs linting, strict type checks, tests, and a production build.
- Local secret files and generated artifacts are excluded from Git.

Development permits `unsafe-eval` for the Next.js development runtime.
Production does not. Clerk middleware owns nonce generation for authenticated
routes and framework scripts.

Authorization, RBAC, staff roles, permissions, authentication fields on staff
records, Supabase Auth, Clerk user synchronization, CSRF controls beyond Clerk's
managed session flow, rate limiting, audit logging, secure uploads, payment
callbacks, and broader business data-access controls are not implemented because
their owning milestones are outside the approved scope.

Google OAuth client secrets must not be committed to this repository or exposed
through `NEXT_PUBLIC_` variables. They belong in Clerk and Google Cloud provider
configuration.
