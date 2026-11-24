# Step 5-R1.2 Visual Storyboard｜Slide 4–5

本文件是 Slide 4、5 的 Visual Storyboard，不是 HTML、CSS、Slidev 或
`v-click` 實作規格。本輪只重新安排資訊的出現順序與視覺焦點；不修改
Slide Copy、Story Spine、案例 SSOT、既有 Preview、PNG 或 Speaker Notes。

## 使用基準與設計決定

- **內容基準**：整合分支的 `docs/presentation-plan.md`、已核准的
  `docs/slide-copy.md`。
- **案例基準**：PR #13 固定 revision
  `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329`；只使用該 revision 的 Order API、
  message catalog、既有 Consumer 與 Browser evidence。
- **現況基準**：`ai-engineering-talk-step5-preview/index.html`、
  `slide-03.png`、`slide-04.png`、`slide-05.png`、`design-review.md`。
- **視覺原則**：沿用 `presentation-creator/references/visual-design.md` 的亮室
  Crystal Light 方向；以尺度、留白與單一焦點建立層級，讓 supporting 內容淡化，
  讓 evidence／metadata 保持可追溯但不搶主訊息。
- **Reveal 原則**：每個 state 是一個可講述的畫面狀態。後一個 state 可以取代
  前一個 state，不預設所有卡片、欄位與註解都要累積留在畫面上。

## 整體敘事功能

Slide 3 已經提出「能執行，是否就代表能交付？」。Slide 4 不急著回答整個問題，
先建立一個必要的正面基線：這個交辦確實能得到成功結果。Slide 5 再用同一個案例
把視線拉到錯誤路徑，讓觀眾看到「結果能回來」與「既有 Consumer 能使用」之間
仍然有契約差異。Slide 6 才接著把這個差異擴展到內部命名、責任與分層。

因此兩頁的閱讀路徑是：

```text
Slide 4：交辦／輸入 → 成功回應 → 成功仍只是局部驗證
Slide 5：共同錯誤輸入 → message 分歧 → 既有 Consumer 相容性分歧
```

---

## Slide 4｜交辦一支訂單查詢 API，功能確實能跑

### A. Visual Intent

- **本頁唯一主要訊息**：功能路徑可以成功，但這只證明成功路徑可執行，尚不
  等於所有交付條件都已被驗證。
- **觀眾先理解**：有人交辦一支訂單查詢 API，並以 `?pageSize=3` 發出查詢；
  交辦包含狀態、UTC 日期區間、分頁與總筆數。
- **觀眾最後理解**：結果是可讀且可重現的成功資料，但它仍是 Browser MSW
  執行的合成案例；下一個要問的不是「有沒有回應」，而是「回應是否符合既有
  Consumer 的契約」。
- **與前後頁的關係**：承接 Slide 3 的疑問，先讓「能跑」成立，再把 Slide 5
  的錯誤 response／UI contract 問題準備好。這頁不提前展示內部架構、SQL 或
  Consumer 細節。

### B. Information Hierarchy

| 層級 | 必須保留的內容 | 視覺處理與出現時機 |
| --- | --- | --- |
| **Primary** | 交辦：新增訂單查詢 API；請求 `?pageSize=3`；`HTTP 200`；`code: "OK"`；`message: "m0000"`；訂單 ID `[42, 35, 28]`；`totalCount: 42` | 依 Reveal Sequence 先後出現。一次只讓「交辦／query」或「成功 response」成為大焦點。成功 response 的 `HTTP 200` 與資料結果是本頁最強的視覺重量。 |
| **Supporting** | 支援狀態、UTC 日期區間、分頁與總筆數；同一個查詢在 AI-direct 與 Project-convention 都回傳同一組成功資料 | 第一個 state 只保留一行交辦上下文；第二個 state 之後才以小型 variant label 說明兩種實作的共同結果，不與 response 競爭。 |
| **Evidence／Metadata** | `SYNTHETIC · BROWSER MSW`；`STATIC EVIDENCE`；Chromium、受限 SQL evaluator、固定 fixtures；不是外部 API Server，也不是真實資料庫執行證據；PR #13 與固定 revision／source links | provenance 以小型固定標籤或 footer 保留；限制說明只在最後一個 state 展開成可讀的兩至三行，不放大成第二個主卡片。revision 與 source links 保持可追溯，但不佔主要閱讀路徑。 |
| **Spoken／Deferred** | 為什麼「成功」仍不能直接推論「可交付」；Browser MSW／合成案例的限制如何影響證據強度；下一頁會檢查錯誤 response 與 Consumer | 由講者在第三個 state 說明；畫面只保留一句收束語與必要 limitation，不放 SQL evaluator 的細節或完整測試矩陣。 |

