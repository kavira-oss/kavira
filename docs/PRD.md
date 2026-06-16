# Kavira — Product Requirements Document

**Status:** Draft v1.0
**Owner:** Calvin (clinztouch) — Maintainer
**Last updated:** 2026-06-16 (rev 2 — governance update: Maintainer title, module-scoped CODEOWNERS merge rights, dev/staging/prod branch flow)
**License:** Apache 2.0
**Repository:** github.com/kavira-oss/kavira

---

## 1. Vision & Positioning

Kavira is an open-source behavioral tracking and analytics infrastructure. It captures time-based user events, computes behavioral patterns from those events, and surfaces the resulting insight through a REST API consumed by a web dashboard and a mobile app.

Kavira is not a habit-tracking app. Framing it that way places it in a saturated consumer category where products compete on UI polish and minor feature differences, and where the engineering itself isn't the value. Kavira's value sits in the system underneath: authentication, event ingestion, scheduling, background processing, and pattern computation. The habit-completion use case is the first and most legible instance of the system, not its ceiling.

**One-line description:**
> Open-source infrastructure for capturing behavioral events and generating insight from them.

**Taglines (context-dependent):**
- Developer-facing: *"Behavioral tracking infrastructure, built in the open."*
- User-facing: *"Understand your patterns. Own your data."*
- System description: *"Track behavior. Compute patterns. Generate insight."*

### Why this is worth building

A habit tracker is not worth building in 2026 — the market is mature and dominated by products with years of UX investment and brand recognition. A behavioral data system, positioned as open infrastructure, is worth building because its value is judged differently: by system design, extensibility, and how well it functions as a reference implementation other developers can learn from and build on. Projects in this category (PostHog, Plausible, Unleash) remain relevant for exactly this reason — the code itself, not just the hosted product, is the thing people show up for.

---

## 2. Target Audience

Kavira has two audiences, and v1 must serve both without compromising either.

**Primary — Contributors (developers).**
Engineers at junior, mid, and senior level who want to work on a real backend system: event ingestion, relational data modeling, background job processing, analytics pipelines, auth flows. Kavira should function as a portfolio-grade reference project — something a contributor can point to and say "I built the analytics scheduler" or "I designed the event schema."

**Secondary — End users.**
People who want to track recurring behaviors (habits, routines, practices) and see real pattern data about their own consistency — not just a streak counter, but day-of-week breakdowns, consistency scores, and trend data over time.

v1 is built primarily for the first audience. The second audience is served by whatever the first audience builds on top of the engine.

---

## 3. Core System Concepts

These four concepts are the vocabulary of the entire system. Every feature, schema decision, and endpoint should be describable in these terms.

| Concept | Definition |
|---|---|
| **Behavior** | A user-defined thing being tracked (e.g. "Read 20 minutes", "Morning run"). Analogous to a habit, but modeled as a trackable entity with metadata (frequency, category), not just a title and a checkbox. |
| **Event** | A single timestamped occurrence of a Behavior being completed or logged. The atomic unit of data in the system. Events are append-only — they are not edited in place, only added or retracted. |
| **Pattern** | A computed property derived from a stream of Events for a given Behavior — current streak, longest streak, completion rate, day-of-week distribution, consistency score. Patterns are derived data, recomputed on a schedule or on demand, never stored as the source of truth. |
| **Insight** | A human-readable statement generated from one or more Patterns — e.g. "You're 80% consistent on weekdays, 40% on weekends." Insights are the output layer; they are what the user or API consumer actually sees. |

This separation (raw Events → computed Patterns → generated Insights) is the core architectural decision of the system. It is what distinguishes Kavira from a CRUD habit tracker and is non-negotiable in the v1 data model.

---

## 4. V1 Scope

### In scope

**Authentication & accounts**
- Register, login, email verification, password reset
- JWT access tokens (15 minute expiry) + refresh token rotation
- Per-device session tracking, stored server-side
- Logout (single device) and logout-all-devices

**Behavior management**
- Create, edit, archive, delete Behaviors
- Behavior metadata: title, description, category, target frequency (daily / specific weekdays)

**Event logging**
- Log a completion event for a Behavior on a given date
- Retract (delete) a logged event
- Idempotent — logging the same Behavior twice for the same day does not create duplicate events

**Core analytics (Patterns)**
- Current streak, longest streak
- Completion rate (% of expected days completed, given frequency)
- Day-of-week consistency breakdown
- Computed on read for v1; scheduled recomputation is a stretch goal (see below)

**Background jobs**
- Scheduled job to recompute Patterns for active users
- Scheduled email digest (weekly summary) — infrastructure only; content can be minimal in v1

**API & documentation**
- Full REST API
- Swagger UI at `/api/docs`, generated from decorators — not hand-maintained

**Web dashboard (apps/web)**
- Auth pages (register, login, verify, forgot/reset password)
- Behavior list / dashboard view
- Individual Behavior detail view with Pattern data
- Create / edit Behavior flow
- Basic account settings

