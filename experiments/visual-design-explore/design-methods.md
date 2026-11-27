# Method Consolidation：Graphic Construction 與 Composition

## 範圍與判讀方式

本文件只整理截至 `b2371e6` 的既有產物、commit、Draft PR #21 紀錄，以及 Phase 2 的三份邊界研究，不新增設計實驗、不產生新圖形，也不把局部結果提升為整體流程結論。整理對象包括：Semantic Model、Information Allocation、Relationship Scoping、D1–D3、E2–E5、C1–C3 的局部研究，以及 P2-A／P2-B／P2-C 的研究結果。

文中的「已支持」只表示既有產物或客觀核對能直接支持；「設計判斷」表示由 Agent／設計者對畫面作的質性判讀；「尚未驗證」表示現有資料沒有觀眾、投影、runtime 或跨案例證據。

## 1. 工作邊界

| 層次 | 要處理的問題 | 主要輸入 | 產出 | 不負責的問題 |
| --- | --- | --- | --- | --- |
| 語意模型 | 哪些 domain fact、invariant、difference 與關係必須被保留？ | source revision、案例事實、Consumer 契約 | semantic objects、屬性、關係、限制 | 不決定視覺編碼、位置或動畫順序 |
| Communication Framing／Information Abstraction | 對這次傳達而言，哪些語意必須保留、可如何抽象，以及哪些責任不能交給講者補完？ | communication objective、audience、evidence boundary、Semantic Model | 輕量的 core／support／omit、exact／summary／conceptual guard；可由既有方法承載 | 不另建案例事實 SSOT，不決定圖形、位置、視覺重量或固定揭露順序 |
| 視覺物件 | 觀眾要看到哪些可辨識的圖形物件與連接？ | semantic model、已界定的局部關係 | response card、shared baseline、message object、lookup lane、container、path 等 | 不等同於 domain object；共享語意不代表必須合併成一個圖形物件 |
| Visual Representation | 關係原理、表示單元及 shared／independent identity 要如何被理解？ | semantic model、局部關係、representation scope | representation specification、semantic mapping、interpretation constraints | 不決定座標、完整構圖、字體或其他局部幾何 |
| Graphic Construction | 如何把一組必要關係構造成可追蹤的視覺物件與物件關係？ | semantic objects、Relationship Scoping、局部限制 | construction variant、物件身份、alignment／containment／connection／reference–reuse 等構造關係 | 不處理整張畫面的 global hierarchy、畫布分配或連續揭露 |
| Composition | 已選定或已成立的視覺物件，如何在畫布或連續狀態中配置、分級與引導？ | visual object graph、canvas、內容尺寸、優先級、持續性限制 | massing、space arrangement、value／weight、reading path、rough composition、sequence state | 不應藉構圖改寫語意、合併不可合併的 response／lane，或以刪除必要關係換取稀疏 |
| Critique／Verification | 這個設計判斷或交付檔案是否可被核對？ | 完整 PNG／SVG、規格、source、測量結果 | qualitative findings、客觀驗證紀錄、defect／trade-off／uncertainty | Critique 不是真值；artifact verification 也不證明觀眾看懂 |

Graphic Construction 與 Composition 的界線不是「前者畫圖、後者排版」：前者決定關係如何被構造成視覺物件，後者決定既有物件如何共同佔據畫布、形成層級與閱讀路徑。Factoring、Subtraction、Reference／Reuse 等是製作方法，不是必須直接顯示給觀眾的內容；只有它們造成的語意關係或限制需要進入成品。

## 2. 可獨立處理的問題索引

下列問題可以按實際不確定性單獨取用；它們不是固定順序，也不是每次都要全部執行。

