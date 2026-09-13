# Vignak Solutions — Complete UI/UX Design Audit

**Date:** 2026-09-13  
**Application:** Vignak Solutions (client React/Vite + Express API)  
**Mode:** READ-ONLY audit — no application source modified  
**Evidence basis:** Code inspection of routes, layouts, pages, tokens, and components in `client/`. Browser rendering of the Vite client was **not available** (`ERR_CONNECTION_REFUSED` on `127.0.0.1:5173`). Responsive and contrast findings that require pixels are labeled **INFERRED** or **CODE-BASED RESPONSIVE RISK**. Route/copy/structure findings from source are labeled **VERIFIED**.

---

## 1. Executive Summary

Vignak’s public surface already communicates a clear flagship story: academic **Project Assistance** for B.Tech/M.Tech students, with a strong indigo/cyan brand direction, expressive typography (DM Sans + Instrument Serif), and a coherent hero → process → CTA path.

Comprehension breaks after the marketing surface. Two intake channels compete (**account + tracked service request** vs public **`/start-project` Lead inquiry**). Catalog deep-links pass `?next=` / `?service=` into Register, but Register **ignores** those params (**VERIFIED**). The customer dashboard introduces SaaS vocabulary (Requests, Projects, Deliverables, Quotations, Milestones, “work orders”) without a short guided onboarding. Admin uses a parallel CSS-module shell with leftover green accents that conflict with the indigo brand.

**Overall UI/UX (today): 6.2 / 10**  
**Visual UI Quality: 7.0 / 10** · **UX Quality: 5.6 / 10** · **First-Time User Comprehension: 5.4 / 10**

**Final comprehension answer:** **PARTIALLY** — a non-technical student can grasp *what Vignak does* and *that they should create an account*, but will struggle with *which form to use*, *what each dashboard section means*, and *what happens after submit*.

---

## 2. Current Application Understanding

### Page inventory (from `client/src/routes/AppRoutes.jsx` — VERIFIED)

```text
PUBLIC (PublicLayout)
├── /                          HomePage
├── /project-assistance        ProjectAssistancePage
├── /project-assistance/domains/:domainId
├── /services                  ServicesCatalogPage
├── /services/:slug            ServiceDetailPage
├── /portfolio[+/:slug]
├── /talks[+/:slug]
├── /about, /contact
├── /start-project             StartProjectPage (creates Lead — not ServiceRequest)
├── /privacy, /terms
├── redirects: /solutions*, /customized* → /services*
└── *                          NotFoundPage

AUTH (no shell)
├── /login, /register
└── /admin/login, /admin/forgot-password, /admin/reset-password

USER (ProtectedRoute → DashboardLayout)
├── /dashboard                 Overview (StudentDashboardPage)
├── /dashboard/requests[+ /new | /:id]
├── /dashboard/projects[+ /:id]
├── /dashboard/deliverables
├── /dashboard/quotations
├── /dashboard/payments
├── /dashboard/notifications
├── /dashboard/profile
└── /dashboard/support
    (Staff hitting /dashboard redirect to /admin/dashboard)

ADMIN (AdminShell + permissions)
├── /admin/dashboard
├── /admin/assigned-overview
├── /admin/leads[+/:id]
├── /admin/service-requests[+/:id]
├── /admin/work-projects[+/:id]
├── /admin/service-definitions
├── /admin/inquiries[+/:id]
├── /admin/projects[+ /new | /:id/edit]   (portfolio CMS)
├── /admin/talks[+ /new | /:id/edit]
├── /admin/users
└── /admin/settings
```

### Navigation sources (VERIFIED)

| Surface | Source |
|---------|--------|
| Public navbar | `NAV_LINKS` in `client/src/constants/site.js` + Start Your Project / auth CTAs in `Navbar.jsx` |
| Footer | Hardcoded Explore/Account links in `Footer.jsx` |
| Customer sidebar | `dashboardNavForUser` in `site.js` |
| Admin sidebar | `NAV` in `AdminShell.jsx` |

### Design stack (VERIFIED)

- **Public/dashboard:** Tailwind utilities + `Button.jsx` / `Field.jsx`
- **Admin + shared primitives:** CSS modules + `tokens.css`
- **Brand:** Indigo `#4F46E5` / Cyan `#06B6D4`; fonts DM Sans + Instrument Serif
- **Debt:** Orphaned CSS modules (`Navbar.module.css`, `Footer.module.css`, `Button.module.css`, `Field.module.css`, `HomePage.module.css`); green leftovers (`--focus-ring`, Card hover `rgba(15,110,86,…)`, AdminShell mint link)

---

