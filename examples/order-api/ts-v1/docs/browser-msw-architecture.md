# Synthetic Order API — Browser MSW architecture and limits

**Decision: one runnable, browser-compatible TypeScript Order API in `examples/order-api/ts-v1/`.** The former Node HTTP Server, `better-sqlite3` implementation and separate browser-lab package have been retired. Use Git history for old versions; do not maintain parallel application code. Node.js still runs build and browser test tooling.

## Real application code, mocked network and DB execution edges

```text
Slidev / static Vite Consumer
  -> fetch(<site-base>/mock/api/{variant}/orders?...)
     -> browser MSW API handler -> real Controller
        -> AI-direct: OrderRepository -> parameterized SQL
        -> Project-convention: OrderService -> OrderDao -> Drizzle ORM sqlite-proxy
           -> fetch(<site-base>/mock/db/query) with SQL + params + row mode
              -> browser MSW DB handler -> bounded SQL evaluator -> one orders.json fixture
```

Only **one** MSW Service Worker is registered with two handler groups. The application contains real query generation, validation, DAO and response assembly. No independent static-success response copies are used. MSW modules belong at the transport edge, never in the domain or DAO.

The DB evaluator is intentionally a **read-only bounded interpreter**, not a SQL database. It recognizes only the application's emitted SELECT and COUNT shapes with optional exact status, inclusive UTC calendar date filters implemented as a half-open interval, stable ordering `created_at DESC, id DESC`, LIMIT and OFFSET. Every other SQL shape, unsupported bind or write must reject with HTTP 422. It should not silently grow into a general SQL parser.

The established synthetic Consumer expects `{ code, message, data: { items, totalCount } }`. AI-direct deliberately returns `{ code, message, data: items[], totalCount }`; both deliver the same filtered order data but only the project-convention version satisfies the prior Consumer contract. Extra root JSON fields alone are **not** treated as proof of incompatibility.

## SSOT and evidence

- `src/domain.ts`: request parsing, UTC rules, domain types.
- `src/schema.ts`: the **only** Drizzle table definition.
- `src/application.ts`: both variant implementations, once.
- `src/existing-consumer.ts`: synthetic consumer contract.
- `src/mock-db.ts`: bounded mock SQL evaluator (not a second application).
- `src/worker.ts`: API / DB MSW handlers.
- `fixtures/orders.json`: single fixed set of 42 synthetic orders.
- `test/browser.test.mjs`: real Chromium with Page-reload and Worker-scope verification; generates `generated/browser-evidence.json` as CI artifact.

Evidence captures source Commit, path, Request URL, HTTP Status, Response Body, Consumer outcome and SQL/parameters, clearly labeling the DB runtime as a bounded Mock instead of real SQLite. Do **not** compare this evidence to a removed Node runtime.

## Verification and deployment gates

**Gate A (browser feasibility):** genuine Chromium, non-root Pages-like base URL, MSW worker controls page, both API and DB handlers execute, queries succeed after reload.

**Gate B (functional & contract):** both variants correctly handle default/filtered/paged/empty/invalid queries, stable UTC/date/order/count semantics, existing Consumer contract, unsupported SQL fail-closed, artifact metadata.

**Gate C (canonical source):** one executable application package, one schema, one fixture, one DAO per variant and one browser CI; Node service code removed instead of maintained as a second backend.

**Still required:** verify this consolidated package with CI and test an **actual** hosted GitHub Pages PR Preview, including its Service Worker scope. The current Vite static-subpath test is not equivalent to deploying on github.io. Later have Slidev import application code and evidence from the canonical directory; do not copy logic or hand-write duplicate Responses into slides.

The two variants are intentionally constructed for the talk; do not claim they were produced by a real AI run.