| ID／問題類型 | 適用方法 | 必要輸入 | 處理範圍 | 預期輸出 | 驗收方式 |
| --- | --- | --- | --- | --- | --- |
| S1 語意邊界與共同基準 | Semantic Model；Source Guard；Communication Framing guard | 指定 revision、案例資料、既有 Consumer 契約；需要時加入 communication objective、audience 與 evidence boundary | 分開 API error result、`message` 語意與 Consumer compatibility；列出 invariant／difference，並核對必要語意的 abstraction 與 core／support／omit 邊界 | 可供設計取用的 semantic object／relation 清單、不可違反的限制，以及可供下游查找的輕量 framing guard | 能回答同一 input、共同 envelope、差異欄位與結果層次；必要語意未被錯誤抽象；不能把 `compatible` 說成 API 成功；不要求固定執行順序或獨立長期文件 |
| S2 局部關係拆解 | Relationship Scoping | S1；需要觀眾理解的 State／單張圖目標 | 將關係拆成封閉的局部問題，不預先指定色彩、位置、外框或連線形式 | RS3-01–04 類型的問題卡、scope、shared objects、constraints、acceptance | 每個問題可獨立描述其 understanding objective，且不把構造方案偷渡成問題定義 |
| G1 關係表示 | Alignment、Connection、Containment、Reference／Reuse；Relationship Representation | 一個局部關係、物件身份、semantic mapping 與必要 interpretation constraints | 表示共同輸入、共同規則、兩個獨立輸入、lookup 方向或 container 邊界 | 一個或多個低精度 representation variant；必要時形成 Representation Specification | 核對表示原理、semantic mapping、shared／independent identity 與限制；不把構造細節誤當表示決策 |
| G2 物件身份與共享／抽取 | Factoring、Subtraction、Shared Object Integration | semantic invariants、response identity、必要中間關係、representation specification | 決定哪些物件只畫一次並被引用、哪些共同欄位可抽取、哪些不能刪 | response-specific object、shared baseline、lookup object、reuse／reference 關係；記錄 inherited identity constraints | 抽取後仍能看出適用對象、從屬關係與因果鏈；shared／independent identity 不被合併；較少物件不作為唯一成功標準 |
| G3 構造整合 | Relational Composition；D01／D02 decision constraints | 已選的局部 representation、Representation Specification、物件身份、方向限制 | 把局部物件接成一個可交付的 construction；保留 row／lane 對應與共用規則，區分 inherited／construction decisions | 可被 Composition 取用的 visual object graph 或局部 SVG；必要時附 Handoff Record | 物件可辨識、連線方向不製造錯誤匯合、共用規則只出現一次但兩條輸入仍分開；不由 Construction 重選表示策略 |
| C1 空間可行性 | Space Requirement Measurement；Spatial Arrangement | 已定內容、字體／字級／行高、可用區域與高度限制 | 測量換行、auto-height、邊界、欄寬與間距；選擇局部位置與尺寸 | 尺寸、bounding boxes、間距、可行／不可行配置 | 實測無 overflow、overlap、clipping；量測結果不直接宣稱最佳構圖 |
| C2 視覺編碼、焦點與相對重量 | Value Study；Visual Encoding；Visual Weight | 穩定的 geometry、物件身份、semantic mapping、內容優先級、對比／明度候選 | 指定視覺屬性如何承載語意／分類／關係，並在固定物件與空間下調整 value、contrast、weight；同一屬性可同時承擔多種責任 | 可比較的 encoding／focus／weight variants、既有 semantic constraints 或 critique record | 能分辨 changed property 與承載責任；mapping、文字／pattern／line style 與尺寸可核對，但感知焦點、等權與理解仍須測試 |
| C3 閱讀路徑與 mapping | Staging、Alignment、Continuity、Path Disambiguation、Connection | source／destination、lane identity、跨區對應、已有構圖 | 消除斜切、內聚或錯誤匯合造成的閱讀歧義；不新增 domain relation | 每個輸入到目的地的清楚 path；狀態間可延續的物件位置／身份 | 路徑可逐條追蹤、無錯誤合流、箭頭不穿過主要文字；不以靜態檢查宣稱閱讀速度改善 |
| C4 單張構圖、密度與受控 Treatment | Massing；Rough Composition；Independent Composition Critique | 穩定 visual object graph、內容尺寸、message priority、畫布，以及已凍結的 semantic mapping／identity／必要 weight constraints | 配置整張圖的區域、層級、留白與完整內容；可將 surface appearance 作為既有構圖／critique 中的局部變數 | massing sheet、rough composition、SVG／PNG variant、質性 review | 必要物件／關係存在、渲染無明顯幾何缺陷，局部 Treatment 不取代 encoding 或改寫語意；把 artifact invariants、perceptual outcomes、trade-off 與 uncertainty 分開 |
| Q1 狀態分配與物件延續 | Information Allocation；Object Matching；Sequence Construction | semantic model、各狀態理解目標、visual object identity | 決定何時 persist、update、enter、exit；保留共同基準與 A/B lane 身份 | state-by-state allocation table、object matching、SVG／PNG states | 每個狀態只揭露允許的資訊；persistent object 不改名、不被合併；source 與實際交付物一致 |

