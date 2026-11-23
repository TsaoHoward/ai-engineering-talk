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

## Step 4 第二輪｜Slide 8–13

- **狀態**：第二輪人工審查通過
- **保存範圍**：Slide 8–13

## Slide 8｜從交付落差到規格與模組

- **Headline**：從交付落差到規格與模組
- **Body／主要文字**：

  第二章｜工作拆分如同模組設計

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 8](./presentation-plan.md)
- **主要訊息**：從「結果是否可交付」轉向「工程師如何合作」。
- **Transition**：第一章留下的合作前提，其實就是工程師日常使用的規格。

## Slide 9｜規格不只存在於規格書

- **Headline**：規格不只存在於規格書
- **Body／主要文字**：

  ```ts
  export class OrderService {
    constructor(private readonly dao: OrderDao) {}
    async search(query: OrderQuery): Promise<OrderPage> {
      const [items, totalCount] = await Promise.all([
        this.dao.selectPage(query), this.dao.count(query),
      ])
      return { items, totalCount }
    }
  }
  ```

  型別、建構子、既有 Consumer 與測試都是規格線索；簽章只描述局部，完整行為仍需查證。

- **Evidence／來源連結**：[PR #13｜Order API](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) · [`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`domain.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`existing-consumer.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **主要訊息**：合作所需的規格分散在型別、程式、Consumer 與測試中。
- **Transition**：沿著實際呼叫鏈，看這些模組如何分工合作。

## Slide 10｜模組靠責任、介面與依賴合作

- **Headline**：模組靠責任、介面與依賴合作
- **Body／主要文字**：

  **Project-convention 路徑**：`createController → OrderService → OrderDao → Drizzle (sqlite-proxy) → DbTransport`

  - `createController`：解析 Request 並回傳 `ApiResult`。
  - `OrderService`：組合 DAO 的 `selectPage` 與 `count`。
  - `OrderDao`：使用 Drizzle 建立查詢。
  - `DbTransport` 將 SQL／參數交給 Browser MSW DB Handler，再由受限 SQL evaluator 回應（Mock）。

- **Evidence／來源連結**：[`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`README.md`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/README.md) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **證據限制**：這是案例採用的合理分層，不表示模組分層越多越好；Browser MSW 與受限 SQL evaluator 是 Mock，不是真實資料庫。
- **主要訊息**：模組透過清楚的責任、介面與依賴合作，並封裝內部實作。
- **Transition**：如果合作對象從程式模組換成工作單元，會看到什麼？

## Slide 11｜System View 可以切換成 Work View

- **Headline**：System View 可以切換成 Work View
- **Body／主要文字**：

  **System View**

  `createController → OrderService → OrderDao`

  **Work View**

  `建立 Table → 實作 API → 開發前端`

- **Evidence／來源連結**：[第二章 Storyboard](./storyboards/ch02.md) · [v0.9.3 細綱](../outline/outline-v0.9-candidate.md) · [核准的 Slide Sequence](./presentation-plan.md) · [`README.md`（PR #13 revision e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/README.md) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **限制備註**：Work View 是概念性的工作交接示意，不代表固定時間順序；Runtime Class 與工作節點並非一對一對應。PR #13 使用 Browser MSW 與 Mock，沒有實際建立資料庫 Table。Work View 的交接物為 Schema／資料規則及 API 契約，供後續視覺設計參考。
- **主要訊息**：從程式模組的合作視角，切換到完成系統的工作交接視角。
- **Transition**：再放大中間的「實作 API」：這項工作需要哪些約定？

## Slide 12｜一項工作也需要完整工作契約

- **Headline**：一項工作也需要完整工作契約
- **Body／主要文字**：

  | 面向 | 訂單查詢 API 工作 |
  | --- | --- |
  | **Input** | 訂單查詢需求、Schema／相關程式、既有 API 與訊息代碼規範 |
  | **Output** | API 變更、必要測試、交付說明 |
  | **Responsibility** | 完成訂單查詢功能 |
  | **Constraints** | 遵守既有分層、命名、訊息契約與修改邊界 |
  | **Acceptance** | 功能、Consumer 整合契約與測試證據符合要求 |

- **Evidence／來源連結**：[核准的 Slide Sequence](./presentation-plan.md) · [第二章 Storyboard](./storyboards/ch02.md) · [v0.9.3 細綱](../outline/outline-v0.9-candidate.md) · [`domain.ts`（PR #13 revision e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`existing-consumer.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **主要訊息**：工作需要清楚約定輸入、產出、責任、限制與驗收。
- **Transition**：契約列清楚後，是否還要預先決定每個實作步驟？

## Slide 13｜對外清楚，對內保留實作彈性

- **Headline**：對外清楚，對內保留實作彈性
- **Body／主要文字**：

  執行者可自行安排步驟與工具；影響介面或驗收的未知，先查證或協商。

- **Evidence／來源連結**：[第二章 Storyboard](./storyboards/ch02.md) · [核准的 Slide Sequence／Slide 13](./presentation-plan.md)
- **主要訊息**：契約界定交付邊界，同時保留執行者處理內部細節的空間。
- **Transition**：接著看如何把可重用的執行方法封裝成 Skill。

## Step 4 第三輪｜Slide 14–18

- **狀態**：第三輪人工審查通過
- **保存範圍**：Slide 14–18

## Slide 14｜把工作契約交給 AI

- **Headline**：把工作契約交給 AI
- **Body／主要文字**：

  第三章｜從 Prompt 到 Skill：封裝工作

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 14](./presentation-plan.md) · [Slide 12–13 工作契約](./slide-copy.md)
- **主要訊息**：從工作契約切換到 AI 協作介面。
- **Transition**：對照原始 Prompt 與改善後的工作要求。

## Slide 15｜Prompt 可以把隱含契約變成明確資訊

- **Headline**：Prompt 可以把隱含契約變成明確資訊
- **Body／主要文字**：

  **原始交辦**

  `幫我新增一支訂單查詢 API，支援日期、狀態與分頁。`

  **改善後的工作要求**

  1. 先讀取既有程式與專案規範。
  2. 沿用既有 `Controller／Service／DAO／Drizzle` 分層。
  3. `ApiResponse.message` 使用前端可識別的訊息代碼。
  4. 遵守修改邊界，執行測試並回報未確認事項。

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 15](./presentation-plan.md) · [v0.9.3 第三章](../outline/outline-v0.9-candidate.md) · [PR #13｜Order API message-code contract](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) · [`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`domain.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`message-catalog.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/message-catalog.ts) · [`existing-consumer.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **限制備註**：`m0000`、`m0001` 的具體細節留在 Evidence，不放入 Body；本頁是 Prompt 改寫範例，不宣稱曾由真實 AI 模型執行或驗證。
- **主要訊息**：把原本隱含的交付契約變成可以使用與查證的資訊。
- **Transition**：分離每次任務的變動內容與可重用方法。

## Slide 16｜每次任務不同，但執行方法可以重用

- **Headline**：每次任務不同，但執行方法可以重用
- **Body／主要文字**：

  | 每次任務不同 | 可以重用 |
  | --- | --- |
  | 功能需求、輸入、修改範圍與特殊限制 | 專案規範、工作程序、檢查方法與產出格式 |

  用 `Abstraction`、`Encapsulation`、`Reuse` 分離變動與共通部分。

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 16](./presentation-plan.md) · [v0.9.3 第三章](../outline/outline-v0.9-candidate.md)
- **主要訊息**：每次任務提供變動的需求；共通的執行方法透過 Skill 重用。
- **Transition**：具體展示可重用程序的形狀。

