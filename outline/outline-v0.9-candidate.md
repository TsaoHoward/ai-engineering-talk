# 從寫 Code 到設計工作

> 用模組化思維理解 AI 協作、軟體工程與工程師成長

- 版本：v0.9.2 候選（2026-11-22；延續 v0.9.1，修正第三至六章與 TypeScript SSOT 不一致的技術敘述）
- 狀態：六章內容保留既有敘事，第一、二章已完成案例對齊；第三至六章已修正已識別的 TypeScript 技術不一致，具體 Skill／Workflow／部署故事素材仍待確認；正式 Slidev 與真實 GitHub Pages 尚待整合驗收
- 對象：新進軟體工程師
- 暫定時間：35–40 分鐘
- 貫穿案例：新增訂單查詢 API，支援訂單狀態、日期區間與分頁查詢
- 內容結構：六章、18 個原始內容單元（不是正式投影片數量；分鏡 Beat、Click、實際張數各自獨立）

## 核心主張

AI 能執行許多超出個人知識與經驗範圍的工作，但產出結果不代表成果能可靠交付。有效委派與交付仍需理解責任、介面、限制、依賴及驗收方式。這些不是為 AI 特別發明的要求，而是軟體工程原本就需要的知識。傳統新人逐步從局部工作學習這些能力；AI 可能讓新人更早嘗試超出其原本職責的工作，使原本可逐漸累積的工程知識提前成為門檻。AI 同時也能反過來輔助探索與學習。

**貫穿設計原則：一個需求、兩種視角、同一套模組化思維。**

- **System View**：最後交付的系統，如何拆成有責任、介面、依賴的模組。
- **Work View**：完成系統的工作，如何拆成可委派、組合、驗收的工作單元。
- 兩者是思考原則的類比，不是一對一的技術映射。
- 每次切換概念，盡量重用同一案例、圖形與節點，透過放大、縮小、替換連線來敘事。

---

## 第一章｜問題從哪裡開始？（約 4 分鐘）

### 01｜交辦一支 API，功能看起來可用

以**原創合成**情境引入：新增 `GET /api/orders`，支援狀態、UTC 日期區間、分頁與總筆數。先展示簡短交辦 Prompt，再呈現有明確 Mock 標籤的 API Client HTTP 200 和查詢結果。

**執行證據的界線**：現在有一份[可在瀏覽器執行的 TypeScript 合成案例](../examples/order-api/ts-v1/README.md)；其 Chromium 測試確實使用 MSW API Handler → 真正的 Controller／Repository 或 Service／DAO／Drizzle → MSW DB Handler／有限 SQL 模擬執行，並檢查 HTTP Status 與結果。這能稱為**瀏覽器 Mock API 的實測**，但不是部署在真實 API Server 或 SQL Database 的驗證，也不是特定 AI 模型實際產出的紀錄。敘事上的 `GET /api/orders` 需區分於演示用 `<site-base>/mock/api/{variant}/orders`。

### 02｜功能可用，不代表符合專案的交付契約

從同一份合成成果，由外而內依序檢查 **Response → 架構 → Naming**；三者不是等重的獨立技術教學。

| 面向 | AI-direct（人為合成的對照） | Project-convention（同一合成專案的既有慣例） |
| --- | --- | --- |
| **Response／Consumer** | `aiResponse` 回傳 `{code,message,data:items[],totalCount}`，頁面資料位於 root | `response` 回傳 `{code,message,data:{items,totalCount}}`，保留 `ApiResponse<T>` 外殼 |
| **資料存取** | `createController → OrderRepository → parameterized SQL → DbTransport` | `createController → OrderService → OrderDao → Drizzle ORM (sqlite-proxy) → DbTransport` |
| **Naming** | 以 `OrderRepository` 直接承接查詢 | 明確區分 `OrderService`、`OrderDao`；兩種版本共用 `OrderQuery`／`OrderPage` 型別 |

兩條路徑都由**同一個 MSW DB Handler** 以 42 筆固定資料執行受限 SQL 語意。分頁參數為 `page=0`、`pageSize=20`，排序 `created_at DESC, id DESC`；日期依 UTC 日曆日轉半開區間。

此案例中，不相容的具體原因不是「JSON 多一個 root 欄位就必然壞掉」，而是既有 Consumer `readExistingOrdersConsumer` 會讀取 `data.items`、`data.totalCount`：AI-direct 的 Response 無法滿足，符合慣例的 Response 可以。**程式實際使用不同回應工廠，並沒有實際修改同一個共用 `ApiResponse<T>` 定義**；簡報不得把假設的共用型別修改說成已發生的程式事實。

