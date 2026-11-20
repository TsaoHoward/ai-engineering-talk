# 第一、二章整合｜TypeScript SSOT 與敘事證據對應 v0.1

> 2026-11-20；工作包 A（內容／案例對齊），**不是** Slidev 已完成整合的驗收報告。
>
> 技術事實一律以 [唯一可執行案例](../examples/order-api/ts-v1/README.md) 及其 [原始碼](../examples/order-api/ts-v1/src/application.ts)／[Chromium 測試](../examples/order-api/ts-v1/test/browser.test.mjs) 為準。舊 Java/MyBatis 片段已移除，不另維護一份教學程式。
>
> [PR #10](https://github.com/TsaoHoward/ai-engineering-talk/pull/10) 的 Browser SSOT CI（合成案例）已通過，仍為 Draft；本分支由其已驗收提交 `5abaa27f` 衍生。

## 1. 哪些事實有實際執行支持？

| 敘事所需主張 | SSOT 中的來源 | 證據性質／限制 |
| --- | --- | --- |
| 兩條路徑對同一組訂單產生相同查詢結果 | `src/application.ts`：`OrderRepository.search` 與 `OrderService.search → OrderDao` | Chromium 透過 MSW API／DB 雙層攔截；不是真實的外部 API Server 或 SQL 資料庫 |
| HTTP 200、UTC 日期、status、分頁、穩定排序及 totalCount | `src/domain.ts`、`src/mock-db.ts`、`fixtures/orders.json` | `test/browser.test.mjs` 驗證 8 組成功查詢、9 組錯誤輸入與 14 組 SQL 拒絕；輸出 `generated/browser-evidence.json` |
| 回應外殼的差異 | `src/application.ts` 的 `aiResponse` 與 `response` | AI-direct：`{code,message,data:items[],totalCount}`；符合慣例：`{code,message,data:{items,totalCount}}` |
| 「既有 Consumer 不相容」的具體原因 | `src/existing-consumer.ts` 的 `readExistingOrdersConsumer` | 讀取 `data.items` 和 `data.totalCount`；同一 Response 套用後，AI-direct 拒絕、convention 可用。**根欄位多一個 totalCount 本身不足以證明破壞相容性** |
| 不同架構／命名 | `src/application.ts` | AI-direct：Controller 函式 → `OrderRepository` → parameterized SQL；convention：Controller 函式 → `OrderService` → `OrderDao` → Drizzle `sqlite-proxy`；**並無 Java `OrderController` 類別或 `OrderQueryDto`** |
| 真正使用 ORM，但沒有部署資料庫 | `src/schema.ts`、`src/worker.ts`、`src/mock-db.ts` | Drizzle 實際產生 SQL 與參數，由同一個 Browser MSW 的 DB Handler 執行**受限 SQL 語意**；不是 SQLite，也不支持通用 SQL 正確性主張 |

## 2. 第一、二章保留的敘事決策

**第一章（約 4 分鐘）**：交辦 → 功能看起來成功（**Browser MSW 的實測 Mock HTTP 200**，不是 Java 或真後端測試）→ Response 契約與 Consumer → 架構 → Naming → 回頭檢查交辦與既有專案規格落差。沒有證據支持「某個真實 AI 模型產出了此程式」；AI-direct 是人為設計的合成對照。**不提前展開工作契約模型**。

**第二章（約 5 分鐘）**：接住「這些就是工程師每天使用的規格」→ 從 `OrderService` 真正的 `async search(query: OrderQuery): Promise<OrderPage>` 談方法、型別、建構子與 Consumer 契約 → 重用 Controller／Service／DAO／Drizzle 的 System View → 抽出責任／介面／依賴 → Work View（設計 Schema／建立 Table → 實作 API → 前端整合，表示工作交接，不是對應執行時類別，也不是強制線性開發）→ 放大工作契約與封裝。

**敘事與實作分離**：第一章的「新增 `GET /api/orders`」是虛構業務需求；瀏覽器實際攔截端點是 `<site-base>/mock/api/{variant}/orders`。簡報顯示時須把演示路由／Mock 標籤說清楚。第二章 Work View 中的「建立 Table」是一般系統開發活動，這份瀏覽器案例實際只定義 Drizzle Schema 與 Mock DB，不曾建立真實資料表。

## 3. 在 Slidev 引用、避免第二份實作

- **Code**：從 `examples/order-api/ts-v1/src/application.ts` 的真實程式選取區段；可後續加 `#region` 標記或用元件讀取原檔。不要另寫與程式分岔的 Java、TypeScript 範例。
- **API Demo**：Slidev Vue 元件使用合成案例提供的 API URL builder，啟動一次 Browser MSW Worker；確認目前環境的 Pages base URL 與 Worker scope。
- **Evidence**：Browser E2E 的 `generated/browser-evidence.json` 是**CI 產物**、預設 Git ignore，尚未自動注入 Slidev Build。後續需在同一 Commit 的建置流程產生／取得並校驗版本後才引用；不可假設 Artifact 已在 repo 內。
- **圖與敘事**：架構圖、重點揭露、工作模組示意是投影片 View；允許視覺抽象，但其節點、依賴和技術標籤必須可追溯到上述程式或明確標為概念示意。

## 4. 剩餘工作（不阻擋開始低保真整合）

1. 工作包 B：第一章六個分鏡畫面／第二章 Beat 06–09 組成連續 Slidev 原型；調整根目錄 `slides.md` 的舊順序、Java／MyBatis 文字與過早的工作契約。
2. 工作包 B 中確定 Code 的展示區段、API Client 視覺、互動深度和每次 Click 的敘事；不要把大量原始碼塞入主畫面。
3. 工作包 C：Chromium 視覺／語意驗收、真實 GitHub Pages PR Preview 的 Worker Scope、重載與資產路徑；連續約 9 分鐘的講述時間需實際排練。
4. 第三至六章仍有舊技術名詞（如 MyBatis／JDBC），**本次未聲稱全場已對齊**；後續逐章修訂，不把舊文字當成 SSOT。

## 5. 不變的邊界

- 案例、Fixtures、測試與展示素材全部是原創／合成；不取用公司內部資訊。
- 不主張 Repository 或原生 SQL 技術本身有問題；問題是**既有契約與工作交辦是否被發現並遵守**。
- 不把「MSW 模擬執行通過」說成「真資料庫 SQL 正確性」；不把人為合成對照說成真實模型的評測結果。
- 第一、二章分鏡與細綱是編輯規格，**正式 Slidev 尚未依這輪內容修改**。