## 3. Audit Scope & Methodology

| Method | Status |
|--------|--------|
| Route & component inventory from source | Done |
| Copy & CTA flow tracing | Done |
| Token / Tailwind / CSS module comparison | Done |
| Simulated first-time user (non-technical student) | Done |
| Live browser visual QA | **Not available** — findings marked accordingly |
| Automated WCAG tooling | Not run — visual a11y only from code |

Severity: CRITICAL / HIGH / MEDIUM / LOW. Issues use IDs `UIUX-001`+.

---

## 4. Current UI Score

| Category | Score |
| -------- | ----: |
| Visual Design | 7.2 |
| CSS Quality | 6.5 |
| Layout | 7.0 |
| Alignment | 6.8 |
| Spacing | 7.0 |
| Typography | 7.5 |
| Color System | 6.4 |
| Contrast | 6.2 |
| Component Consistency | 5.8 |
| **Overall UI** | **7.0** |

---

## 5. Current UX Score

| Category | Score |
| -------- | ----: |
| Navigation | 6.5 |
| Information Architecture | 5.8 |
| First-Time User Experience | 5.4 |
| User Journey Clarity | 5.5 |
| CTA Clarity | 5.2 |
| Content Clarity | 6.0 |
| Dashboard UX | 5.0 |
| Forms UX | 5.8 |
| Feedback States | 6.2 |
| Mobile UX | 6.0 (code-based) |
| Accessibility | 6.0 |
| **Overall UX** | **5.6** |

---

## 6. First-Time User Comprehension Score

> **First-Time User Comprehension: 5.4 / 10**

| Immediately understandable | Requires thinking | Confusing | Unclear |
|----------------------------|-------------------|-----------|---------|
| Vignak helps students with academic projects | Difference between Services and Project Assistance | `/start-project` vs account request | Why Quotations/Deliverables appear empty |
| Start Your Project ≈ create account | Request status ≠ project progress (disclaimed but easy to miss) | Register deep-link params ignored | When a “project” appears after a “request” |
| Domains as topic chips | Dashboard sidebar density | “Work order” vs “project” | Expected follow-up timing after submit |

---

## 7. Overall UI/UX Score

> **OVERALL UI/UX SCORE: 6.2 / 10**

**Weighting:** Comprehension and journey clarity (~45%) outweigh visual polish (~35%) and consistency/a11y (~20%). A coherent marketing UI cannot fully compensate for dual intake + post-login vocabulary load.

---

## 8. First-Time User Simulation

Persona: non-technical final-year student, first visit at `/`.

| # | Question | Rating | Evidence-based answer |
|---|----------|--------|------------------------|
| 1 | What is Vignak? (5–10s) | Clear | Hero brand + “working technical project” for students (**VERIFIED** copy in `projectAssistance.js`) |
| 2 | What does it provide? | Clear | Guidance, development help, docs, demo |
| 3 | Who is it for? | Clear | B.Tech / B.E. / M.Tech called out |
| 4 | What is Project Assistance? | Clear | Flagship nav + dedicated page/process |
| 5 | Other services? | Somewhat Clear | `/services` exists; home teaser is compact; business services less explained for students |
| 6 | What to click for help? | Somewhat Clear | “Start Your Project”, Contact, Support (logged-in) compete |
| 7 | After “Start Your Project”? | Confusing | Guest → `/register`, not a project form; logged-in → `/dashboard/requests/new` |
| 8 | Need an account? | Somewhat Clear | Marketing pushes account; `/start-project` works without one |
| 9 | After submitting request? | Confusing | Toast “We will review…”; no SLA, no request ID emphasis, dual forms differ |
| 10 | Can I track? | Clear (if account path) | Dashboard requests/projects exist |
| 11 | Where is my project? | Confusing | Projects empty until staff convert; “work orders” language |
| 12 | Dashboard sections mean? | Confusing | Requests vs Projects vs Deliverables vs Quotations unexplained for new users |
| 13 | Communicate with Vignak? | Somewhat Clear | Project Messages after project exists; else Contact/Support |
| 14 | Documents? | Somewhat Clear | Only inside project Documents tab |
| 15 | What next? | Confusing | Overview lacks “you are here / waiting on review” narrative |
| 16 | Did Vignak receive it? | Somewhat Clear | Toast + list; Start Project success card better than request path for confirmation UI |

---

## 9. User Journey Audit

### Primary intended journey (VERIFIED)

```text
Visitor → Home
  → Understand PA flagship
  → Start Your Project / Create Account
  → /register
  → /dashboard (Overview)
  → /dashboard/requests/new  (often manual; ?service ignored at register)
  → Submit ServiceRequest
  → Toast + /dashboard/requests
  → (staff) convert → WorkProject
  → /dashboard/projects/:id (milestones, docs, messages)
```