### C. Reveal Sequence

#### State 1｜先看交辦與輸入

- **觀眾此刻應理解的事情**：這不是抽象 API 圖，而是一個具體交辦；先確認
  查詢要支援什麼，以及現在送出的 query 是什麼。
- **主要視覺焦點**：`新增訂單查詢 API` 與大尺寸的 `?pageSize=3`。
- **顯示哪些資訊**：保留頁面 headline、Chapter label、簡短 brief：
  「支援狀態、UTC 日期區間、分頁與總筆數。」保留小型
  `SYNTHETIC · BROWSER MSW` provenance 標籤，避免觀眾誤把後續畫面當成真實
  外部服務證據。
- **保留、淡化、隱藏或取代**：
  - 保留交辦與 query；query 是此 state 唯一的大型 code-like 元素。
  - 成功 response、`HTTP 200`、資料結果、兩種 variant 暫時隱藏。
  - 不顯示 `STATIC EVIDENCE` 或長 limitation；它們屬於結果出現後的證據說明。
- **銜接下一個 state**：講者指出「現在看它實際回傳什麼」，交辦卡被取代或
  收縮成 response 上方的一條 query breadcrumb。

#### State 2｜成功回應成為唯一主焦點

- **觀眾此刻應理解的事情**：同一個 `?pageSize=3` 確實得到成功回應，而且
  成功資料的形狀清楚可讀。
- **主要視覺焦點**：中央或偏右的大型 success response；視覺重量依序是
  `HTTP 200` → `code: "OK"`／`message: "m0000"` → `[42, 35, 28]`／`42`。
- **顯示哪些資訊**：
  - 上方以小字保留 query breadcrumb：`?pageSize=3`。
  - 以一個 response composition 顯示 `HTTP 200`、`code: "OK"`、
    `message: "m0000"`。
  - 將 `data` 拆成兩個大而少量的值：`order IDs [42, 35, 28]` 與
    `totalCount: 42`。
- **保留、淡化、隱藏或取代**：
  - State 1 的 capability sentence 被隱藏或降成很小的 brief label；不讓它
    與 response 同時爭取閱讀焦點。
  - `AI-direct` 與 `Project-convention` 先不做兩張並列卡片，只在 response
    下方留一行小型提示：「同一個查詢，兩種實作回傳同一組成功資料」。
  - `STATIC EVIDENCE` 可作為 response 的小型標籤；長 limitation 仍先隱藏。
- **銜接下一個 state**：講者確認「能跑」已成立，再問「這組結果的證據邊界
  是什麼，以及是否已驗證交付相容性？」response 詳細欄位被壓縮成摘要。

#### State 3｜把成功結果放回證據邊界

- **觀眾此刻應理解的事情**：成功結果是有效的案例證據，但證明範圍只到合成的
  functional path；它不能自動證明真實 API Server、真實資料庫或完整交付契約。
- **主要視覺焦點**：一句收束語：**功能路徑成功，交付條件仍待驗證。** 收束語
  下方保留精簡 success summary，而不是再展開完整 response。
