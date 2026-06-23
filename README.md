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
- A free [Neon](https://neon.tech) database (create a free project, copy the connection string)
- A free [Upstash](https://upstash.com) Redis instance (create a free database, copy the Redis URL)

### Setup

```bash
# Clone the repo
git clone https://github.com/kavira-oss/kavira.git
cd kavira

# Install all dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

Open `.env` and fill in your values:
- `DATABASE_URL` — your Neon connection string
- `REDIS_URL` — your Upstash Redis URL
- `JWT_SECRET` — any random string, min 32 characters

```bash
# Generate Prisma client
cd apps/api
pnpm prisma:generate

# Apply existing migrations to your database
pnpm prisma migrate deploy

# Start the API
pnpm start:dev
```

API runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/docs`

### Running the full stack

```bash
# From repo root — starts all apps in parallel
cd ../..
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
