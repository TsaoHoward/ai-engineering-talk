# S04｜Independent Design Critique

## 審查範圍與方法

本審查實際觀看 `graphic-construction.png`、`form-factoring.png` 與 `form-subtraction.png` 三張 PNG；對應 SVG 僅用於核對 PNG 中的連接與圖形關係。判準以 [`semantic-model.md`](./semantic-model.md) 為準，未進行正式投影測試、整頁簡報品質驗收、runtime tests、Formstorming 或 Composition Studies。

核心判準是：三個版本都應讓觀眾看見同一個 invalid query 產生兩個 response；兩個 response 的 HTTP 400、`INVALID_QUERY` 與 `data: null` 相同；差異只在 `message` 的值及其被既有 Consumer 查詢 catalog 後的結果。`message` 不是由 `code` 推導出的顯示文字，raw text 也不是 catalog key 的另一種同義呈現。

## 結論摘要

| 版本 | 保留的核心關係 | 主要代價 | 判斷 |
| --- | --- | --- | --- |
| V1 · Graphic Construction | 共同輸入、兩個 response、共同 envelope 欄位、不同 `message`、同一 Consumer 的 miss/hit 與結果 | 共同欄位重複；中央的垂直註記與兩條 message 路徑增加閱讀負擔 | 語意最完整，但視覺上偏擁擠 |
| V2 · Form Factoring | 保留 V1 的 lookup 操作與結果，將共同欄位抽成明確的共同視覺結構 | 共同欄位不再位於兩個 response 物件內，需依賴「both responses」及「not a shared response instance」的說明 | 最適合作為 Composition 的圖形基礎 |
| V3 · Form Subtraction | 保留輸入、共同欄位摘要、兩個 message 值及最終相容性結果 | 拿掉 catalog lookup 的可視操作，也未以圖形連接共同欄位與兩個 response | 過度刪減；不建議直接進入 Composition |

推薦以 **V2** 為後續 Composition 的基礎。它比 V1 有效降低重複，且仍保留「raw text → catalog miss」與「`m0001` → catalog hit」這個使 Consumer 結果不同的關鍵操作。V2 仍需在 Composition 階段處理共同欄位與各 response 的從屬關係，但目前沒有阻擋其作為基礎的問題。

## V1｜Graphic Construction

### Semantic Expressiveness

- **Observation：** 左側同一個 invalid request 分支到 response pair；兩個 response 各自呈現 HTTP 400、`code: INVALID_QUERY`、`data: null`，再各自提供 raw text 或 `m0001`。
  **Impact：** 同一輸入、相同 error envelope、只有 `message` 不同的 invariant 很直接；不會把兩條路徑誤解成不同錯誤案例，也沒有暗示其中一個 API response 成功。
  **Classification：** Preference（有利於語意完整性）。

- **Observation：** 右側是一個共同的 Existing Error Consumer，並把 raw text 接到 `catalog miss`、把 `m0001` 接到 `catalog hit`，再分別顯示 `Unknown message code` 與 `查詢條件不合法`。
  **Impact：** `message` 是 Consumer lookup key，而不是由 `INVALID_QUERY` 自動產生顯示文字，這個語意方向在圖上有具體路徑支撐；也是三版中最完整保留 Consumer 操作的呈現。
  **Classification：** Preference（有利於語意完整性）。

### Visual Effectiveness 與可見缺陷

- **Observation：** response pair 以兩個左側 envelope box 重複呈現相同的 HTTP、`code`、`data`，並以中央虛線及垂直文字「same fields in both」補充其相同性。
  **Impact：** 共同欄位的存在很清楚，但觀眾必須掃過兩組相同內容，焦點容易從 `message` 的語意差異移向重複的 envelope；垂直文字也比水平標籤慢讀。
  **Classification：** Trade-off。

- **Observation：** 中央虛線位於共同 envelope 與 message 欄位的狹窄分界，垂直註記貼近兩側文字與框線；兩條通往 Consumer 的路徑旁又各有「message as key」標註。
  **Impact：** 連接關係仍可辨認，但視覺焦點被分界線、旋轉文字與重複標籤分散，降低快速比較兩個 `message` 值的效率。
  **Classification：** Defect（可辨識的可讀性與視覺層級問題）。

- **Observation：** Consumer 內的 `incompatible · Unknown message code` 與其他小型 lookup 元件都塞在同一個窄欄位中；文字雖仍可辨識，但「code」接近結果框右側邊界。
  **Impact：** 在目前 PNG 尺寸可讀，縮小或放進更窄的 Composition 區塊時，這段結果最可能先失去清晰度。
  **Classification：** Uncertainty（目前不是已確認的文字溢出，但有尺寸敏感性）。

### V1 應保留的優點

- 共同輸入到兩條 response lane 的分支方向清楚。
- 相同 envelope 與不同 `message` 的對照同時存在，不需用額外敘述補回被刪掉的關係。
- catalog miss/hit 及其後果是圖形流程，而不是只靠結論文字宣告。

