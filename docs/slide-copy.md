# Presentation Creator Step 4｜Slide Copy

## Step 4 狀態

- **狀態**：第一輪人工審查通過
- **保存範圍**：Slide 1–7

## Slide 1｜從寫 Code 到設計工作

- **Headline**：從寫 Code 到設計工作
- **Body／主要文字**：

  當 AI 能完成程式，工程師還需要設計什麼？

- **Evidence／來源連結**：[核准的 Step 1–3 基準](./presentation-plan.md)
- **主要訊息**：工程師要設計的不只是程式，也包括工作。
- **Transition**：接著用同一個訂單查詢 API，從功能、契約與模組放大到工作設計。

## Slide 2｜今天要放大哪些視角？

- **Headline**：今天要放大哪些視角？
- **Body／主要文字**：

  - `System View`：功能 → 模組 → 既有契約
  - `Work View`：工作契約 → Skill → Workflow
  - `Whole Picture`：用 SDLC 看上下游依賴與交付

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 2](./presentation-plan.md#slide-2今天要放大哪些视角)
- **主要訊息**：從程式結果逐步放大到設計工作的視角。
- **Transition**：先問一個貫穿全場的問題：能執行，是否就代表能交付？

## Slide 3｜能執行，是否就代表能交付？

- **Headline**：能執行，是否就代表能交付？
- **Body／主要文字**：—（只保留簡潔 Question）
- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 3](./presentation-plan.md#slide-3能執行是否就代表能交付)
- **主要訊息**：可執行與可交付不是同一個判準。
- **Transition**：把問題放進一個具體的訂單查詢 API 交辦。

## Slide 4｜交辦一支訂單查詢 API，功能確實能跑

- **Headline**：交辦一支訂單查詢 API，功能確實能跑
- **Body／主要文字**：

  交辦：新增訂單查詢 API，支援狀態、UTC 日期區間、分頁與總筆數。

  請求：`?pageSize=3`

  回應：`HTTP 200` · `code: "OK"` · `message: "m0000"`

  結果：訂單 ID `[42, 35, 28]` · `totalCount: 42`

  同一個查詢在 AI-direct 與 Project-convention 都回傳這組成功資料。

- **Evidence／來源連結**：[PR #13｜Order API message-code contract](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) · [`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **證據限制**：這是 Chromium 中由 Browser MSW 執行的合成案例，底層是受限 SQL evaluator 與固定 fixtures；不是真實 API Server，也不是真實資料庫執行證據。
- **主要訊息**：功能路徑可以成功，不代表交付條件都已被驗證。
- **Transition**：從正常結果轉向錯誤回應與既有 Consumer 的整合契約。

## Slide 5｜`message` 不是自由文字，而是既有 UI 契約

- **Headline**：`message` 不是自由文字，而是既有 UI 契約
- **Body／主要文字**：

  錯誤輸入：`?fromDate=2026-01-01`（缺少 `toDate`）

  `HTTP 400` · `code: "INVALID_QUERY"` · `data: null`

  | 路徑 | `message` | 既有 Consumer |
  | --- | --- | --- |
  | AI-direct | `"fromDate and toDate must be supplied together"` | 無法解析：`Unknown message code` |
  | Project-convention | `"m0001"` | 解析成功：`查詢條件不合法` |

- **Evidence／來源連結**：[`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`domain.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`existing-consumer.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts) · [`message-catalog.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/message-catalog.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **證據限制**：這是 Browser MSW 的 Chromium 合成案例；它驗證案例中的回應與 Consumer 解析路徑，不是外部 API Server 或真實資料庫的執行證據。
- **主要訊息**：`message` 的欄位語意要符合既有 Consumer，而不是只填入人類可讀的文字。
- **Transition**：從對外 Response 的契約，擴展到內部架構與命名的責任分層。

## Slide 6｜既有契約也藏在命名與責任分層

- **Headline**：既有契約也藏在命名與責任分層
- **Body／主要文字**：

  | AI-direct | Project-convention |
  | --- | --- |
  | `Controller → OrderRepository → parameterized SQL` | `Controller → OrderService → OrderDao → Drizzle ORM (sqlite-proxy)` |

  共同案例執行路徑：`DbTransport → Browser MSW POST /mock/db/query → 受限 SQL evaluator → fixtures/orders.json`

- **Evidence／來源連結**：[`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`worker.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/worker.ts) · [`README.md`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/README.md)
- **主要訊息**：交付相容性也包含專案既有的命名、責任與依賴分層。
- **Transition**：當我們用這些既有約定驗收，才看見交辦與規格之間的落差。

## Slide 7｜交辦寫的是功能，驗收依賴的是既有規格

- **Headline**：交辦寫的是功能，驗收依賴的是既有規格
- **Body／主要文字**：

  **交辦**：查詢功能、狀態、UTC 日期區間、分頁、總筆數。

  **既有規格**：成功訊息 `m0000`、錯誤訊息代碼 `m0001`；Consumer 讀取 `data.items`／`data.totalCount`；Project-convention 沿用 `Controller → Service → DAO`；測試驗收 UTC、排序與分頁。

  **收束**：沒有明確交代的，正是我依賴的既有規格。

- **Evidence／來源連結**：回收 [PR #13 的 Order API 案例來源](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) 與 Slide 4–6 已展示的 [`application.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts)、[`existing-consumer.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts)、[`browser.test.mjs`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)。
- **主要訊息**：可交付的判斷依賴可追溯的既有規格，不只依賴功能描述。
- **Transition**：接下來把這些既有約定命名為工程師日常使用的規格，回到模組合作。
