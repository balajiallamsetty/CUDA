# Production checklist

Use before promoting a build to production.

## Security

- [ ] `JWT_SECRET` ≥ 32 chars; unique per environment
- [ ] No production secrets in git (`.env` gitignored; `.env.example` placeholders only)
- [ ] SMTP configured in production (password reset fail-closed without it)
- [ ] `CLIENT_URL` matches real SPA origin
- [ ] HTTPS on SPA + API; cookies `Secure`
- [ ] Helmet CSP / frameguard / referrerPolicy verified in browser
- [ ] Staff lead IDOR + inquiry scope verified with a STAFF account
- [ ] `npm audit` reviewed (high/critical resolved or accepted in audit doc)

## Reliability

- [ ] `/api/health` returns 200 (liveness)
- [ ] `/api/ready` returns 200 with DB up
- [ ] Atlas backups enabled; restore drill scheduled
- [ ] Rate limits active on auth + public forms
- [ ] Structured logs reachable; no passwords/tokens in logs

## Product / SEO

- [ ] Core public routes render; `PageMeta` titles present
- [ ] `robots.txt` + static `sitemap.xml` deployed
- [ ] Admin deep links respect permission guards

## Process

- [ ] CI green on the release commit (lint, test, build, audit, e2e)
- [ ] Staging smoke passed on same artifacts
- [ ] Rollback plan known (previous tag + previous DB snapshot if schema changed)