## 3. 必要依賴（不是固定 Workflow）

依賴描述的是某個問題需要哪些前置事實，不是所有專案都要沿著箭頭走：

```text
案例事實／source guard
        ↓
S1 Semantic Model
        ├─ 關係邊界不清時 → S2 Relationship Scoping
        │                         ↓
        │                   G1 Relationship Representation
        │                         ↓
        │                   G2 Object Identity／Factoring
        │                         ↓
        │                   G3 Construction Integration
        │                         ↓
        │             C1/C2/C3 局部 Composition 問題（按需要取用）
        │                         ↓
        │                   C4 Whole Composition／Critique
        └─ 有連續揭露時 → Q1 Information Allocation／Object Matching
                                  ↓
                            Sequence Construction／Critique

任何 SVG／PNG 交付 ───────────────→ Artifact-level Verification
```

- S1 是語意密集案例的必要候選；S2 只在關係邊界尚未清楚時需要。若單一局部關係已被規格完整界定，可直接進入 G1。
- G1、G2、G3 可以拆開：先只研究 `message` 的表示，不必同時決定 Consumer outcome；也可以在既有 visual object graph 穩定時不重做 Construction。
- C1、C2、C3 是不同的 Composition 變數。C1 的尺寸量測可支援 C1 arrangement，但不會自動決定 C2 焦點或 C4 整張圖的價值。
- Q1 只在有狀態、動畫或連續揭露時必要；它不能替代單張圖的構造或構圖判斷。
- Critique 與 Artifact-level Verification 是兩種不同依賴：前者讀畫面與語意，後者核對 source、render 與檔案事實；任何一方都不能取代另一方。

## 4. Agent 判斷與程式量測／驗證的責任

| 責任 | Agent／設計判斷 | 程式量測／客觀驗證 |
| --- | --- | --- |
| 語意 | 判斷哪些 invariant／difference 是理解必要條件；判斷 `message`、Consumer、outcome 的層次是否被混淆 | 依指定 source、revision、Blob 或檔案內容核對事實；不能自行推導觀眾語意 |
| 構造 | 選擇是否 align、connect、contain、factor、reuse 或 subtract；判斷抽取後關係是否仍可理解 | 核對 SVG 是否可渲染、元素座標、畫布尺寸、文字是否落在範圍內 |
| 構圖 | 決定視覺 hierarchy、massing、value／weight、留白、path 與 density 的取捨；分類 defect／trade-off／uncertainty | 測量 bounding box、換行、間距、contrast ratio、overflow、overlap、clipping |
| 連續狀態 | 決定何者 persist／enter／update、揭露節奏與物件身份是否應保持 | 依 object matching 與檔案內容比對狀態；不能由像素相似度單獨判定語意連續 |
| 交付 | 判斷成品是否保留必要語意、是否適合進入下一個設計問題 | 核對 PNG／SVG 是否為同一交付狀態、尺寸／bytes／pixels 是否一致、是否可重現 |