### Competing journey (VERIFIED)

```text
Visitor → /start-project OR PA footer “Public inquiry form”
  → createLead (CRM)
  → “Inquiry received” on same page
  → No dashboard tracking of that Lead for the visitor
```

### Dead ends / friction

| Issue | Detail |
|-------|--------|
| Deep-link drop | Services CTAs use `/register?next=…&service=…` but Register navigates only to `/dashboard` |
| Dual intake | Lead inquiry not linked to Requests list |
| Empty commercial nav | Quotations/Deliverables/Payments empty by default — looks unfinished to first-timers |
| Staff redirect | Staff never see customer dashboard (by design) — fine for ops |

### Journey scores

| Journey | Score / 10 |
| ------- | ---------: |
| First Visit → Understand Vignak | 7.5 |
| Homepage → Project Assistance | 8.0 |
| Project Assistance → Request | 5.5 |
| Register → Dashboard | 6.0 |
| Submit Request → Confirmation | 5.5 |
| Dashboard → Understand Status | 4.5 |
| Dashboard → Find Next Action | 5.0 |
| Request → Project Understanding | 4.5 |
| Portfolio → Trust | 6.5 |
| Service Discovery | 6.0 |
| Mobile Experience | 6.0 (code-based) |

---

## 10. Information Architecture Audit

**Strengths:** PA elevated in nav (`font-semibold`); Services catalog consolidates former solutions/customized; Talks kept as CMS product.

**Problems:**

1. **“Start Your Project”** semantically suggests a form; for guests it is account creation.
2. **Start Project page** name collides with CTA but creates a **Lead**, not a ServiceRequest.
3. Dashboard packs commercial objects (Quotations/Payments) beside student intake without progressive disclosure.
4. Admin “Portfolio” vs customer “Projects” naming collision across roles.
5. Footer omits Start Project prominence relative to nav CTA density.

---

## 11. Navigation Audit

### Public Navbar (VERIFIED)

- 7 primary links + Start Your Project always visible; Log in / Create Account hidden below `sm` (rely on mobile drawer) — **CODE-BASED RISK:** mobile users must open hamburger for login if they miss Start CTA.
- Mobile menu: full-screen overlay with links + auth buttons (**VERIFIED** structure).
- Hamburger uses `sr-only` “Menu”; visual affordance is minimal (thin bars).

### Dashboard sidebar

- Labels are short but opaque to novices (Deliverables, Quotations).
- Active state uses accent soft background — clear.
- No breadcrumbs on nested pages (only “Back” on some details).

### Admin

- Long permission-filtered list; operational clarity good for staff, jargon-heavy (Leads, Service Requests, Work Projects, Services config).

---

## 12. CSS Audit

| Finding | Detail |
|---------|--------|
| Dual systems | Tailwind pages vs CSS-module admin/UI — visual parity imperfect |
| Orphan modules | Unused Button/Field/Navbar/Footer/HomePage modules invite drift |
| Focus ring | `--focus-ring` still green while brand is indigo |
| Utility duplication | Google Fonts imported in both `global.css` and `tokens.css` |
| Admin bar fill | Uses CSS var accent — aligned; Card hover green — not aligned |

CSS Quality score reflects maintainability risk more than total breakage.

---

## 13. Color Audit

| Token / usage | Note |
|---------------|------|
| Accent indigo / cyan | Strong, intentional brand (**KEEP**) |
| `--color-muted: #64748B` on `#F8FAFC`/`white` | **INFERRED** borderline for `text-xs`/`text-sm` helper copy |
| `text-white/55`–`/80` on dark footer/hero | Generally OK on ink; depends on hero photo under opacity |
| Badge accent | Soft indigo bg + accent text — usually readable |
| Leftover green | Focus, Card hover, Admin site link `#9fd9c5` — brand inconsistency |
| Category chips | Default Tailwind color families beyond brand tokens |

No verified white-on-white in primary Button (white on accent). `outlineInverse` is unsafe if reused on light backgrounds (**INFERRED** misuse risk).

---

## 14. Typography Audit

| Element | Assessment |
|---------|------------|
| Display H1/H2 (Instrument Serif) | Distinctive, on-brand (**KEEP**) |
| Eyebrow + lead pattern | Consistent hierarchy on marketing/dashboard |
| Dashboard `!text-3xl` overrides | Works; slightly fights global h1 clamp |
| Badge / tab pills `text-xs` | Dense; OK for status, weak for primary instruction |
| Admin tables | Compact module styles — operational, not consumer-friendly |

