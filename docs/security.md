# Security (Phase 3)

## Controls

- Helmet (CSP for SPA + Google Fonts in production, `frameguard` deny, referrer policy), CORS allowlist, rate limits
- express-validator on public and admin writes (including inquiries, settings, services)
- Honeypot on public forms and talk registration
- bcrypt (cost 12); hashes never returned
- JWT in HttpOnly cookies; sessions rejected after `passwordChangedAt`
- `authenticate`, `requireStaff`, `authorizePermission`
- STAFF lead list **cannot** override `assignedTo` via query (IDOR fixed)
- Inquiry STAFF scope: assigned-to-self + unassigned; cannot open/update others’ assigned
- Safe query helpers reject object/array operator injection (`$ne`, `$gt`, …)
- Mass-assignment allowlists on Project / Talk / Speaker writes
- Production hard-fail if `JWT_SECRET` missing or &lt; 32 characters
- Password reset: nodemailer when SMTP configured; **production without SMTP creates no tokens** (generic response)
- User search uses escaped regex
- Audit logs for auth and important mutations (no passwords/tokens)
- Production 5xx responses hide stacks / DB internals
- Liveness `/api/health` vs readiness `/api/ready`

## Permissions

See `@vignak/shared` `PERMISSIONS` / `ROLE_PERMISSIONS`.

## Remaining / accepted risks

- CAPTCHA / WAF not implemented
- Image CDN + upload pipeline not built (URL-only)
- Dynamic sitemap generation remaining (static sitemap covers core URLs)
- Express/`qs` moderate advisories may remain without breaking majors — see production audit
- Never claim the system is “100% secure”
