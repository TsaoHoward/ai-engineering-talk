# S04｜D3.2 Object Matching

## 物件命名

以下名稱是三個理解狀態之間固定使用的物件識別。`AI-direct response` 與 `Project-convention response` 始終是兩個獨立 response 物件；`Response comparison frame` 只是比較容器，不代表一個 response instance。

| ID | 穩定物件名稱 | 辨識特徵與角色 | State 1 | State 2 | State 3 |
| --- | --- | --- | --- | --- | --- |
| O1 | `Same invalid request` | 同一個 `?fromDate=2026-01-01`、`toDate` 缺失的案例錨點 | 可見 | 保留 | 保留為共同案例錨點 |
| O2 | `Response comparison frame` | 容納兩個 response 與共同 error envelope 的比較容器；不是 response 本身 | 可見 | 保留 | 保留，作為 lookup 前的比較基準 |
| O3 | `AI-direct response` | `AI-direct` 身分、獨立 response card、左側／A 比較身份 | 可見；message 只顯示為未揭露欄位 | 保留；顯示 raw text | 保留；作為 raw-text lookup 的來源 |
| O4 | `Project-convention response` | `Project-convention` 身分、獨立 response card、右側／B 比較身份 | 可見；message 只顯示為未揭露欄位 | 保留；顯示 `m0001` | 保留；作為 message-code lookup 的來源 |
| O5 | `Common error envelope` | 每個 response 共同的 `HTTP 400`、`code: INVALID_QUERY`、`data: null` | 可見 | 保留 | 保留為精簡比較錨點 |
| O6 | `Message field A / B` | 兩個 response 各自的 `message` 欄位；A 與 B 不合併 | A/B 槽位可見但值未揭露 | A = raw text；B = `m0001` | 保留為兩條 lookup 的輸入 |
| O7 | `Existing error Consumer` | 同一個既有 Consumer；將每個 `message` 當作 catalog key | 尚未加入 | 尚未加入 | 加入為共同 lookup 邊界 |
| O8 | `Message catalog` | `MESSAGE_CATALOG` 與 `m0001 → 查詢條件不合法` entry | 尚未加入 | 尚未加入 | 加入為共同查表目標 |
| O9 | `AI-direct lookup lane` | A 的 `raw text → catalog miss → incompatible` 因果鏈 | 尚未加入 | 尚未加入 | 加入，含 `Unknown message code`、`consumed: null` |
| O10 | `Project-convention lookup lane` | B 的 `m0001 → catalog hit → compatible` 因果鏈 | 尚未加入 | 尚未加入 | 加入，含 `displayMessage: 查詢條件不合法` |

## State 1 → State 2

### 轉換焦點與比較基準

主要注意力由 `Common error envelope` 轉向兩個獨立 response 中的 `Message field A / B`。轉換後仍需能直接辨識：同一個 `Same invalid request`、兩個 response 的 `AI-direct`／`Project-convention` 身分，以及兩者相同的 `HTTP 400 / INVALID_QUERY / data: null`。State 1 的 message 槽位不可填入或預示任何真實回傳值。

| Object | Before | Operation | After | Invariant |
| --- | --- | --- | --- | --- |
| O1 `Same invalid request` | 同一個缺少 `toDate` 的 invalid query，作為兩個 response 的共同來源 | Persist | 同一案例錨點仍在場 | query 值、缺失欄位與同一案例身份不變 |
| O2 `Response comparison frame` | 比較容器同時承載共同欄位與兩個待比較 response | Reframe | 比較注意力由共同欄位移向 response 的 `message` 差異 | 容器仍只是比較框架，不暗示兩個 response 是同一 instance |
| O3 `AI-direct response` | 已標示 `AI-direct` 的獨立 response；`message` 僅為未揭露欄位 | Persist | 同一個獨立 response 顯示其 `message` 為 raw text：`fromDate and toDate must be supplied together` | `AI-direct` 身份、response 獨立性與共同 error envelope 不變 |
| O4 `Project-convention response` | 已標示 `Project-convention` 的獨立 response；`message` 僅為未揭露欄位 | Persist | 同一個獨立 response 顯示其 `message` 為 `m0001`，並標為 message code／catalog key | `Project-convention` 身份、response 獨立性與共同 error envelope 不變 |
| O5 `Common error envelope` | 兩個 response 共同持有 `HTTP 400`、`INVALID_QUERY`、`data: null` | Persist | 共同欄位仍作為 message 比較的固定基準 | 不得因 message 值不同而暗示 HTTP status、API error code 或 data 不同 |
| O6 `Message field A / B` | A/B 只有欄位存在，實際值延後揭露 | Update | A 更新為 raw text；B 更新為 `m0001`；兩欄仍分屬 O3/O4 | A 與 B 的 response 歸屬、欄位名稱 `message` 及兩種值的不同語意維持 |

