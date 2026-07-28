# Deployment

## Build Artifact

The production command is:

```bash
npm run build
```

Next.js emits its standard optimized production artifact for a supported Node.js
hosting environment or managed Next.js platform.

## Runtime Requirements

- Node.js 22 or newer
- Environment values documented in `.env.example`
- HTTPS termination at the hosting platform or reverse proxy
- Clerk application credentials configured as deployment secrets

## Continuous Integration

The GitHub Actions workflow runs on pull requests and pushes to `main`. It checks
formatting, linting, strict types, unit coverage, production build output, and
Playwright tests before code is considered releasable.

No production hosting project, deployment credentials, custom domain, database,
or business external service is configured in Milestone 1. Clerk is the only
approved authentication integration.