- **顯示哪些資訊**：
  - `HTTP 200 · OK · m0000` 與 `[42, 35, 28] · totalCount: 42` 的單行摘要。
  - 小型 `AI-direct`、`Project-convention` labels，旁邊只保留「同一組成功
    資料」的語意。
  - 可讀但低權重的 Evidence Limit：Chromium 內 Browser MSW 的合成案例，
    底層為受限 SQL evaluator 與固定 fixtures；不是外部 API Server，也不是
    真實資料庫執行證據。
- **保留、淡化、隱藏或取代**：
  - State 2 的完整 status card、field stack、data card 全部由 summary 取代，
    不再讓數字與限制文字形成多個同等大的區塊。
  - provenance／revision 維持在 footer 或 metadata，不在主畫面重複 PR #13
    的連結文字。
  - 「下一頁檢查 `message` 與既有 Consumer」是講者的 transition，不需要再
    變成一個新卡片。
- **銜接下一頁**：從「成功 response 的摘要」切到同一案例的錯誤 query；Slide 5
  將 response 中唯一尚未被驗證的相容性問題放大為 `message` contract。

### D. End State

最後畫面只保留三個層次，且每個層次服務同一個結論：

```text
功能路徑成功，交付條件仍待驗證。

HTTP 200 · code: "OK" · message: "m0000"
order IDs [42, 35, 28] · totalCount: 42

AI-direct + Project-convention：同一組成功資料
Evidence limit：Browser MSW 合成案例；非外部 API Server／真實資料庫證據
```

它不會重新變得擁擠，原因是：

1. 交辦的完整說明已在 State 1 完成任務，不在 End State 重複。
2. response 的欄位細節已在 State 2 完成任務，End State 只留下足以支撐結論的
   摘要。
3. 兩個實作名稱只作為共同結果的 metadata；不是兩張新的比較卡片。
4. evidence limitation 是一個短 footer，而不是與成功 response 並列的第二個
   故事。

### E. Review

- **資訊順序**：交辦／query → 成功 response → 成功證據的邊界，順序單一且
  不需要觀眾自行在左右欄來回拼接。
- **競爭焦點**：每個 state 只有一個大焦點；`HTTP 200`、結果數字、限制說明
  不會同時被做成三個大型 card。
- **講者配合**：三個 state 對應「交辦」「它能跑」「但先不要把它當完整交付」
  三個口語節拍；state 間可用取代式 reveal，講者不必等待畫面累積完所有欄位。
- **不必要細節**：本頁不展示 SQL、資料庫 schema、完整 test matrix 或內部
  module chain；這些不屬於 Slide 4 的唯一訊息。
- **正確性**：保留 `?pageSize=3`、`HTTP 200`、`OK`、`m0000`、`[42, 35, 28]`、
  `totalCount: 42`、兩種實作相同成功資料，以及 Browser MSW／受限 SQL evaluator／
  固定 fixtures 的限制；沒有把合成案例說成真實後端或資料庫證據。

---

## Slide 5｜`message` 不是自由文字，而是既有 UI 契約

### A. Visual Intent

- **本頁唯一主要訊息**：同一個錯誤 response 若把 `message` 當自由文字，既有
  Consumer 可能無法解析；只有符合既有 message-code 契約的回應能被 Consumer
  正確使用。
- **觀眾先理解**：兩種路徑面對的是同一個錯誤輸入與同一個錯誤 envelope：
  `?fromDate=2026-01-01` 缺少 `toDate`，回傳 `HTTP 400`、`code: "INVALID_QUERY"`、
  `data: null`。
- **觀眾最後理解**：差異集中在 `message`：AI-direct 的 detail 文字導致既有
  Consumer 得到 `Unknown message code`；Project-convention 的 `"m0001"` 則
  被解析為「查詢條件不合法」。
- **與前後頁的關係**：承接 Slide 4 的成功 baseline，把問題縮小到 response
  contract；接往 Slide 6 時，再從對外 `message` contract 放大到內部命名與
  責任分層。這頁不提前展示完整架構路徑。

