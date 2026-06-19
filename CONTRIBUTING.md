# Contributing to Kavira

## Before you start

- Read the [PRD](./docs/PRD.md) — it defines v1 scope. Features outside it require a discussion issue first.
- Check [open issues](https://github.com/kavira-oss/kavira/issues) for something to pick up.
- Do not start work without a linked issue assigned to you.

---

## Branch naming

All branches off `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b <type>/<short-description>
```

| Type | When |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Tooling, config, deps |
| `docs/` | Documentation only |
| `test/` | Tests only |
| `refactor/` | No behaviour change |

Examples:
```
feat/analytics-streak-calculator
fix/auth-refresh-token-cookie
docs/swagger-behaviors-endpoint
test/event-service-unit
```

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(analytics): add day-of-week consistency breakdown
fix(auth): resolve refresh token cookie domain mismatch
chore(deps): update prisma to 7.1.0
test(events): add unit tests for idempotency check
```

---

## Pull requests

- All PRs target `dev` — never `staging` or `prod` directly
- Link the issue: `Closes #123`
- CI must pass before merge
- Address CodeRabbit comments before requesting human review
- 1 approval required

---

## Local setup

```bash
git clone https://github.com/kavira-oss/kavira.git
cd kavira
pnpm install
cp .env.example .env
pnpm --filter @kavira/api db:generate
pnpm --filter @kavira/api db:migrate
pnpm dev
```

---

## Code style

- TypeScript strict mode — no `any` without justification
- Run `pnpm lint` and `pnpm format` before pushing
- No `console.log` — use NestJS Logger
- DTOs for all controller inputs
- Services own all business logic — controllers stay thin

---

## Questions

Open a [GitHub Discussion](https://github.com/kavira-oss/kavira/discussions) rather than a DM.