---

## 15. Alignment Audit

Public pages use `max-w-container` + consistent `px-4 sm:px-6` — generally aligned. Dashboard cards share left edges in grid. Admin service-definition UI uses inline grid — workable but less polished. Project detail tab pills wrap with `flex-wrap` — acceptable; uneven row heights on wrap (**CODE-BASED RISK**).

---

## 16. Spacing Audit

Marketing sections use generous `py-14`/`py-20` — professional. Dashboard packing is tighter and fine for tools. Risk: home packs many sections (values, process, domains, portfolio, services, why, FAQ, CTA) — long scroll may dilute primary CTA (**MEDIUM** content density, not a spacing bug).

---

## 17. Layout Audit

| Area | Assessment |
|------|------------|
| Home hero | Full-bleed dark composition — strong |
| Dashboard | Sidebar + main — standard SaaS |
| Admin | Dark sidebar drawer under 960px — functional |
| Auth pages | Centered card — clear |
| Tables | DataTable stacks with `data-label` at max-width 720px — good pattern |

---

## 18. Button Audit

`Button.jsx`: variants primary/secondary/outline/ghost/inverse/outlineInverse/danger/success; sizes sm/md/lg; focus-visible ring accent.

| Issue | Severity |
|-------|----------|
| Navbar packs multiple primary-looking actions (Create Account + Start Your Project both prominent) | HIGH (CTA competition) |
| Disabled `opacity-55` reduces contrast | MEDIUM |
| Orphan `Button.module.css` still encodes green shadow | LOW (dead code) |

No evidence of large text in tiny buttons in the live Tailwind Button.

---

## 19. Card Audit

| Variant | Implementation |
|---------|----------------|
| Marketing/dashboard cards | Tailwind `rounded-2xl border … shadow-soft` |
| `Card` component | CSS module; green hover border |
| Stat tiles on Overview | Same Tailwind card language |
| Admin `.panel` | AdminPages module |

Inconsistency: module Card vs Tailwind cards; prefer one hover language.

---

## 20. Form Audit

| Form | Clarity | Gaps |
|------|---------|------|
| Register | Clear fields + customer type | Ignores `next`/`service`; institution/course heavy for business types |
| Login | Clear | — |
| New request (`ServiceRequestForm`) | Config-driven labels | Domain/tech fields may intimidate; little “why we ask” helper |
| Start Project | Clear inquiry framing | Budget/service enums; no account; success doesn’t explain tracking gap |
| Contact | Clear | — |
| Profile | Clear | Customer type editable — good |

Post-submit: toasts exist; **no request ID** surfaced in student UI; Start Project has better success panel than service request path.

---

## 21. Dashboard Audit

Overview (`StudentDashboardPage.jsx`):

**Works:** Greeting, stat links, “New request” CTA, recent projects.

**Fails first-time comprehension:**

- Copy mixes “requests”, “projects”, “milestones”, “work orders”.
- Empty recent projects says “No active work orders” — jargon.
- No explicit “Waiting for Vignak to review your request” state machine.
- Quotations/Deliverables/Payments in nav without overview explanation.

Project detail: progress bar + tabs (Overview/Milestones/Tasks/Documents/Messages/Activity) — powerful but tab labels assume product literacy. Support page correctly points to Messages vs Contact (**KEEP** pattern).

---

## 22. Responsive Audit

**CODE-BASED (client not rendered):**

| Breakpoint concern | Risk |
|--------------------|------|
| Navbar: auth buttons `hidden sm:inline-flex`; Start CTA always shown | Login discoverability on narrow phones depends on menu |
| Hamburger vs many CTAs in header | Crowding at ~320–390px |
| Dashboard `lg:grid-cols-[220px_1fr]` | Sidebar stacks above content on small — OK |
| Admin drawer at 960px | Non-Tailwind breakpoint inconsistency |
| DataTable card mode at max-width 720px | Good |
| Project tabs `rounded-full` wrap | Usable but dense |

Mark all specific overflow claims as **INFERRED** pending visual QA.

---

## 23. Accessibility Visual Audit

| Item | Notes |
|------|-------|
| Skip link | Present in PublicLayout pattern |
| Focus | Button uses `focus-visible:ring-accent/40`; tokens still define green focus for modules |
| Labels | Field components associate labels |
| Color-only status | Status often text + Badge — better than color alone |
| Target sizes | sm buttons / icon hamburger ~40px — acceptable |
| Contrast | Muted text on light — **INFERRED** risk for small type |
| Tab buttons | Not `role="tab"` — custom buttons; keyboard OK as buttons |