## V2｜Form Factoring

### Semantic Expressiveness

- **Observation：** V2 把 HTTP 400、`INVALID_QUERY`、`data: null` 集中在「COMMON VALUES · IN BOTH RESPONSES」區塊，並明寫「factored visual · not a shared response instance」；下方保留兩個分開的 response message box。
  **Impact：** 共同欄位不再被重複當成兩份內容，視覺上更容易把注意力放到 `message` 的差異；明確註記也避免「兩個 response 共用同一個 response instance」的錯誤暗示。
  **Classification：** Preference（形式操作有效改善表達）。

- **Observation：** AI-direct 與 Project-convention 的 message box 分別標示 raw text、catalog key、separate field，並沿用 V1 的 raw text → miss、`m0001` → hit 兩條 lookup 路徑。
  **Impact：** V2 保留了本模型最重要的差異：兩個 response 都是 invalid-query response，但只有 catalog key 能被既有 Consumer 解析。
  **Classification：** Preference。

- **Observation：** 共同欄位區塊與兩個 message box 都位於同一個「FACTORED VIEW」框內，但共同區塊本身沒有分別連到兩個 response message box。
  **Impact：** 「共同欄位屬於兩個 response」主要由標題與說明文字建立，而不是由容器或連線直接建立；對不熟 factoring notation 的觀眾，仍可能把它當成獨立摘要。
  **Classification：** Trade-off。

### Visual Effectiveness 與可見缺陷

- **Observation：** V2 移除兩份相同 envelope 的重複卡片，讓兩個 message box 變寬，raw text 與 `m0001` 的對照更集中；右側仍保留 catalog、lookup pill、hit/miss 與兩個 Consumer outcome。
  **Impact：** 比 V1 更容易先看見「共同值被固定、message 才是變數」，同時沒有犧牲查表操作的可見性。
  **Classification：** Preference。

- **Observation：** 從 request 分支出的箭頭實際落到兩個 message-bearing box，common values 區塊位於其上方但沒有箭頭；「same input · two objects」與「not a shared response instance」需協助讀者理解這個 factoring。
  **Impact：** 這不是錯誤資訊，但 response 的組成關係比 V1 更依賴標題、框內文字與讀者對抽取表示法的理解。
  **Classification：** Trade-off。

- **Observation：** V2 的主要文字與框線沒有可辨識的遮擋或文字溢出；lookup 連線、兩個 message box 和 Consumer 結果在 PNG 中均可追蹤。
  **Impact：** 在目前畫面尺寸下，V2 的資訊密度仍可承受，沒有發現會阻止理解的可見渲染缺陷。
  **Classification：** Preference（客觀可見的正面結果）。

### V2 應保留的優點

- 將 invariant 抽取一次，直接減少視覺重複。
- 明確區分「factored visual」與「shared response instance」，避免 factoring 被誤讀成資料共用。
- 完整保留 catalog lookup 的因果步驟，仍能解釋為何相同的錯誤分類導向不同 Consumer outcome。

## V3｜Form Subtraction

### Semantic Expressiveness

- **Observation：** V3 保留共同欄位摘要、兩個 message 值、同一 Consumer 與兩個 outcome，但把 Consumer 內的 `raw text → catalog miss`、`m0001 → catalog hit` 元件及箭頭移除。
  **Impact：** 觀眾能看見兩種結果不同，卻不再能從圖形本身確認差異是由 catalog lookup 命中／失敗造成；「message → MESSAGE_CATALOG」只剩 Consumer 標題下的一行文字。
  **Classification：** Defect（必要的操作關係未被圖形清楚表達）。

- **Observation：** V3 的 common values box 與兩個 response message box 是分離的；輸入箭頭直接進入各 message box，沒有從 common values 指向兩個 response 或包住三者的關係。
  **Impact：** `HTTP 400`、`INVALID_QUERY`、`data: null` 容易被讀成一個獨立的比較摘要，而不是兩個 response 各自都攜帶的欄位。這弱化了 semantic model 要求的「每個 response 都包含相同 error envelope」關係。
  **Classification：** Defect（可直接辨識的連接關係不清楚）。

- **Observation：** V3 仍在 Consumer 中保留 `MESSAGE_CATALOG` 卡片，但卡片沒有連到 AI-direct 或 Project-convention 的 outcome；結果框看起來像接收 message 後直接產生，而非經過 catalog。
  **Impact：** 它可能暗示 catalog 只是背景資料，或暗示 Consumer 以其他未畫出的規則產生結果；這會遮蔽本案例要表達的契約限制。
  **Classification：** Defect。

### Visual Effectiveness 與可見缺陷

- **Observation：** V3 移除 V2 的 factoring 外框、重複的 operation labels、lookup pills 與 hit/miss 元件，畫面留下更大的留白，兩個 message box 與兩個 outcome 對照很快可掃到。
  **Impact：** 高層次的「raw message 不相容、`m0001` 相容」結論更直接；若觀眾已知 catalog 規則，V3 會比 V2 輕。
  **Classification：** Preference（針對快速掃讀的改善）。

