# S04｜D3.4 Independent Sequence Critique

## 審查範圍與方法

本審查依播放順序實際觀看三張完整 PNG：

1. [`sequence/state-01.png`](./sequence/state-01.png)
2. [`sequence/state-02.png`](./sequence/state-02.png)
3. [`sequence/state-03.png`](./sequence/state-03.png)

判準以 [`semantic-model.md`](./semantic-model.md)、[`information-allocation.md`](./information-allocation.md) 與 [`object-matching.md`](./object-matching.md) 為準。對應 SVG 僅用來核對文字、座標與物件關係，沒有修改或重新產生任何 SVG／PNG。

以下 `Observation` 是 PNG 或 SVG 中可直接核對的現象；`Impact` 若涉及理解速度、投影距離或觀眾反應，會明確標示為尚未測試的推測。本次沒有進行觀眾測試、正式投影測試或 runtime tests，也不使用數字美學評分。

有一項輸入一致性問題會影響判斷：實際觀看的 `state-02.png` 沒有顯示同一個 invalid request 與共同 error envelope；但對應的 [`state-02.svg`](./sequence/state-02.svg) 仍包含這些物件，且其 `<desc>` 也宣稱它們保留。以下以使用者指定必須觀看的 PNG 作為序列實況判斷依據，並把 SVG／PNG 不一致另列為可見缺陷。

## 結論摘要

三個狀態的預期敘事角色是成立的：State 1 建立共同 API 基準，State 2 顯示 `message` 的兩種值，State 3 揭露同一個既有 Consumer 如何查表並產生不同相容性結果。State 1 的共同案例與 State 3 的完整因果鏈都能直接支撐 Semantic Model；State 2 的深色 response cards 也確實把注意力集中到 raw text 與 `m0001`。

但目前實際 PNG 序列不適合直接進入 Visual Refinement。State 1 → 2 在畫面上移除了規格要求保留的同一 request、共同 error envelope 與 `HTTP 400 / INVALID_QUERY / data: null`；State 3 又重新加入這些基準。這使「共同條件不變」在最需要被驗證的轉換中只剩標題與副標宣告，而不是持續可見的資訊。再加上 State 2 的 PNG 與 SVG 不是同一個可見狀態，當前審查對象尚未穩定。

## 三個狀態的個別敘事作用

### State 1｜固定同一個錯誤案例與 API 基準

- **Observation：** 畫面上方有同一個 `?fromDate=2026-01-01`、`toDate: missing` 的 request card；下方比較框明列兩個獨立 response、共同的 `HTTP status: 400`、`code: INVALID_QUERY`、`data: null`，以及各自尚未揭露值的 `message` field。
- **Impact：** 這直接建立「同一個 invalid query 產生兩個可比較的 error response」，沒有把兩條路徑說成一條 API 成功、另一條 API 失敗，也沒有提前宣布 Consumer 結果。
- **Classification：** Preference。

- **Observation：** `RESPONSE A · AI-DIRECT` 與 `RESPONSE B · PROJECT-CONVENTION` 維持左右分列；兩張卡都以 `value not shown in this state` 標示揭露延後。
- **Impact：** 兩個 response 的身份與 `message` 欄位位置已成為後續 matching 錨點，且資訊延後是明示的，不會被讀成遺漏內容。
- **Classification：** Preference。

- **Observation：** 共同 error envelope 以單一水平帶呈現，並用 `each response carries the same attributes` 及兩條垂直 guide lines 指向左右 response 區域；它是比較容器中的共同基準，不是第三個 response。
- **Impact：** 共同資訊的延續關係在本狀態清楚；這是後續只突出 `message` 時應保留的理解錨點。
- **Classification：** Preference。

### State 2｜揭露 `message` 的語意差異

