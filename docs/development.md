# Development

## Setup

```bash
npm install
cp .env.example server/.env   # PowerShell: Copy-Item .env.example server/.env
```

Fill `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in `server/.env`.

## Run

```bash
npm run dev                 # client + server
npm run dev:client          # Vite on :5173
npm run dev:server          # Express on :5000
```

Vite proxies `/api` to `http://localhost:5000` during local development.

## Seed an admin

```bash
npm run seed:admin
```

Requires `ADMIN_EMAIL`, `ADMIN_PASSWORD` (≥12 chars), optional `ADMIN_NAME`.

## Test

```bash
npm run test:server         # Jest + Supertest + in-memory MongoDB
npm run test:client         # Vitest + React Testing Library
npm test                    # both
npx playwright install      # once
npm run test:e2e            # Playwright smoke (starts Vite)
```

## Lint and build

```bash
npm run lint
npm run build
```

## Quality expectations

Before calling Phase 1 complete:

1. Client production build succeeds
2. Server and client tests pass
3. Public routes render without console errors in critical flows
4. Forms persist when Atlas/local Mongo is configured
5. Unauthenticated `/api/admin/me` returns 401
6. No secrets committed