Not a WCAG certification.

---

## 24. Component Consistency Audit

| Component | Consistency |
|-----------|-------------|
| Button | Good on Tailwind path |
| Field | Good |
| Badge | Module tones consistent in admin/student lists |
| Empty/Error/Loading | Shared States — good |
| Toast | Shared — good |
| Cards | Split implementations |
| Nav patterns | Public Tailwind vs Admin modules vs Dashboard Tailwind |

---

## 25. Project Assistance UX Audit

**Path:** Home → PA → Domains → Register/Request → Dashboard → Track.

| Step | Score | Notes |
|------|------:|-------|
| Marketing clarity | 8 | Process steps 1–6 excellent |
| Domain landings | 7 | Clear topic pages |
| Conversion CTA | 5 | Guest Start → Register; PA footer also offers public inquiry |
| Authenticated request | 7 | Form exists; domains included |
| Tracking | 5 | Intake vs delivery split explained on Requests page but easy to miss |
| Trust | 7 | Honest FAQ / no fake guarantees |

**Student understanding of complete process:** PARTIAL — marketing process is clear; operational objects after login are not.

---

## 26. Multi-Service UX Audit

| Criterion | Assessment |
|-----------|------------|
| PA as flagship | Yes — nav weight + home |
| Other services legitimate | Catalog pages with audience/process/FAQ |
| Who each is for | Present on detail pages |
| After selecting service | Broken deep-link to register params |
| Confusion risk | Secondary services + commercial dashboard items can overwhelm students |
| Unfinished feel | Empty quotations/payments; provider-ready payments copy is honest but advanced |

---

## 27. Elements to KEEP

| Element | Page | Why it works | Recommendation |
|---------|------|--------------|----------------|
| Hero brand + headline + support + CTA group | `/` | Answers what/who in first viewport | KEEP — NO CHANGE to structure |
| PA process steps | Home + PA | Sequential comprehension | KEEP |
| Intake ≠ progress disclaimer | `/dashboard/requests` | Critical truth for students | KEEP — amplify, don’t remove |
| Indigo/Cyan brand tokens | Global | Distinct from generic purple-AI look | KEEP |
| Instrument Serif display + DM Sans | Global | Professional hierarchy | KEEP |
| Services catalog redirects from legacy IA | Routes | Prevents orphan competing IA | KEEP |
| Support page Messages vs Contact | `/dashboard/support` | Clear help routing | KEEP |
| DataTable mobile stack | Admin lists | Responsive pattern | KEEP |
| Toast success after request | New request | Minimal confirmation | KEEP — enrich, don’t remove |
| EmptyState/ErrorState components | Shared | Consistent feedback shells | KEEP |

---

## 28. Critical Issues

### UIUX-001

- **Page:** `/register` (entry from `/services/:slug`)
- **Component:** RegisterPage
- **Category:** User Journey / CTA
- **Severity:** CRITICAL
- **Issue:** Catalog links include `?next=/dashboard/requests/new&service=…` but Register always `navigate('/dashboard')` and never reads query params.
- **User impact:** User who chose a service loses that intent after signup.
- **Recommended direction:** Honor `next` + `service` (or store and redirect). No redesign of register layout required.

### UIUX-002

- **Page:** `/` CTA + `/start-project` + `/dashboard/requests/new`
- **Category:** Information Architecture / User Journey
- **Severity:** CRITICAL (comprehension)
- **Issue:** Three different “start” concepts: account creation, Lead inquiry, ServiceRequest — with overlapping labels (“Start Your Project” / “Start Project”).
- **User impact:** Wrong channel → no tracking or unexpected CRM-only path.
- **Recommended direction:** Rename/clarify public inquiry vs tracked request; align CTA destinations with outcomes.

---

## 29. High Priority Issues

### UIUX-003 — Dashboard vocabulary without onboarding

**Page:** `/dashboard` · **Category:** Dashboard UX · **Severity:** HIGH  
Overview and nav use Requests / Projects / Deliverables / Quotations / “work orders” without a one-screen explainer.  
**Direction:** First-login checklist or plain-language definitions under each nav item.

### UIUX-004 — Post-request “what happens next” thin

**Page:** after `/dashboard/requests/new` · **Category:** Feedback · **Severity:** HIGH  
Toast only; no ETA, owner, or ID emphasis.  
**Direction:** Confirmation panel on request detail with next steps.

### UIUX-005 — Competing header CTAs

**Page:** Global Navbar · **Category:** CTA · **Severity:** HIGH  
Create Account + Start Your Project both primary for guests; Start goes to Register anyway.  
**Direction:** Single primary conversion CTA; demote the duplicate.