- **Observation：** 實際 PNG 顯示兩張左右對齊的深色 response card：A 顯示 `fromDate and toDate must be supplied together` 並標成 `raw error detail`，B 顯示 `m0001` 並標成 `message code`；Consumer lookup 與結果尚未出現。
- **Impact：** 這個狀態把視覺注意力集中在本案例唯一的欄位差異，並正確延後 `catalog miss／hit` 與 `compatible／incompatible`，因此沒有提前揭露結論。
- **Classification：** Preference。

- **Observation：** State 1 的 request card、共同 error envelope、`HTTP 400`、`INVALID_QUERY` 與 `data: null` 在實際 `state-02.png` 中都不可見。畫面只以標題「共同 error envelope 不變」、副標與上方小標 `same error envelope · different message` 口頭式宣告它們仍相同。
- **Impact：** 觀眾在看見兩種 `message` 值時，不能從當前畫面直接核對共同 API 基準；這使「只有 message 改變」依賴記憶與講者補充，並讓 State 3 重新出現共同基準時像是在補回前一狀態被移除的資訊。這直接偏離 Information Allocation 與 Object Matching 對 State 2 的保留要求。
- **Classification：** Defect。

- **Observation：** A/B 的 response 身份、左右位置與 `message` 欄位對應仍可辨識，但 State 2 將 State 1 的淺色卡片改成大面積深色 message cards，且在實際 PNG 中沒有保留 State 1 的外層比較框與共同欄位帶。
- **Impact：** 深色卡片有效形成 attention transition；同時，視覺物件的連續性不再由框線與容器維持，而主要依賴 `RESPONSE A/B`、`AI-DIRECT／PROJECT-CONVENTION` 與固定左右位置。這是可以理解的聚焦取捨，但不是完整的物件外觀延續。
- **Classification：** Trade-off。

- **Observation：** `state-02.svg` 的 source 仍包含 State 1 的 request card、共同 error envelope 與相同座標系中的比較框；其 `<desc>` 也寫明「same invalid request and common API error envelope remain」。這些物件卻沒有出現在實際 `state-02.png`。
- **Impact：** 審查者無法把 SVG 所描述的 intended state 當成已交付的可見畫面；PNG 與 SVG 的不一致也讓後續 refinement 的對象不明確。
- **Classification：** Defect。

### State 3｜揭露 Consumer lookup 與相容性結果

- **Observation：** State 3 保留同一 request、兩個 response、共同 `HTTP status: 400`、`code: INVALID_QUERY`、`data: null` 與兩種 `message` 值，並在下方加入同一個 `EXISTING ERROR CONSUMER`、`message → MESSAGE_CATALOG`、`m0001 → 查詢條件不合法` 及兩條 A/B lookup lane。
- **Impact：** 完整因果鏈可直接追蹤：raw text → `catalog miss` → `incompatible · Unknown message code` → `consumed: null`；`m0001` → `catalog hit` → `compatible` → `displayMessage: 查詢條件不合法`。畫面明確把差異放在 Consumer contract，而非 API error status。
- **Classification：** Preference。

- **Observation：** 兩個深色 message card 仍保留 State 2 的值與左右身份；下方兩條 lane 也以 `A · AI-direct` 與 `B · Project-convention` 對應。上方 response card 的箭頭落到 Consumer 面板上緣，而不是直接落到各自的 lane；lane 的左右位置與標籤補足這個 mapping。
- **Impact：** 重要物件與資訊值有良好的延續，跨區連接仍可讀；但觀眾需要從上方 response 的左右位置再對照到下方 lane，而不是沿單一箭頭一路讀到結果。
- **Classification：** Trade-off。

- **Observation：** 下方 Consumer 面板同時放入 operation、catalog entry、規則說明、miss／hit、兩個 outcome 與 `consumed: null`／`displayMessage`；目前完整 PNG 沒有看到文字裁切、物件遮擋或箭頭穿過文字。
- **Impact：** 語意完整性已成立，但這是序列中資訊負荷最高的狀態。明亮會議室、投影距離與非原尺寸觀看下，輔助文字及斜線 hatch 中的次要結果是否仍易讀尚未測試。
- **Classification：** Uncertainty。

