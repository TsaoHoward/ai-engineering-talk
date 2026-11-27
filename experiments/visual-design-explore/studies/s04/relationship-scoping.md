# S04 State 3｜Relationship Scoping

## 拆解邊界

本文件只根據 `semantic-model.md` 與 `information-allocation.md` 的 State 3 必要資訊及理解目標，將關係拆成可獨立處理的局部視覺設計問題。

這裡界定的是「需要讓觀眾理解的關係」，不是圖形方案。各問題不預設 visual encoding、物件位置、大小、色彩、外框、連線或完整投影片構圖；後續 Agent 可在每個問題的範圍內獨立提出表示方式。

State 3 的核心理解是：同一個 invalid query 產生兩個具有相同 API error envelope 的 response；兩者的 `message` 語意不同；既有 Consumer 將 `message` 當作 message catalog key，因此 raw text 與 `m0001` 產生不同的 Consumer 相容性結果。

## 局部視覺設計問題

### RS3-01｜建立共同的錯誤案例與 API 基準

- **Problem：** 如何讓觀眾理解，`Invalid query request` 是同一個錯誤輸入，而 `AI-direct response` 與 `Project-convention response` 都是對這個輸入產生的 API error response，且兩者的共同 error envelope 相同？
- **Understanding Objective：** 觀眾能把兩個 response 視為同一案例下的可比較對象，知道兩者都代表 HTTP `400`、`code: INVALID_QUERY`、`data: null`，而不是一條 API 成功、另一條 API 失敗。
- **Scope：**
  - 必要物件：`Invalid query request`；`?fromDate=2026-01-01` 且缺少 `toDate`；`AI-direct response`；`Project-convention response`。
  - 必要屬性：兩個 response 的 HTTP status `400`、`code: INVALID_QUERY`、`data: null`；兩個 response 都包含 `message` 欄位，但此問題不需揭露其實際值。
  - 必要關係：同一個 invalid query 被兩種實作共同接收；每個 response 都具有相同的 API error envelope；兩個 response 的 `message` 都是後續比較的欄位。
- **Constraints：** 不得暗示輸入是兩個不同錯誤案例；不得暗示共同 envelope 有差異；不得把 API error result 與 Consumer compatibility result 混為一談；不得在此問題中預先判定哪個 `message` 可被解析。
- **Shared Objects / Dependencies：** `Invalid query request`、兩個 response、HTTP `400`、`INVALID_QUERY`、`data: null` 是 RS3-02 與 RS3-04 的共同基準。RS3-02 依賴此問題所建立的「只有 `message` 尚待比較」的邊界；RS3-04 會重用此基準以區分 API 層結果與 Consumer 層結果。
- **Acceptance：** 不看完整投影片構圖，觀眾仍能回答：兩個 response 是否來自同一個缺少 `toDate` 的輸入？兩者的 HTTP status、API error code、payload 空值是否相同？並能指出後續差異不在這些共同欄位。

### RS3-02｜辨識 `message` 的值與語意差異

- **Problem：** 如何讓觀眾理解，兩個 response 的共同 error envelope 沒有改變，真正不同的是 `message` 欄位的值及其語意：一個是 raw error detail，另一個是既有 message code？
- **Understanding Objective：** 觀眾能辨認 `AI-direct.message` 的 `fromDate and toDate must be supplied together` 是 raw text，而 `Project-convention.message` 的 `m0001` 是 catalog key；兩者不是同義值的兩種呈現。
- **Scope：**
  - 必要物件：RS3-01 的同一個 invalid query、兩個 response、兩個 response 的 `message` 欄位。
  - 必要屬性：`AI-direct.message = fromDate and toDate must be supplied together`；`Project-convention.message = m0001`；兩個 response 仍同為 HTTP `400`、`INVALID_QUERY`、`data: null`。
  - 必要關係：每個 response 分別提供一個 `message` 值；前者的值是 raw error detail，後者的值是 message catalog key；`code: INVALID_QUERY` 與 `message` 是 response 中分別攜帶的欄位，不是推導關係。
