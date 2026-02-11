# Promo Manager Web

Vite + React + TypeScript admin SPA for promo management and analytics.

## Environment

Create `.env` (or copy `.env.example`) with:

```
VITE_API_BASE_URL=http://localhost:3000
```

Important: the API client already uses paths like `/api/...`, so the base URL must **not** include `/api`.

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