## State 1 → State 2 轉換審查

### Understanding Progression

- **Observation：** State 1 的主要焦點是共同 request／error envelope；State 2 的主要焦點轉成兩張 response 中 `message` 的 raw text 與 `m0001`。
- **Impact：** 轉換意圖清楚，且沒有提前揭露 Consumer outcome；但是實際 PNG 並非「保留基準後聚焦差異」，而是「移除基準後只留下差異」。因此理解從共同基準到欄位差異的必要連接被削弱。
- **Classification：** Defect。

### Information Timing

- **Observation：** State 2 才出現兩個 `message` 的實際值；`catalog`、lookup rule 與結果仍被延後到 State 3。
- **Impact：** 差異先於解釋結果出現，符合規格要求的揭露順序。問題不在揭露太早，而在共同基準在這個時間點不可見。
- **Classification：** Preference（揭露順序）；Defect（共同基準消失）。

### Object Continuity

- **Observation：** 資訊物件上，A/B response identity 與 message value 可從 State 1 延續到 State 2；視覺物件上，左右位置與卡片輪廓仍相近，但外層比較框、共同欄位帶與淺色 response card 外觀沒有延續。State 2 的深色 card 與大字 message 是新的 attention treatment，不是新的 response instance。
- **Impact：** 重要 response 物件仍可辨識，但連續性主要靠文字標籤，而非完整的幾何與容器延續。版面／裝飾的改變本身不造成語意錯誤，卻不能被誤當成物件 continuity 已完全成立。
- **Classification：** Trade-off。

### Attention Transition

- **Observation：** State 2 以深色 response cards、白色 message 值和留白，將視線從 State 1 的共同欄位帶移到 `raw error detail` 與 `message code`。
- **Impact：** 這是有效的注意力轉移；在目前 PNG 中，沒有看到其他 Consumer 結果搶先與 message 差異競爭。實際觀眾是否能同時保留共同基準，則受前述資訊移除影響。
- **Classification：** Preference。

## State 2 → State 3 轉換審查

### Understanding Progression

- **Observation：** State 3 保留 State 2 的兩個 message 值，並在其下新增同一 Consumer、catalog 與兩條結果 lane；同時把 request 與共同 API attributes 重新放回上方。
- **Impact：** 從「兩種值」到「同一 Consumer 對兩種值採不同解析」的因果推進清楚，且 API error result 與 Consumer compatibility 被明確分層。共同基準的重新出現則不是新的理解，而是補回 State 2 未持續顯示的理解。
- **Classification：** Preference（新增 Consumer 因果鏈）；Trade-off（重新加入先前消失的基準）。

### Information Timing

- **Observation：** `message → MESSAGE_CATALOG`、`catalog miss／hit`、`compatible／incompatible` 與顯示結果都延後到 State 3 才出現。
- **Impact：** 這符合「先看差異，再看 Consumer 如何解讀」的揭露節奏，沒有讓觀眾在看見 `raw text`／`m0001` 前先得到成功／失敗結論。
- **Classification：** Preference。

### Object Continuity 與 Attention Transition

- **Observation：** State 2 的深色 cards 在 State 3 仍保留，位置、A/B 身份、raw text 與 `m0001` 都未改寫；新的注意力由上方 response 差異向下轉移到 Consumer 面板與兩條 lane。兩條箭頭落在 Consumer 面板上緣，面板內再以左右 lane 維持 A/B 對應。
- **Impact：** 這個轉換比 State 1 → 2 更自然，因為先前揭露的 message 值沒有消失或改名，且新結果位於來源下方。跨面板 mapping 仍需要一次左右對照，但沒有把兩條 response 合併成單一路徑。
- **Classification：** Preference（值與來源延續）；Trade-off（箭頭未直接落到 lane）。

## 七項連續畫面評估

### 1. Understanding Progression

