# The Gentleman BarberShop and Spa

Production business management platform for The Gentleman BarberShop and Spa.

## Milestone 1

This repository currently contains the production project foundation and Clerk
authentication integration:

- Next.js App Router with strict TypeScript
- Tailwind CSS and shadcn/ui configuration
- Feature-based source architecture
- Validated environment configuration
- Health endpoint and secure response headers
- Clerk-managed authentication and sessions
- Sign-in and sign-out entry points with Clerk-managed Google authentication
- Route protection for authenticated account access
- ESLint, Prettier, Husky, and lint-staged
- Vitest unit tests and Playwright end-to-end tests
- GitHub Actions continuous integration

Database access, user persistence, RBAC, staff roles, profile management,
booking, payments, dashboards, gallery, analytics, notifications, SEO
implementation, and all other business capabilities are intentionally outside
this milestone.

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
