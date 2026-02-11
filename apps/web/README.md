# Promo Manager Web

Vite + React + TypeScript admin SPA for promo management and analytics.

## Environment

The app reads API settings from the monorepo root:

- `../../.env.api.development` for `dev`
- `../../.env.api.production` for `build`

Example contents (development):

```
VITE_API_BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000
```

Meaning:
- `VITE_API_BASE_URL` — the **frontend host** (where Vite runs).
- `API_BASE_URL` — the **backend host** (used by Vite proxy in `vite.config.ts`).

For production, these are usually the same because the frontend is served as static content from the backend host.

Important: the API client uses paths like `/api/...`, so the base URL must **not** include `/api`.

## Why `credentials: "include"`

Authentication uses httpOnly cookies set by the server. To send cookies with every request, the client uses `credentials: "include"`.

## Pages

- `/login`
- `/register`
- `/users`
- `/promo-codes`
- `/orders`
- `/analytics/users`
- `/analytics/promo-codes`
- `/analytics/usage`

## Development

```
npm install
npm run dev
```
