# S04｜D2.4 Independent Composition Critique

## 審查範圍與方法

本審查實際觀看兩張完整 PNG：

- Develop R1：[04-message.png](../../develop/png/04-message.png)
- D2.3 Rough Composition：[rough-composition.png](./rough-composition.png)

判準以 [`semantic-model.md`](./semantic-model.md) 為準，並核對 D2.1／D2.2 的既有研究結論與 [Design Storyboard](../../develop/design-storyboard.md)。以下「Observation」是畫面中直接可見的現象；若「Impact」涉及觀眾理解速度、投影距離或講述效果，會明確標為尚未經觀眾測試的推測。本次沒有執行 runtime tests，也沒有進行正式投影或觀眾測試。

## 比較結論

R1 的優勢是把注意力集中在 `message` 欄位：左側案例卡、放大鏡與右側兩張 response 卡形成清楚的鏡頭感，適合講者在一個短段落中引導觀眾看「同一錯誤 response 的兩種 message 意義」。但它把 `message → catalog lookup → Consumer outcome` 壓縮成卡片內文與底部 socket 的文字宣告，沒有把主要因果關係畫出來。

D2.3 的優勢是把完整語意鏈放在同一個畫面：同一 invalid request、相同 error envelope、兩個獨立 response、同一 Consumer、catalog miss／hit，以及兩種結果都可被追蹤。代價是畫面從「欄位特寫」變成一張完整關係圖，資訊與閱讀路徑較多，講者需要帶著觀眾由上往下讀。

因此，D2.3 不是因為更新而較好；它是以較高的資訊負荷換取較完整的語意表達。R1 則是以較低的資訊負荷換取較多口頭補充。

## 1. Semantic Expressiveness

### R1：保留了核心比較，但沒有完整畫出 Consumer 操作

- **Observation：** R1 以 `SAME CASE / ERROR INPUT`、`HTTP 400 · INVALID_QUERY`、兩張 response 卡及不同的 `message` 值，保留「同一錯誤案例、同一錯誤分類、差異在 message 語意」的基本對照。
- **Impact：** 這個基準避免畫面直接暗示兩條路徑有不同的 HTTP 結果；`raw text` 與 `m0001` 也確實被視為不同型態的值。這是 R1 應保留的語意錨點。
- **Classification：** Preference。

- **Observation：** `AI-direct` 與 `PROJECT-CONVENTION` 卡片直接寫出 `Unknown message code`、`查詢條件不合法` 及 `does not dock`／`docks to catalog`，但兩張卡沒有連到一個可追蹤的 lookup 流程；底部的 `existing Consumer + catalog` socket 也沒有與兩張卡形成實際連線。
- **Impact：** 「既有 Consumer 把 `message` 當作 catalog key」主要依賴文字與講者說明，而不是畫面中的關係。單看 R1，觀眾可以知道結果不同，但不一定能從圖形本身知道差異是 catalog miss／hit 造成的。
- **Classification：** Defect。

### D2.3：完整保留必要關係，且沒有把兩個 error response 說成一成一敗

- **Observation：** D2.3 以 `SAME INVALID REQUEST` 向下連到 `TWO RESPONSE OBJECTS · SAME INPUT`，再以 `COMMON ATTRIBUTES ON EACH RESPONSE` 明列 `HTTP status: 400`、`code: INVALID_QUERY`、`data: null`；下方兩個 response 只改變 `message` 值。
- **Impact：** Semantic Model 要求的 invariant 與 difference 同時可見：兩個 response 都完成 invalid-query 回應，差異只在既有 Consumer 如何解析 `message`。這比 R1 更能獨立支撐本段命題。
- **Classification：** Preference。

- **Observation：** 下半部明列同一個 `message → MESSAGE_CATALOG` 操作，並把 `raw text → catalog miss → incompatible` 與 `m0001 → catalog hit → compatible` 畫成兩條 lookup lane。
- **Impact：** `message` 不是由 `INVALID_QUERY` 自動推導出的顯示文字、raw text 不是 catalog 的同義 key，這兩個容易被誤讀的關係都有具體圖形證據。這是 D2.3 相對 R1 最重要的語意改善。
- **Classification：** Preference。

