# API

## Response Envelope

Successful JSON endpoints use:

```json
{
  "data": {},
  "success": true
}
```

## Health

`GET /api/health`

Returns application liveness without querying future infrastructure.

### Success

Status: `200 OK`

```json
{
  "data": {
    "service": "The Gentleman BarberShop and Spa",
    "status": "ok",
    "version": "0.1.0"
  },
  "success": true
}
```

The response includes `Cache-Control: no-store`.

## Authentication

Clerk owns its authentication callback and frontend API traffic through the
official Next.js App Router integration. These routes are not part of the
application JSON API contract and do not use the shared response envelope.

No custom authentication API endpoints are part of Milestone 1.

## Business Settings

Milestone 6 adds no public JSON API endpoints. Authenticated Business Settings
reads occur in a protected React Server Component, and saves use one protected
Server Action with Zod validation. The action accesses only the existing
`public.business_settings` singleton through the server-only Supabase client.
