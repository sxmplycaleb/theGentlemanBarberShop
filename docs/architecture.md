# Architecture

## Scope

Milestone 0 establishes a deployable application foundation. It contains no
business workflows or integrations.

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

The foundation feature contains only milestone status presentation. Services,
repositories, database adapters, and business validation layers are not created
until a requirement needs them.

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