### UIUX-006 — Empty commercial sections feel unfinished

**Pages:** `/dashboard/quotations|deliverables|payments` · **Category:** Dashboard UX · **Severity:** HIGH for students  
Honest empties, but nav presence implies content.  
**Direction:** Progressive disclosure by customerType/service needs; keep pages for business users.

### UIUX-007 — Brand color leftovers (green)

**Files:** `tokens.css`, `Card.module.css`, `AdminShell.module.css` · **Category:** Color / Consistency · **Severity:** HIGH for professionalism  
**Direction:** Align focus/hover/admin accents to indigo/cyan.

### UIUX-008 — Request vs Project timing unclear

**Pages:** Requests + Projects · **Category:** Content Clarity · **Severity:** HIGH  
Users expect a “project” immediately after submit.  
**Direction:** Explicit “Under review — not started building yet” state on Overview.

### UIUX-009 — Documents only inside project tabs

**Page:** `/dashboard/projects/:id` · **Category:** Navigation · **Severity:** HIGH if users look in Support/Overview  
**Direction:** Cross-link “Shared files appear here after your project starts.”

### UIUX-010 — Mobile auth discoverability

**Component:** Navbar · **Category:** Responsive / Navigation · **Severity:** HIGH (CODE-BASED)  
Log in hidden until `sm` / menu.  
**Direction:** Ensure mobile menu surfaces Log in first; keep Start CTA.

---

## 30. Medium Priority Issues

| ID | Issue | Category |
|----|-------|----------|
| UIUX-011 | Muted `#64748B` on small helper text — contrast risk (INFERRED) | Accessibility / Color |
| UIUX-012 | Dual Card implementations (Tailwind vs module) | Consistency |
| UIUX-013 | Orphan CSS modules + duplicate font imports | CSS |
| UIUX-014 | Project detail tabs not ARIA tabs; dense pill UI | Accessibility |
| UIUX-015 | Admin vs customer “Projects” naming collision | IA |
| UIUX-016 | Start Project success doesn’t offer Create Account / track | Feedback |
| UIUX-017 | ServiceRequestForm little field-level “why” help | Form UX |
| UIUX-018 | Home content length dilutes primary CTA | Visual Hierarchy |
| UIUX-019 | Admin breakpoint 960 vs Tailwind lg 1024 | Responsive |
| UIUX-020 | Deliverable marketing list vs Deliverables nav (same word, different meaning) | Terminology |

---

## 31. Low Priority Issues

| ID | Issue | Category |
|----|-------|----------|
| UIUX-021 | Disabled button opacity contrast | Accessibility |
| UIUX-022 | Category chip colors outside brand tokens | Color |
| UIUX-023 | Inline style on progress bar width | Consistency |
| UIUX-024 | Admin service definition form uses pipe-delimited text areas — ops-only UX | Form UX (admin) |
| UIUX-025 | Hamburger visual is minimal (weak affordance) | Visual Hierarchy |

---

## 32. Top 20 Issues

1. UIUX-001 — Register ignores `next`/`service`
2. UIUX-002 — Dual/triple “start” intake confusion
3. UIUX-003 — Dashboard vocabulary without onboarding
4. UIUX-008 — Request vs Project timing
5. UIUX-004 — Thin post-submit next steps
6. UIUX-005 — Competing header CTAs
7. UIUX-006 — Empty commercial nav items
8. UIUX-007 — Green leftover brand conflict
9. UIUX-010 — Mobile auth discoverability
10. UIUX-009 — Document findability
11. UIUX-020 — “Deliverable” dual meaning
12. UIUX-016 — Lead inquiry dead-end for tracking
13. UIUX-011 — Muted text contrast risk
14. UIUX-017 — Form field guidance
15. UIUX-012 — Card inconsistency
16. UIUX-015 — Projects naming across roles
17. UIUX-018 — Home length / CTA dilution
18. UIUX-014 — Tab a11y/density
19. UIUX-013 — Orphan CSS / dual imports
20. UIUX-019 — Breakpoint inconsistency

---

## 33. Master Issue Table