因此，客觀驗收只能支持「沒有溢出」「尺寸符合」「PNG 與 SVG 一致」等命題；它不能單獨支持「觀眾看懂」「焦點正確」「方法有效」。反過來，質性 critique 發現的視覺風險若涉及檔案或渲染事實，必須再由 artifact-level verification 核對。

## 5. 方法與實驗證據索引

| 方法／實驗 | 既有證據支持的範圍 | 已知缺陷或取捨 | 尚未驗證 |
| --- | --- | --- | --- |
| P2-A Information Design／Semantic Model | [`information-design.md`](./studies/s04/information-design.md) 以 S04 固定案例核對 Communication Framing、Information Abstraction、core／support／omit、必要關係與畫面／講者／補充責任；其結論保留輕量概念責任，並將 Semantic Model 作為案例事實 SSOT、Information Allocation 作為狀態與揭露分配。**Artifact Evidence：** 規格與既有 Semantic Model／Information Allocation 可逐項核對。**Design Judgment：** 集中化可作下游 guard，但整體重疊使獨立階段效益不足。 | 不建立獨立 Information Design 執行階段或長期文件契約；不能把抽象／priority guard 改寫成固定執行順序或視覺方案。 | 跨案例適用性、abstraction／priority 的重工與理解效益、長期文件形態與觀眾／投影效果。 |
| P2-B Visual Representation／Graphic Construction | [`representation-study.md`](./studies/s04/representation-study.md) 的 E1a／E1b 具體區分表示原理、semantic mapping、shared／independent identity、interpretation constraints 與 Construction 的幾何、連線、文字及局部排版；Representation Specification 可交給 G3，Handoff Record 可分辨 inherited decisions、construction decisions 與 gaps。**Artifact Evidence：** `comparison.svg/png`、fresh render 與 SHA 可核對。**Design Judgment：** 交接產物具有本案例用途。 | Concept 與 Artifact 可分開；Method-level 拆分 **Defer**。每種策略只有一個 Construction，沒有有／無規格的成本或品質對照；D01 差異只能限制證據強度，不能被解讀成 handoff failure。 | **Unverified：** 同一 Representation Strategy 下的多種 Construction、有／無規格對照、觀眾理解、投影效果、跨案例適用性與拆分效益。 |
| P2-C Visual Encoding／Visual Treatment | [`visual-encoding-study.md`](./studies/s04/visual-encoding-study.md) 在固定 geometry、identity、文字、path 與既有 mapping 下核對 Encoding 與 Treatment 的差異。**Artifact Evidence：** Baseline／Variant SVG／PNG、source diff、render、尺寸與 contrast 可核對。**Design Judgment：** Encoding 可由既有 G1／G2／C2 承載，Treatment 可作 Composition／Critique 的局部變數。 | Visual Encoding 的概念責任與既有產物 **Retain**；不新增 Encoding 方法或檔案類型。Visual Treatment 為條件式概念 Separate，但 Method-level **Defer**；artifact 沿用既有 SVG／critique records。 | **Unverified：** 反向 Encoding／Treatment 控制、感知 Weight／分組／可讀性、觀眾理解、投影／跨案例效果，以及獨立方法的成本／品質效益。 |
| Semantic Model；Relationship Scoping | `semantic-model.md` 把同一 invalid query、共同 `HTTP 400 / INVALID_QUERY / data: null`、兩個 response、`message` 差異與 Consumer lookup 分開；`relationship-scoping.md` 將 State 3 拆為 RS3-01–04，且每題有 scope 與 acceptance。 | 多份文件重述共同 envelope、response 與 lookup，存在維護與漂移成本；拆解本身尚未跨案例驗證。 | 有無 semantic model／scoping 是否改善觀眾保留 invariant、是否值得文件成本。 |
| Relationship Representation（E2／E3） | E2 的 RS3-03 比較 Parallel Lookup Lanes 與 Nested Contract；E3 的 RS3-02 保留共同基準並放大兩種 `message` 語意。兩者都證明局部規格足以產生局部 representation。 | E2 沒有方案評選；E3 明確不包含 Consumer lookup／compatibility outcome，不能當作完整構圖。 | 哪種表示較快、較準確，或在投影／不同畫布上較穩定。 |
| Factoring／Subtraction；E4／E5 | V2 Factoring 移除共同欄位重複但保留 lookup 因果鏈；V3 Subtraction 因刪除 catalog miss／hit 與共同欄位從屬關係而失敗。E4 讓兩個 message object 各自只出現一次並被 response 與 lookup 共同引用；E5 把共同 request／API baseline 抽成明確適用於兩者的區域。 | Factoring 使從屬關係更依賴標註與版面推論；Subtraction 顯示「更少物件」可能刪掉必要語意；E4／E5 都沒有完整 compatibility outcome 或整體 refinement。 | Factoring 的推論成本在何種畫布、距離與內容密度下會超過減少重複的收益。 |
| Relational Composition；D01／D02／C01 partial | `relational-composition.svg` 實際使用 Alignment、Containment、Connection、Reference／Reuse；D01／D02 固定上下兩列、單一共用 lookup 區域與分離路徑；C01 將兩個 message card 接入 shared lookup。 | 這是構造選擇與局部整合，不是設計品質評選；未完成整體 Composition／Visual Refinement。 | 全部構造整合是否降低誤讀、是否改善整張圖的 hierarchy 與講述負荷。 |
| Massing／Value／Rough Composition | Massing 固定資訊與關係比較空間；Value 固定 geometry 只改明度；Rough Composition 將完整案例填入。這支持隔離設計變數、並觀察完整性與負荷取捨。 | V2／B 的選擇仍是質性判斷；D2.3 比 R1 完整但負荷較高，R1 較低負荷卻需口頭補 lookup。 | 焦點辨識、理解速度、投影可讀性與整體品質；沒有證明 D2.3 或 R1 對觀眾較好。 |
| C1：Space Requirement／Spatial Arrangement | `space-requirement.md` 量得 320／480／640px 的換行與高度；C1c-E1 選 480px + 32px，並在 `1040×360` 內核對 bounding box、換行、無 overflow；結果是局部空間可行。 | 量測使用特定 Chromium fallback font、auto-height 且無外部高度上限；不決定最佳排列，也不代表完整投影片可行。 | 實際簡報字體、投影距離、完整畫布高度與觀眾閱讀效果。 |
| C2：Visual Weight | 固定兩卡 geometry，只改 grayscale weight；`66aacae` 紀錄兩個 message 等權、bounds／換行不變，contrast ratios 為 `6.90:1`、`5.74:1`、`13.20:1`。 | 對比合格不等於焦點被觀眾正確讀取；等權處理也未證明避免了所有 implementation superiority 誤讀。 | 視覺焦點辨識、兩欄比較速度、明亮環境與不同顯示器效果。 |
| C3：Guided Reading Path | `b2371e6` 以 Staging、Alignment、Continuity、Path Disambiguation 將兩條內斜路徑改為外側獨立進入；PNG 與 fresh SVG render byte-for-byte 一致。 | 只驗證路徑構造與交付一致；沒有觀眾路徑追蹤資料，不能宣稱閱讀速度或誤讀率改善。 | 觀眾是否真的沿兩條獨立路徑讀取，以及跨區 mapping 的認知負荷。 |
| Information Allocation／Object Matching／Sequence | 三狀態規格要求共同基準 → `message` 差異 → Consumer 結果，並固定 O1–O10 的 persist／enter／update；D3.4a 以 Blob SHA、1600×900 重渲染與 `0` differing pixels 更正了原先不可重現的 State 2 blocker。 | Sequence critique 曾把畫面印象誤判為 PNG／SVG 不一致；修正後只能說交付一致，不能說 State 2 最佳或觀眾理解成立。 | 播放、講者引導、投影後排可讀性，以及觀眾能否區分 API error result 與 Consumer compatibility。 |
| Independent Critique／Artifact Verification | `graphic-review.md`、`composition-review.md`、`sequence-review.md` 能分辨語意缺口、密度 trade-off、mapping 風險與可見渲染缺陷；D3.4a 顯示檔案事實需獨立核對。 | 單次「independent」不代表第二評審者、盲審或統計可靠性；critique 不能取代量測，量測也不能取代設計判斷。 | 第二評審者一致性、觀眾資料、跨案例再現性、時間／成本／token 效率。 |