- **Observation：** 三狀態的 intended sequence 是共同基準 → `message` 值差異 → Consumer lookup 結果；State 1 與 State 3 分別把起點與完整因果鏈畫出來，State 2 的標題與卡片也只聚焦 message 差異。
- **Impact：** 核心理解階梯成立，但實際 PNG 的 State 1 → 2 把共同基準拿掉，造成中間狀態無法直接驗證「只有 message 改變」。這是對理解 progression 的實質缺口，不是單純版面偏好。
- **Classification：** Defect。

### 2. Information Timing

- **Observation：** State 1 未揭露 message 值；State 2 揭露 raw text／`m0001` 但未揭露結果；State 3 才揭露 Consumer rule、catalog entry 與兩條 outcome。
- **Impact：** 差異與因果解釋的先後順序恰當，沒有提前展示 `compatible`／`incompatible`。共同 API baseline 在 State 2 不可見是保留問題，不是 timing 過早或過晚的問題。
- **Classification：** Preference（揭露節奏）；Defect（中間狀態的 invariant 不可見）。

### 3. Object Continuity

- **Observation：** 資訊延續上，same request、共同 error attributes、A/B response identity、兩個 message value 與 Consumer mapping 可在序列中辨識；視覺物件延續上，A/B 卡片與左右位置保留，但 State 2 的外框與卡片色彩改變，State 3 又重新組成上下兩個面板。版面與裝飾的重複（例如外框、分隔線與小標）並不等於物件本身延續。
- **Impact：** 重要物件沒有被合併或改名，且 A/B 對應最終維持；但 State 2 的實際 PNG 讓資訊延續和視覺容器延續不同步。若只看畫面而不讀標籤，連續性較弱。
- **Classification：** Trade-off；其中 State 2 缺少規格要求 invariant 為 Defect。

### 4. Attention Transition

- **Observation：** State 1 的共同 envelope 是上方比較帶；State 2 以深色 cards 將焦點收窄到 message；State 3 以新增的下方 Consumer 面板把注意力帶到 lookup 與 outcome。
- **Impact：** 三次注意力轉移的方向符合語意順序，沒有在 State 3 以前讓結果搶先出現。State 2 的聚焦效果建立在移除 baseline 的代價上，因此注意力設計有效但序列連續性不完整。
- **Classification：** Trade-off。

### 5. Information Load

- **Observation：** State 1 的內容分組單純；State 2 的實際 PNG 只留下兩張 message cards、標題與簡短說明；State 3 承載共同 attributes、兩個 message、Consumer operation、catalog entry、規則註記與兩條 outcome lane。State 3 的各物件仍被面板與 lane 分組，沒有可見重疊。
- **Impact：** State 2 的低負荷部分來自共同基準被移除，不能直接視為較好的資訊分配；State 3 用較高負荷換取完整因果鏈。這種負荷是否能在明亮會議室中被講者引導順利消化，尚未經觀眾或投影測試。
- **Classification：** Trade-off；投影可讀性為 Uncertainty。

### 6. Semantic Fidelity

- **Observation：** State 1 與 State 3 正確呈現同一 invalid query、兩個獨立 response、共同 `HTTP 400 / INVALID_QUERY / data: null`，並把 `message` 與 `code` 分開；State 3 也正確呈現 raw text 查表失敗、`m0001` 查表成功。沒有把 `compatible` 說成 API 成功，也沒有把 raw text 說成 catalog 的替代 key。
- **Impact：** 完整序列的 intended semantic model 大致被保留；但以實際 PNG 播放時，State 2 的共同基準消失，讓語意 invariant 暫時只能靠口頭或記憶維持。這是序列表達的缺口，不是 domain fact 被寫錯。
- **Classification：** Defect（State 2 的可見 invariant）；Preference（State 1／3 的語意正確性）。

### 7. Visible Defects