### B. Information Hierarchy

| 層級 | 必須保留的內容 | 視覺處理與出現時機 |
| --- | --- | --- |
| **Primary** | 錯誤輸入 `?fromDate=2026-01-01`（缺少 `toDate`）；共同 `HTTP 400`、`code: "INVALID_QUERY"`、`data: null`；兩種 `message` 值；既有 Consumer 的 incompatible／compatible 結果 | 依序從共同 envelope → message 分歧 → Consumer 結果出現。每個 state 只把當前因果節點放大。 |
| **Supporting** | `AI-direct` 與 `Project-convention` 名稱；`message · detail` 與 `message · code` 的差異；「同一錯誤輸入、共同 response envelope」 | 用兩條 lane 的小型標籤支撐比較；不將實作名稱、欄位標籤與 outcome 做成三層同等大的標題。 |
| **Evidence／Metadata** | `"fromDate and toDate must be supplied together"` 的完整 detail；`"m0001"`；既有 Consumer 使用 message catalog 對照到「查詢條件不合法」；PR #13、固定 revision `e8ae8ad3`、Browser MSW 合成案例限制與 source links | 完整 detail 在 message state 顯示一次並允許自然換行；catalog／revision／Browser MSW 以小型 evidence line 或 footer 保留，避免把 source metadata 變成第三個主故事。 |
| **Spoken／Deferred** | 為什麼 `code: "INVALID_QUERY"` 相同仍不足以保證 UI 相容；Consumer 如何使用預載 catalog；這不是 AI-direct 與 Project-convention 的一般優劣評比，而是案例中的既有契約差異 | 由講者補足因果解釋；畫面保留可驗證的輸入、欄位、輸出與 Consumer 結果，不展開完整 `message-catalog.ts` 或 Consumer 原始碼。 |

### C. Reveal Sequence

#### State 1｜共同錯誤先固定比較基準

- **觀眾此刻應理解的事情**：兩條路徑收到完全相同的 invalid query，並產生
  相同的 HTTP error envelope；目前還沒有比較兩種 `message` 的語意。
- **主要視覺焦點**：一條橫向的 common error path：
  `?fromDate=2026-01-01` → **缺少 `toDate`** → `HTTP 400`。
- **顯示哪些資訊**：
  - headline 與小型 `PR #13 · e8ae8ad3` metadata。
  - shared input：`?fromDate=2026-01-01`，明確標記「缺少 `toDate`」。
  - response envelope：`HTTP 400`、`code: "INVALID_QUERY"`、`data: null`。
- **保留、淡化、隱藏或取代**：
  - 只顯示共同輸入與共同 envelope；`AI-direct`、`Project-convention` 的
    message 內容與 Consumer 結果暫時隱藏。
  - 不在此 state 顯示完整英文 detail，避免觀眾過早讀文字而錯過共同基準。
  - Browser MSW／合成案例 provenance 留在低權重 footer 或頁面 metadata。
- **銜接下一個 state**：講者說「真正的差異藏在 `message`」，共同 envelope
  收縮成上方 breadcrumb，畫面焦點移到欄位分歧。

#### State 2｜只放大 `message` 的分歧

- **觀眾此刻應理解的事情**：兩個 response 的 HTTP status 與 error code 相同，
  但 `message` 的語意不同：一個是 detail 文字，一個是既有代碼。
- **主要視覺焦點**：中央的兩條 message lane：
  - **AI-direct**：`"fromDate and toDate must be supplied together"`
  - **Project-convention**：`"m0001"`
- **顯示哪些資訊**：
  - 上方保留縮小的共同基準：`HTTP 400 · INVALID_QUERY · data: null`。
  - 兩條 lane 各只保留實作名稱、`message` label、實際 message 值。
  - 可用小型 semantic tag 標出 `message · detail` 與 `message · code`，但
    不再重複完整 response envelope。