Repository／原生 SQL 並非技術錯誤；問題在於工程師是否掌握此專案既有的整合契約與責任分工。所有具體證據與限制參見[第一、二章 SSOT 對應](../docs/ch01-ch02-ssot-alignment.md)。

### 03｜為什麼我會預期另一種交付？

回頭對照最初交辦內容與剛才驗收依賴的判斷依據：既有 Consumer／Response、責任分層、Naming、查詢語意和測試。

**收束**：我交辦的是功能，驗收卻依賴尚未完整提供或確認的既有規格。不了解既有系統就直接盲寫，人類工程師也可能遇到同樣落差。第一章**不先完整列出工作契約模型**，亦不把答案簡化成 Prompt 更長。

**轉場**：我們剛剛拿來判斷可否交付的依據，其實就是工程師每天使用的「規格」。

---

## 第二章｜工作拆分如同模組設計（約 5 分鐘）

### 04｜規格如何支援模組合作？

從真實案例的 TypeScript 方法簽章開始：

```ts
async search(query: OrderQuery): Promise<OrderPage>
```

此為 `src/application.ts` 中 `OrderService` 的**實際方法簽章**，不是示意的 Java DTO／Interface。接著引出其他規格來源：`OrderQuery`、`OrderPage` 型別、`OrderDao` 建構子依賴、`ApiResponse<T>`、既有 Consumer、測試與專案文件。簽章呈現局部輸入／輸出，但**不等於完整的行為契約**。

回用第一章的 System View：`createController → OrderService → OrderDao → Drizzle → DbTransport → MSW DB Handler`。觀眾應理解 Responsibility、Interface、Dependency、Encapsulation；不需額外講解 OOP 語法。底層是**有限 SQL Mock**，而不是真資料庫。

### 05｜如果設計的不是 Code，而是工作？

以同一組圖形，轉換設計對象：

1. **System View**：交付後的系統中，Controller／Service／DAO 如何合作。
2. **共同設計問題**：誰負責？怎麼合作？依賴什麼？
3. **Work View**：`建立 Table／設計 Schema → 實作 API → 開發前端`，用 Schema／API 契約等**交接物**標示工作依賴。

兩者不是節點一對一映射；Work View 是一般軟體工程工作的概念示意，**不是宣稱這份 Browser MSW 案例部署了實際資料表**，也不是固定不能並行的時間順序。

放大「實作 API」工作單元：

| 面向 | 具體內容 |
| --- | --- |
| Input | 訂單查詢需求、Schema、既有 Consumer／API 契約、相關程式與規範 |
| Output | 可整合的 TypeScript API 變更、測試與交付說明 |
| Responsibility | 完成訂單查詢與分頁功能 |
| Constraints | 沿用此專案的 Service／DAO 分工與共用回應契約，維持改動邊界 |
| Acceptance | 行為與既有 Consumer 相容、MSW／Chromium 測試證據通過，並說明 Mock SQL 限制 |

**章末封裝**：對外約定清楚，內部方法保留實作彈性；影響契約或驗收的未知事項仍須查證／協商。

**轉場至第三章**：如果同類工作反覆出現，怎樣把可重用的執行方法封裝為 Skill？

---

## 第三章｜從 Prompt 到 Skill：封裝工作（約 6 分鐘）

### 06｜把工作契約寫進 Prompt

原始：`幫我新增一支訂單查詢 API，支援日期、狀態與分頁。`

改善：提供現有 TypeScript 專案的需求、相關原始碼與規格，包括 `OrderQuery`／`OrderPage`、`ApiResponse<T>`、既有 `readExistingOrdersConsumer` 與測試。要求沿用此專案 `createController → OrderService → OrderDao → Drizzle ORM` 的責任分工與命名；維持 `{code,message,data}` 回應外殼，將 `items` 與 `totalCount` 放在 `data` 內以符合既有 Consumer；遵守修改邊界，執行 Browser MSW／Chromium 驗證，並回報未確認事項及受限 SQL Mock 的驗證界線。

**案例界線**：這是工作契約的示意改善版本，並非曾交給特定 AI 模型實際執行且經比較驗證的 Prompt。

**重點**：不是純粹把 Prompt 寫長，而是把隱含的工作契約顯性化。

### 07｜每次都重新交代，不是很麻煩嗎？

- **每次變動**：具體需求、修改範圍、當次輸入、特殊限制。
- **可以重用**：工作程序、檢查方法、產出格式、專案規範。

