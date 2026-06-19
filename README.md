# Kavira

> Open-source behavioral tracking and analytics infrastructure.

Kavira captures time-based user events, computes behavioral patterns from those events, and surfaces the resulting insight through a clean REST API — consumed by a web dashboard and a mobile app.

Kavira is **not** a habit-tracking app. It is a behavioral data system: the infrastructure underneath matters more than the interface on top.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma 7 |
| Background jobs | @nestjs/bull + Redis |
| API docs | Swagger (@nestjs/swagger) |
| Frontend | Next.js 15 (App Router) |
| Mobile | React Native + Expo |
| Monorepo | pnpm workspaces + Turborepo |

---

## Project Structure

```
kavira/
├── apps/
│   ├── api/        ← NestJS REST API
│   ├── web/        ← Next.js web dashboard
│   └── mobile/     ← React Native + Expo mobile app
├── packages/
│   ├── types/      ← shared TypeScript interfaces
│   ├── utils/      ← shared utility functions
│   └── ui/         ← shared component library
└── docs/
    └── PRD.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 11
- PostgreSQL 16
- Redis

### Setup

```bash
git clone https://github.com/kavira-oss/kavira.git
cd kavira
pnpm install
cp .env.example .env
# Fill in your .env values
pnpm --filter @kavira/api db:generate
pnpm --filter @kavira/api db:migrate
pnpm dev
```

---

## API Documentation

Once running, visit `http://localhost:3000/api/docs` for the Swagger UI.

---

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## License

[Apache 2.0](./LICENSE)
