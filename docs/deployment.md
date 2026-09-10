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
NODE_ENV=production npm run start -w server
# serve client/dist behind HTTPS (nginx, Cloudflare, etc.)
```

API and SPA may be reverse-proxied on the same origin (`/api` → Express) or split with `VITE_API_URL` + CORS `CLIENT_URL`.

## Staging gate

1. Deploy the same commit artifacts to staging with staging secrets.
2. Smoke: `/api/health`, `/api/ready`, login, lead create, one CMS publish.
3. Approve manually — CI does **not** auto-deploy to production.

## Cookies & HTTPS

Production cookies use `secure` + `sameSite: 'none'`. Serve the SPA and API over HTTPS; align `CLIENT_URL` with the browser origin.

## Images

Phase 3 keeps **URL-only** images (no upload/CDN pipeline).
