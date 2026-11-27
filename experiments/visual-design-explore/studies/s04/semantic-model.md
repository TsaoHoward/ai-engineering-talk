# S04｜message 契約語意模型

## 範圍與核心命題

本文件只拆解 Snapshot 04 的資訊關係，不決定視覺形式、構圖或揭露順序。敘事範圍對應 [Design Storyboard 的 S04](../../develop/design-storyboard.md#snapshot-04把鏡頭停在-message) 與 [Slide 5](../../../../docs/slide-copy.md#slide-5message-不是自由文字而是既有-ui-契約)。

觀眾已知兩種實作都能完成正常訂單查詢。本次比較同一個錯誤輸入下的兩個 response：HTTP 狀態與錯誤分類相同，但 `message` 的語意是否符合既有 Consumer，導致不同的解析結果。

## 1. Objects

### 必要物件

| 物件 | 身分／用途 | 來源 |
| --- | --- | --- |
| `Invalid query request` | `?fromDate=2026-01-01`，缺少 `toDate` 的同一個錯誤輸入 | `domain.ts` [D:62–70]；`browser.test.mjs` [T:34–44] |
| `AI-direct response` | AI-direct 路徑對此輸入產生的錯誤 response | `application.ts` [A:94–120]；`browser.test.mjs` [T:111–127] |
| `Project-convention response` | Project-convention 路徑對此輸入產生的錯誤 response | `application.ts` [A:94–120]；`browser.test.mjs` [T:111–127] |
| `message` 欄位 | 兩個 response 中唯一需要比較語意的欄位 | `domain.ts` [D:21–25]；`application.ts` [A:94–96] |
| `Existing error Consumer` | 讀取 error envelope，將 `message` 當作訊息代碼解析 | `existing-consumer.ts` [C:38–47] |
| `Message catalog` | Consumer 使用的既有代碼到顯示文字對照表 | `message-catalog.ts` [M:3–13] |
| `Consumer outcome` | 解析成功並得到顯示文字，或因未知代碼而不相容 | `existing-consumer.ts` [C:38–47]；`browser.test.mjs` [T:123–127] |

### 可省略背景物件

`DbTransport`、Browser MSW、bounded SQL evaluator、固定 fixtures、正常查詢的訂單資料，以及兩條內部責任路徑，不是本次 message 語意比較的必要物件。它們可作為案例證據邊界，但不應改變本模型的核心對照。（`README.md` [R]；`browser-msw-architecture.md` [B]）

## 2. Attributes

### 必要屬性

| 物件 | 屬性 | 值／語意 | 來源 |
| --- | --- | --- | --- |
| 錯誤輸入 | query | `?fromDate=2026-01-01`；`toDate` 缺失 | `domain.ts` [D:62–66]；`browser.test.mjs` [T:38–44] |
| 兩個 response | HTTP status | `400` | `application.ts` [A:117–120]；`browser.test.mjs` [T:111–114] |
| 兩個 response | `code` | `INVALID_QUERY` | `application.ts` [A:118–120]；`browser.test.mjs` [T:113–116] |
| 兩個 response | `data` | `null` | `application.ts` [A:94–96]；`browser.test.mjs` [T:117–118] |
| AI-direct response | `message` | raw text：`fromDate and toDate must be supplied together` | `domain.ts` [D:64–66]；`application.ts` [A:94–96, 118–120]；`browser.test.mjs` [T:119–120] |
| Project-convention response | `message` | code：`m0001` | `domain.ts` [D:27–33]；`application.ts` [A:94–96, 118–120]；`browser.test.mjs` [T:120–121] |
| Existing error Consumer | lookup rule | 以 `message` 查 `MESSAGE_CATALOG`；查不到即丟出 `Unknown message code` | `existing-consumer.ts` [C:38–47] |
| Message catalog | `m0001` entry | `查詢條件不合法` | `message-catalog.ts` [M:4–8] |
| Consumer outcome | AI-direct | incompatible；`consumed: null` | `browser.test.mjs` [T:123–124] |
| Consumer outcome | Project-convention | compatible；`displayMessage: 查詢條件不合法` | `browser.test.mjs` [T:125–126] |

### 可省略屬性

正常查詢的 `HTTP 200`、`m0000`、訂單 ID、`totalCount`，以及成功 response 的 `data.items` shape，已由前一個 Snapshot 建立；它們不是本次錯誤 response 差異的必要屬性。兩條實作的 repository/service/DAO 名稱也屬於後續 S05 的背景，不納入 S04 主比較。

## 3. Relations

### 必要關係

1. `Invalid query request` → **被兩種實作共同接收** → `AI-direct response`、`Project-convention response`。輸入是同一個缺少 `toDate` 的 invalid query；不是兩個不同錯誤案例。（`domain.ts` [D:62–70]；`browser.test.mjs` [T:111–114]）
2. 每個 response → **包含相同 error envelope 分類** → `HTTP 400`、`code: INVALID_QUERY`、`data: null`。（`application.ts` [A:94–96, 118–120]；`browser.test.mjs` [T:111–118]）
3. 每個 response → **提供** → `message`；兩條路徑提供不同型態的值：raw detail 或 message code。（`application.ts` [A:94–96]）
4. `Existing error Consumer` → **將 `message` 視為 catalog key** → `Message catalog`。Consumer 不把 `message` 當作任意可直接顯示的文字。（`existing-consumer.ts` [C:38–47]）
5. `AI-direct response.message` → **查表失敗** → `Consumer outcome: incompatible / Unknown message code`。（`existing-consumer.ts` [C:43–47]；`browser.test.mjs` [T:119–124]）
6. `Project-convention response.message = m0001` → **查表成功** → `Consumer outcome: compatible / 查詢條件不合法`。（`message-catalog.ts` [M:4–13]；`browser.test.mjs` [T:121–126]）

### 關係的語意方向

`code: INVALID_QUERY` 表示 API 錯誤分類；`message` 則是被既有 UI Consumer 解析的訊息識別值。兩者不是同一個欄位的兩種寫法，也不是 `code` 自動轉換成顯示文字。（`domain.ts` [D:21–33]；`existing-consumer.ts` [C:38–47]）

## 4. Invariants

在同一輸入、同一指定 revision 的比較中，以下資訊保持相同：

- query：`?fromDate=2026-01-01`，缺少 `toDate`。
- 錯誤狀態：HTTP `400`。
- API 錯誤分類：`code: INVALID_QUERY`。
- payload 空值：`data: null`。
- 兩條路徑都被同一個既有 error Consumer 評估。
- 差異不是「一條路徑成功、另一條失敗」；兩條路徑都完成 API 層的 invalid-query 回應。差異出現在 response 被既有 Consumer 接收後的語意解析。（`application.ts` [A:98–120]；`existing-consumer.ts` [C:38–47]；`browser.test.mjs` [T:111–127]）

## 5. Differences

| 比較面 | AI-direct | Project-convention | 意義 |
| --- | --- | --- | --- |
| `message` 的值 | raw error detail：`fromDate and toDate must be supplied together` | catalog key：`m0001` | 欄位值的語意契約不同 |
| Consumer 操作 | 以 raw text 查 catalog，找不到 key | 以 `m0001` 查 catalog，找到 entry | 同一 Consumer 對兩值採取不同解析結果 |
| Consumer 結果 | `incompatible: Unknown message code: ...`；`consumed: null` | `compatible: message code resolved`；顯示 `查詢條件不合法` | message 的差異轉化為既有 Consumer 相容性差異 |

核心差異是：**raw text 描述錯誤，但不是既有 catalog 可識別的訊息代碼；`m0001` 是既有 catalog 可解析的訊息代碼。**（`existing-consumer.ts` [C:43–47]；`message-catalog.ts` [M:4–13]；`browser.test.mjs` [T:119–126]）

## 6. Semantic Constraints

後續資訊構造不得暗示以下關係：

- 不得暗示兩個 response 的 HTTP status、`code` 或 `data` 不同；本次只比較 `message` 語意與 Consumer 結果。
- 不得暗示 raw text 與 `m0001` 是同義值的兩種呈現；前者是未命中的查詢字串，後者是 catalog key。
- 不得暗示 `message` 由 `code: INVALID_QUERY` 自動推導；兩者由 response 分別攜帶，Consumer 只對 `message` 做 catalog lookup。
- 不得暗示 catalog 把任意 raw text 翻譯成顯示文字；它只解析已存在的代碼 entry。
- 不得暗示 AI-direct 的錯誤分類不正確，或 Project-convention 沒有錯誤；兩者同樣回報 invalid query，只有既有 Consumer 的相容性不同。
- 不得把「使用 message code」提升成所有 API 的通用規則；這是本案例既有 Consumer 的契約限制。
- 不得以本差異推導兩種內部架構或實作路徑的普遍優劣；S04 的判準是既有 Consumer 是否能解析，不是架構排名。
- 不得把本案例的 Browser MSW、bounded SQL 或固定 fixtures 說成真實外部 API／資料庫執行證據；這些是可省略的案例邊界背景。（`README.md` [R]；`browser-msw-architecture.md` [B]）

## Source index

所有技術事實均指向指定 revision `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329`：

- [A] [`src/application.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/application.ts)
- [D] [`src/domain.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/domain.ts)
- [C] [`src/existing-consumer.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/existing-consumer.ts)
- [M] [`src/message-catalog.ts`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/src/message-catalog.ts)
- [T] [`test/browser.test.mjs`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/test/browser.test.mjs)
- [R] [`README.md`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/README.md)
- [B] [`docs/browser-msw-architecture.md`](https://github.com/TsaoHoward/ai-engineering-talk/blob/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329/examples/order-api/ts-v1/docs/browser-msw-architecture.md)
