# Security (Phase 2)

## Controls

- Helmet, CORS allowlist, global + form + auth + password-reset + registration rate limits
- express-validator on public and admin writes
- Honeypot on public forms and talk registration
- bcrypt (cost 12); hashes never returned
- JWT in HttpOnly cookies
- `authenticate`, `requireStaff`, `authorizePermission`
- STAFF lead IDOR protection (assigned leads only)
- ADMIN cannot manage SUPER_ADMIN accounts
- Audit logs for auth, lead/project/talk/user/settings actions (no passwords/tokens)
- Forgot-password anti-enumeration (generic response)
- Production 500 responses hide stacks

## Permissions

See `@vignak/shared` `PERMISSIONS` / `ROLE_PERMISSIONS`.

## Remaining production tasks

- Real SMTP for password reset
- CAPTCHA / WAF
- Image CDN + upload pipeline
- Dynamic sitemap generation
- HTTPS + cookie SameSite=none pairing
