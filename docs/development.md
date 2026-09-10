# Development (Phase 2)

```bash
npm install
Copy-Item .env.example server/.env
# set MONGODB_URI, JWT_SECRET, CLIENT_URL
npm run seed:admin
npm run seed:content
npm run dev
```

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
- Password reset links are printed to the server console in development
- Admin UI: `/admin/login` → `/admin/dashboard`
