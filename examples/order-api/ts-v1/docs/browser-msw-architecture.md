# Browser MSW architecture decision — bounded SQL mock (B)

Status: **Gate A passed in real Chromium on 2026-11-20**, using static Vite preview at a GitHub Pages-like non-root URL. [CI evidence](https://github.com/TsaoHoward/ai-engineering-talk/actions/runs/44715870959). Gates B/C and deployment to actual GitHub Pages remain pending.
This applies to Synthetic Order API v1 and a future GitHub Pages / Slidev integration. It does **not** replace currently verified Node/SQLite evidence until the browser equivalent passes acceptance.

## Goal

Run the **same synthetic application logic** inside a static GitHub Pages-hosted Slidev/Vue app, with no real API server and no DB service. Keep realistic module boundaries; only the external HTTP/DB execution edges are mocked.

- AI-direct: API controller → `OrderRepository` → parameterized raw SQL → database adapter.
- Project-convention: API controller → `OrderService` → `OrderDao` → real Drizzle ORM query builder → Drizzle sqlite-proxy driver.
- Both send `{ sql, params, method }` to the same mock DB adapter; it uses **real SQL query signatures from the calling code**, never a parallel hand-written query per slide.
- One browser MSW setup with **two groups of handlers**: `/mock/api/*` for public API calls; `/mock/db/query` for internal mock DB calls. These are separate routes, **not two Service Workers**.
- API handlers reuse controller / application functions. The DB route is a private test transport, not a public database API.

## B-level DB executor (strict scope)

A deterministic, read-only, in-memory table backed by the single checked-in `orders.json` fixture. Accept only the query family *actually emitted* by Order API v1:

1. `SELECT` selected order columns, with optional exact `status = ?`, optional UTC created-at half-open bounds `>= ?` and `< ?`.
2. Stable `ORDER BY created_at DESC, id DESC`, `LIMIT ? OFFSET ?`.
3. Matching `SELECT COUNT(*)` over identical optional predicates.

Translate recognized SQL **shape + bound parameters** to in-memory filtering, sorting, slicing and count. Do not implement a general SQL parser, DML, joins, arbitrary predicates, or mutable database state. Reject any unrecognized query, columns, parameter count/type, ordering or operator; **never return fallback success rows**. Do not rely on merely checking that a query contains words such as `status` or `limit`.

This is a **bounded interpreter**, not SQLite. It does not prove arbitrary SQL correctness or DB-specific behavior. Tests must verify the generated SQL contract and the bounded executor separately.

## Preserve code fidelity

- Keep real `OrderRepository`, `OrderService`, `OrderDao`, `ordersTable`, Drizzle query generation and shared `ApiResponse` behavior.
- Changing DB calls from sync to `async`/`Promise` is acceptable because a realistic remote driver is asynchronous; rewriting DAO to directly filter an array *is not*.
- A mock transport / DB driver abstraction may be injected at the composition root. Avoid scattering MSW imports, fixture arrays, SQL regex or Slidev-specific conditions into domain, Service or DAO modules.
- Pin the working Drizzle version. The current v1 source pins `drizzle-orm@0.44.7`; do not silently switch to the v1.0 RC proxy API, whose driver interface is different.
- Keep existing Node SQLite code as a comparison/reference only until browser tests pass. Do not maintain two different business-rule implementations long-term.

## Request flow

```text
Slidev/Vue Consumer
  └─ fetch(<site-base>/mock/api/orders?...)
       └─ MSW API Handler → Controller → [Repository | Service → DAO]
                                                  └─ raw SQL | Drizzle ORM
                                                       └─ fetch(<site-base>/mock/db/query)
                                                            └─ MSW DB Handler
                                                                 └─ bounded SQL evaluator
                                                                      └─ deterministic orders fixture
```

The Worker script, registration scope and URL construction must honor the current GitHub Pages base path, including `/ai-engineering-talk/pr-preview/pr-N/`. Unknown mock API/DB routes must fail closed rather than attempt a real network backend. Do not intercept unrelated Slidev/Pages asset requests.

## Acceptance gates — small vertical slice first

**Gate A — browser architecture feasibility:** In a genuine Chromium browser on the built static site (not Node `setupServer`), one `fetch` crosses API MSW → app logic → DB MSW → bounded executor and returns correct order data; Worker controls the page, page reload succeeds, and nested fetch does not hang. Verify subpath/PR preview behavior.

**Gate B — functional equivalence and evidence:** Both variants handle default search, status, inclusive UTC calendar dates (exclusive next-day upper bound), tie-break ordering, page/pageSize limits, filtered totalCount, empty result and invalid input. Generated evidence includes request URL, status, response body, variant, source version and mock/real DB provenance. Add an existing-Consumer contract test that demonstrates what actually breaks against AI-direct; do not assume extra JSON properties alone break clients.

**Gate C — maintainability and limits:** Snapshot/contract tests reject unsupported SQL and unexpected parameter shapes. Changing DAO query generation must not silently pass. No Node native `better-sqlite3` imported into the browser bundle, no SQLite server, no extra framework, and no independently maintained fake Response fixture for API success.

Gate A is verified. Preserve the Node HTTP/SQLite example until Gate B/C, behavioral parity, and shared source consolidation are reviewed. The browser lab has **not** been published to the actual GitHub Pages host. Slidev visual design remains a separate stage.

## Scope/non-goals

No MSW production API service, arbitrary SQL engine, browser SQL WASM, authentication, database writes, dynamic schema migrations, external calls, or generalized mock ORM. No claim that the synthetic AI-direct code was generated by a real model.

This design intentionally preserves the production-like layers while limiting the mock to the final data source. If the SQL interpreter starts growing beyond this query family, **stop and reassess** rather than silently turning the mock into a second application.
