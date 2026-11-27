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

## 5. Existing Method Comparison

### 5.1 比較條件與判讀方式

本節固定同一個 S04 案例、Communication Objective、Audience Context、Presentation Context 與 Evidence Boundary，不比較哪一個資訊方案較好，也不以 State 3 的圖形數量、文件完整度或形式正式程度判定拆分效益。

- **A — Existing Method：** 以 `semantic-model.md`、`information-allocation.md` 與 State 3 的實際 SVG／PNG 為既有方法證據。文件明確記載與由產物推論的決策分開標示。
- **B — Independent Information Design：** 以本文件第 1–4 節為準，不修改 B，也不重新設計 A。
- **Artifact Evidence：** 只能支持文件明確寫出的規格，或 State 3 直接可見、可由 SVG 核對的內容；不能由成品反推未記載的設計意圖。
- **Design Judgment：** 對責任重疊、下游用途與拆分成本的質性判讀。
- **Unverified：** 尚無觀眾測試、投影測試、跨案例或獨立驗收輪次支持的命題。

### 5.2 A 已處理的資訊設計決策

#### 文件明確記載的決策

`semantic-model.md` 已明確處理案例事實層的資訊選擇：列出必要物件、必要屬性、必要關係、invariants、differences 與 semantic constraints，並將正常查詢背景、內部責任路徑、Browser MSW、bounded SQL 等列為可省略背景。它也明確保留同一 invalid query、共同 `HTTP 400 / INVALID_QUERY / data: null`、兩個 `message` 值、同一 Consumer、catalog lookup 與兩種 Consumer outcome。

`information-allocation.md` 已明確處理傳達與狀態分配：State 1 先建立共同輸入與 API error envelope，State 2 揭露 `message` 語意差異，State 3 揭露 Consumer lookup 與 compatibility 結果；每個狀態再區分 `Visible Information`、`Spoken Information`、`Deferred Information` 與 `Retained Understanding`。這已包含共同基準先於差異、差異先於 Consumer 結果的資訊優先與承載決策。

因此，A 的明確方法責任已涵蓋：

1. 案例事實與必要／可省略資訊的選擇。
2. 必要語意關係、invariants、differences 與不可違反的誤讀限制。
3. 跨狀態的資訊優先順序、可見／口述／延後分配與持續理解。
4. exact values 與概念層級的部分取捨，以及 State 3 要承擔的核心因果鏈。

#### 從 State 3 產物推論、但不應反寫成 A 的文件規則

State 3 的 SVG／PNG 直接呈現了以下已交付內容：同一個 invalid request、兩個 response、共同 error envelope、兩個 `message` 值、同一個 Existing Error Consumer、`message → MESSAGE_CATALOG`、`m0001` entry、catalog miss／hit 與兩種 outcome。它也以共同 attributes → message 差異 → Consumer lookup → outcome 的上下配置，實際表達了資訊層級與閱讀方向。

這些是 **Artifact Evidence**，但不全是 A 的獨立文件決策。尤其是卡片、框線、箭頭、兩欄排列、hatch、文字大小與視覺重量，屬於 State 3 的表示／構圖產物；不能只因它們存在，就推論 A 曾以「Information Design」文件獨立決定這些細節。`composition-review.md` 也把完整語意鏈、跨區 mapping、資訊負荷與投影可讀性區分為構圖取捨或尚未驗證事項。

### 5.3 A／B 責任比較

#### Information Selection

- **A 如何處理（Artifact Evidence）：** `semantic-model.md` 的必要／可省略物件與屬性已回答「哪些案例事實不能丟失」；必要關係與 invariants 又回答「哪些關係必須保留」。`information-allocation.md` 再依三個理解狀態選擇各階段可見、口述或延後的資訊。State 3 實際保留的輸入、共同 envelope、message、Consumer 與 outcome 與這個選擇一致。
- **B 如何處理（Artifact Evidence）：** B 以 Communication Objective、Audience Context 與 Presentation Context 重新核對用途，將資訊分為核心、支持、可省略／補充，並為每一項寫出保留理由與承載責任。B 也明確說明「從 Semantic Model 省略傳達」不是刪除案例事實。
- **B 的新增或更明確決策（Design Judgment）：** B 新增的是傳達範圍的核對視角，而不是新的案例事實清單。它讓「對本段觀眾而言必須傳達什麼」與「案例中存在什麼」語意上分開；但在本案例中，B 沒有找出 A 未涵蓋的必要物件、屬性或關係。
- **責任重疊：** 高。B 的核心／支持／省略清單大幅重述 Semantic Model 的必要／可省略分類，State 3 的 visible／spoken／deferred 又已處理傳達範圍。
- **對下游的用途：** 可作為進入表示或構圖前的最低內容清單，避免下游刪掉共同 envelope、兩個 `message` 或 Consumer 因果鏈；但 A 已可提供同等的語意防漏檢查。
- **新增文件與維護成本（Design Judgment）：** 低至中。若 B 只保留傳達目的、觀眾與取捨理由，成本可控；若同步維護完整的必要資訊表，則會與 Semantic Model 產生來源漂移與重複更新。

