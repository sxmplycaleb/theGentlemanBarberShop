# The Gentleman BarberShop and Spa

Production business management platform for The Gentleman BarberShop and Spa.

## Milestone 10

This repository currently contains the production project foundation, Clerk
authentication integration, Supabase database foundation, core business schema
foundation, Services Management, Staff Management, Business Settings
Management, Customer Management, Booking Management, Appointment Workflow, and
Payments & Checkout:

- Next.js App Router with strict TypeScript
- Tailwind CSS and shadcn/ui configuration
- Feature-based source architecture
- Validated environment configuration
- Health endpoint and secure response headers
- Clerk-managed authentication and sessions
- Sign-in and sign-out entry points with Clerk-managed Google authentication
- Route protection for authenticated account access
- Supabase PostgreSQL database configuration
- Forward-only business schema migrations for service categories, services,
  staff, business settings, and customers
- Row Level Security enabled on business schema tables
- Authenticated Services Management for service categories and services
- Authenticated Staff Management for staff listing, search, pagination, sorting,
  create, edit, soft delete, restore, activate/deactivate, and display ordering
- Authenticated Business Settings Management for viewing and saving the
  singleton business name, timezone, and currency configuration
- Authenticated Customer Management for customer listing, search, pagination,
  sorting, create, edit, soft delete, restore, and active/inactive status
- Authenticated Booking Management for booking listing, search, filtering,
  pagination, sorting, create, edit, soft delete, restore,
  related-record selection, and exact-slot collision validation
- Authenticated Appointment Workflow for a business-date queue, search,
  staff/status filtering, pagination, sorting, booking detail, and atomic
  lifecycle transitions
- Authenticated Payment Management for checkout, full and partial payments,
  multiple payments, immutable transaction history, outstanding balances,
  receipt presentation, and administrative refunds
- Server-owned historical booking charge and currency snapshots
- Database-serialized payment and refund validation that prevents concurrent
  overpayment and over-refund
- ESLint, Prettier, Husky, and lint-staged
- Vitest unit tests and Playwright end-to-end tests
- GitHub Actions continuous integration

Appointment Workflow remains an operational layer over bookings and introduces
no appointment table, entity, or API. Payments is an internal append-only
financial layer and never changes booking lifecycle status. Online payment
processing, payment gateways, callbacks, webhooks, invoices, taxes, discounts,
tips, calendar integrations, notifications, reporting, analytics, customer
authentication, RBAC, Supabase Auth, and Clerk user synchronization remain
outside this milestone.

## Requirements

- Node.js 22 or newer
- npm 11 or newer

## Local Setup

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

The local application is available at `http://localhost:3000`. The health
endpoint is available at `http://localhost:3000/api/health`.

## Quality Commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run test:e2e
```

Install the Playwright Chromium browser once before the first end-to-end run:

```bash
npx playwright install chromium
```

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)
- [Environment](docs/environment.md)
- [Security](docs/security.md)
- [Testing](docs/testing.md)