- **Constraints：** 不得暗示 raw text 與 `m0001` 是同義值；不得暗示 `message` 由 `INVALID_QUERY` 自動產生；不得暗示兩個 response 的 HTTP status、`code` 或 `data` 不同；不得在尚未引入 Consumer lookup 的前提下宣稱其中一個 API response 成功或失敗。
- **Shared Objects / Dependencies：** 兩個 response、共同 envelope 與 `message` 欄位共享 RS3-01；`AI-direct.message`、`Project-convention.message`、`m0001` 會被 RS3-03 與 RS3-04 共同使用。RS3-02 提供 RS3-03 lookup 的輸入語意，但局部方案仍可將兩個值及其必要分類一併納入，不依賴完整投影片。
- **Acceptance：** 觀眾能指出兩個 response 的共同欄位保持不變，並準確說出差異只在 `message`：raw text 與 catalog key；也能說明 `INVALID_QUERY` 不是把兩者連成同一語意的轉換器。

### RS3-03｜表達既有 Consumer 的 message lookup 契約

- **Problem：** 如何讓觀眾理解，`Existing error Consumer` 不是把 `message` 當作任意可直接顯示的文字，而是將它視為 key，交給 `Message catalog` 查詢？
- **Understanding Objective：** 觀眾能掌握既有 Consumer 的解讀規則：`message` → `MESSAGE_CATALOG`；`m0001` 是可查詢的既有 catalog entry，其顯示文字為 `查詢條件不合法`。
- **Scope：**
  - 必要物件：`Existing error Consumer`；RS3-02 的兩個 `message` 值；`Message catalog`；catalog entry `m0001`；顯示文字 `查詢條件不合法`。
  - 必要屬性：Consumer 的 lookup rule 是以 `message` 查 `MESSAGE_CATALOG`；catalog 中存在 `m0001` entry；查不到 key 時會產生 `Unknown message code`。
  - 必要關係：兩個 response 的 `message` 都交給同一個 Consumer 依同一規則處理；Consumer 將 `message` 當作 catalog key，而不是直接將 raw text 當作顯示文字；`m0001` 對應到 `查詢條件不合法`。
- **Constraints：** 不得暗示 catalog 會翻譯任意 raw text；不得暗示 `code: INVALID_QUERY` 取代或自動生成 `message`；不得把 message-code lookup 提升為所有 API 的通用規則；不得把 Consumer 規則描述成 API error classification 規則。
- **Shared Objects / Dependencies：** `message` 值共享 RS3-02；`Existing error Consumer`、`Message catalog` 與 `m0001` entry 會被 RS3-04 重用。RS3-03 在語意上承接 RS3-02，但其局部方案必須包含兩種輸入值、lookup 規則與必要 catalog entry，才能獨立判斷契約，不依賴完整畫面。
- **Acceptance：** 觀眾能指出同一個 Consumer 對兩個 `message` 值使用同一個 catalog-key lookup 規則，並能指出 `m0001` 命中的顯示文字；同時不會把 raw text 視為已經是可直接顯示的 catalog 結果。

### RS3-04｜區分 API error result 與 Consumer compatibility result

- **Problem：** 如何讓觀眾理解，同一個 API error result 在經過同一個既有 Consumer 後，可以因 `message` 語意不同而產生不同的相容性結果？
- **Understanding Objective：** 觀眾能同時理解兩條結果關係：raw text 查詢失敗，得到 `Unknown message code`、`incompatible`、`consumed: null`；`m0001` 查詢成功，得到 `displayMessage: 查詢條件不合法`、`compatible`。差異發生在 Consumer 契約，不是 API 是否正確回報 invalid query。
- **Scope：**
  - 必要物件：RS3-01 的同一輸入與共同 error envelope；RS3-02 的兩個 `message` 值；同一個 `Existing error Consumer`；`Message catalog`；兩個 `Consumer outcome`。
  - 必要屬性：AI-direct 分支為 raw text → catalog miss → `Unknown message code`／`incompatible`／`consumed: null`；Project-convention 分支為 `m0001` → catalog hit → `displayMessage: 查詢條件不合法`／`compatible`。
  - 必要關係：兩個 response 共享同一 API 層 invalid-query 結果；兩者由同一 Consumer 評估；`message` 的不同值導致 catalog lookup 的不同結果；lookup 結果再導致不同的 Consumer compatibility outcome。