## 6. Phase 2 Boundary Consolidation

本節只整合 P2-A、P2-B、P2-C 已完成的研究判定；Concept、Method 與 Artifact 分開判讀，不把概念上的 Separate 直接轉成新的方法、強制產物或固定 Workflow。

### 6.1 Concept／Method／Artifact 最終判定

| Responsibility | Concept | Method | Artifact | 最終承載 |
| --- | --- | --- | --- | --- |
| Information Design | Retain | Retain（既有方法中的輕量責任） | 不要求獨立長期文件 | Communication Framing、Information Abstraction 由既有 Semantic Model／Information Allocation 承載；Semantic Model 維持案例事實、必要關係與 semantic constraints 的 SSOT，Information Allocation 維持狀態、揭露順序與畫面／講者／補充分配。 |
| Visual Representation | Separate | Defer | Retain | G1／G2 可產出 Representation Specification；G3 讀取它並以 Handoff Record 交接，不把一次成功交接提升為每次都要分離的方法。 |
| Visual Encoding | Separate | Retain | Retain | 保留「視覺屬性如何承載語意、分類或關係」的描述責任，沿用 G1／G2、semantic constraints 與 C2，不新增 Encoding 方法或檔案類型。 |
| Visual Treatment | Separate（條件式） | Defer | Retain | 在固定 mapping、identity、geometry、必要 Encoding／Weight 條件下，作為既有 Composition／Critique 的局部變數；沿用 SVG／PNG 與 critique records，不建立獨立 Treatment Workflow。 |