- **Observation：** 上方兩張 response 卡向下的箭頭落在 Consumer 區域的兩個位置，但沒有直接落到下方各 lane 的 `raw text`／`m0001` 膠囊；左右欄位對應主要由位置、標籤與下方文字維持。
- **Impact：** 這個關係仍可追蹤，沒有表達錯誤，但觀眾需要在上下兩個區域之間做一次對照，才能確認哪個 response 對應哪個 lookup lane。
- **Classification：** Trade-off。

## 2. Visual Hierarchy

- **Observation：** R1 的大標題、`msg` zoom lens，以及兩張等寬 response 卡共同把視線集中在 `message` 的差異；`FIELD CONTRACT` 與 trace rail 提供目前鏡頭位置。
- **Impact：** 未經觀眾測試的推測是，講者可較快把觀眾帶到「raw text versus `m0001`」這個主衝突，而不必先解釋整張關係圖。
- **Classification：** Preference。

- **Observation：** D2.3 仍以深色 response 卡突出兩個 message，但同一畫面還有兩個大型外框、共同屬性帶、三個區域標題、Consumer operation、Message catalog、規則說明及兩條結果 lane。
- **Impact：** 未經觀眾測試的推測是，`message` 不再是唯一立即可見的焦點；觀眾可能先把它讀成「完整 error-response 流程圖」，再回頭理解欄位差異。這是完整性換取聚焦速度的取捨，不是語意錯誤。
- **Classification：** Trade-off。

- **Observation：** D2.3 的副標直接說明「同一個錯誤輸入、同一個 error envelope；只有 message 的語意不同」，R1 的副標則主要說明鏡頭如何移動。
- **Impact：** 就單張畫面而言，D2.3 對比較基準與核心結論的自我說明較完整；R1 對連續觀看中的鏡頭感較強。
- **Classification：** Preference。

## 3. Composition

- **Observation：** R1 採左到右的 request → lens → response cards 配置，左右 response 卡等高、各自有 outcome；但 lens 的箭頭停在 `msg` 圓形，沒有再向兩張 response 卡分支。
- **Impact：** 左到右的觀看方向很容易成立，但「同一 input 產生兩個 response」與「兩個 response 都交給同一 Consumer」較像由標題和口頭說明補完，而不是由空間連接完整表達。
- **Classification：** Trade-off。

- **Observation：** D2.3 使用上方輸入、中央 response comparison、下方 Consumer／lookup 的 Top-down Matrix；共同屬性、兩個 message 卡與兩條結果 lane 分別對齊在清楚的外框內，兩張 response 卡也維持相同寬度與視覺重量。
- **Impact：** 空間配置把「共同基準」放在差異之前，並把「值如何被消費」放在差異之後；這使比較基準、變數與結果的層次比 R1 更完整。
- **Classification：** Preference。

- **Observation：** D2.3 的兩個主要面板幾乎填滿畫布，底部重述句靠近下緣；相較之下，R1 在左下與 response 卡之間保留較多空間。
- **Impact：** D2.3 用較少的空白換取 lookup 與 outcome 的完整呈現；在明亮會議室或較遠觀看距離下，這種密度是否仍舒適尚未確認。
- **Classification：** Trade-off。

## 4. Information Load

- **Observation：** R1 同時呈現案例卡、鏡頭、兩個 response、兩種 outcome、底部 socket、trace rail 與多個說明標籤，但大部分資訊仍被分組在兩張 response 卡內。
- **Impact：** 未經觀眾測試的推測是，R1 較容易在 90 秒左右完成口頭說明；代價是 Consumer lookup 的細節不在畫面上，講者必須補足因果鏈。
- **Classification：** Trade-off。

