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

No additional API endpoints are part of Milestone 0.