## Slide 17｜Skill 封裝一類工作的執行程序

- **Headline**：Skill 封裝一類工作的執行程序
- **Body／主要文字**：

  **Implement Skill｜公開來源**

  1. **開始**：依 Spec 或 Ticket 執行；Ticket 參照不明確時先確認。
  2. **實作**：適用時，在預先約定的 seam 使用 TDD。
  3. **檢查**：定期執行 Typecheck 與個別測試；最後執行完整測試。
  4. **完成**：完成後進行 Code Review，並 commit 到目前分支。

- **Evidence／來源連結**：[Implement Skill（固定 revision `6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394`）](https://github.com/mattpocock/skills/blob/6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394/skills/engineering/implement/SKILL.md) · [Source Commit](https://github.com/mattpocock/skills/commit/6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394) · [MIT License](https://github.com/mattpocock/skills/blob/6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394/LICENSE)
- **說明**：`讀取 → 確認 → 實作 → 測試 → 回報` 是本簡報的概念抽象，不是公開 Implement Skill 的原始程序；該 Skill 沒有承諾「回報證據及限制」。
- **限制備註**：本頁整理公開文件所承諾的工作程序，不代表本簡報已執行該 Skill、完成任何測試，或具備完整交付系統。
- **主要訊息**：公開 Skill 將一類工作的執行程序整理成可重用指引。
- **Transition**：一個 Skill 可以封裝一段工作方法，但仍有清楚的能力邊界。

## Slide 18｜Skill 是有邊界的工作單元，不是完整交付系統

- **Headline**：Skill 是有邊界的工作單元，不是完整交付系統
- **Body／主要文字**：

  Skill 可以封裝一段可重用的工作方法，但不會自動提供需求、設計、驗收或上下游依賴。

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 18](./presentation-plan.md) · [v0.9.3 第三章](../outline/outline-v0.9-candidate.md)
- **主要訊息**：Skill 封裝單一工作方法；完整交付仍需要其他工作與上下游組合。
- **Transition**：從單一工作單元切換到上下游與整體交付。

