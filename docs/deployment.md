# Deployment

## Environments

| Env | Purpose | Notes |
|-----|---------|-------|
| `development` | Local machine | Dev JWT fallback allowed; reset URLs logged if SMTP unset |
| `test` | Jest / CI | In-memory MongoDB; no real SMTP |
| `staging` | Pre-prod | Same build artifacts as production; staging env vars + staging DB only |
| `production` | Live | Requires strong `JWT_SECRET` (32+), `MONGODB_URI`, `CLIENT_URL`; SMTP required for password-reset delivery |

Never point local development at the production database.

## Required production env

See [`.env.example`](../.env.example):

- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET` (32+ characters)
- `CLIENT_URL` (exact SPA origin for CORS + cookies)
- `SMTP_*` for password reset mail delivery

Optional: `PORT`, `JWT_EXPIRES_IN`, `SMTP_FROM`.

## Build & run

```bash
npm ci
npm run build          # Vite client → client/dist
npm run lint
npm test
# serve API
NODE_ENV=production npm start
# serve client/dist behind HTTPS (nginx, Cloudflare, Render Static, etc.)
```

API and SPA may be reverse-proxied on the same origin (`/api` → Express) or split with `VITE_API_URL` + CORS `CLIENT_URL`.

## Render

See [`render.yaml`](../render.yaml). This is an **npm workspaces monorepo** (`client`, `server`, `shared`).

| Setting | Value |
|---------|--------|
| **Root Directory** | *(blank — repository root)* — **never** `server` |
| **Build Command** | `npm ci && npm run build` |
| **Start Command** (API) | `npm start` |
| **Node** | `20` (`NODE_VERSION=20` or `.node-version`) |

Why Root Directory must not be `server`: the API is plain Express JavaScript (no compile step). Running `npm run build` inside `server/` fails with `Missing script: "build"`. Installs must also run from the repo root so `@vignak/shared` resolves.

Typical split deploy:

1. **Web Service** (`vignak-api`) — build + `npm start` (Express listens on `PORT`, host `0.0.0.0` in production).
2. **Static Site** (`vignak-web`) — same build; publish `client/dist`. Set `VITE_API_URL` to the API origin at build time. Set API `CLIENT_URL` to the Static Site origin (CORS + cookies).

## Staging gate

1. Deploy the same commit artifacts to staging with staging secrets.
2. Smoke: `/api/health`, `/api/ready`, login, lead create, one CMS publish.
3. Approve manually — CI does **not** auto-deploy to production.

## Cookies & HTTPS

Production cookies use `secure` + `sameSite: 'none'`. Serve the SPA and API over HTTPS; align `CLIENT_URL` with the browser origin.

## Images

Phase 3 keeps **URL-only** images (no upload/CDN pipeline).
