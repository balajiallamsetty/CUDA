# Security Audit — Vignak Solutions Final Audit

**Date:** 2026-09-11  
**Type:** Evidence-based application security review (not a certified penetration test).

---

## Controls verified (PASS)

| Control | Evidence |
|---------|----------|
| HttpOnly JWT cookie | `auth.js`; harness login sets session |
| bcrypt password hashing | User model; login compare |
| Session invalidation on password change | Harness: change-password → `/api/admin/me` 401 |
| Staff lead IDOR (`assignedTo` query) | Harness: STAFF cannot list/open others’ leads |
| NoSQL operator injection via query objects | Harness: `status[$ne]` → 400 (`safeQuery`) |
| Mass assignment allowlists | Harness: project create ignores `passwordHash`/`role` |
| RBAC permission denials | USER 403 admin; SALES 403 projects; CONTENT 403 users |
| Anonymous admin 401 | Harness |
| Prod JWT secret hard-fail | `env.js` code review (`< 32` throws in production) |
| Password reset anti-enumeration | Generic message PASS |
| Prod reset fail-closed without SMTP | `authService.requestPasswordReset` code review |
| Health vs ready split | Health has no DB; ready 503 when down |
| Helmet referrerPolicy / frameguard / CSP | `app.js` |
| CORS origin allowlist | `app.js` + `CLIENT_URL` |
| Rate limiters present | `rateLimiters.js` (429 not load-tested) |
| Honeypot middleware on public forms | routes |
| express-validator on writes | validators + admin routes |
| XSS payload stored as text (not executed server-side) | Harness contact with `<script>`/`onerror` |
| Prod 5xx redaction | `errorHandler.js` |
| Logger sensitive key redaction | `logger.js` |
| `.gitignore` covers `.env` | PASS |
| Secret scan | No live Mongo URIs / private keys in source |
| `npm audit --audit-level=high` | Clean |

---

## Issues / residual risk

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| BUG-001 | P1 | Silent static fallback can mask outages / confuse trust boundary | Open |
| BUG-005 | P2 | `SameSite=none` cookies without CSRF tokens | Open |
| BUG-006 | P2 | No CAPTCHA/WAF | Open / accepted ops |
| BUG-007 | P2 | Moderate qs/Vitest advisories | Accepted pending majors |
| — | P2 | Rate-limit effectiveness NOT TESTED | Gap |
| — | P2 | Exhaustive role×route matrix PARTIAL | Gap |
| — | INFO | CSP `styleSrc` includes `'unsafe-inline'` for SPA practicality | Accepted tradeoff |

---

## OWASP-oriented notes

- **A01 Broken Access Control:** Lead IDOR fixed & retested; inquiry staff scope code-reviewed + partial tests; assign UI missing does not weaken API denies.  
- **A02 Cryptographic failures:** bcrypt + JWT secret length in prod; cookies Secure in prod.  
- **A03 Injection:** Query object rejection PASS; mongoose schemas; XSS stored — ensure React text rendering (default) escapes (code uses JSX text nodes).  
- **A05 Misconfiguration:** Health minimized; Swagger off in prod; missing local `.env` is ops.  
- **A07 Auth failures:** Generic login errors; session kill PASS; short passwords fail validation before auth.  
- **A09 Logging:** Structured logger; avoid logging tokens (mailer logs reset URL in **dev only** — ensure prod SMTP path never console-logs tokens).

---

## Verdict

Security posture is **materially improved (Phase 3)** and core regressions PASS. Residual P1 is primarily reliability/trust (fallback), not classic authz bypass. **Do not claim production-hardened without CSRF decision, SMTP staging proof, and fallback policy.**
