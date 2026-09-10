# Development (Phase 3)

```bash
npm install
Copy-Item .env.example server/.env
# set MONGODB_URI, JWT_SECRET (32+ recommended), CLIENT_URL
# optional SMTP_* for real reset emails
npm run seed:admin
npm run seed:content
npm run dev
```

## Environments

Use `development` / `test` / `staging` / `production`. Never use the production DB from a laptop.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Client + server |
| `npm run build` | Client production build |
| `npm test` | Server + client tests |
| `npm run test:e2e` | Playwright |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Create SUPER_ADMIN from env |
| `npm run seed:content` | Upsert sample projects/talks/services |

## Notes

- Vite proxies `/api` to `:5000`
- Without SMTP, reset links are logged in non-production only
- Admin UI: `/admin/login` → `/admin/dashboard`
- CI: `.github/workflows/ci.yml` (no auto-deploy)
