# Integration Verification — Vignak Solutions Final Audit

**Date:** 2026-09-11

---

## Integration matrix

| Integration | Config | Connection tested | Auth | Request/Response | Failure behavior | Verdict |
|-------------|--------|-------------------|------|------------------|------------------|---------|
| MongoDB / Mongoose | `MONGODB_URI` | In-memory harness PASS; Atlas **BLOCKED** (no env) | N/A URI | CRUD PASS in harness | `/api/ready` 503 when disconnected PASS | **PARTIAL** |
| SMTP / Nodemailer | `SMTP_*` | Unset in audit env | optional auth | Dev logs reset URL PASS | Prod fail-closed (no token) code-reviewed; inbox **BLOCKED** | **PARTIAL** |
| Vite → API proxy | `client/vite.config.js` → `:5000` | Observed ECONNREFUSED when API down | cookies include | Proxy errors in Vite log | Client continues via fallbacks | **FAIL** under outage UX |
| CORS / CLIENT_URL | `env.clientUrl` | Harness uses localhost | credentials | CORS allowlist code PASS | Mis-set origin breaks cookies | **PASS** (code) |
| Helmet CSP + fonts | `app.js` | Code review | n/a | Prod CSP directives present | May break if new CDNs added | **PASS** (code) |
| JWT cookies | `vignak_token` | Harness login/me PASS | HttpOnly | change-password kills session PASS | Invalid cookie 401 PASS | **PASS** |
| Swagger `/api/docs` | non-prod only | NOT TESTED runtime | n/a | Mounted when `!isProd` | Hidden in prod | **NOT TESTED** |
| Google Fonts | CSP allow | NOT TESTED network | n/a | — | Offline fonts degrade | **NOT TESTED** |
| Payments / OAuth / S3 / AI | — | — | — | — | Not implemented | **N/A** |

---

## End-to-end chains

### Contact / Lead (verified in harness)

USER ACTION → FRONTEND (NOT live) → `POST /api/contact|/api/leads` → validators → service → MongoMemory → 201 → countDocuments PASS

Live UI→DB: **BLOCKED** (no server env).

### Talk registration

`POST /api/talks/:id/register` → 201 → unique index → duplicate 409 PASS → `TalkRegistration` count 1 PASS

### Password reset

`POST /api/auth/forgot-password` → generic message PASS → without SMTP in test/dev logs link PASS → production without SMTP skips token (code path)

Real email delivery: **BLOCKED**.

### Admin mutations

Project/talk create, settings patch, dashboard stats: harness PASS. Live admin UI against Atlas: **BLOCKED**.

---

## Cross-module

| From | To | Result |
|------|-----|--------|
| Auth cookie | Admin routes | PASS |
| Content publish | Public GET by slug | PASS |
| Registration | Admin registrations list API | PARTIAL (create path PASS; list not separately asserted in harness) |
| Portfolio UI | Public projects API | **FAIL** integrity when API down (static fallback) |

---

## Conclusion

Core internal integrations are structurally sound and proven in-memory. Production cutover still requires real Atlas + SMTP staging proof and removal/flagging of silent SPA fallbacks.
