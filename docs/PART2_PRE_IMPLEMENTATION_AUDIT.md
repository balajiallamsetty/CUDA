# Part 2 Pre-Implementation Audit

**Date:** 2026-09-12  
**Goal:** Extend Part 1 into a multi-service ecosystem without rebuilding or regressing Project Assistance.

## Part 1 inventory (extension points)

| Area | Status | Part 2 action |
|------|--------|---------------|
| ServiceRequest → WorkProject | Working (PA) | Config-driven milestones per service |
| ServiceDefinition | PA-only seed | Seed all SERVICE_SLUGS + workflowConfig |
| Dashboard | Student-only nav | Adapt by customerType |
| Payments | Stub page | Payment model + admin record + webhook skeleton |
| Quotation / Deliverable | Absent | New models + APIs |
| Message | Client-visible only | Add CLIENT/INTERNAL visibility |
| Public Services | Marketing pages | Catalog from ServiceDefinition |
| Talks CMS | Intact | Keep; Event Management via workflow |
| Lead CRM | Intact | Preserve |

## Regression checklist (must stay green)

- [ ] USER register/login/cookie session
- [ ] PA service request create + ownership IDOR
- [ ] Admin convert → WorkProject + milestones + progress
- [ ] Project messages (client)
- [ ] Notifications
- [ ] Lead assign UI
- [ ] `/project-assistance` + domains
- [ ] Portfolio placeholders labeled illustrative

## Risks

1. Hardcoded `PA_DEFAULT_MILESTONES` on convert — must load template from ServiceDefinition while keeping PA weights.
2. Student-only dashboard — business users need different nav without forking apps.
3. Dual catalogs (ServiceOffering CMS vs ServiceDefinition) — link by slug; workflow lives on ServiceDefinition.
4. Payment faking — admin-recorded only until provider secrets configured.

## Approach

Modular monolith extensions only. See Part 2 plan for locked decisions.
