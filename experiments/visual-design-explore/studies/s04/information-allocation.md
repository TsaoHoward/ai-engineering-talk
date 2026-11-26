# S04｜D3.1 Information Allocation

## 分配邊界

起始理解承接 S03：觀眾已知道兩種實作都能完成正常訂單查詢。本段只把同一案例推進到錯誤 response 的 Consumer 契約；S05 從這個結論承接到內部責任與命名，不在本段重新展開。

本段的目標理解是：兩種實作對同一個 invalid query 都回傳相同的 API 錯誤結果，但 `message` 的語意不同；既有 Consumer 將它當作 message catalog key，因此兩者不具有相同的 Consumer 相容性。

以下三個狀態足以保留必要因果鏈，且讓共同基準先於差異、差異先於 Consumer 結果揭露。

## 理解狀態

| 狀態 | Understanding Goal | Visible Information | Spoken Information | Deferred Information | Retained Understanding |
| --- | --- | --- | --- | --- | --- |
| 1｜固定同一個錯誤案例與 API 基準 | 觀眾先理解：這不是兩個不同案例，也不是一條 API 成功、另一條 API 失敗；同一個 invalid query 讓兩條實作產生可比較的 error response。 | 同一輸入：`?fromDate=2026-01-01`，缺少 `toDate`；兩個 response（`AI-direct`、`Project-convention`）；各自共同欄位：`HTTP 400`、`code: INVALID_QUERY`、`data: null`；兩個 response 都有 `message` 欄位，但先只標示為待比較欄位。 | 補充這個錯誤輸入是同一個指定案例，且兩個 response 都已完成 API 層的 invalid-query 回應。提醒觀眾：接下來比較的是欄位被誰如何解讀，不是 HTTP 結果誰成功。 | 兩個 `message` 的實際值；raw text 與 message code 的語意差異；既有 Consumer、catalog lookup 與相容性結果。 | S03 已建立的「正常訂單查詢可完成」與同一案例連續性；兩種實作均可執行，不把成功查詢結果誤當成本狀態的 error response。 |
| 2｜揭露 `message` 的語意差異 | 觀眾理解：共同 error envelope 沒有改變，真正的變數是 `message`；一個值是 raw error detail，另一個值是既有 catalog key，兩者不是同義值。 | 保留狀態 1 的同一輸入與共同欄位；`AI-direct.message`：`fromDate and toDate must be supplied together`（raw text）；`Project-convention.message`：`m0001`（message code）；明示兩個 response 只有 `message` 的值／語意不同。 | 說明 `code: INVALID_QUERY` 只是 API 錯誤分類，並不自動推導 `message`；`message` 是另一個會被既有 Consumer 使用的欄位。此刻先讓觀眾辨認兩種值的型態，不先宣布哪一條相容。 | `message` 如何進入 `MESSAGE_CATALOG`；`m0001` 對應的顯示文字；raw text 查詢失敗與 code 查詢成功的 Consumer outcome。 | 狀態 1 的同一 invalid request、`HTTP 400`、`INVALID_QUERY`、`data: null`，以及兩個 response 都屬於 API 層有效錯誤結果的理解。 |
| 3｜揭露 Consumer lookup 與相容性結果 | 觀眾理解：既有 Consumer 把 `message` 視為 catalog key；raw text 無法命中而不相容，`m0001` 命中而能顯示文字。差異發生在 Consumer 契約，不是 API 錯誤狀態。 | 以同一共同基準作比較錨點：同一輸入、`HTTP 400`、`INVALID_QUERY`、`data: null`；同一個 `Existing error Consumer`；規則 `message → MESSAGE_CATALOG`；兩條結果鏈：raw text → catalog miss → `Unknown message code`／`incompatible`／`consumed: null`，以及 `m0001` → catalog hit → `displayMessage: 查詢條件不合法`／`compatible`。 | 明確區分 API error result 與 Consumer compatibility：兩條 response 都回報 invalid query，只有既有 Consumer 對 `message` 的解析結果不同。補充 message-code 是本案例既有 UI 契約，不提升為所有 API 的通用規則。 | S05 的內部責任／命名路徑；Browser MSW、bounded SQL、fixtures、source revision 與 `not rerun` 等證據限制；任何架構優劣判斷。 | 狀態 1 的共同 envelope 與狀態 2 的 `raw text`／`m0001` 對照；觀眾已知道「只有 message 語意改變」，因此可把兩條 lookup 結果理解為同一 Consumer 對同一案例的不同相容性。 |

## 狀態銜接原則

- 共同輸入與共同 error envelope 在狀態 1 建立，後續只以精簡基準保留，不要求每一狀態重複完整說明。
- `message` 的兩個值在狀態 2 才出現；Consumer 規則與結果延後到狀態 3，避免觀眾在看見差異前先把它讀成成功／失敗。
- 狀態 3 的 `compatible`／`incompatible` 僅指既有 Consumer 是否能解析 message code，不指 API 是否回傳成功，也不代表兩種實作的普遍優劣。
- 指定 revision、證據來源與 mock 邊界保留在研究文件與講者補充，不作為本段必要的觀眾可見資訊。
