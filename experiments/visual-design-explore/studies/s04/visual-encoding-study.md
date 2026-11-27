# S04｜Visual Encoding / Visual Treatment Boundary Study

## 1. Fixed Input & Boundary

本輪以既有 [`rough-composition.svg`](./rough-composition.svg) 與 [`rough-composition.png`](./rough-composition.png) 作為 Baseline A，不重新執行 Semantic Modeling、Information Design、Representation、Graphic Construction 或 Composition。執行時 branch 為 `experiment/visual-design-explore`，HEAD 為 `500f8eac3294029d977df9ab34c382a885ff27b9`。

本輪的責任假設如下：

| 責任 | 本輪操作化定義 | 本輪不處理 |
|---|---|---|
| Visual Encoding | 以 fill、value、stroke、pattern、文字角色或其他視覺屬性承載分類、語意或關係，例如 `catalog miss`／`catalog hit`。 | 不重新選擇 response、Consumer、catalog 或 lookup 的表示策略。 |
| Visual Weight | 控制焦點、相對重要性與注意力分配，例如兩張 message card 的等權，以及 message 作為主要焦點。 | 不測量觀眾實際看向哪裡或比較速度。 |
| Visual Treatment | 在既有語意、物件與層級條件下調整表面外觀，例如非語意色調與圓角。 | 不做完整 Visual Refinement、色彩方案探索或重新構圖。 |

