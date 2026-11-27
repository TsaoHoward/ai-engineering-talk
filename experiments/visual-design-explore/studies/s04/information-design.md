# S04｜Information Specification

## 1. Input & Boundary

### 固定輸入

本規格只處理 S04 的 message contract，並沿用 [Semantic Model](./semantic-model.md) 所建立的案例事實、historical revision 與 evidence constraints。

- Communication Objective：兩種實作對同一個 invalid query 產生相同的 API 錯誤結果，但 `message` 的語意不同，導致既有 Consumer 的相容性差異。
- Audience Context：觀眾是新進軟體工程師，已知道兩種實作都能完成正常訂單查詢，但不假設其了解 message catalog 契約。
- Presentation Context：公司內部技術分享、speaker-led presentation；本段只處理 S04 的 message contract，不展開後續架構分層與命名議題。
- Evidence Boundary：技術事實以 Semantic Model 所指向的指定 revision `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329` 為準；本規格不宣稱重新執行 runtime。

### 本次 Information Design 的邊界

本規格負責決定：

- 哪些資訊是達成 Communication Objective 所必需，哪些可以省略或保留為補充。
- 每項資訊要保留 exact value、摘要、概念化描述或其他精細程度。
- 資訊的核心、支持與補充優先級。
- 觀眾必須理解的語意關係，以及資訊由畫面、講者或補充資料承載的責任。

本規格不決定資訊的視覺形式、位置、視覺重量、click、state、動畫或具體揭露順序。下游只應從本規格取得「需要表達什麼」，不應將其解讀為如何繪製。

### 與 Semantic Model 的既有責任重疊

Semantic Model 已經對 S04 做過一層資訊選擇判斷：它區分必要物件／屬性／關係與可省略背景，並列出 invariants、differences 與 semantic constraints（見 Semantic Model §1–§6）。這與本次 Information Design 在「選擇哪些資訊進入傳達範圍」上有責任重疊。

本次不把 Semantic Model 的「必要」與「可省略」分類直接視為最終傳達規格，而是以固定傳達目標與觀眾情境重新核對其用途：

- Semantic Model 是案例事實、來源與不可違反語意限制的基準。
- Information Design 是在該基準上，為本次傳達目的決定保留的精細程度、優先級與承載責任。
- 若某項資訊在 Semantic Model 中是必要關係，但對本次傳達只需概念化呈現，這是抽象程度的決定，不是刪除案例事實。
- 本規格不修改或擴充 Semantic Model，也不在本步驟作 Separate、Retain 或 Defer 的最終判定。

## 2. Information Specification

### 2.1 核心資訊

以下資訊是觀眾理解 Communication Objective 所必需的。表中的技術事實均只引用 Semantic Model，不建立另一份案例事實 SSOT。