#### Information Abstraction

- **A 如何處理（Artifact Evidence）：** Semantic Model 保留 exact query、status、code、data、兩個 `message` 值與 outcome，並將正常查詢與內部路徑列為可省略背景；Information Allocation 以狀態目標決定何時呈現 exact value、何時由講者概括。State 3 將 exact value 與 `raw error detail`／`message code` 等角色標籤同時呈現。
- **B 如何處理（Artifact Evidence）：** B 對每個資訊項目明確標註 exact value、摘要、概念化描述或支持性文字。例如保留 `m0001` 的 exact value，但將 lookup outcome 概念化為 `catalog hit → compatible`；同時規定不得把必要語意改寫成不同案例事實。
- **B 的新增或更明確決策（Design Judgment）：** 這是 B 最明確的局部新增價值：它把「案例事實要保留」與「傳達時可用哪種精細程度」分開記錄，尤其說明概念化不等於刪除語意。這比 A 的分散式 exact／summary 使用更容易直接交給下游使用。
- **責任重疊：** 中。A 已有 exact values、必要語意與部分摘要；B 把這些選擇集中成表格，但沒有改變 State 3 所需的語意。
- **對下游的用途：** 能提供文字內容與語意標籤的交付界線，讓下游知道哪些值不可改寫、哪些結果可用概念標籤表示。它不能決定字級、卡片、布局、箭頭或 animation。
- **新增文件與維護成本（Design Judgment）：** 中。每個 exact value、摘要與來源若與 Semantic Model 同列，需同步維護；若只保留真正與本次傳達目的有關的 abstraction decision，成本較低。

#### Information Priority

- **A 如何處理（Artifact Evidence）：** Information Allocation 已將共同基準置於 `message` 差異之前，再將 Consumer 結果延後到 State 3；每一狀態都有 understanding goal 與 retained understanding。State 3 的上方共同 attributes、中段 message cards、下方 Consumer panel 也呈現此優先層次。這是文件明確規格加上成品可見證據的組合。
- **B 如何處理（Artifact Evidence）：** B 將資訊標成核心、支持或補充／可省略，並為核心資訊指定畫面或講者責任。S04 的九項核心資訊大多同屬「核心」，另列四項支持資訊，沒有在核心內再排序。
- **B 的新增或更明確決策（Design Judgment）：** B 提供了資訊項目層級的最低保留門檻，但優先級仍是粗粒度分類，不足以單獨決定視覺焦點、版面層級或揭露節奏。State 3 的先後順序與 State 1–3 的時間優先已主要由 Information Allocation 提供。
- **責任重疊：** 中至高。B 的 core／support 可補足 A 沒有統一命名的優先層級，但其實際排序仍重述 Information Allocation；尚未形成一套不同的優先變數或驗收方法。
- **對下游的用途：** 可作為「不得省略」與「可放入補充層」的約束；不能單獨回答哪個資訊要成為畫面焦點、哪個要變成次要文字，這仍屬構圖／表示或 sequence 決策。
- **新增文件與維護成本（Design Judgment）：** 中。若優先級只作粗粒度 guard，成本有限；若下游依賴它做細部 hierarchy，則必須另訂排序規則與驗收，現有證據尚未支持這個擴張。

#### Required Relationships