## State 2 → State 3

### 轉換焦點與比較基準

主要注意力由「兩個 `message` 值的差異」轉向「同一 Consumer 如何解析兩個值」。O3、O4、O5、O6 不消失：它們提供兩條 lookup lane 所需的來源、值與共同 API 基準；新增的 O9 與 O10 必須保持左右／A-B 對應，不能將兩條結果合併為一條成功／失敗流程。

| Object | Before | Operation | After | Invariant |
| --- | --- | --- | --- | --- |
| O1 `Same invalid request` | 作為兩個 response 的共同案例錨點 | Persist | 仍可回溯兩條 lookup 都來自同一 invalid query | query、缺失 `toDate` 與案例身份不變 |
| O2 `Response comparison frame` | 以並列 response 比較 `message` 值 | Reorganize | 同一比較容器上方保留 response，下方承接 Consumer／catalog／兩條 lane 的關係 | O2 仍是容器；不把 O3/O4 合併為一個 response |
| O3 `AI-direct response` | 顯示 raw text 的獨立 response | Persist | 保留為 `AI-direct` 的 lookup 來源，對應 O9 | response 身份、raw text 值及 A 對應不變 |
| O4 `Project-convention response` | 顯示 `m0001` 的獨立 response | Persist | 保留為 `Project-convention` 的 lookup 來源，對應 O10 | response 身份、`m0001` 值及 B 對應不變 |
| O5 `Common error envelope` | 完整列出共同 API 屬性 | Update | 可精簡為同一輸入、`HTTP 400`、`INVALID_QUERY`、`data: null` 的比較錨點 | 共同 API error result 必須仍可與 Consumer compatibility 區分 |
| O6 `Message field A / B` | 兩個已揭露的 `message` 值並列比較 | Reorganize | A、B 分別成為 O9、O10 的 lane input；不改變欄位值 | `message` 仍是 Consumer lookup 的輸入，不由 `code` 推導 |
| O7 `Existing error Consumer` | 尚未出現 | Enter | 成為兩個 message 共同經過的 lookup 邊界，規則為 `message → MESSAGE_CATALOG` | 同一 Consumer 評估兩條 response；不表示兩個 response 是同一物件 |
| O8 `Message catalog` | 尚未出現 | Enter | 成為 O7 的共同查表目標，顯示 `m0001 → 查詢條件不合法` | catalog 只認得既有 code entry，不把 raw text 視為替代 key |
| O9 `AI-direct lookup lane` | 尚未出現 | Enter | 顯示 `raw text → catalog miss → Unknown message code → incompatible → consumed: null` | 只對應 O3／O6-A；不得改寫成 API request 失敗 |
| O10 `Project-convention lookup lane` | 尚未出現 | Enter | 顯示 `m0001 → catalog hit → compatible → displayMessage: 查詢條件不合法` | 只對應 O4／O6-B；不得改寫成 API request 成功 |

## Object matching 邊界

- 不使用 `Merge`：兩個 response、兩個 `message` 欄位與兩條 lookup lane 都必須維持可辨識的 A/B 對應。
- 不使用 `Exit` 移除共同 API 基準；State 3 只允許精簡 O5，不能刪除理解 lookup 結果所需的比較條件。
- O7–O10 是 State 3 才加入的 Consumer 因果物件；它們不在 State 1 或 State 2 以標題、標籤或空白形狀預示結果。
- 指定 revision、source evidence、Browser MSW、bounded SQL 與 fixtures 不是本段主要視覺物件，不建立跨狀態 matching。
