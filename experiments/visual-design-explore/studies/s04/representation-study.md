# S04｜Representation Study：RS3-03

## 1. Fixed Input & Scope

本研究只處理 RS3-03「表達既有 Consumer 的 message lookup 契約」；固定的語意依賴取自 [Semantic Model](./semantic-model.md) 與 [Relationship Scoping](./relationship-scoping.md#rs3-03｜表達既有-consumer-的-message-lookup-契約)。本文件只規格化表示方式，不執行 Graphic Construction，也不決定完整投影片構圖或揭露順序。

固定理解目標：觀眾理解既有 `Existing error Consumer` 會把兩個 response 的 `message` 各自視為 catalog key，依同一規則查詢同一個 `MESSAGE_CATALOG`，因此得到不同查詢結果。

必要資訊與關係如下：

- 同一個 `Invalid query request`：`?fromDate=2026-01-01`，缺少 `toDate`。
- 兩個彼此獨立的 response：`AI-direct response` 與 `Project-convention response`。
- 兩個 response 的共同 API error envelope：HTTP `400`、`code: INVALID_QUERY`、`data: null`。
- `AI-direct.message = fromDate and toDate must be supplied together`；其語意是 raw error detail。
- `Project-convention.message = m0001`；其語意是 message catalog key。
- 同一個 `Existing error Consumer` 對兩個 `message` 分別套用同一條規則：以 `message` 查 `MESSAGE_CATALOG`。
- `MESSAGE_CATALOG` 中 `m0001` 對應 `查詢條件不合法`；查不到 key 時產生 `Unknown message code`。
- raw text 的 lookup 結果是 miss，Consumer outcome 為 `incompatible`、`consumed: null`；`m0001` 的 lookup 結果是 hit，Consumer outcome 為 `compatible`、`displayMessage: 查詢條件不合法`。

兩種策略都必須保留兩個獨立輸入、共同 envelope、同一 Consumer、同一 catalog、同一 lookup rule、catalog entry、hit/miss 與 Consumer outcome。`code: INVALID_QUERY` 只是共同的 API error classification，不是由 Consumer 用來產生或轉換 `message` 的值。

## 2. Representation Specification A

### Strategy

**共享規則下的雙路徑執行追蹤（shared-rule dual trace）**：把理解目標表示成兩個獨立的 `message` 輸入，各自沿著同一個 Consumer lookup 規則走到 `MESSAGE_CATALOG`，再各自產生 lookup 與 Consumer 結果。表示的重點是「同一規則被重複套用於兩個輸入」，而不是把兩個輸入合併成一個值。

### Representational Principle

以規則執行與因果轉換表示關係：`response.message` 是 lookup input；同一個 `message → MESSAGE_CATALOG` lookup operator 對兩個輸入分別執行；catalog hit 或 miss 再決定各自的 Consumer outcome。共同的 API envelope 是兩條追蹤共享的比較基準，而不是另一個造成差異的處理步驟。

### Representational Units

- 一個共同案例單元：`Invalid query request` 及其缺少 `toDate` 的 query。
- 兩個獨立 response 單元：分別標示 `AI-direct response` 與 `Project-convention response`，各自包含完整的 `message` 值與共同 envelope 屬性 `400`、`INVALID_QUERY`、`data: null`。
- 一個共享 Consumer 規則單元：`Existing error Consumer`，明確標示 `message` 被當作 catalog key。
- 一個共享 catalog 單元：`MESSAGE_CATALOG`，至少包含 `m0001 → 查詢條件不合法`，並能表達 key 不存在時的 miss。
- 兩組彼此分離的 lookup/result 單元：每組保留輸入值、hit/miss、lookup 結果與 Consumer outcome。

### Semantic Mapping

- 共同案例單元對應同一個 invalid query；它分別指向兩個 response 單元，表示兩者是同一輸入下的兩個結果，不是兩個錯誤案例。
- `AI-direct response` 的 `message` 對應精確 raw text `fromDate and toDate must be supplied together`，並標示為 raw error detail；它以原值進入同一 lookup 規則，於 `MESSAGE_CATALOG` 查不到 key，產生 `Unknown message code`、`incompatible`、`consumed: null`。
- `Project-convention response` 的 `message` 對應精確 key `m0001`，並標示為 message catalog key；它以同一 lookup 規則命中 `m0001 → 查詢條件不合法`，產生 `compatible`、`displayMessage: 查詢條件不合法`。
- 兩個 response 各自攜帶相同的 HTTP `400`、`code: INVALID_QUERY`、`data: null`；這些共同屬性只作為兩條追蹤的 invariant，不被映射成 lookup 結果。

### Shared Rule

只建立一個 `Existing error Consumer` 與一個 `MESSAGE_CATALOG` 的共享規則關係：對每個 response，讀取其自己的 `message`，把它當作 key 查詢同一個 catalog；命中則取 entry 的顯示文字，未命中則產生 `Unknown message code`。兩個 `message` 會分別進入此規則，不互相合併，也不存在兩套 Consumer 或兩套 lookup 規則。

### Interpretation Constraints

- 兩條追蹤必須保持為兩個獨立的 `message` 輸入；不得將 raw text 與 `m0001` 拼成、選成或抽象成單一輸入。
- 不得把共享的 Consumer 或 catalog 畫成兩個副本，也不得讓兩條追蹤看起來使用不同的 lookup 規則。
- 不得把 raw text 視為可直接顯示的文字；它在本案例中是未命中的 catalog lookup input。
- 不得把 `m0001` 顯示成 raw text 的翻譯結果；它是先命中的 catalog key，再得到 `查詢條件不合法`。
- 不得把 `code: INVALID_QUERY` 表示成 `message` 的來源、轉換器或 lookup key；兩者是 response 中分別攜帶的欄位。
- `compatible`／`incompatible` 只表示既有 Consumer 能否解析 `message`，不得表示 API 是否成功或 invalid query 是否正確。
- 不得把此 lookup 契約泛化成所有 API 的通用規則，或暗示 catalog 能翻譯任意 raw text。

### Open Construction Decisions

下游 Graphic Construction 仍需決定：如何在具體畫面中同時讓「兩條追蹤各自獨立」與「Consumer、catalog、lookup rule 共享」可辨識；共同案例與共同 envelope 如何分組；兩組完整 exact value 與 outcome 的文字層級；lookup 與 outcome 的具體連接方式；以及所有座標、尺寸、幾何、容器細節、連線路徑、字體、色彩、視覺重量與揭露方式。此規格不預先決定上述構造。

## 3. Representation Specification B

### Strategy

**共享規則下的雙紀錄關係對照（shared-rule relational comparison）**：把兩個 response 表示成兩筆不可合併的案例紀錄，以同一組語意欄位對齊比較 invariant、`message` 語意、lookup、catalog result 與 Consumer outcome。共享的 Consumer／catalog／lookup rule 是跨兩筆紀錄的單一關係定義，不是每筆紀錄各自擁有一套規則。

### Representational Principle

以欄位對齊與關係約束表示差異：每個 response 都以同一組必要語意欄位成為一筆獨立紀錄；共同 envelope 欄位表達不變量，`message` role/value、catalog membership 與 outcome 欄位表達差異。兩筆紀錄都引用一個共同的 lookup rule，讓觀眾由並列的關係對照理解「同規則、不同輸入、不同結果」，而不是由執行先後理解流程。

### Representational Units

- 一個共同案例識別單元：`?fromDate=2026-01-01` 且缺少 `toDate`，連結到兩筆 response 紀錄。
- 兩筆獨立 response 紀錄：`AI-direct response` 與 `Project-convention response`；兩筆都保留 HTTP `400`、`code: INVALID_QUERY`、`data: null` 與各自的 `message`。
- 一組共同 envelope 欄位：明確標示兩筆紀錄的 `400`、`INVALID_QUERY`、`data: null` 相同。
- 一個共享契約單元：`Existing error Consumer` 的規則「以 `message` 查 `MESSAGE_CATALOG`」。
- 一個共享 catalog 對應單元：`m0001 → 查詢條件不合法`，另有「無此 key → `Unknown message code`」的 miss 關係。
- 每筆 response 各自的一組對照欄位：`message` exact value、語意角色、lookup membership/result 與 Consumer outcome。

### Semantic Mapping

- 共同案例識別單元對應同一個 invalid query；兩筆 response 紀錄分別是同一輸入產生的 `AI-direct` 與 `Project-convention` response。
- 兩筆紀錄的共同 envelope 欄位都映射到 HTTP `400`、`code: INVALID_QUERY`、`data: null`，用同值約束表達 API 層結果相同；它們仍是兩筆紀錄，不是一筆合併 response。
- `AI-direct` 紀錄的 `message` value 是 `fromDate and toDate must be supplied together`，role 是 raw error detail；在共同 lookup rule 下，它不屬於 `MESSAGE_CATALOG` 的 key，故 lookup 為 miss，Consumer outcome 是 `Unknown message code`、`incompatible`、`consumed: null`。
- `Project-convention` 紀錄的 `message` value 是 `m0001`，role 是 message catalog key；在同一 lookup rule 下，它命中共同 catalog entry `m0001 → 查詢條件不合法`，Consumer outcome 是 `compatible`、`displayMessage: 查詢條件不合法`。
- `code: INVALID_QUERY` 與 `message` 是兩個並列的 response 欄位；對照中的 `message` 差異不得被表示成由 `code` 推導而來。

### Shared Rule

跨兩筆紀錄只保留一個共享契約定義：`Existing error Consumer` 對每筆紀錄的 `message` 套用同一條 `message → MESSAGE_CATALOG` lookup rule，使用同一個 `MESSAGE_CATALOG`。規則關係必須能同時指向兩筆紀錄，但每筆紀錄仍保有自己的 lookup input、hit/miss 與 outcome；不得因對齊而複製 Consumer，也不得因共享而合併兩個 `message`。

### Interpretation Constraints

- 兩筆紀錄的並列或對齊只表示可比較，不表示時間序列、資料串接、二選一或合併輸入。
- 共同 envelope 欄位必須維持相同：不得讓對照看起來是 HTTP status、`code` 或 `data` 造成結果差異。
- `AI-direct` 的 raw text 與 `Project-convention` 的 `m0001` 必須保留不同 semantic role；不得將它們表示為同義值或同一種資料型態的外觀變體。
- 兩筆紀錄必須引用同一個 Consumer、同一個 catalog 與同一條 lookup rule；不得暗示存在兩個 Consumer 或兩個 catalog。
- `m0001` 的 hit 是 catalog membership 關係，不是 catalog 將 raw text 翻譯成 key；raw text 的 miss 也不得被表示成可容錯翻譯。
- `compatible`／`incompatible` 是 Consumer compatibility 結果，不是 API success／failure 或 error classification 結果。
- 不得把本案例的共同規則提升成所有 API 或所有 raw message 的通用契約。

### Open Construction Decisions

下游 Graphic Construction 仍需決定：兩筆紀錄與共同契約定義的具體層級與分組方式；哪些欄位直接並列、哪些共同資訊集中表達；`MESSAGE_CATALOG` entry 與 miss/hit 關係的具體放置方式；如何讓共享 rule 同時約束兩筆紀錄而不造成複製或合併誤讀；以及所有座標、尺寸、幾何、容器、連線、字體、色彩、視覺重量與揭露方式。此規格不預先完成表格或完整 composition。

## 4. Handoff Self-check

- **實質原理差異：** A 以「同一規則對兩個輸入的分別執行與結果因果鏈」表示；B 以「兩筆獨立紀錄在共同欄位與關係欄位上的對齊比較」表示。差異不是位置、方向、顏色或外框變體。
- **語意保留：** A、B 都保留同一個 invalid query、兩個 exact `message` value、各自的語意角色、共同 HTTP `400`／`INVALID_QUERY`／`data: null`、同一 Consumer、同一 `MESSAGE_CATALOG`、同一 lookup rule、`m0001 → 查詢條件不合法`、raw text miss、`Unknown message code`／`incompatible`／`consumed: null`，以及 `m0001` hit、`compatible`／`displayMessage: 查詢條件不合法`。
- **對下游 Construction 的約束：** A 必須構造出兩條獨立但套用同一規則的語意追蹤；B 必須構造出兩筆獨立紀錄與一個跨紀錄共享規則。兩者都不得複製 Consumer／catalog、合併 message 或改變 lookup 語意。
- **仍未決的 Construction：** 兩種策略都尚未決定具體幾何、座標、尺寸、容器、路徑、文字排版、視覺編碼、完整 composition 與揭露順序；B 也尚未決定具體欄位的視覺排列，A 也尚未決定具體追蹤路徑。
- **表示意圖是否需猜測：** 策略原理、必要單元、共享規則與語意約束已明示，不應需要下游猜測「為何共用 Consumer」或「為何結果不同」。下游仍需自行完成的是上述 Construction 決策，而非補推表示語意。

本文件只建立兩個候選表示策略；尚未評選優勝方案，也未驗證下游交接是否成功。實際交接與後續比較留待指定的下一個研究步驟。

## 5. Construction Handoff Record

### A｜Shared-rule dual trace

- **Inherited Decisions：** 保留同一 `Invalid query request`、兩個獨立 response、共同 `HTTP 400`／`code: INVALID_QUERY`／`data: null`、同一個 `Existing error Consumer`、同一個 `MESSAGE_CATALOG` 與同一條 `message → MESSAGE_CATALOG` lookup rule。兩條 trace 分別保留 raw text／catalog miss／`Unknown message code`／`incompatible`／`consumed: null`，以及 `m0001`／catalog hit／`compatible`／`displayMessage: 查詢條件不合法`。
- **Construction Decisions：** 以同一大小的左側構造區域放置共同 query card、兩張 response card、單一共享 rule card、單一 catalog card 與兩張 outcome card。由兩個 response 的 `message` 分別以方向線進入共享 rule，再以標示為 trace A／B 的分流連線對應 catalog miss／hit 與各自 outcome；共同 envelope 在兩張 response card 中重複列出以維持每筆 response 的完整性。

### B｜Shared-rule relational comparison

- **Inherited Decisions：** 保留同一 query、兩筆不可合併的 response record、對齊的共同 envelope、各自的 exact `message` value 與 semantic role、同一 Consumer／catalog／lookup rule、`m0001 → 查詢條件不合法`、miss／hit 與各自 Consumer outcome。`compatible`／`incompatible` 僅作為 Consumer compatibility 結果。
- **Construction Decisions：** 以同一大小的右側構造區域放置兩個等寬、同欄位順序的 response record，將 API envelope、message role/value、lookup result 與 Consumer outcome 作垂直對齊；在下方放置單一 shared contract card，以虛線參照連接兩筆 record，不使用流程箭頭，維持「欄位對照」而非「執行順序」的讀法。

### Handoff Gaps、假設與 blocker

- 規格未決定座標、尺寸、文字換行、容器樣式、連線路徑、共享單元的具體位置與文字層級；本次由 Construction 自行決定上述幾何與排版。
- 小型假設：兩個策略各使用一個 760×862 的 panel，整張 Study Sheet 為 1600×1000；統一採 Arial／Noto Sans 系列與灰階；raw text 在必要處換成兩行。A 將共享 Consumer／catalog 集中成單一節點，B 將共享契約置於兩筆 record 下方；這些是假設性的具體構造，不改變表示策略或語意限制。
- 未發現需要修改 Representation Strategy 或 Semantic Constraints 的 blocker；本次未重新選擇表示策略、未評選方案，也未形成 Separate／Retain／Defer 判定。

### Artifact Verification

- **Artifact Evidence：** `comparison.svg` 的實際尺寸為 `1600×1000`、`viewBox="0 0 1600 1000"`；以 Playwright Chromium headless、viewport `1600×1000`、device scale factor `1` 載入 SVG 產生 `comparison.png`。SVG 載入無 page error／console error，頁面內含 88 個文字節點。
- **Visual Check：** 檢視 fresh render 後，未見文字溢出、畫布裁切、非預期重疊；A 的方向連線未穿越主要文字，B 的虛線參照未被構造成流程箭頭。此為構造檢查，不等同於觀眾理解已被驗證。
- **Fresh Render Check：** fresh SVG render 的 PNG 與交付 PNG 均為 `1600×1000`、8-bit RGB、non-interlaced；兩者 SHA-256 同為 `c16887971641f0fb70fcda30562ca0080bcd4c04ccf069a67700fe4f2c480456`。
