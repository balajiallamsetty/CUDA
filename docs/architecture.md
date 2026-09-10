# Architecture

## Overview

Vignak Phase 1 is a **modular monolith** monorepo:

- `client/` — React (Vite) public website and admin shell
- `server/` — Express REST API
- `shared/` — shared enums/constants consumed by both packages
- `docs/` — implementation documentation
- `tests/e2e/` — Playwright smoke tests

Phase 2/3 products are intentionally not implemented. The module boundaries are designed so new domains can be added as additional route/service/model groups inside the same Express app.

## Backend layering

```
Routes → Middleware → Controllers → Services → Models → MongoDB Atlas
```

- **Routes** wire HTTP paths, rate limiters, validators.
- **Controllers** stay thin: parse request, call services, shape responses.
- **Services** own business logic and persistence orchestration.
- **Models** define Mongoose schemas, indexes, and constraints.

## Frontend structure

- Design tokens and global styles in `client/src/styles/`
- Reusable UI in `client/src/components/ui` and layout in `components/layout`
- Pages under `client/src/pages`
- API access through `client/src/services/api.js`
- Portfolio/talks currently use local repositories (`portfolioService`, `talksService`) so pages are not tightly coupled to mock arrays

## Public routes implemented

`/`, `/about`, `/solutions`, `/solutions/web-services`, `/solutions/custom-digital-solutions`, `/customized`, `/customized/gifts`, `/customized/conference-kits`, `/talks`, `/talks/:slug`, `/portfolio`, `/portfolio/:slug`, `/contact`, `/start-project`, `/privacy`, `/terms`, plus `404`.

Admin UX shell: `/admin/login`, `/admin` (frontend guard + backend-enforced `/api/admin/*`).

## API surface (Phase 1)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Health + DB state |
| POST | `/api/leads` | Start-a-project leads |
| POST | `/api/contact` | Contact inquiries |
| POST | `/api/auth/login` | Login + HttpOnly cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Current user |
| GET | `/api/admin/me` | Protected admin probe |

## Expansion guidance

Add future domains (events, Joy Box, CRM) as new `routes/controllers/services/models` folders without splitting into microservices until operationally necessary.
