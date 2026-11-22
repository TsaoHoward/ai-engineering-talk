# Order API 案例範圍與素材契約

> 基準：細綱 v0.9.3；全場案例準備檢查（2026-11-22）
>
> 用途：先固定需要的證據，再製作視覺原型；不替代投影片或分鏡。

## 唯一主案例

同一支合成訂單查詢 API，兩條可執行路徑共用訂單 Fixture、DbTransport 與 Browser MSW 的受限 SQL 模擬環境。

- AI-direct：`createController → OrderRepository → parameterized SQL → DbTransport`
- Project-convention：`createController → OrderService → OrderDao → Drizzle → DbTransport`
- 正常查詢：狀態、UTC 日期區間、分頁、總筆數、排序與驗證行為一致；兩邊都使用 `{ code, message, data: { items, totalCount } }`。
- **唯一核心衝突**：在同一個 HTTP 400 查詢參數錯誤情境，`code` 是 API 分類（`INVALID_QUERY`）；既有專案要求 `message` 存前端訊息代碼 `m0001`，AI-direct 卻填入可讀的原始錯誤訊息。
- 前端已預載代碼表，例如 `m0001 → 查詢條件不合法`。Project-convention 可查表；AI-direct 無相符代碼，呈現預期可測的「不相容」狀態，不假設整個前端崩潰。
- Success 的 `message` 統一為 `m0000`；404 與 500 也遵守代碼約定，避免案例其他錯誤路徑留下相同問題。
- 兩條實作的模組設計是補充證據，不另外製造查詢功能或 Response 形狀的差異。
- 本案例是原創／合成程式，不對應任何特定 AI 模型的實測輸出。Browser MSW 的 SQL evaluator 不是實際資料庫。

## 18 個內容單元的素材對應

| 內容單元 | 需要的案例證據／素材 | 是否需改主案例 |
| --- | --- | --- |
| 01 交辦與正常查詢 | 需求 Prompt、兩種實作一致的 Browser MSW HTTP 200 與訂單結果 | 是：統一成功 Response |
| 02 交付契約 | 固定 HTTP 400、`message` 的文字／代碼比較、前端查表結果 | 是：錯誤契約與 Consumer |
| 03 隱含背景 | 最初交辦與訊息代碼、架構、Naming 等既有規格對照 | 否 |
| 04 模組規格 | `OrderService.search`、`OrderQuery`、`OrderPage`、Consumer 等來源 | 否，沿用 |
| 05 工作契約 | Schema／API 契約、工作 Input／Output／Acceptance | 否，概念抽象 |
| 06 改善 Prompt | 要求使用 `message` 代碼與現有分層／測試的工作指示 | 否，文件素材 |
| 07 區分變動與共通 | 任務需求 vs 穩定規範與程序 | 否 |
| 08 封裝 Skill | 一份實際 Skill 的簡短工作程序 | 否，另選素材 |
| 09 Skill 的上下游 | 08 的 Skill 節點與交接物 | 否 |
| 10 需求與設計的 Input | 訂單需求、Schema、API／訊息代碼契約 | 否 |
| 11 SDLC 全貌 | 六個活動的工作地圖 | 否 |
| 12 跨階段依賴 | `message` 規格關係到 API 設計、開發、前端、測試 | 否，沿用 02 |
| 13 工作安排 | 同一 API 的查詢增量／TDD 示意 | 否 |
| 14 Skills 到 Workflow | Spec → Implement → Verify 等具體交接產物 | 否，另選素材 |
| 15 拆分取捨 | 一個 Method／過度拆分／合宜分工的概念對照 | 否 |
| 16 視角擴展 | 前文圖形與節點的回收 | 否 |
| 17 認知門檻 | 回用 02 的隱含訊息契約衝突 | 否 |
| 18 AI 協助學習 | Vue 部署故事 | 否，另核實敘事 |

## 程式／證據驗收

1. 既有八組正常查詢：兩邊 HTTP 200、完整 Response 形狀、相同 items／totalCount，既有 Consumer 均可讀取。
2. 既有九組錯誤輸入：兩邊 HTTP 400、相同 `code`；AI-direct `message` 是實際參數錯誤文字，Project-convention 為 `m0001`。
3. 既有前端 Consumer 對每個錯誤回應實際查表：Project-convention 解出中文訊息，AI-direct 回報未知代碼；兩者在錯誤前均無 DB SQL 呼叫。
4. 既有受限 SQL 的 14 組拒絕案例、Worker reload、DB trace 保留。
5. 對其他 API 錯誤分支（404／500）保留相同訊息代碼契約。
6. 展示頁面與測試從同一個來源執行；不再保留舊分頁 Response 差異的展示或測試主張。
7. 分鏡只引用確實存在的結果；若展示值以測試證據為準，需註明 source revision。

## 案例驗收證據（2026-11-22）

- Draft PR：[#13](https://github.com/TsaoHoward/ai-engineering-talk/pull/13)，base 為 `integration/ch01-ch02-ts-ssot`。
- Browser SSOT CI：[Run 45010340268](https://github.com/TsaoHoward/ai-engineering-talk/actions/runs/45010340268)，tested source revision `57d41e0e3c49cd4e20f45cef5d599460441f9ca7`。
- Node 22、TypeScript typecheck、Vite build、Chromium E2E 通過；測試輸出 8 組正常、9 組無效輸入、14 組 SQL 拒絕；無失敗。
- 另在 E2E 內檢查兩種正常回應與既有成功 Consumer 均一致、9 種錯誤的前端訊息查表差異、HTTP 404 代碼以及 Worker reload。
- 驗收範圍限 Browser MSW 合成 API；正式 Slidev 連續視覺、完整 GitHub Pages Preview、投影與講述仍待另一個工作包驗收。

## 凍結與後續設計界線

- 本輪僅調整 `examples/order-api/ts-v1/`、必要的展示 Consumer、來源文件與檢查；不擴充新查詢功能、不重構 MSW、不製作正式投影片。
- 案例可供全場 18 個內容單元使用；第三章 Skill、第五章 Workflow、最後的 Vue 部署故事各有素材來源，不要求主案例提供額外執行功能。
- 達成程式／測試驗收後，主案例按本規格進入穩定素材狀態。視覺設計優先調整畫面與揭露順序；只有真正違反契約或證據不足才重新修改案例。
