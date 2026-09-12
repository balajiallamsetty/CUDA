# Part 1 Implementation Audit (Discovery)

**Date:** 2026-09-12  
**Goal:** Platform foundation + Project Assistance delivery workflow without rebuilding the monolith.

## Current architecture

```text
client (React/Vite/Tailwind public+student, CSS modules admin)
  → Express API (JWT cookie, RBAC)
  → MongoDB (Lead/Inquiry/User/portfolio Project/Talks/…)
```

## Existing features to preserve

- Auth register/login/logout/me, password reset, bcrypt, cookie JWT
- Public Lead (`/start-project`) + Contact Inquiry
- Student `/me/leads` ownership APIs (legacy)
- Admin CRM: leads, inquiries, portfolio CMS, talks, users, settings, audit
- Security: helmet, CORS, rate limits, honeypot, IDOR patterns, validators
- PA marketing pages + placeholders

## Collision risk

| Name in product | Current model | Part 1 decision |
|-----------------|---------------|-----------------|
| Portfolio case study | `Project` / `projects` | **Keep unchanged** |
| Delivery work order | (missing) | New `WorkProject` / `work_projects` |
| Student request | Currently `Lead` | New `ServiceRequest`; Lead remains CRM interest |

## Broken / gaps (from PROJECT_STATUS)

- Lead assign UI missing on detail (API supports `assignedTo`)
- No ServiceRequest / WorkProject / milestones / tasks / docs / messages / notifications
- Progress falsely implied via Lead CRM labels
- Sitemap missing `/project-assistance`
- E2E without API
- Teal brand → migrate to Indigo/Cyan tokens

## Migration risks

- Do not delete Lead fields or portfolio `Project`
- Dashboard switches to ServiceRequest; optional script copies owned PA leads
- Extend permissions without removing existing ones
- Admin must remain functional during rollout

## Implementation order

A Discovery → B Shared → C Models → D APIs → E Auth → F Student UI → G Admin → H Public → I SEO → J Tests → K Completion audit

## Affected areas (high level)

- `shared/*`, `server/src/models/*`, `server/src/routes/*`, `server/src/services/*`
- `client` dashboard, admin shell/nav, HomePage, categories, tailwind tokens, sitemap
- Tests + `.env.example` + `server/uploads/` gitignore