固定的案例事實與必要語意來自 [`semantic-model.md`](./semantic-model.md)：同一個缺少 `toDate` 的 invalid query 產生兩個 response；兩者都保留 `HTTP 400`、`INVALID_QUERY`、`data: null`；差異只在 `message` 的 raw text／`m0001` 語意，以及同一 Consumer 對 catalog 的 miss／hit 結果（[§1–§6](./semantic-model.md#1-objects)）。

固定條件：

- 1600×900 畫布；物件身份、數量、座標、寬高、文字內容、文字位置、字體、字級、行高與換行不變。
- request、response comparison frame、common attributes、兩張 response card、Consumer、catalog、兩條 lookup lane 與 outcome 的拓撲不變。
- 所有 path 的 `d`、箭頭方向、連線路徑、pattern、線寬、虛實線與語意 mapping 不變。
- 兩張 message card 維持相同尺寸、相同深色 fill／stroke 與相同相對位置；兩者仍以等權處理。
- Baseline A 的既有 message 焦點意圖保留；本輪不修正既有 cross-panel mapping 或密度問題。

既有方法已把這些邊界分開：G1 處理關係如何表示，G2 處理物件身份與 shared／independent 關係，C2 在固定 geometry 下研究 value／contrast／weight，C4 處理整張圖的配置、層級與密度（[`design-methods.md`](../../design-methods.md#2-可獨立處理的問題索引)）。

## 2. Visual Property Analysis

### 2.1 Baseline A 觀察

下表區分直接可由 SVG／PNG 看到的 Artifact Evidence、既有文件明確記載的 Design Intent，以及本輪對用途的推論。Baseline A 的 SVG 直接定義了 message card、outcome pattern、文字 class 與 frame 結構（[`rough-composition.svg`](./rough-composition.svg#L12-L36)）；PNG 則確認這些屬性在完整畫布上的實際外觀。

| Visual Object | Visual Property | Existing Role | Responsibility | Evidence / 判讀 | Modification Constraint |
|---|---|---|---|---|---|
| 畫布與大部分 frame 內部 | `#f7f7f4`、`#fbfbf9`、`#ededeb` 的低彩度背景／surface fill | 提供統一底色、面板表面與低層級區分 | Treatment；soft fill 同時支援分組 | Artifact：SVG `36`、`46`、`56`、`62`、`95`、`104`、`108` 行。Design Judgment：色相本身沒有在案例中指定語意。 | 可改非語意色調，但不能讓面板與 message 或 outcome 的對比改變到產生新的層級暗示；需記錄可能的 contrast 耦合。 |
| 兩張 message card | `#565652` 深色 fill、`#2b2b29` stroke、白色 message text | 將 `message` 差異放到主要視覺焦點；兩張 card 等尺寸、等樣式 | Weight；物件身份由 response label 與文字內容承載，非由深色本身區分 A／B | Artifact：兩張 card 位於 SVG `75–90` 行，尺寸皆 `686×108`。既有文件明確要求兩張 response 等寬、等重量（[`composition-review.md`](./composition-review.md#d23-應保留的設計成果)）。 | 不改 fill、stroke、尺寸、位置、文字或兩卡相對樣式；本輪只可同步改圓角，並視為可能影響知覺重量的未驗證風險。 |
| `raw text`／`m0001`、`catalog miss`／`catalog hit` | Typography、文字值、結果 label | 直接說明兩種 message 角色與 Consumer 結果 | Encoding；同時以文字大小與位置支援 hierarchy | Artifact：message 值在 `79–89` 行，lookup lane 在 `117–139` 行。Semantic Model 明確規定 raw text 不是 catalog key、`m0001` 才是既有 entry（[`semantic-model.md`](./semantic-model.md#5-differences)）。 | 文字內容、字體、字級、行高、換行與位置固定；不可用外觀變更取代必要文字 mapping。 |
| `catalog miss` lane | `hatch` pattern、較淡 stroke、虛線 input pill 與 `catalog miss` label | 讓 miss 與 hit 不只依靠顏色，並顯示查表失敗的中間關係 | Encoding；pattern／line style 承載結果分類 | Artifact：`hatch` 定義於 `9–11` 行，`outcome-miss` 於 `31` 行；PNG 可見斜線紋理。既有 critique 也明確保留 hatch／label 的非色彩辨識（[`composition-review.md`](./composition-review.md#d23-應保留的設計成果)）。 | pattern、線型、stroke、箭頭與 lane 拓撲固定；不能把 miss／hit 的編碼改成單純色彩。 |
| `catalog hit` lane | 純色 surface、深色 stroke、實線 input pill | 與 miss 形成可追蹤的 hit／miss 對照 | Encoding；也有局部 Weight 差異，但主要由 label、線型與位置共同承載 | Artifact：`outcome-hit` 與兩條 lane 分別在 `32`、`129–140` 行。 | 不改成與 miss 相同的 pattern／線型；允許的 Treatment 只能維持此 mapping。 |
| response comparison frame、Consumer frame、內部 soft containers | stroke、`rx`、containment 與對齊 | frame 將共同欄位、兩個 response、Consumer 與 lookup 分組 | Grouping／object identity + Treatment；不是純 Treatment | Artifact：outer frame、common rail 與 Consumer frame 在 `55–62`、`94–108` 行。Design Judgment：frame 的存在與 stroke 使分組可見，圓角主要是表面處理，但仍可能影響分組強度。 | 可調圓角但不移除 frame、不改 stroke／容器邊界、不合併 response 或 lookup lane。 |
| 所有 connector、guide rule 與 arrow | 實線／虛線、stroke、箭頭 marker | 表示 request→response、message→Consumer 與 lookup 方向；guide rule 也標示共同欄位歸屬 | Encoding + Relationship Representation；部分是 hierarchy cue | Artifact：箭頭 marker、`ink-rule`、`guide-rule` 在 `6–7`、`19–21` 行與各 path。Representation／Construction 的既有責任已涵蓋關係方向與路徑（[`design-methods.md`](../../design-methods.md#2-可獨立處理的問題索引)）。 | 不改 `path d`、箭頭方向、虛實線或 stroke 語意；本輪不以 treatment 方式重畫線路。 |
| eyebrow、label、body、mono text | 字體家族、字級、字重、letter spacing、monospace | 區分區域標題、欄位值、說明文字與 code-like value | Encoding of information role + Weight + Readability | Artifact：class 定義於 `13–27` 行；PNG 可見 headline／section／value 的層級差異。既有文件把 typography 列為 backlog，且指出小字與投影仍未驗證（[`research-plan.md`](../../research-plan.md#7-research-backlog)）。 | 全部固定；不把 Typography 變更混入 Treatment 實驗。 |
| 整張 composition | 上方 request → 中間 response comparison → 下方 Consumer；message cards 的暗值與留白 | 形成由共同基準到 message 差異再到 Consumer 結果的閱讀 hierarchy | Composition + Weight；不等同單一 property | Artifact：完整 layout 可由 SVG `44–144` 行與 PNG 核對。既有 critique 判定 D2.3 以較高資訊負荷換取較完整語意（[`composition-review.md`](./composition-review.md#比較結論)）。 | 不移動、縮放、刪除或重新分層；本輪只測局部表面處理。 |

### 2.2 Frozen Encoding／Weight Constraints

本輪凍結的不是「感知重量已證明相同」，而是可由 artifact 直接核對的條件：

1. `raw text`／`m0001`、`catalog miss`／`catalog hit` 的文字、pattern、線型、方向與關係保留。
2. 兩張 message card 都是 `686×108`，位置分別為 response frame 內的 `translate(28 166)` 與 `translate(766 166)`；fill、stroke、文字與文字幾何相同。
3. message cards 仍是畫面中唯一成對使用深色表面的主要 response object；Variant B 不調整其 value 或 contrast。
4. frame、common attributes 與 Consumer／catalog 的分組仍存在；圓角改變不代表分組或物件身份改變。

「兩卡仍被觀眾感知為等權」與「message 仍是主要焦點」不由上列色值或尺寸自動推出；這兩項保留為 Unverified。既有 C2 也明確指出 contrast 合格與觀眾正確辨識焦點不是同一命題（[`design-methods.md`](../../design-methods.md#5-方法與實驗證據索引)）。

## 3. Controlled Treatment Variant

### 3.1 Variant B 實際變更

Variant B 位於 [`visual-encoding-study/treatment.svg`](./visual-encoding-study/treatment.svg) 與 [`visual-encoding-study/treatment.png`](./visual-encoding-study/treatment.png)。它只做一個受控 Treatment 候選，不是色彩方案比較。

| 屬性 | Baseline A | Variant B | 判定 |
|---|---|---|---|
| 畫布背景 | `#f7f7f4` | `#f7f9fc` | 非語意性冷色微調；保留相近明度。 |
| `.paper` surface | `#fbfbf9` | `#fbfcfe` | 非語意性 surface 微調；不改物件或分組。 |
| `.soft` surface | `#ededeb` | `#eef1f4` | 非語意性 surface 微調；承認可能改變局部對比。 |
| request／outer frame／soft container／outcome radius | `rx=10/12/16/20` | 對應改為 `14/16/20/22` | 圓角作為外觀處理；兩張 message card 與兩條 lane 同步調整。 |
| 其餘視覺屬性 | 原值 | 原值 | 固定。 |

這個變體的可辨識差異是稍冷的 surface 與較柔和的圓角；它沒有改變 message card 的暗值、內容或相對尺寸，也沒有將 miss／hit 改成另一種編碼。若 frame 的圓角被觀眾當成強分組線索，或 surface 微色調改變了 message 與背景的對比，則屬 Treatment 與 Grouping／Weight 的耦合，而不是純 Treatment 變數。

### 3.2 Controlled Variable Verification

以 Baseline A 與 Variant B 的 SVG source 比對：

- 兩版都有 44 個 `<text>` nodes；可見文字內容與所有 `<text>` attributes 完全相同。
- 兩版都有 15 個 `<rect>` nodes（含畫布背景）；所有 rect 的 `x`、`y`、`width`、`height` 相同，差異僅為允許的 `fill`／`rx`。
- 兩版都有 10 個 `<path>` nodes；所有 `d` path geometry 完全相同，箭頭與連線方向未變。
- 既有 message card 的 `686×108` 尺寸、位置與文字幾何未變；兩卡仍使用相同 `.message-card` fill／stroke。
- 未修改與本輪無關的既有 mapping、cross-panel 對齊或密度問題。

### 3.3 Rendering Verification

使用 repository 已有的 Playwright／Chromium，以 headless browser、viewport `1600×900`、`deviceScaleFactor: 1` 從交付 SVG 產生 PNG。Variant B 的 fresh render 結果為：

| 核對項目 | 結果 |
|---|---|
| SVG intrinsic／render 尺寸 | `1600×900` |
| 交付 PNG | `1600×900`、8-bit RGB、non-interlaced |
| page load | 成功；`document.documentElement.scrollWidth/scrollHeight = 1600/900` |
| text nodes | `44`；未見文字溢出、裁切或非預期重疊 |
| PNG 來源 | 由交付 `treatment.svg` fresh render 產生 |

以 WCAG relative luminance 公式核對受影響 surface 的文字對比：Baseline A 的 `paper/ink`、`paper/muted`、`soft/ink`、`soft/muted` 分別為 `15.01:1`、`5.41:1`、`13.27:1`、`4.78:1`；Variant B 分別為 `15.15:1`、`5.46:1`、`13.72:1`、`4.94:1`。深色 message card 的 `message-ink` 與 `message-muted` 對比維持 `7.12:1` 與 `5.62:1`，因為 message card fill／text 未變。這些是色值對比量測，不是感知重量或投影可讀性的證明。

視覺檢視 Baseline A 與 Variant B 的 PNG，未觀察到新增的文字溢出、裁切、非預期重疊或箭頭穿越主要文字。這是 Artifact Evidence／Design Judgment，不等同觀眾理解或投影可讀性已被驗證。

## 4. A/B Comparison & Existing Method Evaluation

### 4.1 A/B Comparison

| 比較面 | 保持不變的證據 | Variant B 的差異／判讀 | 證據類型 |
|---|---|---|---|
| Semantic mapping | 同一 request、兩個 response、共同 error envelope、raw text／`m0001`、同一 Consumer、miss／hit 與兩個 outcome 均保留 | 未觀察到新的語意 mapping 或新的 domain object | Artifact Evidence；PNG review |
| Object identity | response A／B labels、message values、Consumer、catalog 與兩條 lane 的 identity 不變 | 圓角變化沒有合併或重命名物件 | Artifact Evidence |
| Visual focus | message cards 位置、尺寸、深色 fill／stroke、文字與兩卡相對等權固定 | surface tint 與圓角可能改變局部邊界的知覺強度；不能宣稱感知焦點完全不變 | Artifact Evidence；Unverified |
| Encoding | hatch、miss／hit labels、虛實線、箭頭、pattern 與所有 path geometry 固定 | Treatment 沒有取代或弱化必要的非色彩 encoding | Artifact Evidence |
| Treatment | 外層背景、paper／soft surface 與 `rx` 改變 | B 形成可辨識但局部的 softer／cooler appearance | Artifact Evidence；Design Judgment |
| Readability | 文字幾何、字體、字級、行高、換行固定；目前 PNG 無可見裁切 | surface 對比的微小變化是否影響遠距閱讀未測試 | Artifact Evidence；Unverified |

結論是：在這一個候選中，Treatment 可以在固定 Encoding 與固定幾何下變動；但「不改變 Visual Weight」只在 artifact-level constraint 上成立，尚未在 perceptual level 成立。Encoding 與 Weight 也不是完全互不影響：fill／contrast、frame radius／grouping cue、typography／readability 都可能跨責任耦合。

### 4.2 Existing Method Comparison

| 既有方法 | 已涵蓋的責任 | P2-C 發現 | 決定 |
|---|---|---|---|
| G1 Relationship Representation | `Alignment`、`Connection`、`Containment`、`Reference／Reuse` 與關係方向 | 本輪的 miss／hit path、共同 envelope 與 lookup 方向已由既有 representation／construction 關係承載；Encoding 是在既有物件／關係上選擇哪些屬性承載語意，不是另一個 response representation。 | 不新增 G1 以外的 representation 方法。 |
| G2 Object Identity / Shared Object | shared Consumer／catalog、獨立 response／message／lookup lane 的身份與不可合併限制 | `raw text` 與 `m0001` 的差異不能靠 treatment 解決；Variant 保留 shared Consumer 與兩個獨立 response，證明 Treatment 依賴 G2 的 identity constraint。 | 保留既有 G2 handoff 約束。 |
| C2 Value Study / Visual Weight | 固定 geometry，只改 value／contrast／weight；以客觀對比檢查支援質性判斷 | C2 已直接覆蓋 message card 的暗值、相對等權與 focus 候選；本輪避免重做 value exploration，並把 Treatment 對感知重量的影響列為未驗證。 | Visual Weight 不拆成新方法。 |
| C4 Rough Composition / Critique | 整張圖的配置、層級、留白、density、reading path 與 trade-off | C4 已決定 Baseline A 的物件配置與 message priority；Variant 只測局部表面處理，不足以證明另有一個完整 Treatment workflow。 | Treatment 可作既有 Composition／Critique 的受控局部變數。 |

因此，Visual Encoding 與 Visual Representation 的責任有重疊但不完全相同：Representation 選擇關係、物件與可解讀的結構；Encoding 指定「某個視覺屬性如何對應某個語意或分類」。本案例的 encoding mapping 已被 G1、G2、semantic constraints 與 C2 的既有產物共同涵蓋，沒有證據需要擴充 Method Catalog。

Treatment 則提供了一組目前方法沒有單獨命名、但可在既有 Composition／Critique 中局部調整的 surface decisions。它有概念上的責任差異，但本輪沒有證明獨立方法能降低成本、重工或品質風險。

## 5. Boundary Decision & Limitations

### 5.1 五項拆分標準

| 判定標準 | Visual Encoding | Visual Treatment |
|---|---|---|
| 責任獨立性 | **Separate（概念）**：語意 mapping 與關係／物件 representation 可分開描述；pattern／line／value 可能回答「這代表什麼」，而不是「物件如何連接」。 | **Separate（概念）**：surface tint 與圓角可在固定 mapping、geometry 與文字下調整；但 frame appearance 仍可能影響分組感。 |
| 變數獨立性 | **Defer**：本輪未做「固定 Treatment／Weight、反向改 Encoding」的控制實驗；只能確認既有 mapping 被保留。 | **Separate（條件式）**：B 在 source-level 固定 Encoding／geometry 下成功改變 Treatment；但 perception-level 的 focus、等權與可讀性仍 Unverified。 |
| 產物獨立性 | **Retain**：semantic constraints、G1／G2 representation specification 與既有 handoff 已能記錄 encoding mapping；新建獨立 encoding artifact 的新增用途不足。 | **Retain**：Variant SVG／PNG 與 critique record 足以記錄本次受控 surface decision；尚不足以支持新的獨立 handoff contract。 |
| 驗收獨立性 | **Retain**：可獨立核對 mapping、物件身份、pattern／line style 與 semantic constraints；這是既有分層驗收，不是新方法。 | **Retain**：可獨立核對 SVG diff、render、尺寸、overflow／clipping 與質性外觀；無法由此驗證觀眾焦點或投影效果。 |
| 拆分效益 | **Defer**：本輪未比較有／無獨立 Encoding 方法的成本或品質。 | **Defer**：只有一個 Treatment candidate，未做獨立方法的成本／品質對照。 |

### 5.2 Concept／Method／Artifact Decision

| 責任 | Concept | Method | Artifact | 交付結論 |
|---|---|---|---|---|
| Visual Encoding | **Separate** | **Retain** | **Retain** | 保留「視覺屬性如何承載語意」作為可獨立描述的責任，但沿用 G1／G2、semantic constraints 與 C2，不新增方法或檔案類型。 |
| Visual Treatment | **Separate** | **Defer** | **Retain** | 承認 surface appearance 可在條件式固定邊界下獨立調整；暫不建立獨立 Treatment method，將候選與約束留在既有 SVG／critique／composition records。 |

這不是把兩個概念直接推導成兩個執行階段。較合適的目前邊界是：先凍結 semantic mapping、object identity、geometry、必要 Encoding 與 Weight constraints，再於既有 Composition／Critique 中選用受控的 Treatment 變動；若未來需要跨案例交接，才重新評估是否需要獨立 handoff artifact。

### 5.3 Evidence Boundary and Limitations

- **Artifact Evidence：** Baseline A 與 Variant B 的 SVG／PNG、source diff、文字／path／尺寸核對、fresh Playwright render 與 PNG 格式核對。
- **Design Judgment：** B 的冷色微調與較圓的容器形成可辨識外觀差異；目前 PNG 沒有新增可見渲染缺陷；Treatment 的責任可在本案例中被局部描述。
- **Unverified：** 觀眾是否仍把兩張 message card 感知為等權、message 是否仍是主要焦點、投影／明亮環境效果、跨案例適用性、觀眾對 miss／hit 的理解、以及獨立方法的成本／品質效益。

本輪限制必須明確保留：

1. 只測試固定 Encoding 下的 Treatment 變動，沒有進行反向 Encoding 變動實驗。
2. 每個條件只有一個候選：Baseline A 與一個 Treatment Variant B，不能作為方案排名或一般化結論。
3. 沒有驗證觀眾理解、視覺焦點感知、兩欄比較速度、投影效果或跨案例適用性。
4. 沒有進行獨立方法的成本／品質對照，也沒有建立新的 Method Catalog、Skill、Workflow 或正式簡報修改。
5. SVG／PNG 的一致性與無溢出只證明交付檔案事實；不證明 semantic mapping 已被觀眾正確理解，也不證明 Treatment 不會影響感知 Weight。
