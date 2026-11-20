# Static Browser MSW / Drizzle Proxy lab (Gate A passed)

**Verified:** [GitHub Actions run 44715870959](https://github.com/TsaoHoward/ai-engineering-talk/actions/runs/44715870959): original Node baseline 3/3; genuine Chromium browser Gate A 1/1, 2026-11-20. The browser test uses a Vite static preview at a GitHub Pages-like subpath; **the lab is not yet published to the actual GitHub Pages host**.

**Purpose:** Demonstrate that both synthetic Order API paths can run in a GitHub Pages-compatible static page. This is a separate verification harness, not the official Slidev deck. Its two routes use the *same fixture and actual TypeScript application/DAO logic*, not hardcoded JSON responses.

Architecture:

- Browser Consumer calls MSW \`/mock/api/{ai-direct|project-convention}/orders\`.
- Handler invokes Controller functions, then raw parameterized SQL (AI-direct) or Service → DAO → Drizzle ORM (convention).
- Both execute through the fetch-backed DB transport → MSW \`/mock/db/query\`.
- The bounded executor recognizes only SELECT orders and COUNT with optional status/UTC date constraints and stable sorting/pagination. It never accepts writes or unknown SQL.
- Same MSW worker; two path groups. No actual HTTP server/SQLite DB at runtime. \`vite preview\` serves **static HTML/JS**, not API.
- The existing Node/SQLite example and its tests are intentionally preserved until this browser E2E passes and the architecture is accepted.

Run from \`browser-lab\`:

\`\`\`sh
npm install
npm run build       # generates public/mockServiceWorker.js, typechecks, builds Vite
npm run preview     # serves under /ai-engineering-talk/pr-preview/pr-10/browser-lab/
npm run test:e2e    # starts its own preview + Chromium; do not run at the same time
\`\`\`

Production build must use the same \`VITE_BASE\` value as the deployment path, and the MSW script must be available at \`<base>/mockServiceWorker.js\`. The browser worker only controls the lab path; a future Slidev integration must repeat the base-path validation independently.

This is a **bounded interpreter**, not a full SQL engine. Functional tests of query results do not imply arbitrary SQL correctness. \`better-sqlite3\` is not imported into the browser lab. Runtime uses in-memory fixture rows, a real Drizzle proxy, and MSW.

**Gate A pass criteria:** Chromium page loaded from a non-root base URL; worker controls the page; each route reaches both API and DB handlers; default page/filtered dates/400 and unsupported SQL verified; page reload works; no browser uncaught errors. CI artifacts must be retained for review.

**Temporary source debt:** A matching Drizzle table definition was copied into this isolated browser npm package to resolve dependencies. Consolidate it into a single browser-safe source before the browser demo becomes canonical; do not duplicate query rules or fixtures.

**Not yet done:** complete cross-variant behavioral matrix, automated evidence snapshots with full Request/Status/Response metadata, consumer contract tests across all cases, Slidev components, MSW in official GitHub Pages, and decision on replacing original Node code. No original-model-generated-AI claim.
