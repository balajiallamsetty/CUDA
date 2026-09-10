# Architecture (Phase 3)

Vignak remains a **modular monolith** monorepo:

- `client/` — public site + admin dashboard (React/Vite, route-level code splitting)
- `server/` — Express REST API
- `shared/` — enums + permission matrix
- `docs/` — implementation + production docs
- `tests/e2e/` — Playwright flows
- `.github/workflows/ci.yml` — lint, test, build, audit, e2e

## Layering

Routes → Middleware (auth, permission, validation, rate limit) → Controllers → Services → Models → MongoDB Atlas

## Phase 3 hardening (no new products)

- Security: lead IDOR fix, safe query helpers, session invalidation on password change, mass-assignment allowlists, inquiry scope, SMTP fail-closed reset, prod JWT secret enforcement
- Performance: compound indexes, lean lead lists, capped public lists, React.lazy + `react-vendor` chunk
- Observability: structured logger, `/api/health` vs `/api/ready`, prod error redaction
- Ops: deployment / backup / checklist docs, production audit artifact

## Out of scope

Joy Box, microservices, Redis/CDN, image upload pipeline, auto-deploy to production.