- **Observation：** D2.3 同時呈現完整 input、common attributes、兩個 message、Consumer operation、catalog entry、兩條 lookup lane、兩個 outcome 與多個 guard label。畫面沒有文字裁切或互相遮擋，但小型 eyebrow、輔助說明與 monospace label 的數量明顯多於 R1。
- **Impact：** 這些文字支撐了語意完整性，卻也讓觀眾需要同時處理「共同欄位」「欄位差異」「lookup 規則」「最終結果」四層資訊。理解速度是否因此下降是未經觀眾測試的推測。
- **Classification：** Trade-off。

- **Observation：** D2.3 使用較小的區域標題、輔助說明與 lane label；在目前完整 PNG 中仍可辨識，沒有因縮排而產生可見溢出。
- **Impact：** 尚未投影或從後排觀看，不能確認這些次要文字在明亮會議室中是否仍具足夠可讀性；這是 presentation risk，不是目前已確認的渲染缺陷。
- **Classification：** Uncertainty。

## 5. Presentation Suitability

- **Observation：** R1 的低密度與 zoom lens 適合講者主導的停頓、指向與口頭轉場；但核心 lookup 關係沒有畫出。
- **Impact：** 它適合把一個記憶點講深，卻較依賴觀眾持續聽講。未經觀眾測試的推測是，分心或晚進入觀看的觀眾較難只靠這張圖恢復完整因果鏈。
- **Classification：** Trade-off。

- **Observation：** D2.3 的白底、深色 message cards、清楚的框線、文字標籤與 hatch pattern 同時提供了對比、分組與非色彩辨識；`catalog miss`／`catalog hit` 不是只靠紅綠顏色區分。
- **Impact：** 這較符合明亮會議室與色覺差異下的基本投影需求，且不會把語意全押在色彩上。
- **Classification：** Preference。

- **Observation：** R1 以紅／綠底色區分失配與接合，雖然同時有 `does not dock`／`docks to catalog` 文字，但綠色 response card 的整體視覺重量容易與「API 成功」產生聯想；D2.3 也使用 `compatible`／`incompatible` 這組結果詞。
- **Impact：** Semantic Model 已明確指出兩條路徑都回 HTTP 400；觀眾是否會把 Consumer 相容性誤讀成 API 成功與否，尚未經測試。D2.3 的 common attributes 與 `EXISTING ERROR CONSUMER` 標題能降低此風險，但不能證明風險已消失。
- **Classification：** Uncertainty。

## 6. Visible Defects

- **Observation：** 兩張完整 PNG 都沒有看到文字被裁切、元件互相遮擋、箭頭穿過文字或未閉合的框線。R1 的綠色卡片說明與底部 socket 文字靠近邊界，但在目前 PNG 中仍可讀；D2.3 的 hatch、箭頭與外框也正常渲染。
- **Impact：** 沒有發現會直接阻擋目前畫面觀看的可見渲染缺陷。投影距離與不同播放器縮放仍未驗證，因此不能把目前可讀性推廣成現場保證。
- **Classification：** Preference。

- **Observation：** R1 的底部 `existing Consumer + catalog` socket 是孤立的圖形，沒有實線或箭頭把它接到上方兩個 response outcome；D2.3 則把 Consumer、catalog、lookup 與 outcome 放在同一個下方面板內。
- **Impact：** R1 的問題不是 SVG／PNG 渲染失敗，而是 docking 圖形關係不完整；D2.3 將這個視覺缺口補成可追蹤的操作關係。
- **Classification：** Defect（R1 的單畫面關係表達）。

## D2.3 應保留的設計成果