- **A 如何處理（Artifact Evidence）：** Semantic Model 已列出共同輸入、相同 error envelope、`message` 欄位分工、同一 Consumer lookup、miss／hit 與 outcome 的六項必要關係，並列出不可暗示的錯誤關係。Information Allocation 又要求這條因果鏈在三個狀態中持續成立；State 3 直接把它畫成兩條 lookup lane。
- **B 如何處理（Artifact Evidence）：** B 以「觀眾必須理解」的語氣列出八項 Required Relationships，補充 API error result 與 Consumer compatibility 的層次關係、案例範圍與不得推廣為架構優劣的限制。
- **B 的新增或更明確決策（Design Judgment）：** B 對下游的驗收語言更直接，將語意關係寫成傳達契約；但八項內容主要是 Semantic Model 的六項關係、invariants 與 constraints 的重述，沒有增加 State 3 未處理的新關係。API 層／Consumer 層區分在 A 已明確存在。
- **責任重疊：** 很高。若兩份文件都各自維護關係清單，最容易出現一邊更新 relation、另一邊忘記更新的漂移。
- **對下游的用途：** B 可作為表示／構造的語意 acceptance checklist；不過 `design-methods.md` 的 Relationship Representation、Relational Composition 與 Information Allocation 已有同樣的下游約束與驗收方向。
- **新增文件與維護成本（Design Judgment）：** 中至高。除非 B 明確只作下游 view 並引用 Semantic Model 作唯一事實來源，否則新增的完整關係表主要增加同步成本。

#### Communication Responsibility

- **A 如何處理（Artifact Evidence）：** Information Allocation 已按狀態區分 `Visible Information`、`Spoken Information`、`Deferred Information` 與 `Retained Understanding`，並具體指定 State 3 由畫面承載哪些 exact value／lookup 結果、由講者補充哪些上下文、哪些證據限制不進入畫面。這已是時間化的畫面／講者／補充分工。
- **B 如何處理（Artifact Evidence）：** B 在每項資訊列上指定「畫面承載」、「講者補充」或「補充資料／來源文件」，並刻意排除視覺形式、位置、重量、state、動畫與具體揭露順序。
- **B 的新增或更明確決策（Design Judgment）：** B 提供的是不依賴 state 的初始 carrier intent，並明確聲明 Information Design 不負責 visual form。這可作為下游輸入，但在本案沒有形成不同於 Information Allocation 的承載結果；它沒有另定 speaker notes 的具體格式，也沒有取代 State 3 的時間分配。
- **責任重疊：** 很高。B 的 screen／speaker／supplement 分類與 Information Allocation 的 visible／spoken／deferred 是同一責任在不同粒度的表達。若兩者並存，B 必須只保留高層 carrier intent，不能再複製 state table。
- **對下游的用途：** 若作為前置 guard，可提醒構圖不要承擔不必要的背景、也不要把必要因果鏈全交給講者；實際何時揭露與如何持續，仍應由 Information Allocation 負責。
- **新增文件與維護成本（Design Judgment）：** 中至高。對同一資訊同時維護兩套 carrier assignment，會增加 sequence 變更時的同步負擔；目前沒有證據顯示額外表格能降低重工。

### 5.4 五項特別檢查

1. **Semantic Model 的必要／可省略分類是否已涵蓋 Information Selection：是，主要已涵蓋。** B 加入 Communication Objective 與 Audience Context 的重新核對，讓傳達取捨更顯式；但在 S04 沒有證明 B 產生了 A 未能產生的必要資訊選擇。
2. **Information Specification 是否區分必要語意與必要呈現細節：部分是。** B 清楚區分必要語意、exact／summary／conceptual abstraction 與 carrier responsibility，也明確排除位置、視覺形式、重量、state 與動畫。因此它沒有建立「必要呈現細節」清單；State 3 的卡片、箭頭、布局等仍是下游產物，不是 B 的新增規格。
3. **資訊優先級是否足以供下游採用：不足以單獨採用。** core／support／補充提供最低保留門檻，但 S04 的核心項目過多且同層，沒有足夠細的相對排序。共同基準 → 差異 → Consumer outcome 的可用優先仍來自 Information Allocation 與 State 3 的實際配置。
4. **畫面／講者／補充資料分工是否與 Information Allocation 重疊：是，高度重疊。** B 是非時間化的承載意圖，A 是逐狀態的承載與延後決定；兩者可以上下游分層，但不能視為兩份獨立分工規格。
5. **Information Specification 是否提供實質決策：局部提供，整體不足以支撐獨立文件。** abstraction boundary、communication framing 與最低內容 guard 有實質用途；Information Selection、Required Relationships、carrier assignment 則主要重述既有文件。文件集中化本身不是拆分效益的直接證據。

## 6. Boundary Decision

### 6.1 五項判定標準