| 資訊項目 | 來源參照 | 選擇結果 | 抽象程度 | 優先級 | 傳達責任 | 必要取捨理由 |
| --- | --- | --- | --- | --- | --- | --- |
| 同一個 invalid query 作為比較基準 | Semantic Model §1 `Invalid query request`；§3 必要關係 1；§4 invariants | 保留 | 保留 exact query `?fromDate=2026-01-01`，並摘要為「缺少 `toDate` 的 invalid query」 | 核心 | 畫面承載 exact value 與概念標籤；講者補充這是兩種實作共同接收的同一輸入 | 若省略共同輸入，觀眾可能把兩個 response 誤解成不同錯誤案例；exact value 也是本案例的 evidence anchor |
| 兩個 API response 的共同錯誤結果 | Semantic Model §2 必要屬性；§3 必要關係 2；§4 invariants | 保留 | 保留 `HTTP 400`、`code: INVALID_QUERY`、`data: null` 三個 exact value；可摘要為「相同的 API error envelope」 | 核心 | 畫面承載共同值與其相同性；講者明確說明這是 API 層的相同結果 | 這是「相同 API 錯誤結果」的必要證據，也防止畫面暗示兩條路徑在 status、`code` 或 `data` 上不同 |
| AI-direct response 的 `message` | Semantic Model §2 AI-direct response；§5 Differences | 保留 | exact value：`fromDate and toDate must be supplied together`；概念化標籤：「raw error detail，不是 catalog key」 | 核心 | 畫面承載 exact value 與語意角色；講者說明 raw text 會被既有 Consumer 當成 key 使用 | 不能只摘要成「一段錯誤文字」，否則會失去 raw text 與 message code 的契約差異 |
| Project-convention response 的 `message` | Semantic Model §2 Project-convention response；§5 Differences | 保留 | exact value：`m0001`；概念化標籤：「message catalog key」 | 核心 | 畫面承載 exact value 與語意角色；講者補充它不是 `INVALID_QUERY` 的另一種寫法 | `m0001` 的識別值是 Consumer 能否解析的直接依據，不能被抽象成泛稱「標準訊息」 |
| `message` 與 API `code` 的欄位分工 | Semantic Model §3「關係的語意方向」；§6 semantic constraints 3 | 保留 | 概念化描述：「`code: INVALID_QUERY` 是 API 錯誤分類；`message` 是 Consumer 查表使用的訊息識別值」；保留兩個 exact field name | 核心 | 畫面承載欄位分工；講者強調兩者分別由 response 攜帶，沒有自動推導關係 | 不表達此分工會使觀眾把 `code` 與 `message` 視為同一契約，改變案例事實 |
| Existing error Consumer 的 lookup 契約 | Semantic Model §1 `Existing error Consumer`、`Message catalog`；§2 lookup rule；§3 必要關係 4 | 保留 | 保留規則：「Consumer 將 `message` 視為 catalog key，查不到即為未知訊息代碼」；不展開 Consumer 內部實作 | 核心 | 畫面承載規則與因果關係；講者以 message catalog 契約補足新進工程師所需背景 | 這是連接 response `message` 與 compatibility outcome 的必要中介；省略會使結果看起來像無理由的 pass/fail |
| AI-direct 的 Consumer outcome | Semantic Model §2 Consumer outcome；§3 必要關係 5；§5 Differences | 保留 | 概念化為「catalog lookup miss → incompatible」；可補充 exact outcome：`Unknown message code`、`consumed: null` | 核心 | 畫面承載 lookup miss 與 incompatible；講者可補充錯誤結果的 exact wording | 必須清楚這不是 API request 被拒絕，而是既有 Consumer 對 response 的語意解析不相容 |
| Project-convention 的 Consumer outcome | Semantic Model §2 Consumer outcome；§3 必要關係 6；§5 Differences | 保留 | 概念化為「`m0001` lookup hit → compatible」；保留顯示文字 `查詢條件不合法` | 核心 | 畫面承載 lookup hit、compatible 與顯示文字；講者補充 catalog entry 的作用 | 需要與 AI-direct outcome 成為同一 Consumer 下的對照，才能支撐「message 語意造成相容性差異」 |
| API error result 與 Consumer compatibility 的層次區分 | Semantic Model §4 invariants；§5 Differences；§6 semantic constraints 1、5 | 保留 | 概念化為兩層結果：「API 層：兩者都是 invalid-query error；Consumer 層：一者 incompatible、一者 compatible」 | 核心 | 畫面承載兩層結果的差異；講者明確說明差異不代表一條 API 成功、另一條 API 失敗 | 這是 Communication Objective 的核心因果邊界；若混成單一成功／失敗判斷，會違反 Semantic Constraints |

### 2.2 支持資訊

支持資訊用來讓新進工程師正確解讀核心對照，但不需要成為新的案例主張。