- 同一個 invalid request 與兩個獨立 response 的關係；不把案例拆成兩個錯誤輸入。
- `HTTP 400`、`INVALID_QUERY`、`data: null` 的共同基準，以及「每個 response 都攜帶共同 attributes」的明示。
- response 卡等寬、等重量的比較基準；不以構圖暗示 AI-direct 在 API 層失敗、或 project-convention 在 API 層成功。
- `raw text → catalog miss` 與 `m0001 → catalog hit` 的可見因果鏈。
- `message → MESSAGE_CATALOG` 的方向，並保留 `m0001 → 查詢條件不合法` 的 catalog entry。
- 白底、深色文字與 hatch／標籤並用的辨識方式，避免把 miss／hit 完全交給色彩。
- 上方 response comparison 與下方 Consumer processing 的分組方式；它比 R1 的浮動 socket 更能支撐本案例的完整語意。

## D2.3 尚未解決或新增的問題

- **單畫面構圖問題：** 上方 response 與下方 lookup lane 的箭頭沒有直接落在對應的 message 膠囊；左右位置與文字能補足，但 mapping 仍需要一次跨區對照。**Classification：Trade-off。**
- **單畫面構圖問題：** D2.3 把共同欄位、message 差異、lookup 規則與 Consumer outcome 同時放入一個畫面；這是語意完整的來源，也是最主要的資訊負荷來源。**Classification：Trade-off。**
- **單畫面可讀性問題：** 輔助標籤與 lane 文字在目前 PNG 沒有溢出，但現場投影距離、明亮環境下的可讀性仍未確認。**Classification：Uncertainty。**
- **單畫面語意風險：** `compatible`／`incompatible` 與綠色接合語彙可能被理解成 API 成功／失敗，而非 Consumer 相容性差異。common error envelope 已降低此風險，但尚未由觀眾測試證實。**Classification：Uncertainty。**
- **連續畫面問題：** R1 的 trace／zoom continuity 與 D2.3 的完整關係圖各自成立，但兩者在連續觀看中的角色尚未被確認：是把 D2.3 當作單張完整說明，還是讓前後畫面共同承擔 lookup 的理解。這不能只靠本張 PNG 判定，也不應在本審查中預設揭露順序。**Classification：Uncertainty。**

## 單一畫面問題與連續畫面問題

### 可由單一畫面判斷的問題

- R1 是否把 `message` 與 Consumer／catalog 的關係畫出來：目前沒有；這是 R1 的語意與構圖缺口。
- D2.3 是否保留共同 envelope、兩個 response、message 差異及 lookup 結果：目前有；這是它可作為語意完整基礎的原因。
- D2.3 的 cross-panel mapping、空白與小字是否讓完整關係變得較難掃讀：目前可直接觀察到構圖取捨，但實際理解影響仍未測試。

### 需要連續畫面才能確認的問題

- D2.3 的完整矩陣是否能與前後 Snapshot 保持案例連續，而不讓觀眾把它讀成另一個獨立錯誤案例。
- 講者在連續敘事中是否能先建立共同 error envelope，再讓觀眾把注意力落到 `message`；這是節奏與揭露問題，不是本張靜態 PNG 能解決的問題。
- `compatible`／`incompatible` 是否在前後畫面的語境中仍被理解為 Consumer contract，而不是 API runtime success。這需要序列脈絡或觀眾測試確認。

本節只辨識哪些判斷需要 sequence evidence；沒有提出新的 Snapshot、替代構圖或資訊揭露順序。

## 是否適合進入 D3 Sequence Development

**適合，且沒有發現阻擋 D3 的語意或可見渲染缺陷。**

D2.3 比 R1 更適合作為 D3 的構圖基礎，因為它已經把本段不可省略的 invariant、message 差異、既有 Consumer lookup 與兩種 outcome 放在同一個可追蹤模型中。它不應被視為已完成的正式投影片：資訊負荷、跨區 mapping、現場小字可讀性，以及 `compatible`／`incompatible` 的解讀仍是明確的待確認事項。

這些事項目前屬於 Trade-off 或 Uncertainty，而不是進入 D3 的 blocker。若後續觀察證明觀眾無法在講者引導下保持共同 error envelope 與 Consumer contract 的區別，才會構成 sequence 層級的阻擋；本次沒有進行該項測試，也不替它預先下結論。