| 判定標準 | P2-A 結果 | 依據與限制 |
| --- | --- | --- |
| 責任獨立性 | **部分成立** | **Artifact Evidence：** B 能明確處理傳達目標、觀眾、抽象程度與最低承載責任；**Design Judgment：** Information Selection、Required Relationships 與 Communication Responsibility 已分散在 A；**Unverified：** 尚未證明這些責任在其他案例仍能保持同樣邊界。 |
| 變數獨立性 | **部分成立** | B 可在不改變案例事實的前提下調整 exact／summary／conceptual、core／support 與畫面／講者承載意圖；但 carrier 與 priority 會直接影響 Information Allocation，且 abstraction 仍受 Semantic Model 的必要語意限制。它不是完全獨立的可自由調整變數。 |
| 產物獨立性 | **不足以 Separate** | `information-design.md` 能成為下游最低內容與 abstraction checklist，但其資訊清單、關係清單與承載分工大多可由 Semantic Model 與 Information Allocation 重建；沒有證據顯示它產生 A 沒有的必要交付物。 |
| 驗收獨立性 | **部分成立但不充分** | 可驗收「沒有刪除必要語意」「exact value 未被錯誤改寫」「必要資訊有承載位置」；但這些檢查分別與 Semantic Model constraints、Information Allocation 的 state table 和 State 3 artifact check 重疊。尚無獨立的觀眾理解或優先級驗收證據。 |
| 拆分效益 | **目前偏低，且有同步成本** | **Design Judgment：** B 的集中化可降低下游查找成本，局部 abstraction guard 有價值；但新增完整文件會重複必要資訊、關係與 carrier table。**Unverified：** 沒有重工量、錯誤率或跨案例資料證明獨立文件能抵銷維護成本。 |

### 6.2 P2-A 結論

**整體結論：Retain。** 就 S04 與目前證據，Information Design 不應作為獨立執行階段或獨立長期 SSOT 保留；應保留其中確實有用的概念責任，並由既有 Semantic Model 與 Information Allocation 共同承擔。這個結論不是因為 B 的文件較長或較完整，而是因為 A 已覆蓋主要選擇、關係與承載決定，而 B 尚未形成獨立產物或獨立驗收。

具體區分如下：

- **概念責任予以保留：** 在下游設計開始前，仍需要一次輕量的 communication framing，確認 Communication Objective、Audience、Evidence Boundary、必要語意的 abstraction level、粗粒度 core／support／omit，以及不可交給講者補完的必要關係。這是對既有方法的明確化，不代表新增一個方法階段。
- **Semantic Model 的責任：** 維持案例事實、必要／可省略物件與屬性、invariants、differences、必要關係與 semantic constraints 的唯一語意基準。Information Design 不另建一份獨立案例事實 SSOT。
- **Information Allocation 的責任：** 維持狀態理解目標、Visible／Spoken／Deferred／Retained 分配、揭露順序與跨狀態持續性。Information Design 不另建一份與其平行的 screen／speaker／supplement state table。
- **下游表示／構圖的責任：** 維持視覺形式、位置、視覺重量、布局、連線與動畫／state 的具體決策。B 的必要語意與 carrier intent 不應被解讀成圖形方案。

因此，本案**不作 Separate**（不建立獨立 Information Design 階段／文件契約），也**不把局部新增價值提升為通用方法**。若未來要整合，較適合把 B 的 abstraction 與 communication framing 作為既有 Semantic Model／Information Allocation 之間的輕量檢查點；本次不修改 `design-methods.md`，也不展開整合工作。

### 6.3 Defer 與證據限制

以下事項保留為 **Defer**，不在本輪推導：

- **跨案例適用性：** 本結論只支持 S04 的 message contract 與 State 3；不能判定在資訊量更大、沒有連續 state 或觀眾不同的案例中，Information Design 是否值得獨立拆分。
- **優先級的獨立驗收：** 尚未有觀眾測試、投影測試或量測證明 B 的 core／support 分類能改善焦點辨識、理解速度或減少重工。
- **抽象程度的獨立收益：** B 的 exact／summary／conceptual 分類在文件上有局部決策價值，但尚未以 A／B 的下游重工、誤讀或維護量做對照。
- **長期文件形態：** 尚未決定未來是否需要把這個輕量檢查點嵌入既有文件、作為欄位或作為短表單；形式本身不構成方法分離證據。

**Artifact Evidence：** Semantic Model、Information Allocation 與 State 3 實際 SVG／PNG 已共同覆蓋本案主要資訊選擇、語意關係、狀態分配與承載結果。
**Design Judgment：** B 在 abstraction 與 communication framing 上有局部新增決策價值，但整體重疊與同步成本使獨立階段的效益不足。
**Unverified：** 觀眾是否更容易理解、下游是否減少重工、以及結論能否跨案例成立，均未由本輪證據驗證。
