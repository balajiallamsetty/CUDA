# Database (Phase 3)

MongoDB Atlas via Mongoose. Key collections: User, Lead, Inquiry, Project, Talk, Speaker, TalkRegistration, ServiceOffering, SiteSettings, AuditLog, PasswordResetToken.

## Indexes (representative)

- Lead: `{ assignedTo, archived, createdAt }`, `{ archived, status, createdAt }`, `{ service, archived, createdAt }`, text search
- Project: `{ published, archived, createdAt }`
- Talk / Speaker: published/archived + text
- TalkRegistration: `{ talk, email }` unique; `{ talk, createdAt }`
- Inquiry: `{ assignedTo, archived, createdAt }`
- AuditLog: `{ actorEmail, createdAt }`, `{ actor, createdAt }`

## Query hygiene

Admin list filters go through `safeQuery` (scalars/enums/ObjectIds only). Lead list omits `notes` / `statusHistory` / `meta` and populates `assignedTo` only.