- **Constraints：** `compatible`／`incompatible` 只表示既有 Consumer 是否能解析 `message`，不得解讀為 API 成功／失敗；不得暗示 AI-direct 的錯誤分類不正確或 Project-convention 沒有錯誤；不得以此結果排名兩種內部架構或實作路徑；不得把本案例結果泛化成所有 API 的規則。
- **Shared Objects / Dependencies：** 共同輸入與共同 envelope 共享 RS3-01；兩個 `message` 值共享 RS3-02；Consumer、catalog 與 lookup 規則共享 RS3-03。這些是語意依賴，不是對完整投影片構圖或其他局部圖形的依賴；RS3-04 的局部方案可自足地包含共同基準、lookup 與兩個結果。
- **Acceptance：** 觀眾能在同一個局部理解單元中回答：兩個 API response 是否都同樣是 HTTP `400`／`INVALID_QUERY`／`data: null`？為何 raw text 導致不相容，而 `m0001` 能得到 `查詢條件不合法`？並能明確指出差異位於 Consumer lookup，而非 API error classification。

## Coverage Mapping

| State 3 必要資訊／關係 | 處理問題 | 覆蓋說明 |
| --- | --- | --- |
| 同一個 `?fromDate=2026-01-01`、缺少 `toDate` 的 invalid query | RS3-01；RS3-04 共享 | RS3-01 建立同一案例基準；RS3-04 保留它以確認結果差異不是來自不同輸入。 |
| 兩個 response：`AI-direct` 與 `Project-convention` | RS3-01；RS3-02；RS3-04 | 三個問題共享兩個 response，但各自只為自己的理解目的取用必要屬性。 |
| 共同 HTTP `400`、`code: INVALID_QUERY`、`data: null` | RS3-01；RS3-04 | RS3-01 建立共同 API error envelope；RS3-04 用它分隔 API error result 與 Consumer compatibility result。 |
| 兩個 response 都有 `message` 欄位 | RS3-01；RS3-02 | RS3-01 標示共同欄位；RS3-02 處理該欄位的實際值與語意差異。 |
| `AI-direct.message` 是 raw error detail | RS3-02；RS3-03；RS3-04 | RS3-02 定義值的語意；RS3-03 定義它進入 catalog-key lookup；RS3-04 處理查表失敗與相容性結果。 |
| `Project-convention.message = m0001` | RS3-02；RS3-03；RS3-04 | RS3-02 定義其為 message code；RS3-03 建立 catalog entry 與顯示文字；RS3-04 處理查表成功與相容性結果。 |
| `Existing error Consumer` 將 `message` 視為 catalog key | RS3-03；RS3-04 | RS3-03 處理契約本身；RS3-04 使用同一契約解釋兩個 outcome。 |
| `m0001` → `查詢條件不合法` | RS3-03；RS3-04 | RS3-03 處理 catalog 對應；RS3-04 處理命中後的 Consumer 顯示結果。 |
| raw text → catalog miss → `Unknown message code`／`incompatible`／`consumed: null` | RS3-04 | 由一個完整的 outcome 關係處理，不再拆成獨立問題，以維持「Consumer 解析失敗」這個單一理解目的的語意封閉。 |
| `m0001` → catalog hit → `displayMessage: 查詢條件不合法`／`compatible` | RS3-04 | 與 raw text 的 outcome 作同一層級的對照，保留相同 Consumer 與同一 API 基準。 |
| API error result 與 Consumer compatibility 的區分 | RS3-01；RS3-04 | RS3-01 固定 API 層共同結果；RS3-04 明確處理跨層差異及其因果歸屬。 |

## Deferred context

以下資訊屬於整體畫面的背景或證據邊界，不是 State 3 局部關係本身，因此不強制納入上述局部圖形設計問題：

- S03 已建立的「正常訂單查詢可完成」及兩種實作的連續敘事背景。它用於承接觀眾理解，不是 State 3 的錯誤 response 關係。
- S05 的內部責任／命名路徑，以及 repository、service、DAO 等實作細節。它們不是 Consumer lookup 與相容性結果的必要物件。
- Browser MSW、bounded SQL、固定 fixtures、source revision 與 `not rerun` 等證據與執行邊界。它們限制案例證據如何被解讀，但不構成 State 3 必要的觀眾理解關係。
- 正常查詢的 HTTP `200`、`m0000`、訂單 ID、`totalCount` 與成功 response 的 `data.items`。這些已由前一個 Snapshot 建立，且不改變本次錯誤 response 的 `message` 語意比較。