- **Observation：** 為得到上述簡潔，V3 同時拿掉了能說明 lookup 因果的中間形式，而未提供替代性的連線或容器關係。
  **Impact：** 簡潔不是單純減少重複，而是刪除了必要的語意證據；觀眾需依賴標題及結果文字自行補完操作。
  **Classification：** Trade-off，且在本案例中代價過高。

- **Observation：** PNG 中沒有明顯文字溢出或互相遮擋；主要問題是 common values 與 catalog 的關係缺少可視連接，而非渲染失敗。
  **Impact：** V3 的問題不能靠「目前文字仍看得清楚」抵銷，因為缺失的是關係表達，不是字體清晰度。
  **Classification：** Defect。

## 形式操作比較

### V1 → V2：Factoring

**實際改善**

- 將兩份相同的 HTTP status、`code`、`data` 從 response lane 中抽出，只呈現一次，降低重複。
- 讓兩個 response 的差異集中在各自的 `message` 欄位，視覺比較基準更明確。
- 保留 V1 的 lookup 操作、catalog hit/miss 及 Consumer 結果，因此沒有刪掉核心因果鏈。
- 以「not a shared response instance」承認 factoring 的視覺約定，避免把抽取後的區塊誤當成共用資料物件。

**失去或新增的問題**

- 共同欄位不再直接位於兩個 response 物件內；輸入箭頭也只落到兩個 message box，從屬關係需要靠文字與版面推論。
- 「FACTORED VIEW」與「separate response objects」是必要的解釋標註，表示 V2 的形式更依賴讀者理解 factoring notation。
- 這是可接受的 trade-off，因為被削弱的是結構的直接性，而不是 `message`、Consumer 與 outcome 的必要語意。

### V2 → V3：Subtraction

**實際改善**

- 移除 factoring 外框與 lookup 中間元件後，畫面更開放，message 值與最終相容性 outcome 更快形成一對一對照。
- 減少小型標籤、pill、連線與說明，使高層次結論較容易掃讀。

**失去或新增的問題**

- 拿掉 raw text 的 catalog miss 與 `m0001` 的 catalog hit，破壞了「值如何被 Consumer 解讀」的可見因果鏈。
- common values 與兩個 response 沒有直接連接，弱化相同 envelope 屬於兩個 response 的關係。
- catalog 卡片保留但沒有通往 outcome 的路徑，形成可見的孤立物件；這比 V2 的 factoring trade-off 更接近語意缺陷。
- 因此 V3 的簡潔是以必要資訊關係為代價，不是單純的去重或聚焦。

## 主要缺陷與應保留的優點

### 主要缺陷

1. V1 的中央虛線、旋轉標註與重複 envelope 造成可辨識的視覺擁擠；它仍是語意完整的版本，但不宜原樣作為最終 Composition。
2. V2 對共同欄位的從屬關係採 factoring 約定，缺少直接連線；這是需在 Composition 中留意的理解成本，但目前仍可由標題與說明補足。
3. V3 缺少 catalog lookup 的圖形操作，且 common values 與兩個 response 沒有清楚的圖形連接；這兩點使它無法完整表達 semantic model 的必要關係。

### 應保留的優點

- 三版都使用同一個 invalid request 分支到兩條比較路徑，沒有把案例變成兩個不同輸入。
- 三版都保留 HTTP 400、`INVALID_QUERY`、`data: null` 的相同基準，沒有以視覺差異暗示錯誤分類不同。
- 三版都把 raw text 與 `m0001` 視為不同型態的 `message` 值，沒有把 raw text 說成 catalog 的可解析翻譯。
- V1/V2 都把同一個 Existing Error Consumer 放在兩條路徑之後；V2 尤其成功在降低重複的同時保留 lookup hit/miss。

## Composition 建議與阻擋判斷

推薦 **V2** 作為後續 Composition 的圖形基礎，不推薦直接採用 V1 或 V3：

- V1 可作為語意完整性的參照，尤其是兩組共同欄位與 lookup 流程，但需要降低中央標註與重複造成的負擔。
- V2 已完成最有價值的形式改善：共同欄位抽取後，仍保留 message → catalog → Consumer outcome 的操作關係。
- V3 可保留其較開放的空間與直接對照感，但目前不應直接作為 Composition 基礎，除非補回 catalog lookup 及共同欄位與兩個 response 的明確關係。

**是否阻擋進入 Composition：**

- **V2：否。** 目前存在 factoring 所帶來的關係推論成本，但沒有發現阻擋 Composition 的語意缺陷或 PNG 渲染缺陷。
- **V1：否，但不推薦。** 它可被理解，主要問題是視覺擁擠與重複。
- **V3：是，若不補回必要關係。** 缺失 catalog lookup 的可視操作，以及共同欄位到兩個 response 的明確從屬關係，會使本 Semantic Model 的核心因果與 invariant 無法只靠圖形可靠傳達。

