# Bug Report — Vignak Solutions Final Audit

**Date:** 2026-09-11  
**Rule:** No fixes applied in this audit pass.

Severity: **P0** Critical · **P1** High · **P2** Medium · **P3** Low

---

## P0 — Critical

_None verified._ No authentication bypass, RCE, or confirmed data-loss bugs found in harness/security tests.

---

## P1 — High

### BUG-001 — Silent portfolio/talks static fallback hides API failure
- **Category:** Frontend / Reliability / Hidden bug  
- **Feature:** Portfolio, Talks, Home featured content  
- **File:** `client/src/services/portfolioService.js`, `client/src/services/talksService.js`  
- **Description:** On any API error, UI loads local `data/portfolio.js` / `data/talks.js` with no user-visible error.  
- **Reproduction:** Run Playwright/Vite without API; observe Vite `ECONNREFUSED` for `/api/projects` & `/api/talks` while pages still render project/talk content and E2E passes.  
- **Expected:** Show Error/Empty/Retry; do not silently substitute CMS data in production.  
- **Actual:** Looks healthy with stale/static content.  
- **Impact:** Operators cannot detect outages; users may act on non-live content; tests give false confidence.  
- **Root cause:** Catch-all fallback design.  
- **Recommended fix:** Disable fallback when `import.meta.env.PROD` or surface banner; fail closed to error state.  
- **Regression risk:** Medium (empty states when API down).  
- **Test after fix:** E2E with API stopped must assert error UI, not content cards from static data.

### BUG-002 — Playwright/CI does not start API
- **Category:** Testing / CI  
- **Feature:** E2E quality gate  
- **File:** `playwright.config.js`, `.github/workflows/ci.yml`  
- **Description:** `webServer` runs client only; proxy to `:5000` fails quietly.  
- **Reproduction:** `npm run test:e2e` — Vite logs proxy ECONNREFUSED; 5 tests still pass.  
- **Expected:** Full-stack smoke or explicit contract mock.  
- **Actual:** Green CI possible with broken backend.  
- **Impact:** Regressions in forms/admin persist undetected.  
- **Recommended fix:** Concurrently start server with memory/test Mongo or wire playwright webServer array.  
- **Test after fix:** Contact submit asserts 201; admin login requires API.

### BUG-003 — Lead assignment has no admin UI
- **Category:** Admin CRM / UX  
- **Feature:** Lead assign  
- **File:** `client/src/pages/admin/AdminLeadDetailPage.jsx` (missing control); API `adminLeadService.js` supports `assignedTo`  
- **Description:** Sales/Admin cannot assign leads from UI despite API + permissions.  
- **Reproduction:** Open lead detail — only status, archive, notes.  
- **Expected:** Assignee select for roles with `LEADS_ASSIGN` / assign permission.  
- **Actual:** Display-only assignee column on list; no editor.  
- **Impact:** Core CRM workflow incomplete; STAFF scoping unused operationally.  
- **Recommended fix:** Add assignee `<Select>` calling `updateAdminLead`.  
- **Test after fix:** UI + API assign; STAFF sees only own leads.

### BUG-004 — Inquiry assignment has no admin UI
- **Category:** Admin CRM / UX  
- **Feature:** Inquiry assign  
- **File:** `client/src/pages/admin/AdminInquiryDetailPage.jsx`  
- **Description:** Status-only UI; API supports `assignedTo` with role gate.  
- **Impact:** Same as BUG-003 for inquiries.  
- **Recommended fix:** Mirror lead assign control with permission check.

---

## P2 — Medium

### BUG-005 — Production cookie `SameSite=none` without CSRF token
- **File:** `server/src/middleware/auth.js`  
- **Impact:** Cross-site cookie sends on HTTPS cross-origin setups increase CSRF risk for state-changing admin POSTs.  
- **Recommendation:** Prefer same-site deploy + `lax`, or CSRF tokens / custom headers.

### BUG-006 — No CAPTCHA/WAF on public forms
- **Files:** lead/contact/registration routes  
- **Impact:** Spam/abuse under automation despite rate limits.  
- **Status:** Accepted risk in Phase 3 docs; still open.

### BUG-007 — Moderate npm advisories (Express/qs, Vitest mocker)
- **Evidence:** `npm audit` — 4 moderate; high+ clean.  
- **Recommendation:** Track; avoid `--force` majors without regression plan.

### BUG-008 — Unused `asObjectId` import (lint warning)
- **File:** `server/src/services/adminInquiryService.js`  
- **Impact:** Hygiene / CI noise.

### BUG-009 — React Hook exhaustive-deps warnings on admin list pages
- **Files:** `AdminLeadsPage.jsx`, `AdminInquiriesPage.jsx`, `AdminLeadDetailPage.jsx`  
- **Impact:** Possible stale closures; currently warnings only.

### BUG-010 — `VITE_API_URL` missing from `.env.example`
- **Impact:** Split-origin deploys misconfigured.

### BUG-011 — Static sitemap omits dynamic project/talk URLs
- **File:** `client/public/sitemap.xml`  
- **Impact:** SEO discoverability incomplete.

### BUG-012 — Admin layout lacks skip-link
- **File:** `client/src/layouts/AdminShell.jsx`  
- **Impact:** Keyboard a11y gap for staff.

---

## P3 — Low

### BUG-013 — Dead `AdminHomePage.jsx` not routed
### BUG-014 — `getPublicServices` unused by any page
### BUG-015 — Vitest `act(...)` warnings / possible unhandled noise
### BUG-016 — Login password validator min 8 vs user create min 12
### BUG-017 — No hard DELETE endpoints (archive-only) — document as product choice
### BUG-018 — Rate-limit 429 behavior not load-tested
### BUG-019 — Workspace missing `.env` blocks local full-stack verification (ops, not code defect)

---

## Summary counts

| Severity | Count |
|----------|------:|
| P0 | 0 |
| P1 | 4 |
| P2 | 8 |
| P3 | 7 |
