# Database

## Engine

MongoDB Atlas via Mongoose. Connection string comes only from `MONGODB_URI` in environment configuration.

## Models implemented

| Model | Purpose | Notable fields |
|-------|---------|----------------|
| `User` | Auth + RBAC | email (unique), passwordHash (select:false), role enum, isActive |
| `Lead` | Project inquiries | service/status enums, org fields, meta ip/ua |
| `Inquiry` | Contact form | subject/message, status |
| `Project` | Portfolio (API-ready) | slug unique, category enum, published/featured |
| `Speaker` | Talk speakers | name, bio, image |
| `Talk` | Vignak Talks | slug, status enum, speaker ref, registration flags |
| `TalkRegistration` | Talk registrations | unique (talk, email) |
| `AuditLog` | Security/ops audit | action, actor, ip, metadata, success |

## Indexes

- Unique: `User.email`, `Project.slug`, `Talk.slug`, `TalkRegistration (talk, email)`
- Query helpers: lead/inquiry status + createdAt, talk/project published flags

## Frontend data note

Portfolio and talks UI currently read **local mock modules** through service wrappers. Mongoose models exist so admin/CMS and public APIs can be connected later without redesigning page contracts.

## What is not modeled yet

Joy Box, venue/event operations, student platform entities, CRM objects, and AI agent configurations are deferred past Phase 1.
