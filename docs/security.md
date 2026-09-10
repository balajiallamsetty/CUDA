# Security

## Implemented controls

- **Helmet** security headers on the API
- **CORS** restricted to `CLIENT_URL` with credentials enabled
- **Rate limiting**: global, form submission, and auth endpoints
- **Input validation** with `express-validator` on leads, contact, login
- **Honeypot field** (`company_website`) on public forms — bots receive a benign success response without persistence
- **Passwords** hashed with bcrypt (cost factor 12); hashes never returned in API payloads (`select: false` + `toSafeObject`)
- **JWT** stored in **HttpOnly** cookies (`Secure` in production, `SameSite=lax` in development / `none` when secure production cross-site)
- **RBAC** via `authenticate` + `authorize(...roles)` middleware
- **Admin API protection** on `/api/admin/*` (frontend checks are UX only)
- **Audit logging** for login success/failure, logout, lead/inquiry creation
- **Central error handler** avoids leaking secrets; production 500s return generic messages
- **Health endpoint** exposes connectivity state only — no credentials

## Roles

`SUPER_ADMIN`, `ADMIN`, `STAFF`, `CONTENT_MANAGER`, `SALES`, `USER`

Staff roles may access `/api/admin/*` in Phase 1.

## Secrets handling

- Never commit `.env`
- Use `.env.example` placeholders only
- Seed admin via `npm run seed:admin` using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from local env

## Known Phase 1 limitations

- No email verification / password reset flows yet
- Talk registration UI is architectural (local confirmation) — persistence API can be added next
- No WAF / captcha provider integration yet (honeypot + rate limits only)
- Production cookie `SameSite=none` assumes HTTPS frontend/API pairing