- **保留、淡化、隱藏或取代**：
  - State 1 的 input 可縮成左上角 breadcrumb；不再以大卡片重複。
  - Consumer outcome 暫時隱藏，讓觀眾先看見「欄位值不同」這個因果前件。
  - 完整英文 detail 只在此 state 出現一次；不得改寫成較短但語意不同的句子。
- **銜接下一個 state**：講者追問「哪一種值是既有 Consumer 會理解的？」兩條
  message lane 被壓縮為上游小 chip，下方的 Consumer 結果取代主要畫面。

#### State 3｜讓既有 Consumer 成為裁判

- **觀眾此刻應理解的事情**：相同 error code 不保證 UI 相容性；既有 Consumer
  依 `message` 的既有語意解析，因此兩條路徑的可用結果不同。
- **主要視覺焦點**：`既有 Consumer` 的兩個明確結果：
  - AI-direct → **無法解析：`Unknown message code`**
  - Project-convention → **解析成功：查詢條件不合法**
- **顯示哪些資訊**：
  - 頂部只保留共同比較基準的 slim strip：`?fromDate=2026-01-01`、
    `HTTP 400`、`INVALID_QUERY`。
  - 每個 outcome 上方保留一個小型上游 chip：AI-direct 的 detail、
    Project-convention 的 `m0001`。
  - 以一個共同標題「既有 Consumer」把兩個結果收束成同一個驗收點。
- **保留、淡化、隱藏或取代**：
  - State 2 的完整 message card 被取代為小型 chip；完整英文 detail 已在前一
    state 完成證據任務，不再佔主畫面。
  - `Unknown message code` 與「查詢條件不合法」是最後一個 state 的最大文字，
    但兩者放在同一個 consumer layer，避免觀眾把差異誤讀成兩個獨立案例。
  - catalog 的完整代碼表、Consumer 原始碼、source links 不在畫面展開。
- **銜接下一頁**：講者將「既有 UI contract」往內部追問：除了 message，命名、
  責任與分層是否也存在同樣的既有約定？交給 Slide 6。

### D. End State

最後畫面採用一條簡化的因果結構，而不是把 State 1、2、3 的所有卡片同時留下：

```text
共同輸入／共同 envelope
?fromDate=2026-01-01（缺少 toDate） · HTTP 400 · INVALID_QUERY · data: null

message 分歧
AI-direct：detail 文字       Project-convention："m0001"
       ↓                              ↓
既有 Consumer
Unknown message code       查詢條件不合法（解析成功）
```

它不會重新變得擁擠，原因是：

1. 共同輸入與 envelope 只留一條 slim context strip，不重複出現在兩張完整卡片
   裡。
2. 完整英文 detail 只在 State 2 出現；End State 使用上游 chip 保留其角色，
   把最大視覺重量留給 Consumer 的相容性結果。
3. `code: "INVALID_QUERY"` 與 `data: null` 只作共同基準，不與
   `Unknown message code`／「查詢條件不合法」競爭。
4. 結論是單一因果：**同一錯誤輸入 → message 語意不同 → 既有 Consumer 結果
   不同**；沒有再加入架構、測試或資料庫支線。

### E. Review

- **資訊順序**：共同輸入／共同 envelope → `message` 分歧 → Consumer 解析結果；
  觀眾不需同時閱讀整張 response table 才能理解因果。
- **競爭焦點**：每個 state 只有一個閱讀任務；State 2 不顯示 outcome，State 3
  不再顯示完整 message cards，避免 raw detail、code 與結果同時搶焦點。
- **講者配合**：三個 state 對應「一樣的錯誤」「差在 message」「Consumer
  判定相容性」；講者可以在每次轉場時說出因果，而不是指著靜態表格逐格解讀。
- **不必要細節**：不展示完整 catalog、Consumer 原始碼、完整測試程式或架構
  chain；它們保留在 Evidence／source links，不擴張本頁範圍。