借用 Abstraction、Encapsulation、Reuse：分離變動與共通部分。

### 08｜將重複程序封裝成 Skill

用 Matt Pocock Skills 作例子，示意 Implement Skill：讀取需求／背景 → 確認範圍和未決事項 → 實作 → 測試 → 回報證據與限制。每次另外提供當次任務。

Skill 可以包含文件、工具與多個步驟，不等同 Class，也不只是 Prompt 模板。長期專案規範可能適合獨立文件，Skill 依需引用。

**轉場**：即使 Implement Skill 很完整，需求與設計從哪裡來？成果又交給誰？

---

## 第四章｜從工作介面到 Whole Picture：SDLC（約 7 分鐘）

### 09｜一個 Skill 不是整個系統

保留 `Implement API` 節點，往上追問需求／設計／契約，往下追問測試／部署／交付。OOP 類比：一個 Class 實作完整，不代表整個系統已完成。

### 10｜Input 從哪裡來？

需求分析（條件、分頁行為、驗收）→ 系統設計（API 契約、分層、資料模型）→ 程式實作。**上游工作 Output 常成為下游 Input。**

### 11｜把視角拉遠：SDLC

需求 → 設計 → 實作 → 測試 → 部署 → 維運。這是理解常見工作活動與交接的地圖，不主張必須線性執行，也不代表一個活動只能有一個產物。

### 12｜Whole Picture 是理解依賴，不只記順序

在同一張圖上添加跨節點依賴、回饋：驗收條件同時作用於設計／實作／測試；既有 Consumer 對 `data.items`、`data.totalCount` 的回應契約影響整合；測試可能回到需求／設計；部署問題可能要求重新調整。

**結論**：定義介面讓工作能拆分，理解依賴讓工作能組合。

**轉場**：知道依賴後，開始判斷順序、並行、回饋與粒度如何調整。

---

## 第五章｜Workflow：組合、調整與取捨（約 8 分鐘）

### 13｜同一組工作，可以有不同安排方式

使用**相同**的工作單元，示範三種不同尺度的調整：

- Waterfall：相對階段式的交付安排，作為基本參照。
- Agile：縮小交付粒度（先狀態查詢，再日期篩選，最後分頁），取得增量回饋。
- TDD：放大實作內部，先定義失敗測試，再實作通過與重構；並非把整個測試階段提前。

這些不是同層級、可直接互換的三套方法。

### 14｜從 Skills 組合成 Workflow

具體演示一套工作流：`需求釐清 → Spec → Tickets → Implement → Review / Verify`。

**Skill**：某類工作如何執行。**Workflow**：不同工作如何協作（順序、依賴、人工決策、交接、驗收、上游回饋）。查詢 API 需求模糊時增加探索；高風險時增加驗證。

### 15｜能拆分，不代表應該無限拆分

用同一支 API 的架構設計作三種對照：

1. 全部寫在單一 Method。
2. 拆成十層、二十個介面。
3. 依實際需求採取適當的 `createController → OrderService → OrderDao` 責任分工，並透過 Drizzle／`DbTransport` 存取資料（參照目前的 Project-convention 合成案例）。

**案例界線**：第一、二種是刻意設置的架構取捨概念示例，並非專案另外維護的兩套可執行程式。第三種參照現有 TypeScript 合成案例；具體分層不是所有專案的唯一正解。

對應 AI Workflow：

1. 一個 Prompt 包辦需求、設計、實作、測試。
2. 每個小步驟都設 Skill、交接、人工批准。
3. 按複雜度、風險、依賴選擇適當分工與驗收。

**結論**：好的 Workflow 和好的系統架構一樣，需要 Cohesion／Coupling／Interface／Composition 的取捨。拆得太少責任模糊，太多則協作與整合成本過高；MVC 只是此情境下的一種合理方案，不是永遠最佳。

---

## 第六章｜回頭看：AI、認知門檻與工程師成長（約 6 分鐘）

### 16｜前面每一次放大視角，都是一次成長

重用全場圖形，回顧：寫 API → 模組分工 → 工作契約 → Skill → 上下游依賴 → Workflow。每次為了解決委派問題放大視角，都暴露更大範圍的工程知識和責任；成長不是自動發生。

### 17｜AI 降低執行門檻，卻讓認知門檻提前出現

