# Project Assistance Pivot — Implementation Report

## Delivered

- **Tailwind** on public site, auth, and student dashboard; admin CRM kept on CSS modules.
- **Brand**: Logo component + favicon; Vignak tokens in `tailwind.config.js`.
- **Content data**: `projectAssistance.js`, `projectCategories.js`, `portfolioPlaceholders.js` + local SVG placeholders.
- **Auth**: `POST /api/auth/register` (USER), student profile fields on User, cookie session.
- **Leads**: optional `user`, `projectCategory`, `technologies`, `projectTitle`; authenticated creates attach ownership.
- **Student APIs**: `GET/PATCH /api/auth/me/profile`, `GET /api/auth/me/leads`, `GET /api/auth/me/leads/:id` (ownership enforced).
- **Frontend**: `/register`, `/login`, `/dashboard/*`, `/project-assistance`; PA-first Home; demoted secondary copy; filterable portfolio with CMS-or-placeholder fallback (labeled illustrative).

## Status label mapping (client only)

| Lead status | Student label |
|-------------|---------------|
| NEW | Submitted |
| CONTACTED | Under review |
| QUALIFIED | Discussion |
| PROPOSAL / NEGOTIATION | In progress |
| WON | Completed |
| LOST | Cancelled |

## Success bar

- First viewport positions Project Assistance for B.Tech/M.Tech.
- Students can Create Account → submit request → list own requests.
- Admin Leads CRM unchanged for ops; Talks/Contact/Admin preserved.
- Public UI powered by Tailwind; regression tests updated.
