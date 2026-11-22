# Synthetic Order API — TypeScript 主案例（SSOT）

## 範圍

這裡只有一份可執行的原創合成 Order API。Java、Node API Server 與 SQLite 版本不再平行維護。

- **AI-direct**：Controller → `OrderRepository` → parameterized SQL。
- **Project-convention**：Controller → `OrderService` → `OrderDao` → Drizzle ORM (sqlite-proxy)。
- 底層共用 `DbTransport` → Browser MSW `POST /mock/db/query` → 受限 SQL evaluator，讀取 `fixtures/orders.json` 的 42 筆固定訂單。
- Browser MSW 攔截 `GET /mock/api/{ai-direct|project-convention}/orders`；查詢支援 status、UTC 日期、分頁與穩定排序。
- **正常情境一致**：HTTP 200、`{ code: 'OK', message: 'm0000', data: { items, totalCount } }`，兩種實作對同一輸入回傳相同資料。
- **錯誤契約衝突**：HTTP 400 的 `code: 'INVALID_QUERY'` 相同；AI-direct 的 `message` 為原始錯誤文字，Project-convention 的 `message` 為 `m0001`。前端預載 `message-catalog.ts` 對照表，既有 Consumer 僅能解碼後者。
- 404 使用 `m0002`，500 使用 `m0003`；`code` 作 API 分類，`message` 為 UI 代碼。

## 原始碼與證據來源

| 資產 | 唯一來源 |
| --- | --- |
| 查詢參數、型別、訊息代碼 ID | `src/domain.ts` |
| 前端預載訊息文字表 | `src/message-catalog.ts` |
| Controller、Repository、Service、DAO | `src/application.ts` |
| 既有成功／錯誤 Consumer | `src/existing-consumer.ts` |
| ORM schema | `src/schema.ts` |
| MSW API／DB transport | `src/worker.ts` |
| 受限 SQL evaluator | `src/mock-db.ts` |
| 訂單資料 | `fixtures/orders.json` |
| 瀏覽器比較、輸出 | `src/main.ts`／`index.html` |
| Chromium E2E 及生成證據 | `test/browser.test.mjs`、`generated/browser-evidence.json` |

`generated/browser-evidence.json` 由測試產出，預設不提交。簡報應引用相同 Source Revision 的程式碼或實測資料，不另寫第二份演示後端。

## 驗證

需要 Node 22+（僅供建置、Vite 與 Playwright；實際 API 在 Browser MSW 模擬）。

```sh
cd examples/order-api/ts-v1
npm ci
npm run verify
npm run dev
```

`verify` 會 build、執行 Chromium E2E 並產生 Source-identified JSON 證據。測試覆蓋正常查詢、錯誤代碼解碼、404 與受限 SQL 拒絕；SQL evaluator 只支援本案例的 SELECT／COUNT 形狀，不對外宣稱真實 DB 相容性。

預設 Vite base：`/ai-engineering-talk/pr-preview/pr-10/order-api/`。Worker script 和 scope 需與建置 base 相同。真正的 GitHub Pages Preview 仍須在正式 Slidev 整合時驗收。

詳見 [全場案例與素材範圍](../../../docs/order-api-case-scope.md)。