回到開場的訂單查詢 API **人為合成對照**：AI-direct 版本在 Browser MSW 情境中能完成查詢並回傳 HTTP 200，但回應資料形狀無法滿足既有 Consumer 對 `data.items`／`data.totalCount` 的要求；其架構與命名也不同於此合成專案設定的慣例。因此，局部功能可用不代表能直接整合與交付。**AI-direct 並非特定 AI 模型的實測輸出**，且 `OrderRepository`／參數化 SQL 本身不是技術錯誤。**這些工程知識不是為了改善 AI 輸出才需要，而是完成工程工作本身就必須具備的。**

傳統新人：透過局部任務、指導、Code Review、逐步擴大的責任，漸進且零碎地接觸需求、設計、測試、整合與交付。

AI 協作：更早嘗試超出新人認知與職責範圍的工作；若想可靠委派、判斷和交付，原本可逐步累積的工程知識就提前變成門檻。

**核心句**：AI 降低工作的執行門檻，卻不會自動降低完成與交付這項工作所需的工程知識。

### 18｜AI 反過來幫助跨越門檻

Vue 部署事件（唯一短暫離開查詢 API 的故事）：部署後無法連線 → AI 問部署方式 → 自己不知道 → 反問如何查證 → 查建置／部署 Log、追蹤 Apache 設定 → 找到問題並理解部署流程。

AI 可協助提問、解釋、規劃調查與探索，但需用文件、程式、Log、測試和真實環境驗證。

**循環**：委派 → 發現認知缺口 → AI 輔助探索 → 建立理解和判斷 → 擴大可掌握的工作範圍。

**收尾**：AI 能完成的事情可能遠超過我的認知；若無法定義工作、理解依賴和判斷成果，這些能力難以真正利用。為了掌握 AI 能力，我必須擴大認知範圍；而 AI 本身也能協助跨越這道門檻。

---

## 視覺與編輯設計原則

1. 第一章先以**明示為 Browser MSW／合成的實測 HTTP 200** 建立共同需求，再以 Response → Consumer → 架構 → Naming 由外而內檢查；不得將 Mock 結果宣稱為真實 API Server／Database 實測或真實 AI 模型輸出。
2. 同一個查詢 API 案例貫穿第 1–5 章；第 6 章回收其全貌，只在最後用 Vue 部署經驗作第二個短例子。
3. 維持 System View 與 Work View 兩個鏡頭，以相同模組化語言連結；不要將 Class 和 Skill 物件化為一對一等價。
4. 圖形應盡量重用，後續畫面透過 zoom、highlight、連線變更、增減工作節點呈現認知範圍擴張。
5. 保留第 15 張：一個 Method／20 個介面／合宜分層，類比一個 Prompt／過度切碎的 Skills／合宜 Workflow。
6. 第 16–18 張**以回收前文為主**，不是額外插入獨立的職涯或方法論課程。
7. Waterfall、Agile、TDD 是工作組織方式的短例子，避免另開方法論比較章。
8. AI 可執行不等於可交付，AI 輔助完成工作不等於已建立個人理解與判斷。

## 待補素材／開發任務

- [x] 可執行合成程式、唯一 Schema／Fixture、Browser MSW／Chromium 測試已在 `examples/order-api/ts-v1/` 收斂為 SSOT；第一、二章內容已對齊。
- [ ] 把同 Commit 的程式片段與 `generated/browser-evidence.json` 真正引入 Slidev Build；仍須完成真實 GitHub Pages Preview 驗收。
- [ ] 一個實際使用過的 Skill，呈現從重複規範到可重用指引的拆分。
- [ ] 一個真實 Workflow 調整案例，最好可對應新增 API 的例子。
- [ ] 系統／工作兩種視角可重用的視覺元件和視覺樣式。
- [ ] 每頁講者備註、時間控制與過渡句。
- [ ] 最終輸出與投影環境測試。

## v0.9.2 候選的變更界線

第一、二章沿用 v0.9.1 已對齊的 TypeScript SSOT、Browser MSW、既有 Consumer 契約、Drizzle Proxy、方法簽章與驗證界線，詳見[第一、二章 SSOT 對應](../docs/ch01-ch02-ssot-alignment.md)。本次僅修正 06、12、15、17 的技術用語、證據性質與案例邊界；不改動六章順序、核心論述或已有分鏡。

08／09 的 Skill 範例、14 的 Workflow 交接案例、18 的 Vue 部署故事仍待補充或確認素材；本版不是整份簡報的最終定稿。

## 版本控制原則

此檔是 **內容與敘事的基準規格**，不是投影片原始碼，也不強制每頁必須只顯示該條目全部文字。後續修改可在投影片內迭代；若改動核心論點、章節安排、案例或結論，需同步修訂此檔並更新版本。
