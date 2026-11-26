# 從寫 Code 到設計工作｜Generate Trial Input

**Source outline:** ../experiments/cc-slidev-pilot/outline.md
**Scope:** Original Slides 3–7 only
**Full outline:** 32 slides remains unchanged
**Duration:** Main talk 35–40 minutes; Q&A excluded
**Theme trial:** Seriph, Shiki, line numbers, fade transition
**Source of copy:** ../../docs/slide-copy.md
**Source of plan:** ../../docs/presentation-plan.md
**Case source:** PR #13 head e8ae8ad3d419cf51927d69b598ea4e00ad6cf329

This is a temporary generation input. It preserves the original slide
numbers, slide order, narrative intent, Slide Copy anchors, case SSOT, and
evidence limitations. It must not be treated as a replacement for the full
32-slide outline.

## Slide 3｜能執行，是否就代表能交付？

- Original type: question
- Main message: 可執行與可交付不是同一個判準。
- Body: 只保留簡潔 Question。
- Transition: 把問題放進一個具體的訂單查詢 API 交辦。
- Visual treatment: Native center layout; question-only slide, no decorative visual.

## Slide 4｜交辦一支訂單查詢 API，功能確實能跑

- Original type: code / data
- Body anchors:
  - 交辦：新增訂單查詢 API，支援狀態、UTC 日期區間、分頁與總筆數。
  - 請求：?pageSize=3
  - 回應：HTTP 200 · code: OK · message: m0000
  - 結果：訂單 ID [42, 35, 28] · totalCount: 42
  - AI-direct 與 Project-convention 都回傳這組成功資料。
- Evidence: PR #13 application.ts and browser.test.mjs.
- Limitation: Chromium Browser MSW、受限 SQL evaluator、固定 fixtures；不是真實 API Server 或真實資料庫執行證據。
- Visual treatment: Compact request/result panel plus a native CSS flow diagram.

## Slide 5｜message 不是自由文字，而是既有 UI 契約

- Original type: framework
- Body anchors:
  - 錯誤輸入：?fromDate=2026-01-01，缺少 toDate。
  - HTTP 400 · code: INVALID_QUERY · data: null
  - AI-direct：人類可讀錯誤文字；既有 Consumer 無法解析。
  - Project-convention：m0001；既有 Consumer 解析為「查詢條件不合法」。
- Evidence: application.ts, domain.ts, existing-consumer.ts, message-catalog.ts, browser.test.mjs.
- Limitation: 驗證的是合成案例中的 response 與 Consumer 解析路徑。
- Visual treatment: Side-by-side contract comparison.

## Slide 6｜既有契約也藏在命名與責任分層

- Original type: framework
- Body anchors:
  - AI-direct：Controller → OrderRepository → parameterized SQL
  - Project-convention：Controller → OrderService → OrderDao → Drizzle ORM (sqlite-proxy)
  - 共同案例路徑：DbTransport → Browser MSW POST /mock/db/query → 受限 SQL evaluator → fixtures/orders.json
- Evidence: application.ts, worker.ts, README.md.
- Limitation: 這是案例中的合理分層，不是獨立的技術優劣比較。
- Visual treatment: Two responsibility paths plus shared bounded transport path.

## Slide 7｜交辦寫的是功能，驗收依賴的是既有規格

- Original type: statement
- Body anchors:
  - 交辦：查詢功能、狀態、UTC 日期區間、分頁、總筆數。
  - 既有規格：m0000／m0001、data.items／data.totalCount、Controller → Service → DAO、UTC／排序／分頁測試。
  - 收束：沒有明確交代的，正是我依賴的既有規格。
- Evidence: Reuse Slides 4–6 evidence and PR #13 case sources.
- Limitation: 不新增獨立證據，只回收前頁已展示且可追溯內容。
- Visual treatment: Brief-versus-acceptance comparison with a closing statement.

## Generate trial constraints

- Generate only these five original slide numbers.
- Do not add a cover, agenda, section divider, conclusion, Q&A, or backup slide.
- Preserve original slide numbers in filenames and master comments.
- Keep body text concise while moving detailed source notes and limitations into
  presenter notes.
- Use no external CSS framework, component library, image, or new visual system.
- Preserve the original case and evidence caveats.