**Mobile app (apps/mobile)**
- Auth flow (shared logic with web via `@kavira/types` and `@kavira/utils`)
- Today's Behaviors view with one-tap event logging
- Behavior detail view (read-only Pattern display is acceptable for v1)

### Explicitly out of scope for v1

- Social features (sharing, accountability partners, leaderboards)
- Webhooks / external integrations
- Public API for third-party developers (the API exists, but a public developer program is a v2+ concern)
- Predictive analytics or ML-driven insight generation
- Push notifications (the scheduling infrastructure may exist; actual push delivery is not v1)
- Multi-language / i18n support
- Payment / monetization of any kind

Anything not listed under "in scope" is out of scope by default. Contributors proposing new features should open a discussion issue referencing this document before starting work.

---

## 5. Technical Architecture

### 5.1 Stack summary

| Layer | Choice | Rationale |
|---|---|---|
| Backend framework | NestJS + TypeScript | Enforces module boundaries via DI and decorators; matches the team's existing production experience; built-in Swagger, guards, and scheduling support directly address the contributor-clarity goal. |
| Database | PostgreSQL | Event/Pattern/Behavior relationships are inherently relational; window functions make Pattern computation a query, not application code. |
| ORM | Prisma 7 | Type-safe queries, trackable migrations, fast contributor onboarding (`prisma migrate dev`). |
| Background jobs | `@nestjs/bull` + Redis | Production-grade queue with retry/backoff; Redis is already required for session/token revocation, so this adds no new infrastructure dependency. |
| Scheduling | `@nestjs/schedule` | Cron-based triggers for Pattern recomputation and digest jobs. |
| Auth | JWT access + refresh rotation | Stateless access tokens for performance; rotating refresh tokens with per-device DB-backed sessions for revocation and multi-device support. |
| API docs | `@nestjs/swagger` | Documentation generated from the same decorators that define the controllers — cannot drift out of sync the way hand-written docs do. |
| Frontend | Next.js 15 (App Router) | File-based routing, SSR where useful for the dashboard, large contributor familiarity. |
| Mobile | React Native + Expo | Single codebase for iOS/Android; Expo Router keeps navigation conventions close to Next.js for contributors moving between apps. |
| Shared code | pnpm workspaces (`@kavira/types`, `@kavira/utils`, `@kavira/ui`) | One definition of core types and logic, consumed identically by api/web/mobile. |
| Monorepo tooling | Turborepo | Caches builds, runs tasks across workspaces in dependency order. |

### 5.2 Module structure (apps/api)

```
apps/api/src/
├── app.module.ts
├── auth/                  → register, login, verify, refresh, logout, guards
├── behaviors/             → Behavior CRUD
├── events/                → event logging, retraction
├── analytics/             → Pattern computation, scheduler, queue processor
├── notifications/         → email service, digest content
└── prisma/                → PrismaService (injectable client)
```

Each top-level directory is a NestJS module with its own controller, service, and DTOs. A contributor can be assigned ownership of a single module without needing context on the others.

### 5.3 Data flow

```
Client (web/mobile)
   │  POST /events
   ▼
EventsController → EventsService → Prisma → PostgreSQL (Event row inserted)
                                                  │
                                  (scheduled or on-demand)
                                                  ▼
                                       AnalyticsService
                                       (window-function query)
                                                  │
                                                  ▼
                                         Pattern (computed, not stored
                                         as separate source of truth —
                                         cached for read performance
                                         but always re-derivable from
                                         Event rows)
                                                  │
                                                  ▼
                                       Insight generation (text)
                                                  │
                                                  ▼
                                  GET /behaviors/:id/insights → Client
```

The system's correctness guarantee: **Events are the only source of truth.** Patterns and Insights must always be re-derivable from the Event log alone. This is what makes the system trustworthy as infrastructure — nothing is computed in a way that can drift from the underlying data.

---

## 6. Data Model (high level)

This is the conceptual shape, not the final Prisma schema (that is a separate, implementation-level artifact written after this PRD is approved).

```
User
 ├── id, email, username, passwordHash, isVerified, timestamps
 └── has many → Behavior, Session

Session  (refresh token / device tracking)
 ├── id, userId, refreshTokenHash, deviceInfo, expiresAt, createdAt
 └── belongs to → User

Behavior
 ├── id, userId, title, description, category, frequency, isArchived, timestamps
 ├── belongs to → User
 └── has many → Event

Event
 ├── id, behaviorId, occurredAt (date), createdAt, metadata (jsonb, optional)
 └── belongs to → Behavior

(Pattern and Insight are NOT separate tables in v1 — they are computed
 via query against Event, optionally cached in a lightweight
 PatternSnapshot table for read performance. This is an implementation
 decision to be finalized in the Prisma schema design, not a v1
 product requirement.)
```

Key modeling decision: `Event` is intentionally generic (`behaviorId` + `occurredAt` + optional `metadata`), not `Habit` + `Completion` with a boolean. This is what allows the system to extend beyond simple daily completions (e.g. logging a duration, a count, or a note) without a schema migration later.

---

## 7. API Surface (high level)

