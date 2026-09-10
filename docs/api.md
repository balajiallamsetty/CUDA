# API Reference (Phase 2)

Base URL (local): `http://localhost:5000`

Auth: HttpOnly cookie `vignak_token` set on login. Send requests with credentials.

Common envelope:

```json
{ "success": true, "data": {}, "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 1 } }
```

Errors: `{ "success": false, "message": "...", "errors": [{ "field", "message" }] }`

## Public

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/health` | No | DB health |
| POST | `/api/leads` | No | Start-a-project lead |
| POST | `/api/contact` | No | Contact inquiry |
| GET | `/api/projects` | No | Published portfolio (`?featured=true`) |
| GET | `/api/projects/:slug` | No | Project detail |
| GET | `/api/talks` | No | Published talks |
| GET | `/api/talks/:slug` | No | Talk detail |
| POST | `/api/talks/:id/register` | No | Register (rate-limited, honeypot) |
| GET | `/api/services` | No | Published service offerings |

## Auth

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/login` | No | Sets cookie |
| POST | `/api/auth/logout` | Optional | Clears cookie + audit |
| GET | `/api/auth/me` | Yes | Session + permissions |
| POST | `/api/auth/forgot-password` | No | Anti-enumeration message |
| POST | `/api/auth/reset-password` | No | `{ token, password }` |
| POST | `/api/auth/change-password` | Yes | `{ currentPassword, newPassword }` |

## Admin (staff roles + permission checks)

| Method | Path | Permission |
|--------|------|------------|
| GET | `/api/admin/me` | Staff |
| GET | `/api/admin/dashboard/stats` | `dashboard:read` |
| GET/PATCH | `/api/admin/leads`, `/leads/:id` | `leads:read` / `leads:write` |
| POST | `/api/admin/leads/:id/notes` | `leads:write` |
| GET/PATCH | `/api/admin/inquiries` | `inquiries:*` |
| GET/POST/PATCH | `/api/admin/projects` | `projects:*` |
| GET/POST/PATCH | `/api/admin/speakers` | `speakers:*` |
| GET/POST/PATCH | `/api/admin/talks` | `talks:*` |
| GET | `/api/admin/talks/:id/registrations` | `talks:read` |
| GET/POST/PATCH | `/api/admin/users` | `users:*` |
| GET/PATCH | `/api/admin/settings` | `settings:*` |
| GET | `/api/admin/audit-logs` | `audit:read` |
| GET/POST | `/api/admin/services` | `services:*` |

List endpoints accept `page`, `limit`, `q`, and resource-specific filters (`status`, `archived`, `published`, etc.).

OpenAPI UI is available in non-production at `/api/docs` when the server mounts Swagger.
