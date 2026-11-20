# Synthetic Order API v1 — executable TypeScript experiment

**Scope:** original/synthetic code and fixtures only. This is an isolated example, not a production API or a Slidev dependency. The existing `examples/order-api/*.md` Java illustration remains unchanged for comparison. No external services, credentials, Docker, or running database server are required.

## One requirement, two deliberately different implementations

- **`ai-direct`**: `Controller / HTTP route → OrderRepository → raw parameterized SQLite` and an `ApiResponse` expanded with a root `totalCount` field. Other endpoints show `totalCount: null` to make the shared-envelope impact visible.
- **`project-convention`**: `Controller / HTTP route → OrderService → OrderDao → Drizzle ORM → SQLite`, preserving the existing `{ code, message, data }` response envelope and placing `{ items, totalCount }` under `data`.

Both use the same SQLite fixture, validation, UTC date interpretation, pagination, stable ordering, and REST interface. **Both should pass functional tests**. The expected contract difference is intentional and documented, not an incidental test failure. Raw SQL/Repository is not intrinsically wrong; the contrast is about *following an established project's agreement*.

TypeScript does not implement Java's MyBatis. Drizzle fulfills the analogous responsibility behind the DAO boundary; the original Java package/class names are not mechanically copied.

## Commands (Node.js 22, npm)

From this directory, independently of root Slidev:

```bash
npm install
npm run verify       # typecheck, real HTTP tests, generate evidence
npm run dev:ai       # http://127.0.0.1:3101/api/orders
npm run dev:convention # http://127.0.0.1:3102/api/orders
```

The two `dev:*` commands run in separate terminals. Example request:

```bash
curl 'http://127.0.0.1:3101/api/orders?status=PAID&fromDate=2026-01-01&toDate=2026-01-01&page=0&pageSize=20'
```

The checked-in `fixtures/orders.json` contains 42 deterministic rows. `npm run evidence` makes **actual HTTP requests** to both implementations and exports JSON under ignored `generated/` for downstream Slidev visual work. That generated evidence is not a Java runtime test.

## Behavior contract

- `GET /api/orders`, optional exact-match `status`.
- UTC calendar dates `fromDate` and `toDate` must be both present or both absent, inclusive at the date level; implementation uses `[fromDate 00:00 UTC, toDate + 1 day 00:00 UTC)`.
- `page` is zero-based, default `0`. `pageSize` default `20`, permitted `1..100`. Bad parameters return HTTP 400. Large unsafe offsets are rejected.
- Stable ordering `created_at DESC, id DESC`. `totalCount` counts rows after filters but before paging. Seeded timestamps are UTC ISO text.
- `GET /api/status` is a deliberately simple second endpoint to show the shared wrapper's compatibility effect.

## Non-goals and future integration

- No real external database, migrations, authentication, full framework, or claim that the AI actually generated these files.
- `ai-direct` is a **constructed comparator**, not an evaluation of an AI model run.
- No MSW yet. Slidev may later import the generated evidence or exercise a suitable reusable query core, but runtime evidence generation is independent of the presentation.
- Do not replace `outline/outline-v0.9-candidate.md` and storyboards' Java-specific names before reviewing their narrative equivalence with this tested TypeScript case.