Visual Weight 負責焦點、相對重要性與注意力分配；Visual Treatment 負責在既有語意、物件、構造與層級條件下的外觀處理。Treatment 的獨立調整只在條件式固定邊界下成立；它可能影響分組、感知 Weight 與可讀性，故不能以 source-level 不變直接宣稱 perceptual-level outcome 不變。

### 6.2 受影響方法的輸入、產物、下游與驗收

| 責任／方法 | 必要輸入 | 預期產物 | 下游依賴 | 驗收、適用條件與證據限制 |
| --- | --- | --- | --- | --- |
| Communication Framing／Information Abstraction（由 S1 與 Q1 承載） | Communication Objective、Audience Context、Presentation Context、Evidence Boundary、Semantic Model 的必要語意 | 輕量的 core／support／omit、exact／summary／conceptual guard；不要求獨立長期文件 | 支援 G1／G2／G3 與 Q1，但不預先規定它們的固定順序 | 核對必要語意未被刪除或錯誤改寫、不可由講者補完的關係有承載責任；S04 有 Artifact Evidence 與 Design Judgment，跨案例與抽象／priority 效益 Unverified。 |
| G1 Relationship Representation | 局部關係、物件身份、semantic mapping、shared／independent constraints | 低精度 representation variant；需要交接時附 Representation Specification | G2／G3、後續 Composition | 核對表示原理、semantic mapping、shared／independent identity 與 interpretation constraints；只適用於已界定的局部關係，S04 交接用途有 Artifact Evidence，Method-level split 仍 Defer。 |
| G2 Object Identity／Shared Object | Semantic invariants、response identity、必要中間關係、Representation Specification | response-specific object、shared object、reuse／reference 關係與 inherited identity constraints | G3、C3／C4 與任何需要 shared／independent 判定的構造 | 核對抽取後適用對象、從屬關係與因果鏈仍可見，不能以物件較少作唯一標準；跨案例的推論成本與效益 Unverified。 |
| G3 Construction Integration | 已選 representation、Representation Specification、物件身份、方向限制與 Construction constraints | 可交付 visual object graph／局部 SVG，以及區分 inherited decisions、construction decisions、handoff gaps 的 Handoff Record | C1–C4 或 Q1；依實際不確定性取用，不形成固定 Workflow | 核對不得重選表示策略、必要物件／關係可追蹤、連線／標籤／幾何無明顯缺陷；`comparison.svg/png` 支持本案例 artifact facts，但 D01 解讀修正後仍只有單一 Construction／策略。 |
| C2 Visual Encoding／Visual Weight | 穩定 geometry、object identity、semantic mapping、內容優先級與待比較視覺屬性 | encoding／focus／weight variants、既有 semantic constraints、SVG／PNG 或 critique record | C4 Composition／Critique；必要時回饋 G1／G2 的 mapping 或 identity 問題 | 核對 source-level changed property、文字／pattern／line style、尺寸與 contrast；artifact facts 不等於感知 Weight、焦點或觀眾理解，且本案未做反向 Encoding 控制。 |
| C4 Composition／Critique 中的 Visual Treatment | 已凍結 mapping、identity、geometry、必要 Encoding／Weight constraints | 局部 SVG／PNG variant 與 critique record | 既有 Composition／Critique 的後續局部調整 | 核對 artifact-level invariants（物件、文字、path、尺寸、overflow／clipping）與局部外觀差異；perceptual-level outcomes（分組、Weight、可讀性、投影）仍 Unverified，故不形成獨立 Treatment method。 |