- **Observation：** 三張實際 PNG 中沒有看到文字裁切、卡片互相遮擋、箭頭穿過主要文字、框線未閉合或明顯溢出。State 3 的 hatch、箭頭與 A/B lane 在目前完整尺寸仍可辨認。
- **Impact：** 就目前 PNG 的靜態渲染而言，沒有發現會立即阻擋觀看的幾何渲染缺陷。這不等於已證明投影可讀性；明亮環境、後排距離與播放器縮放尚未測試。
- **Classification：** Preference（目前未見可見渲染阻擋）；Uncertainty（現場可讀性）。

- **Observation：** `state-02.png` 與 `state-02.svg` 對同一狀態的可見物件不一致：PNG 沒有 request／共同 envelope，SVG 有相應元素與文字描述。
- **Impact：** 這是目前最直接的輸入／交付缺陷；它使「審查哪個 State 2」及「Visual Refinement 應以哪個物件集合為基礎」都無法穩定回答。
- **Classification：** Defect。

## 已成立的設計成果

- State 1 清楚建立同一個 invalid query、兩個獨立 response 與共同 API error baseline。
- State 2 在實際 PNG 中清楚區分 raw error detail 與 message code，且沒有提前揭露 Consumer 結果。
- State 3 完整畫出 `message → MESSAGE_CATALOG`、catalog miss／hit 及兩條對應 outcome；這保留了本案例不可省略的因果關係。
- A/B response identity、左右對應與 message 值在 State 2 → 3 中保持穩定；沒有把兩條 lookup lane 合併成單一成功／失敗流程。
- `HTTP 400`、`INVALID_QUERY`、`data: null` 與 Consumer compatibility 在 State 1／3 被分層呈現，沒有以視覺暗示其中一個 API response 成功。
- 目前 PNG 沒有直接可見的文字遮擋、溢出或箭頭穿字問題；hatch 與文字標籤也讓 miss／hit 不完全依賴顏色。

## 尚未解決的主要問題

1. **State 1 → 2 的共同基準不持續。** 實際 `state-02.png` 移除同一 request、共同 error envelope 及其三個共同欄位；這違反 `information-allocation.md` 與 `object-matching.md` 對 State 2 的 invariant 要求，並使「只有 message 改變」不能在當前畫面直接核對。**Classification：Defect。**
2. **State 2 的 PNG／SVG 不一致。** SVG source 與描述保留了 State 2 在 PNG 中不可見的物件。這使目前審查對象與後續 refinement 基礎不明確。**Classification：Defect。**
3. **Consumer 面板的跨區 mapping 仍需對照。** 上方 response 的箭頭落在 Consumer 面板上緣，不直接落到 A/B lane；左右位置與文字能補足，但不是單一路徑的直接連接。**Classification：Trade-off。**
4. **投影可讀性尚未驗證。** State 3 的輔助說明、`consumed: null`、小型 eyebrow、footer 與 hatch 內文字在目前 PNG 可辨識，但明亮會議室與後排距離下的效果沒有實測。**Classification：Uncertainty。**
5. **`compatible／incompatible` 的解讀尚未測試。** State 3 已用共同 `HTTP 400` 與 `EXISTING ERROR CONSUMER` 降低把它誤讀成 API 成功／失敗的風險，但不能僅憑靜態審查證明觀眾不會混淆。**Classification：Uncertainty。**

## 是否適合進入 Visual Refinement

**目前不適合。** 阻擋原因只有兩項，且都與審查對象是否穩定及必要資訊是否持續可見直接相關：

- 實際 State 2 PNG 缺少規格要求保留的共同案例與 API baseline，造成 State 1 → 2 的理解連接中斷。
- State 2 PNG 與對應 SVG 描述的物件集合不一致，無法確定後續 refinement 應針對哪一個已成立的狀態進行。

其餘問題目前屬於 Trade-off 或 Uncertainty，沒有另行構成阻擋。本文件不提出修正稿、替代構圖、新狀態、完整設計計畫或 Visual Refinement 操作；在上述兩項 blocker 被釐清前，不對序列做進一步設計判斷。
