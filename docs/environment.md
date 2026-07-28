# Environment

Environment values are parsed with Zod in `src/config/env.ts`. Invalid values
fail at application startup or build time rather than being used silently.

## Variables

| Variable              | Exposure           | Required | Purpose                                                          |
| --------------------- | ------------------ | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Browser and server | No       | Canonical application origin for environment-aware configuration |

`NODE_ENV` is supplied by Next.js and must be `development`, `test`, or
`production`.

## Local Configuration

Create local values from the committed template:

```powershell
Copy-Item .env.example .env.local
```

All `.env*.local` files are ignored by Git. Values prefixed with
`NEXT_PUBLIC_` are included in browser bundles and must never contain secrets.

No secrets are required in Milestone 0.
