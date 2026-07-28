# Security

## Milestone 0 Controls

- Strict environment parsing prevents malformed configuration from being used.
- A nonce-based Content Security Policy restricts resources to the application
  origin, blocks framing and object embedding, and avoids production
  `unsafe-inline` script and style permissions.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy` are applied to all routes.
- The framework disclosure header is disabled.
- The health response is non-cacheable and exposes no environment or
  infrastructure details.
- CI runs linting, strict type checks, tests, and a production build.
- Local secret files and generated artifacts are excluded from Git.

Development permits `unsafe-eval` for the Next.js development runtime.
Production does not. Inline framework scripts and styles must carry the
per-request nonce created by the request proxy.

Authentication, authorization, RBAC, CSRF controls, rate limiting, audit logging,
secure uploads, payment callbacks, and data-access controls are not implemented
because their owning milestones are outside the approved scope.
