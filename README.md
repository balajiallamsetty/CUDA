# Vignak Solutions

Phase 1 foundation for **Vignak Solutions** — a modular monolith connecting technology, experiences, and communities.

This repository contains the public website, lead/contact APIs, portfolio & Vignak Talks architecture, and an authentication foundation for future admin tooling.

## Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JSX), Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT in HttpOnly cookies, bcrypt |
| Testing | Jest + Supertest, Vitest + React Testing Library, Playwright |
| Structure | npm workspaces monorepo (modular monolith) |

## Repository layout

```
vignak/
├── client/     # React public site
├── server/     # Express REST API
├── shared/     # Shared enums/constants
├── docs/       # Architecture & development docs
└── tests/      # Playwright e2e tests
```

## Prerequisites

- Node.js 18+
- npm 9+
- A MongoDB Atlas cluster (or local MongoDB for development)

## Local setup

1. Clone the repository and install dependencies from the root:

```bash
npm install
```

2. Copy environment defaults and fill in secrets locally (never commit `.env`):

```bash
cp .env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example server/.env
```

3. Edit `server/.env` with your `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

4. Start both apps:

```bash
npm run dev
```

- Client: http://localhost:5173  
- API: http://localhost:5000  

## Environment variables

See [`.env.example`](.env.example):

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin for CORS/cookies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used only by the optional seed script |

## Development commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server together |
| `npm run dev:client` | Vite only |
| `npm run dev:server` | Express only |
| `npm run build` | Production build of the client |
| `npm test` | Run server + client unit/integration tests |
| `npm run lint` | Lint client and server |
| `npm run seed:admin` | Create an admin user from env credentials |
| `npm run test:e2e` | Playwright smoke tests |

## Documentation

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
- [Development](docs/development.md)

## Phase scope

**Phase 1 (this repo):** public website, web/customized/talks positioning, leads, contact, portfolio & talks data architecture, auth foundation, admin API protection.

**Not in Phase 1:** Joy Box, full admin CMS, Phase 3 ecosystem products.