Full endpoint documentation lives in Swagger once implemented. This is the contract shape for planning purposes.

```
Auth
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/verify
  POST   /api/auth/resend-verification
  POST   /api/auth/request-reset
  POST   /api/auth/reset-password
  POST   /api/auth/refresh
  POST   /api/auth/logout
  POST   /api/auth/logout-all

Behaviors
  POST   /api/behaviors
  GET    /api/behaviors
  GET    /api/behaviors/:id
  PATCH  /api/behaviors/:id
  DELETE /api/behaviors/:id

Events
  POST   /api/behaviors/:id/events
  DELETE /api/behaviors/:id/events/:eventId

Analytics
  GET    /api/behaviors/:id/patterns
  GET    /api/behaviors/:id/insights
```

---

## 8. Frontend & Mobile Scope

Both clients are consumers of the same API contract — neither implements business logic that belongs in the backend (streak math, validation rules, etc. all live server-side; clients render what the API returns).

**Web (apps/web)** prioritizes the full dashboard experience — this is where Pattern and Insight data gets the richest visual treatment (charts via Recharts).

**Mobile (apps/mobile)** prioritizes fast event logging — the primary mobile use case is "I just did the thing, let me log it in one tap." Rich analytics viewing on mobile is acceptable to be simpler than web in v1.

Shared validation schemas and TypeScript types live in `@kavira/types` so a DTO defined once is enforced identically on both clients and the API.

---

## 9. Contributor Structure & Governance

**Roles:**
- **Maintainer (Calvin)** — architecture authority, repo-wide merge rights, sets conventions, final say on disputes
- **Senior Reviewer** — repo-wide merge rights, co-reviews all PRs, owns a specific domain (analytics or mobile, TBD)
- **Module Maintainers** — merge rights scoped to their owned module, granted via `CODEOWNERS`; promoted from contributors who've shown consistent, trustworthy work in that domain. Names to be assigned as the team grows.
- **Contributors** — assigned to specific modules/issues, PR-only, no merge rights, not general-purpose

Module-scoped merge rights are enforced through a `.github/CODEOWNERS` file mapping directories (e.g. `/apps/api/src/analytics/`, `/apps/mobile/`) to the people who own them, combined with GitHub's "Require review from Code Owners" branch protection setting. This lets a module maintainer approve and merge PRs within their own domain without blocking on the Maintainer or Senior Reviewer, while still requiring a relevant owner's sign-off for anything outside their scope.

**Branch strategy:**
- `dev` — integration branch; all contributor work merges here first via PR (1 approval, CI passing)
- `staging` — promoted from `dev` via PR only; auto-deploys to the staging environment on merge (1 approval, CI passing)
- `main` — promoted from `staging` via PR only; auto-deploys to production on merge (2 approvals required, CI passing)

Branch protection enforces the promotion path directly: `staging` only accepts PRs originating from `dev`, and `main` only accepts PRs originating from `staging`. This prevents a feature branch from skipping straight to production.

**Process:**
- All work happens via GitHub Issues tied to this PRD's scope. Features not covered by Section 4 require a discussion issue before implementation begins.
- All changes land via PR — no direct pushes to `dev`, `staging`, or `main`.
- CI must pass (lint + test) before merge, at every stage.
- Issues are scoped to single modules where possible so contributors at different levels can work in parallel without collision.

**Suggested first-contribution issues** (once scaffold lands): writing tests for `analytics.service.ts`, documenting endpoints with Swagger decorators, building `@kavira/ui` primitives, implementing the mobile event-logging screen.

---

## 10. Success Metrics for V1

V1 is complete when:

- A user can register, verify, log in, create a Behavior, log Events against it, and retrieve computed Patterns and Insights — end to end, through both the web dashboard and the mobile app, against the same API.
- The background job system successfully runs scheduled Pattern recomputation without manual intervention.
- Swagger documentation at `/api/docs` accurately reflects every implemented endpoint.
- Test coverage exists for the analytics computation logic and the auth flow at minimum.
- At least one contributor outside the core two (Maintainer + Senior Reviewer) has successfully landed a merged PR.
- The repository is in a state where it could be made public without embarrassment — clean structure, working CI, accurate README.

V1 is explicitly not measured by user growth, app store presence, or production scale. It is measured by whether the system works end-to-end and whether the contributor experience around it functions as designed.

---

## 11. Open Questions (to resolve before or during Phase 1 build)

- Final naming for the `PatternSnapshot` caching table (or whether to skip caching entirely for v1 and compute Patterns on every read).
- Whether `frequency` on Behavior is free-text or a constrained enum (daily / weekly / custom weekday set) — affects both schema and the completion-rate calculation.
- Redis hosting choice for background jobs and session storage (self-hosted vs. managed, e.g. Upstash).
- Exact cron schedule for the analytics recomputation job and the digest email job.

These do not block starting Phase 1 (repo scaffolding, tooling, auth module) but must be resolved before the `analytics` module implementation begins.

---

*This document is the source of truth for Kavira's v1 scope. Changes to scope require updating this file via PR, not informal discussion.*
