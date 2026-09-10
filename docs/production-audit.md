# Production audit — Vignak Solutions Phase 3

Date: 2026-09-11  
Scope: Harden Phase 1–2 modular monolith. No Joy Box / new product features.

**Overall rating: Conditionally Ready** — Critical/High Slice A issues addressed with regression tests; remaining risks are operational (SMTP, WAF/CAPTCHA, Atlas backup drills, dependency moderates) and must be owned before calling the system production-complete. This is **not** a claim of “100% secure.”

---

## Findings

### Architecture

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| INFO | monorepo | Modular monolith retained | Clear ops surface | Keep; no microservices | Accepted |
| LOW | client SPA | Client-side routing SEO | Limited crawl of dynamic routes | Static sitemap + PageMeta; dynamic sitemap later | Remaining (partial Fixed) |

### Security

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| CRITICAL | `adminLeadService.js` | STAFF `?assignedTo=` overwrote scope | Lead IDOR | Force staff `assignedTo=self` | Fixed |
| HIGH | admin list services | Raw `req.query` objects | NoSQL operator injection | `safeQuery.js` scalars only | Fixed |
| HIGH | `auth.js` | JWT ignored `passwordChangedAt` | Session after reset/change | Reject `iat < passwordChangedAt` | Fixed |
| HIGH | project/talk services | Mass assignment via spreads | Privilege / field injection | Allowlists + `pickFields` | Fixed |
| HIGH | `adminInquiryService.js` | Unscoped STAFF + weak updates | Inquiry IDOR / abuse | Scope + validators | Fixed |
| HIGH | `authService.js` | Prod reset without delivery | Token leakage / dead feature | SMTP mailer; fail closed without SMTP | Fixed |
| MEDIUM | `env.js` | Weak JWT in prod | Token forgery | Hard-fail &lt; 32 chars | Fixed |
| MEDIUM | health | Verbose DB on public health | Info leak | Split `/api/health` + `/api/ready` | Fixed |
| MEDIUM | `userService.js` | Unescaped regex search | ReDoS risk | `escapeRegex` | Fixed |
| MEDIUM | validators | Missing inquiry/settings/services | Invalid writes | Added validators | Fixed |
| LOW | Helmet | Default CSP may break SPA | Broken UI | Tuned CSP + fonts | Fixed |
| MEDIUM | deps | Express/`qs` moderate advisories | Theoretical DoS/parse issues | Track; avoid `--force` majors | Accepted |
| MEDIUM | public forms | No CAPTCHA/WAF | Spam / abuse | Add at edge when traffic warrants | Remaining |

### Authentication / Authorization

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| HIGH | cookie JWT | Sessions survived password change | Account takeover window | `passwordChangedAt` check | Fixed |
| INFO | AdminShell | Deep links UX only | Confused UX | `RequirePermission` redirect | Fixed |
| INFO | API | Source of truth for authz | — | Keep permission middleware | Accepted |

### Database

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| PERF | models | Missing compound indexes | Slow admin filters | Added compound indexes | Fixed |
| PERF | lead list | Over-populated notes/history | Payload bloat | Select omit + populate assignee | Fixed |

### API design

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| PERF | public lists | Unbounded finds | Memory / latency | Cap ~50–100 | Fixed |
| INFO | pagination | Admin lists capped | — | Preserve | Accepted |

### Frontend

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| PERF | `AppRoutes.jsx` | Eager route imports | Large initial JS | `React.lazy` + Suspense | Fixed |
| PERF | Vite | Single vendor blob | Cache efficiency | `manualChunks` react-vendor | Fixed |
| MEDIUM | `api.js` | Weak network/401 handling | Stuck admin session | Timeout + unauthorized handler | Fixed |
| LOW | public pages | Missing PageMeta | Weak SEO | Added on remaining pages | Fixed |
| LOW | a11y | No skip link | Keyboard UX | Skip link + main id | Fixed |

### Performance

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| INFO | Redis/CDN | Not present | Scale ceiling | Defer until metrics demand | Accepted |

### Scalability

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| INFO | monolith | Single deployable | Simple ops | Scale vertically / Atlas first | Accepted |
| REMAINING | sitemap | Static only | Missing dynamic portfolio/talks URLs | Generate from API later | Remaining |

### Observability

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| MEDIUM | logging | Ad-hoc console | Hard prod debug | `logger.js` JSON in prod | Fixed |
| MEDIUM | readiness | Mixed with liveness | Bad orchestrator probes | `/api/ready` | Fixed |

### Ops / CI

| Severity | File | Problem | Impact | Recommendation | Status |
|----------|------|---------|--------|----------------|--------|
| HIGH | CI | No pipeline | Regressions ship | GitHub Actions workflow | Fixed |
| MEDIUM | docs | Missing deploy/backup | Ops risk | Added deployment/backup/checklist | Fixed |
| LOW | dead code | Unused `AdminLayout.jsx` | Noise | Removed | Fixed |

---

## Regression coverage

- `server/tests/security.test.js` — IDOR, operator injection, post-change session kill, mass assignment, permission boundaries
- `server/tests/failure.test.js` — ready 503, auth 401, 404, duplicate registration 409
- Existing Phase 2 `api.test.js` retained

## Explicit non-claims

Do not treat this audit as a penetration test or compliance certification. Production readiness depends on correctly configured secrets, SMTP, HTTPS, Atlas backups, and operational follow-through on Remaining/Accepted items.