## Step 4 第四輪｜Slide 19–23

- **狀態**：第四輪人工審查通過
- **保存範圍**：Slide 19–23

## Slide 19｜從單一 Skill 拉遠到整體交付

- **Headline**：從單一 Skill 拉遠到整體交付
- **Body／主要文字**：

  第四章｜從工作介面到 Whole Picture：SDLC

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 19](./presentation-plan.md) · [Slide 18](./slide-copy.md) · [第四章細綱](../outline/outline-v0.9-candidate.md)
- **主要訊息**：視角從單一 Skill 的能力邊界，切換到完整交付中的上下游工作。
- **Transition**：如果 Skill 只完成一段工作，這段工作的需求與設計輸入從哪裡來？

## Slide 20｜上游工作的 Output，常常就是下游工作的 Input

- **Headline**：上游工作的 Output，常常就是下游工作的 Input
- **Body／主要文字**：

  **共同背景：訂單查詢 API**

  **需求分析**
  Output：查詢條件／分頁規則／驗收需求

  ↓ 交接為下游 Input

  **系統設計**
  Output：API 契約／Schema・資料規則／責任分層

  ↓ 交接為下游 Input

  **程式實作**
  Input：需求分析與系統設計的成果

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 20](./presentation-plan.md) · [v0.9.3 第四章](../outline/outline-v0.9-candidate.md) · [第二章 Storyboard](./storyboards/ch02.md) · [`domain.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`schema.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/schema.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **限制備註**：箭頭表示工作依賴，不表示固定的時間順序。Work View 與本頁交接關係是概念示意；PR #13 的程式與測試可提供交接物素材，但不證明實際執行過這套完整 SDLC。
- **主要訊息**：工作之間透過交接物互相依賴；上游產出會成為下游工作的前提。
- **Transition**：如果把這些工作放回完整交付範圍，還有哪些主要活動需要被看見？

## Slide 21｜SDLC 是理解交付活動的地圖

- **Headline**：SDLC 是理解交付活動的地圖
- **Body／主要文字**：

  `需求 → 設計 → 實作 → 測試 → 部署 → 維運`

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 21](./presentation-plan.md) · [v0.9.3 第四章](../outline/outline-v0.9-candidate.md) · [Order API README（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/README.md)
- **限制備註**：SDLC 是理解交付活動與交接的地圖，不主張所有專案都必須依固定線性流程執行。本頁不宣稱 PR #13 已提供真實部署或維運證據；其案例使用 Browser MSW 與受限 SQL evaluator，不是真實 API Server 或資料庫執行證據。
- **主要訊息**：用六個主要活動放大整個軟體交付範圍。
- **Transition**：看見活動全貌之後，下一步不是只記住順序，而是理解它們如何互相依賴。

## Slide 22｜Whole Picture 不只是記順序，而是理解依賴

- **Headline**：Whole Picture 不只是記順序，而是理解依賴
- **Body／主要文字**：

  **同一項契約，跨越不同工作**

  `ApiResponse.message`
  **不是自由文字，而是前端可識別的訊息代碼**

  - **API 設計**：定義 `message` 的語意
  - **API 實作**：查詢錯誤時依既有規則回傳 `m0001`
  - **前端 Consumer**：依預載代碼表顯示「查詢條件不合法」
  - **測試**：驗證 Response 與 Consumer 相容

  `↺ 測試結果可能要求回頭調整設計（概念示意）`

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 22](./presentation-plan.md) · [v0.9.3 第四章](../outline/outline-v0.9-candidate.md) · [PR #13｜Order API message-code contract](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) · [`domain.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts) · [`application.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts) · [`message-catalog.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/message-catalog.ts) · [`existing-consumer.ts`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts) · [`browser.test.mjs`（e8ae8ad3）](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- **限制備註**：PR #13 可驗證 `ApiResponse.message` 的訊息代碼、Consumer 解析與測試相容性；「設計 → 實作 → Consumer → 測試」的跨工作關係與測試回饋箭頭是概念示意，不是 PR #13 實際 SDLC 歷程的證據。案例使用 Browser MSW 與受限 SQL evaluator，不新增真實 API Server、資料庫或部署證據。
- **主要訊息**：同一項契約會跨越設計、實作、Consumer 與測試；理解依賴才能組合工作。
- **Transition**：理解依賴之後，還要決定這些工作要如何安排與組合。

## Slide 23｜從理解依賴到安排工作

- **Headline**：從理解依賴到安排工作
- **Body／主要文字**：

  第五章｜Workflow：組合、調整與取捨

- **Evidence／來源連結**：[核准的 Slide Sequence／Slide 23](./presentation-plan.md) · [第五章細綱](../outline/outline-v0.9-candidate.md)
- **主要訊息**：完成第四章轉場，將焦點交給下一章的工作安排問題。
- **Transition**：同一組工作，可以有不同安排方式。
