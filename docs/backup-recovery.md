# Backup & recovery

## What to back up

1. **MongoDB Atlas** — primary datastore (users, leads, inquiries, projects, talks, settings, audit logs).
2. **Environment / secrets** — vault or host secret store (never git).
3. **Deployed artifacts** — git tags / CI build outputs for rollback.

Static SPA assets in `client/dist` are rebuildable from source; do not treat them as the sole backup.

## Recommended cadence

| Asset | Cadence | Retention |
|-------|---------|-----------|
| Atlas continuous backup / snapshots | Provider default (daily+) | ≥ 7–30 days |
| Pre-release snapshot | Before risky migrations | Until release verified |
| Secret inventory | On rotate | Current + previous |

## Restore outline

1. Restore Atlas cluster / snapshot to a **new** database (do not overwrite blindly).
2. Point staging `MONGODB_URI` at the restored DB; verify `/api/ready` and spot-check admin lists.
3. Promote only after smoke tests.
4. Rotate JWT/SMTP credentials if the incident involved secret exposure.

## Password reset tokens

Tokens are short-lived hashed records. After restore, users may need to request a fresh reset; that is expected.

## RPO / RTO (working assumptions)

- RPO: last Atlas snapshot interval (typically ≤ 24h unless continuous backup).
- RTO: hours — DNS/app redeploy + DB restore verification. Refine after first staging restore drill.