| ID | Type | Category | Severity | Page | Component | Element | Problem | User Impact | Recommended Direction |
| -- | ---- | -------- | -------- | ---- | --------- | ------- | ------- | ----------- | --------------------- |
| UIUX-001 | UX | User Journey | CRITICAL | /register | RegisterPage | Query handling | Ignores next/service | Lost service intent | Honor redirect params |
| UIUX-002 | UX | IA | CRITICAL | / + /start-project | Navbar + StartProject | CTA labels | Multiple start meanings | Wrong intake | Clarify/rename channels |
| UIUX-003 | UX | Dashboard UX | HIGH | /dashboard | Overview + sidebar | Labels | Jargon without guide | Paralysis | Onboarding copy |
| UIUX-004 | UX | Feedback | HIGH | /dashboard/requests | Toast | Post-submit | Weak next-step | Anxiety | Confirmation panel |
| UIUX-005 | UX | CTA | HIGH | Global | Navbar | Buttons | Duplicate conversion CTAs | Decision fatigue | One primary CTA |
| UIUX-006 | UX | Dashboard UX | HIGH | /dashboard commercial | Nav | Quotations etc. | Empty looks unfinished | Distrust | Progressive disclosure |
| UIUX-007 | UI | Color | HIGH | Global/Admin | tokens/Card/AdminShell | Accents | Green leftovers | Unprofessional | Indigo/cyan only |
| UIUX-008 | UX | Content Clarity | HIGH | /dashboard | Overview | Empty copy | Project expected immediately | Confusion | Explicit review state |
| UIUX-009 | UX | Navigation | HIGH | /dashboard/projects/:id | Tabs | Documents | Hard to discover | Missed files | Cross-links |
| UIUX-010 | UX | Responsive | HIGH | Global | Navbar | Auth buttons | Hidden on narrow | Can’t log in easily | Menu priority |
| UIUX-011 | UI | Accessibility | MEDIUM | Many | text-muted | Helpers | Possible low contrast | Hard to read | Darken muted or enlarge |
| UIUX-012 | UI | Consistency | MEDIUM | Many | Card | Hover | Two card systems | Visual drift | Single pattern |
| UIUX-013 | UI | CSS | MEDIUM | Build | *.module.css | Orphans | Dead styles | Maintainer risk | Remove or wire |
| UIUX-014 | UI | Accessibility | MEDIUM | Project detail | Tabs | Pills | Not tab semantics | SR/keyboard clarity | ARIA tabs or clearer labels |
| UIUX-015 | UX | IA | MEDIUM | Admin vs User | Nav | Projects | Same word different objects | Support confusion | Rename portfolio vs work |
| UIUX-016 | UX | Feedback | MEDIUM | /start-project | Success | Next CTA | No track path | Drop-off | Offer account/track |
| UIUX-017 | UX | Form UX | MEDIUM | /dashboard/requests/new | ServiceRequestForm | Fields | Little why-text | Abandonment | Short hints |
| UIUX-018 | UI | Visual Hierarchy | MEDIUM | / | HomePage | Sections | Long scroll | CTA dilution | Tighten below fold |
| UIUX-019 | UI | Responsive | MEDIUM | Admin | AdminShell | 960px | Breakpoint mismatch | Layout jump | Align to lg |
| UIUX-020 | UX | Terminology | MEDIUM | Marketing + dash | Copy | Deliverable | Two meanings | Misread | Distinct labels |
| UIUX-021 | UI | Accessibility | LOW | Global | Button | Disabled | Low contrast | Hard to see state | Stronger disabled style |
| UIUX-022 | UI | Color | LOW | Domains | Chips | Colors | Off-token | Mild inconsistency | Map to brand |
| UIUX-023 | UI | Consistency | LOW | Project detail | Progress | Inline bg | Magic color | Drift | Token class |
| UIUX-024 | UX | Form UX | LOW | Admin services | Definitions | Pipe textareas | Ops friction | Staff errors | Structured fields later |
| UIUX-025 | UI | Visual Hierarchy | LOW | Navbar | Menu icon | Affordance | Weak icon | Miss menu | Standard hamburger |

---

## 34. File-Level Fix Map