- **正確性**：保留缺少 `toDate` 的 exact input、`HTTP 400`、`INVALID_QUERY`、
  `data: null`、AI-direct 的 exact detail、Project-convention 的 `"m0001"`、
  `Unknown message code`、`查詢條件不合法`，以及 PR #13 固定 revision 與
  Browser MSW 合成案例限制；沒有把案例改寫成一般化的 AI 品質評比。

---

## 相對於舊靜態原型的實質改變

| 面向 | 舊原型 | 本輪 Storyboard |
| --- | --- | --- |
| **閱讀模型** | Slide 4 以 brief card 與完整 success panel 並列；Slide 5 同時顯示 shared input、兩張 message card 與 Consumer outcome | 兩頁都改為「一條因果路徑」；state 間允許取代，不把所有資訊當成永久累積層。 |
| **Slide 4 焦點** | 交辦、query、status、response fields、資料、兩種實作、provenance 與 limitation 同時可見 | 先看交辦／query，再看成功 response，最後才看兩種實作共同結果與 evidence boundary。 |
| **Slide 4 收束** | 成功結果與 limitation 在同一個 panel 內並列，主訊息需由觀眾自行推論 | 以「功能路徑成功，交付條件仍待驗證」作收束；詳細 response 被摘要化，為 Slide 5 留出問題入口。 |
| **Slide 5 焦點** | 觀眾需在兩張 response card 與底部 outcome 區來回比對 | 先固定共同 error envelope，再單獨放大 `message` 分歧，最後讓 Consumer outcome 成為裁判。 |
| **Slide 5 比較方式** | detail、code、Consumer result 同時出現，容易形成多個水平閱讀起點 | message 值在 State 2 出現一次；State 3 只保留小型上游 chip，將最大重量移到 incompatible／compatible 結果。 |
| **Evidence 位置** | provenance、revision、限制與主要內容靠近，容易被誤看成同等重要 | Evidence／metadata 仍保留，但以 tag、footer、slim context 或 source note 降低視覺權重；必要事實不刪除。 |
| **講者節奏** | 靜態畫面需要講者自行指出「先看哪裡」 | 每頁 3 個 state 對應清楚口語節拍，並以取代式 reveal 支援逐步說明。 |

## 尚待人工決定的問題

1. **實際 click 數與觸發時機**：本 storyboard 建議每頁 3 個 state；人工需要
   決定是否每個 state 各用一次 click，或將 Slide 4 的 State 1／2 合併以配合
   35–40 分鐘的總節奏。
2. **End State 的收束語是否上屏**：人工需要決定「功能路徑成功，交付條件仍待
   驗證」是否作為正式畫面文字，或只由講者說出；若上屏，需維持它是唯一收束
   語，不再新增副標。
3. **Evidence limit 的固定位置**：需在視覺原型階段決定它固定在頁面 footer、
   response 下方，或僅在最後 state 顯示；同時確認亮室投影下仍可讀，但不能
   回到原本的第二主卡片。
4. **Slide 5 detail 的換行與字級**：必須保留
   `"fromDate and toDate must be supplied together"` 原文；人工需要在原型
   階段確認兩行換行、字級與 lane 寬度，不得以省略號取代必要內容。
5. **Metadata 的可見程度**：需決定 PR #13 與完整 revision 是否留在投影片
   footer、speaker notes 或 preview-only evidence；無論選哪一種，正式交付仍需
   保持可追溯性。
6. **正式 Slidev 的實作方式**：本輪尚未決定使用 `v-click`、狀態切換或獨立
   slide 的實作；這應在人工審查 storyboard 通過後另行決定，不在本輪提前實作。

## 本輪停止點

本文件完成 Slide 4、5 的 Visual Intent、Information Hierarchy、Reveal Sequence、
End State 與 Review。依工作範圍，本輪到此停止；不進入 HTML／CSS、PNG、Slidev、
`v-click`、Slide 3、Slide 6–32、Commit 或 PR。
