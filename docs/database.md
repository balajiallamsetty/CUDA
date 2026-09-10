# Database (Phase 2)

## Models

| Model | Notes |
|-------|-------|
| User | Roles, isActive, passwordChangedAt, passwordHash select:false |
| Lead | assignedTo, archived, notes[], statusHistory[] |
| Inquiry | assignedTo, archived |
| Project | archived, text index, unique slug |
| Speaker | designation, organization, socialLinks, archived |
| Talk | archived, speaker ref |
| TalkRegistration | unique (talk, email) |
| AuditLog | action/actor metadata |
| PasswordResetToken | tokenHash, expiresAt, usedAt |
| ServiceOffering | slug, order, published |
| SiteSettings | public contact fields |

## Indexes

Status/archived/assignedTo/query text indexes on leads, inquiries, projects, talks. Unique slugs on Project/Talk/ServiceOffering.
