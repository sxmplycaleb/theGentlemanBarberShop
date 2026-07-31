# Deployment

## Build Artifact

The production command is:

```bash
npm run build
```

Next.js emits its standard optimized production artifact for a supported Node.js
hosting environment or managed Next.js platform.

## Milestone 11 Visual Release Checks

Before promotion, capture and retain deployment screenshots for the landing,
sign-in, dashboard, representative list, form, appointment detail, checkout,
and settings pages in both themes. Capture desktop, tablet, and mobile
viewports. Screenshots must use non-sensitive test data and must not expose
Clerk identifiers, payment references, customer contact details, or deployment
secrets.

Verify alongside the screenshots:

1. No page-level horizontal overflow.
2. The responsive table region contains wide data on small screens.
3. Sidebar collapse and mobile drawer dismissal work with keyboard input.
4. Theme preference survives reload and defaults to the operating-system
   preference when no stored choice exists.
5. Representative authenticated pages score at least 95 for Lighthouse
   Accessibility using an approved authenticated test session.

## Runtime Requirements

- Node.js 22 or newer
- Environment values documented in `.env.example`
- HTTPS termination at the hosting platform or reverse proxy
- Clerk application credentials configured as deployment secrets
- Supabase project URL and anonymous key configured for database access
- Optional Supabase service-role key configured only as a server-side secret

## Milestone 10 Database Release

Milestone 10 must be released with its single forward migration. Before
application traffic is enabled:

1. Replay every migration from an empty Supabase database.
2. Verify booking charge and currency backfill.
3. Verify payment RLS, grants, immutable triggers, totals view, and concurrent
   overpayment/over-refund rejection.
4. Run database lint and advisors.
5. Regenerate authoritative database types.
6. Run the complete application quality gates against those generated types.

The migration snapshot trigger keeps existing Booking Management inserts
compatible during deployment. The release must still be treated as one
controlled application-and-schema change. The current repository has no usable
local or linked Supabase environment, so these checks remain mandatory manual
release tasks rather than silently skipped verification.

## Continuous Integration

The GitHub Actions workflow runs on pull requests and pushes to `main`. It checks
formatting, linting, strict types, unit coverage, production build output, and
Playwright tests before code is considered releasable.

No production hosting project, deployment credentials, custom domain, or
business external service is configured in Milestone 2. Supabase PostgreSQL is
the approved database, and Clerk is the only approved authentication
integration.
