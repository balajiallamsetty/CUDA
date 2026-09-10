# Architecture (Phase 2)

Vignak remains a **modular monolith** monorepo:

- `client/` — public site + admin dashboard (React/Vite)
- `server/` — Express REST API
- `shared/` — enums + permission matrix
- `docs/` — implementation docs
- `tests/e2e/` — Playwright flows

## Layering

Routes → Middleware (auth, permission, validation, rate limit) → Controllers → Services → Models → MongoDB Atlas

## Phase 2 additions

- Full admin CRM/CMS under `/api/admin/*` with permission middleware
- Public content APIs for projects, talks, services, talk registration
- Password reset token architecture
- Admin UI shell with role-filtered navigation
- SEO helpers (`PageMeta`, robots.txt, static sitemap)

## Out of scope

Joy Box, Phase 3 ecosystem products, file uploads/CDN, production SMTP delivery (reset links logged in development).