| Issue ID | Likely file(s) | Likely styling | Change type (future) |
|----------|----------------|----------------|----------------------|
| UIUX-001 | `client/src/pages/RegisterPage.jsx` | N/A | Behavior: read search params |
| UIUX-002 | `Navbar.jsx`, `StartProjectPage.jsx`, `projectAssistance.js`, `site.js` | Copy/CTA | Label + IA |
| UIUX-003 | `StudentDashboardPage.jsx`, `site.js` | Tailwind copy | Onboarding content |
| UIUX-004 | `NewRequestPage.jsx`, `MyRequestDetailPage.jsx` | Tailwind | Confirmation UI |
| UIUX-005 | `Navbar.jsx` | Button variants | CTA hierarchy |
| UIUX-006 | `site.js` `dashboardNavForUser` | N/A | Conditional nav |
| UIUX-007 | `tokens.css`, `Card.module.css`, `AdminShell.module.css` | CSS vars | Color alignment |
| UIUX-008 | `StudentDashboardPage.jsx` | Tailwind | Status narrative |
| UIUX-009 | `MyProjectDetailPage.jsx`, `SupportPage.jsx` | Tailwind | Cross-links |
| UIUX-010 | `Navbar.jsx` | Tailwind responsive | Mobile auth order |
| UIUX-011 | `tokens.css` / Tailwind `text-muted` | Color | Contrast tweak |
| UIUX-012 | `Card.module.css` vs page cards | CSS/Tailwind | Unify |
| UIUX-013 | Orphan modules, `global.css` | CSS | Cleanup |
| UIUX-014 | `MyProjectDetailPage.jsx` | Tailwind | A11y structure |
| UIUX-015 | `AdminShell.jsx` labels | Copy | Rename |
| UIUX-016 | `StartProjectPage.jsx` | Tailwind | Success CTAs |
| UIUX-017 | `ServiceRequestForm.jsx` | Field hints | Microcopy |
| UIUX-018 | `HomePage.jsx` | Section count | Content edit |
| UIUX-019 | `AdminShell.module.css` | Media query | Breakpoint |
| UIUX-020 | `projectAssistance.js` + nav labels | Copy | Disambiguate |

*No changes made during this audit.*

---

## 35. Recommended Fix Order

### PHASE 1 — Critical Comprehension & Usability

UIUX-001, UIUX-002, UIUX-003, UIUX-008, UIUX-004, UIUX-005

### PHASE 2 — Critical Visual/CSS

UIUX-007; verify UIUX-011 contrast on real devices

### PHASE 3 — Navigation & Information Architecture

UIUX-006, UIUX-009, UIUX-015, UIUX-020, UIUX-016

### PHASE 4 — Responsive UX

UIUX-010, UIUX-019 — **manual render** at 320–430px required

### PHASE 5 — Design Consistency

UIUX-012, UIUX-013, UIUX-022, UIUX-023

### PHASE 6 — Visual Polish

UIUX-014, UIUX-017, UIUX-018, UIUX-021, UIUX-024, UIUX-025

---

## 36. Final Scorecard

| Area | Score |
| ---- | ----: |
| Visual UI | 7.0/10 |
| CSS | 6.5/10 |
| Layout | 7.0/10 |
| Alignment | 6.8/10 |
| Spacing | 7.0/10 |
| Typography | 7.5/10 |
| Colors | 6.4/10 |
| Responsive | 6.0/10 |
| Accessibility | 6.0/10 |
| Consistency | 5.8/10 |
| Navigation | 6.5/10 |
| Information Architecture | 5.8/10 |
| User Journey | 5.5/10 |
| First-Time User Comprehension | 5.4/10 |
| Forms UX | 5.8/10 |
| Dashboard UX | 5.0/10 |
| Feedback UX | 6.2/10 |
| CTA Clarity | 5.2/10 |
| Overall UI | 7.0/10 |
| Overall UX | 5.6/10 |
| **Overall UI/UX** | **6.2/10** |

---

## 37. Final Conclusion

### What is already strong?

Flagship marketing clarity, PA process storytelling, brand typography/color direction, shared Button/Field/Toast/Empty patterns, honest disclaimers that intake status is not development progress.

### What is acceptable?

Admin operational shell, portfolio/talks public pages, loading/error shells, basic mobile nav structure.

### What is confusing?

Start/Register/Start-Project triangle; dashboard object model; empty commercial sections; service deep-links that do not survive registration.

### What is visually broken?

Nothing critically unreadable found in code for primary indigo buttons. Brand **inconsistency** (green leftovers) and **INFERRED** muted contrast are the main visual risks—not a white-on-white catastrophe.

### What prevents first-time understanding?

Post-login product language and dual intake without a single guided path.

### What prevents feeling fully professional?

Dual design systems, leftover green tokens, orphan CSS, CTA competition in the header.

### What prevents feeling trustworthy?

Unclear “what happens after I submit,” empty nav destinations, and inquiry paths that do not map to a trackable student workspace.

---

### Most important final question

> If a completely non-technical person opens Vignak Solutions for the first time, can they understand what Vignak does, what they can request, how to request it, what happens after requesting it, and how to track/continue their work?

**Answer: PARTIALLY**

They can understand **what Vignak does** and **that Project Assistance is the main offer**. They can usually **start an account**. They will often **not** confidently know **which form is the real request**, **what each dashboard item means**, or **when a project will appear**—until staff convert a request and the user rediscovers the Projects area.

---

*End of audit. Application source files were not modified.*