### 6.3 Phase 2 證據與依賴限制

- **Artifact Evidence：** 三份研究文件所引用的規格、SVG／PNG、source diff、fresh render、尺寸、文字／path、contrast 與 SHA／pixel 核對，只支持文件或產物可直接核對的事實。
- **Design Judgment：** 對責任邊界、下游用途、mapping 負擔、局部外觀差異與拆分成本的質性判斷，不能單獨證明方法效益。
- **Unverified：** 觀眾理解、感知 Weight、分組、投影可讀性、跨案例適用性、整體使用成本與品質效益均不因本輪整合而變成已驗證。
- 同一視覺屬性可能同時承擔 Encoding、Weight、Treatment 或 Grouping 責任；應依該屬性在案例中的用途判定責任，不依屬性種類預先分類。Artifact-level invariants 與 perceptual-level outcomes 必須分開記錄。
- 所有依賴仍是條件式設計依賴：representation 可為 Construction 的輸入，encoding／weight／treatment 的限制可供 Composition／Critique 使用，但不存在由此推導的固定 Workflow。

## 7. 收束結論

1. Graphic Construction 的最小責任是保留必要關係並建立可追蹤的視覺物件；Composition 的最小責任是配置、分級與引導已成立的物件。兩者都不能藉「簡潔」偷偷刪除語意。
2. Semantic objects、visual objects、construction methods 必須分開命名。`message` 共享語意，不代表必須畫成一個 shared message；`MESSAGE_CATALOG` 可是單一共享物件，但兩個 lookup input 與 outcome 仍須保持分離。
3. Factoring、Subtraction、Massing、Value、Spatial Arrangement、Visual Weight、Guided Path 都是針對特定不確定性的選用方法。既有證據支持「方法可隔離局部變數」或「局部構造可行」，不支持固定 Workflow 或整體效率／品質改善。
4. 驗收要分兩條：設計判斷確認語意、層級與取捨；程式／檔案核對確認尺寸、渲染、overflow、bytes 或 pixels。兩條證據不可互相冒充。
5. 本輪最穩定的成果是問題邊界、必要關係與客觀交付核對方式；觀眾理解、投影效果、跨案例有效性與整體流程效益仍然是未驗證事項。