| 資訊項目 | 來源參照 | 選擇結果 | 抽象程度 | 優先級 | 傳達責任 | 必要取捨理由 |
| --- | --- | --- | --- | --- | --- | --- |
| Message catalog 的相關 entry | Semantic Model §1 `Message catalog`；§2 `m0001` entry | 保留 | 只保留與本案例命中的 entry：`m0001 → 查詢條件不合法`；不展開完整 catalog | 支持 | 畫面承載 entry 作為 lookup hit 的證據；講者說明 catalog 不是任意 raw text 的翻譯器 | 只呈現相關 entry 可支撐 compatibility 結果；完整 catalog 不增加本段 message contract 的理解 |
| `message` 值的兩種語意角色 | Semantic Model §5 Differences；§6 semantic constraints 2、4 | 保留 | 使用對立但非同義的概念：「raw text 描述錯誤」與「catalog key 識別訊息」 | 支持 | 畫面承載兩種角色名稱；講者避免將它們說成同義值或不同顯示格式 | 觀眾需要知道差異是契約語意，不是字串外觀或語言翻譯差異 |
| Consumer 對兩種值採取相同 lookup 機制、得到不同結果 | Semantic Model §3 必要關係 4–6；§5 Differences | 保留 | 概念化為同一 lookup rule 下的 hit／miss 對照；不描述內部程式流程 | 支持 | 畫面承載規則到 outcome 的語意鏈；講者補充因果解讀 | 保留同一 Consumer 與同一 lookup rule，才能把差異歸因於 `message` 值的契約語意 |
| 歷史 revision 與證據邊界 | Semantic Model Source index；§4 invariants；§6 semantic constraints 8 | 保留為補充脈絡 | 摘要為「指定 revision 的 artifact evidence」；不把 Browser MSW、fixtures 或 bounded SQL 說成真實外部執行 | 支持 | 補充資料／來源文件承載；講者只在需要時說明 evidence boundary | 保留可追溯性與誠實的證據界線，但不讓案例背景取代 message contract |

### 2.3 可省略或保留為補充的資訊

| 資訊 | 選擇結果 | 責任與理由 |
| --- | --- | --- |
| 正常查詢的 `HTTP 200`、`m0000`、訂單 ID、`totalCount`、成功 response 的 `data.items` shape | 主畫面省略 | Semantic Model §2 已指出這些由前一個 Snapshot 建立，且不影響本次錯誤 response 的 message 差異；不再佔用本段核心承載。若需要連接上下文，由講者以一句話帶過即可。 |
| 兩條實作的 repository／service／DAO 名稱 | 主畫面省略 | Semantic Model §2 將其歸為後續 S05 背景；本段判準是既有 Consumer 是否能解析，不是架構或命名比較。 |
| `DbTransport`、Browser MSW、bounded SQL evaluator、固定 fixtures、正常訂單資料、兩條內部責任路徑 | 主畫面省略，證據需要時留在來源文件 | Semantic Model §1 與 §6 指出它們不是 message 語意比較的必要物件，且不得被說成真實外部 API／資料庫執行證據。 |
| `Unknown message code` 的完整錯誤字串與 `consumed: null` | 核心結論保留摘要，exact wording 作支持或補充 | Semantic Model §2 有 exact outcome；本段必須傳達 lookup miss 與 incompatible，但不要求把錯誤輸出全文作為主要資訊。 |
| 完整 message catalog | 省略 | Semantic Model §6 指出 catalog 只解析已存在的代碼 entry；本案例只需 `m0001` 的 entry 即可支撐因果鏈。 |
| 來源檔案、行號與指定 revision | 補充資料／來源文件保留 | 用於 artifact traceability，不作為核心 audience-facing message contract；來源以 Semantic Model Source index 為準。 |

上述省略是傳達範圍的選擇，不是對案例事實的刪除或否定。核心對照仍必須保留同一輸入、相同 API error envelope、兩個 `message` exact value、lookup 契約與兩種 Consumer outcome。

## 3. Required Relationships

下游設計必須讓觀眾能理解以下關係；本節只規定理解內容與方向，不規定使用箭頭、容器、表格、程式碼或其他圖形形式。

