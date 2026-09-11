# Vignak Solutions

**Phase 3** production hardening for the Vignak Solutions modular monolith — public site, admin CRM/CMS, and REST API.

## Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JSX), Vite, React Router (lazy routes) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT in HttpOnly cookies, bcrypt, `passwordChangedAt` session kill |
| Testing | Jest + Supertest, Vitest + RTL, Playwright |
| CI | GitHub Actions (lint → test → build → audit → e2e) |

## Repository layout

```
vignak/
├── client/     # Public site + admin UI
├── server/     # Express REST API
├── shared/     # Enums + permission matrix
├── docs/       # Architecture, security, deployment, audit
└── tests/      # Playwright e2e
```

## Local setup

```bash
npm install
cp .env.example server/.env   # PowerShell: Copy-Item .env.example server/.env
# edit MONGODB_URI, JWT_SECRET (32+), CLIENT_URL=http://127.0.0.1:5173
npm run seed:admin            # optional
```

Start in **two terminals** from the repo root:

```bash
npm run server
```

```bash
npm run client
```

- Client: http://127.0.0.1:5173  
- API: http://127.0.0.1:5000 (`/api/health`, `/api/ready`)

Full walkthrough: [docs/START.md](docs/START.md).

## Environment variables

See [`.env.example`](.env.example). Production **hard-fails** without a strong `JWT_SECRET`, `MONGODB_URI`, and `CLIENT_URL`. Optional `SMTP_*` enables password-reset email; without SMTP in production, forgot-password does **not** create tokens (fail closed).

## Commands

| Command | Description |
|---------|-------------|
| `npm run server` | Backend only (Terminal 1) |
| `npm run client` | Frontend only (Terminal 2) |
| `npm run dev` | Client + server together |
| `npm run build` | Production client build |
| `npm test` | Server + client tests |
| `npm run lint` | Lint |
| `npm run test:e2e` | Playwright |
| `npm run seed:admin` / `seed:content` | Seed helpers |

## Documentation

- [Start guide](docs/START.md) — run backend and frontend in two terminals
- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
- [API](docs/api.md)
- [Development](docs/development.md)
- [Deployment](docs/deployment.md)
- [Backup & recovery](docs/backup-recovery.md)
- [Production checklist](docs/production-checklist.md)
- [Production audit](docs/production-audit.md)

## Phase scope

| Phase | Status |
|-------|--------|
| 1 — Public site, leads/contact, auth foundation | Done |
| 2 — Admin CRM/CMS, RBAC, talks registration, SEO | Done |
| 3 — Security fixes, perf, observability, CI/CD, production docs | Done (this release) |
| Joy Box / new products | **Not started** |
