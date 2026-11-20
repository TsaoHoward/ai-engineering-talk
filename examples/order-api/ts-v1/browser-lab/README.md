# Static Browser MSW / Drizzle Proxy lab (Gates A+B passed)

**Verified:** [GitHub Actions Gate B run 44719821501](https://github.com/TsaoHoward/ai-engineering-talk/actions/runs/44719821501): original Node baseline 3/3; genuine Chromium browser Gate B 1/1, 2026-11-20. Includes 8 successful query cases, 9 invalid-input cases, 14 rejected SQL commands, response/consumer parity, and an evidence artifact that records the tested Git commit. The browser test uses a Vite static preview at a GitHub Pages-like subpath; **the lab is not yet published to the actual GitHub Pages host**.

**Purpose:** Demonstrate that both synthetic Order API paths can run in a GitHub Pages-compatible static page. This is a separate verification harness, not the official Slidev deck. Its two routes use the *same fixture and actual TypeScript application/DAO logic*, not hardcoded JSON responses.

Architecture:

- Browser Consumer calls MSW `/mock/api/{ai-direct|project-convention}/orders`.
- Handler invokes Controller functions, then raw parameterized SQL (AI-direct) or Service → DAO → Drizzle ORM (convention).
- Both execute through the fetch-backed DB transport → MSW `/mock/db/query`.
- The bounded executor recognizes only SELECT orders and COUNT with optional status/UTC date constraints and stable sorting/pagination. It never accepts writes or unknown SQL.
- Same MSW worker; two path groups. No actual HTTP server/SQLite DB at runtime. `vite preview` serves **static HTML/JS**, not API.
- The existing Node/SQLite example and its tests are intentionally preserved until this browser E2E passes and the architecture is accepted.

Run from `browser-lab`:

```sh
npm ci
npm run build       # generates public/mockServiceWorker.js, typechecks, builds Vite
npm run preview     # serves under /ai-engineering-talk/pr-preview/pr-10/browser-lab/
npm run test:e2e    # starts its own preview + Chromium; do not run at the same time
```

Production build must use the same `VITE_BASE` value as the deployment path, and the MSW script must be available at `<base>/mockServiceWorker.js`. The browser worker only controls the lab path; a future Slidev integration must repeat the base-path validation independently.

This is a **bounded interpreter**, not a full SQL engine. Functional tests of query results do not imply arbitrary SQL correctness. `better-sqlite3` is not imported into the browser lab. Runtime uses in-memory fixture rows, a real Drizzle proxy, and MSW.

**Gate A pass criteria:** Chromium page loaded from a non-root base URL; worker controls the page; each route reaches both API and DB handlers; default page/filtered dates/400 and unsupported SQL verified; page reload works; no browser uncaught errors. CI artifacts must be retained for review.

**Temporary source debt:** A matching Drizzle table definition was copied into this isolated browser npm package to resolve dependencies. Consolidate it into a single browser-safe source before the browser demo becomes canonical; do not duplicate query rules or fixtures.

**Gate B passed:** The automated Chromium matrix calls both APIs through MSW and exercises defaults, second page, date-only and status/date combinations, empty results, maximum page size, invalid inputs and bounded SQL rejection. The synthetic existing Consumer reads `data.items` from both **actual HTTP Responses**: AI-direct is incompatible and project-convention is compatible. The generated `generated/browser-evidence.json` (ignored in Git, uploaded as CI artifact) captures source commit, runtime provenance, query, per-variant Request URL / HTTP status / JSON body / consumer outcome, and observed SQL with bound parameters. This is **mock DB execution**, not SQLite correctness evidence.

**Remaining for Gate C and integration:** schema is currently duplicated between Node and browser packages, as a temporary dependency-boundary workaround. Decide the smallest durable single source without breaking separate package builds. The lab is not yet hosted on actual GitHub Pages or integrated into official Slidev, and the old Node backend is deliberately retained as a reference. No claim that a real AI model generated the comparator.