1. **共同輸入關係**：同一個 `Invalid query request`（`?fromDate=2026-01-01`，缺少 `toDate`）同時對應 AI-direct 與 Project-convention 兩個 response。不得把它呈現成兩個不同錯誤案例。
2. **API 結果相同關係**：兩個 response 都是 `HTTP 400`、`code: INVALID_QUERY`、`data: null`。下游不得暗示 status、API error classification 或 payload 空值不同。
3. **欄位分工關係**：每個 response 都提供 `message`；`code: INVALID_QUERY` 是 API 錯誤分類，`message` 是既有 Consumer 查表使用的訊息識別值。`message` 不是 `code` 的自動推導結果。
4. **語意差異關係**：AI-direct 的 `message` 是 raw error detail；Project-convention 的 `message` 是 catalog key `m0001`。兩者不是同義值的兩種呈現，也不是同一文字的不同格式。
5. **Consumer 契約關係**：既有 error Consumer 對 `message` 執行 message catalog lookup，並非把 `message` 當成任意可直接顯示的文字。
6. **因果鏈關係**：AI-direct raw text → catalog lookup miss → `Unknown message code`／incompatible；Project-convention `m0001` → catalog lookup hit → `查詢條件不合法`／compatible。兩條鏈使用同一既有 Consumer 規則。
7. **層次關係**：API 層的相同 invalid-query error result，經過既有 Consumer 解析後，可以產生不同 compatibility outcome。不得把 Consumer incompatible 說成 AI-direct 沒有回傳 API error，也不得把 Project-convention compatible 說成沒有錯誤。
8. **案例範圍關係**：這個對照只支持「本案例既有 Consumer 是否能解析」的判斷，不支持兩種內部架構的普遍優劣，也不支持把 message code 提升為所有 API 的通用規則。

## 4. Self-check & Limitations

### Self-check

- **技術事實依據**：所有 response 值、欄位語意、lookup 行為、catalog entry、Consumer outcome 與 evidence boundary 均可回溯到 Semantic Model §1–§6 及其 Source index；本文件沒有新增案例事實。
- **資訊選擇不改變事實**：省略的是已由前一個 Snapshot 建立或與本段無關的背景；保留的 exact query、HTTP status、`code`、`data`、兩個 `message` 值與 outcome 未被改寫。
- **因果關係完整**：共同輸入 → 相同 API error envelope → `message` 語意差異 → 同一 Consumer 的 lookup hit／miss → 不同 compatibility outcome，仍可被下游保留。
- **層次區分清楚**：規格明確分開 API error result 與 Consumer compatibility，沒有把任一 Consumer outcome 改寫成 API 成功或失敗。
- **視覺方案獨立**：規格只描述資訊、抽象、優先級、責任與必須理解的關係，沒有指定圖形、拓撲、構圖、動態或揭露順序。
- **方法結論克制**：本文件只提供一份 Information Specification，不宣稱已驗證觀眾理解、整體方法效益或 Information Design 是否應成為獨立方法，也不形成 Separate、Retain 或 Defer 的最終判定。

### Limitations and unresolved questions

- 尚未驗證新進工程師是否能在實際 presentation 中正確區分 API error result、`message` contract 與 Consumer compatibility；本文件只有設計判斷，沒有觀眾測試證據。
- 尚未決定上述資訊在下游畫面中的具體視覺表示、布局、視覺重量、揭露順序或互動狀態；這些不屬於本步驟的責任。
- 尚未決定哪些支持資訊應出現在投影片、speaker notes 或獨立來源文件的具體載體；本文件只先分配其傳達責任。
- 本規格只適用於 Semantic Model 所描述的 S04 案例與指定 historical revision；不能由此推導其他 API、Consumer 或 message catalog 的一般契約。
- 本規格未重新執行 runtime，也未以本文件單獨驗證 artifact evidence 的現況；證據有效性仍受 Semantic Model 所記錄的 revision 與來源邊界限制。
- Information Design 與 Semantic Model 的責任邊界仍有「必要／可省略」判斷上的重疊；本步驟記錄並管理該重疊，但不以單一文件數量或概念差異提前決定是否應永久拆分。
