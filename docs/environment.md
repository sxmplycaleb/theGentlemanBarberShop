# Environment

Environment values are parsed with Zod in `src/config/env.ts`. Invalid values
fail at application startup or build time rather than being used silently.

## Variables

| Variable                                          | Exposure           | Required   | Purpose                                                          |
| ------------------------------------------------- | ------------------ | ---------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                             | Browser and server | No         | Canonical application origin for environment-aware configuration |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`               | Browser and server | Production | Clerk publishable key for browser authentication components      |
| `CLERK_SECRET_KEY`                                | Server only        | Production | Clerk secret key for server-side authentication checks           |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                   | Browser and server | No         | Application sign-in route                                        |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Browser and server | No         | Default destination after sign-in                                |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Browser and server | No         | Default destination after Clerk's standard sign-up flow          |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL`            | Browser and server | No         | Default destination after sign-out                               |

`NODE_ENV` is supplied by Next.js and must be `development`, `test`, or
`production`.

## Local Configuration

Create local values from the committed template:

```powershell
Copy-Item .env.example .env.local
```

All `.env*.local` files are ignored by Git. Values prefixed with
`NEXT_PUBLIC_` are included in browser bundles and must never contain secrets.
`CLERK_SECRET_KEY` must remain server-side only.

Milestone 1 uses Clerk-managed sessions. No database URL, database adapter, user
persistence secret, or custom password secret is introduced in this milestone.

Google authentication is configured in the Clerk Dashboard as a social
connection. Google OAuth client credentials must remain in Clerk and Google
Cloud configuration; they are not application environment variables for this
repository.
