# 從寫 Code 到設計工作｜Presentation Planning Baseline

> 本文件保存已人工確認的 Presentation Creator Step 1–3，供後續新 Codex Session 執行 Step 4–8 時使用。
>
> 本文件是製作規劃與 Slide Sequence，不是投影片原始碼、視覺設計稿、講者逐字稿或技術案例全文。

## Planning Status

| Step | 狀態 | 本文件的邊界 |
| --- | --- | --- |
| Step 1｜Presentation Brief | **已確認** | 保存 audience、setting、venue、messages 與 format。 |
| Step 2｜Story Spine | **已確認** | 保存六段 Spine、Why this story、Position、Stakes 與 Ending。 |
| Step 3｜Slide Sequence | **已確認** | 保存第二輪收斂後的完整 32 頁、六章與 18 個內容單元。 |
| Step 4｜Write slide copy | 尚未執行 | 不在本次任務處理。 |
| Step 5｜Visual design | 尚未執行 | 不在本次任務處理；本文件的 Slide Type 只表示敘事職責，不是版型定稿。 |
| Step 6｜Speaker notes | 尚未執行 | 不在本次任務處理。 |
| Step 7｜Emit Slidev deck | 尚未執行 | 不修改 `slides.md` 或其他 Slidev 檔案。 |
| Step 8｜QA | 尚未執行 | 不進行視覺、投影或播放驗收。 |

### 已確認／暫定／待確認的使用方式

- **已確認的決策**：Step 1–3 的 brief、六段 Story Spine、Position、Ending、六章／18 單元，以及第二輪核准的 32 頁順序；每頁的 Slide Type 也已確認為敘事角色。
- **暫定的製作選擇**：Evidence 呈現方式、素材裁切方式、視覺版型、Click／跨頁實作方式與時間配置。這些可服務已確認的敘事，但不能在 Step 4–8 前視為視覺定稿。
- **後續待確認的素材**：尚未選定或尚未以同一 Source Revision 產出的 code、browser evidence、Skill、Workflow 交接物、Vue 部署故事與最終投影驗收資料。

## Presentation Brief

- **主題**：從寫 Code 到設計工作
- **對象**：新進軟體工程師
- **場合**：公司內部 Live Talk
- **時間**：35–40 分鐘
- **Venue**：明亮會議室，一般投影機或電視
- **格式**：Slidev、16:9、Speaker-led

### 三個核心訊息

1. AI 能完成程式，不代表成果能可靠交付；仍需要規格、介面、限制、依賴與驗收。
2. 模組化思維也能用來設計工作，從 Prompt、Skill 延伸到 Workflow。
3. AI 使工程知識的重要性更早浮現，也能協助工程師學習。

### 貫穿案例與敘事方法

- 以同一個訂單查詢 API 需求貫穿主要論述；案例的技術細節由 PR #13 的 Order API message-code source 負責，本文件只保存其在投影片中的用途。
- 以兩個鏡頭連續推進：**System View** 看交付後的系統如何由責任、介面與依賴組合；**Work View** 看完成系統的工作如何定義、委派、交接與驗收。
- 案例是原創／合成素材。Browser MSW、測試與產出證據不等同真實外部 API Server 或資料庫執行證據；後續呈現時須保留此限制。

## Story Spine

以下六個 Beat 已人工核准。為方便對照 Slide Sequence，使用 B1–B6 作為短標記。

| 短標記 | Beat | 已確認內容 |
| --- | --- | --- |
| B1 | Once upon a time | 工程師透過規格、模組分工、介面與測試合作。 |
| B2 | Every day | 日常工作依賴許多未必明寫在需求中的既有約定。 |
| B3 | One day | AI 能快速完成超出既有經驗的工作，但功能可執行不代表能可靠交付。 |
| B4 | Because of that | 以模組化思維明確定義工作契約，將可重用程序封裝成 Skill。 |
| B5 | Because of that | 理解上下游與 SDLC 依賴，透過 Workflow 安排、組合及驗收工作。 |
| B6 | Until finally | AI 讓工程判斷的門檻更早出現，也能協助工程師建立理解。 |

### Why this story（依已確認內容整理）

新進工程師可能先看到「AI 能寫出可執行程式」，但可靠交付還依賴既有契約、責任邊界、上下游依賴與驗收判斷。用同一個需求逐步放大從 Code、模組、工作契約、Skill 到 Workflow 的視角，可以把 AI 協作放回工程師原本就需要的設計與交付工作，而不是把問題簡化成 Prompt 長短或工具技巧。

### Position

**AI 協作能力的提升，仰賴工程師設計、組合與驗收工作的能力。**

### Stakes（依已確認內容整理）

若只把「能執行」當成「能交付」，產出可能與既有 Consumer、命名、責任分工或訊息契約不相容；若只把工作交給 AI 而不理解依賴與驗收，新人會更早接觸超出經驗範圍的工作，卻未必能可靠判斷結果。相反地，若能逐步擴大定義、整合與判斷工作的能力，就能更充分利用 AI，也能讓 AI 協助自己建立工程理解。

### Ending（必須保留原文）

「要充分利用 AI 的能力，工程師需要擴大自己定義、整合與判斷工作的能力；AI 也可以成為學習這些能力的工具。」

## Confirmed Slide Sequence｜32 頁

以下 32 頁順序是經人工確認的 Step 3 第二輪結果。每頁的 Evidence 欄只整理已存在的來源或明確標記待確認事項；不新增案例證據、不複製 PR #13 的技術案例全文。

### Opening

### Slide 1｜從寫 Code 到設計工作

- **工作標題**：從寫 Code 到設計工作
- **Chapter／來源內容單元**：Opening／Step 1 Brief、Step 2 Story Spine
- **主要訊息／Slide Intent**：建立全場主題：工程師要設計的不只是程式，也包括工作。
- **Slide Type**：`statement`
- **Spine Beat**：Opening，連接 B1–B6
- **Evidence／素材需求**：已確認的標題、主題與核心訊息即可；不需要外部證據。標題頁的副標、案例標籤與是否顯示時間待 Step 4–5 決定。
- **Transition**：說明觀眾將如何跟著同一個 Order API 放大視角。

### Slide 2｜今天要放大哪些視角？

- **工作標題**：今天要放大哪些視角？
- **Chapter／來源內容單元**：Opening／Story Spine、六章主張
- **主要訊息／Slide Intent**：預告功能、模組、工作契約、Skill、SDLC、Workflow 的推進。
- **Slide Type**：`goals`
- **Spine Beat**：B3 → B4 → B5
- **Evidence／素材需求**：使用已確認的六章概念路徑；不需新增技術案例。三個 takeaways 的最終投影片字數待 Step 4 確認。
- **Transition**：提出「可執行是否等於可交付」的張力。

### Slide 3｜能執行，是否就代表能交付？

- **工作標題**：能執行，是否就代表能交付？
- **Chapter／來源內容單元**：Opening／第一章 01
- **主要訊息／Slide Intent**：建立全場核心問題。
- **Slide Type**：`question`
- **Spine Beat**：B3
- **Evidence／素材需求**：沿用第一章 01 的訂單查詢 API 需求與「功能看起來可用」起點；具體 request／response 版本須與 PR #13 的 Source Revision 一致。
- **Transition**：進入實際 API 交辦與執行結果。

### 第一章｜問題從哪裡開始？

### Slide 4｜交辦一支訂單查詢 API，功能確實能跑

- **工作標題**：交辦一支訂單查詢 API，功能確實能跑
- **Chapter／來源內容單元**：第一章／01
- **主要訊息／Slide Intent**：讓觀眾看到需求與正常執行結果。
- **Slide Type**：`code / data`
- **Spine Beat**：B3
- **Evidence／素材需求**：PR #13 head `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329` 所指向的合成 Order API 與 browser evidence 可作來源；後續須以同一 revision 重新產出或取得展示資料，並清楚標示 Browser MSW／合成限制。不可把它描述成真實後端執行。
- **Transition**：從正常結果轉向錯誤回應與整合契約。

### Slide 5｜`message` 不是自由文字，而是既有 UI 契約

- **工作標題**：`message` 不是自由文字，而是既有 UI 契約
- **Chapter／來源內容單元**：第一章／02
- **主要訊息／Slide Intent**：顯示 AI-direct 與既有 Consumer 在 `message` 上的不相容。
- **Slide Type**：`framework`
- **Spine Beat**：B2 → B3
- **Evidence／素材需求**：PR #13 的 message-code source、前端 catalog、既有 Consumer 與相容性測試是唯一案例來源；需要選定可讀的錯誤 response、代碼表與 Consumer 片段。不要在本文件重現整份案例。
- **Transition**：從對外 Response 擴展到內部架構與命名。

### Slide 6｜既有契約也藏在命名與責任分層

- **工作標題**：既有契約也藏在命名與責任分層
- **Chapter／來源內容單元**：第一章／02
- **主要訊息／Slide Intent**：說明交付相容性也包含專案既有分層與命名。
- **Slide Type**：`framework`
- **Spine Beat**：B2 → B3
- **Evidence／素材需求**：從 PR #13 同一 Source Revision 的 `application.ts`／相關架構來源選取最小 code 或路徑圖，對照 AI-direct 與 project-convention；具體展示範圍、去重與可讀性待 Step 4–5 確認。
- **Transition**：收回技術細節，對照交辦與驗收。

### Slide 7｜交辦寫的是功能，驗收依賴的是既有規格

- **工作標題**：交辦寫的是功能，驗收依賴的是既有規格
- **Chapter／來源內容單元**：第一章／03
- **主要訊息／Slide Intent**：將訊息代碼、分層、命名、測試等資訊統整為隱含背景。
- **Slide Type**：`statement`
- **Spine Beat**：B2 → B3
- **Evidence／素材需求**：由 Slide 4–6 的已選案例材料回收；不新增獨立證據。需確認回收頁只保留已在前頁展示、且能追溯到 PR #13 或既有分鏡的內容。
- **Transition**：將這些背景命名為工程師日常使用的規格。

### Slide 8｜從交付落差到規格與模組

- **工作標題**：從交付落差到規格與模組
- **Chapter／來源內容單元**：第一章 → 第二章／01–03 → 04–05
- **主要訊息／Slide Intent**：真正切換觀看角度：從「結果是否可交付」轉向「工程師如何合作」。
- **Slide Type**：`section-divider`
- **Spine Beat**：B1 → B2
- **Evidence／素材需求**：使用前章留下的契約／架構元素作轉場；不新增證據。Divider 的文字與前後視覺承接待 Step 5 驗證。
- **Transition**：先看規格實際存在於哪些載體。

### 第二章｜工作拆分如同模組設計

### Slide 9｜規格不只存在於規格書

- **工作標題**：規格不只存在於規格書
- **Chapter／來源內容單元**：第二章／04
- **主要訊息／Slide Intent**：展示 Method、型別、Constructor、Consumer 與測試都是規格來源。
- **Slide Type**：`code`
- **Spine Beat**：B1
- **Evidence／素材需求**：第二章分鏡指定使用 PR #13 對應 Source Revision 的真實 `OrderService.search(query: OrderQuery): Promise<OrderPage>` 及相關型別／Consumer／測試來源。不得僅由 method signature 推論完整 UTC、排序或分頁規則；需在素材中保留必要限制。
- **Transition**：從局部簽章拉遠到模組合作。

### Slide 10｜模組靠責任、介面與依賴合作

- **工作標題**：模組靠責任、介面與依賴合作
- **Chapter／來源內容單元**：第二章／04
- **主要訊息／Slide Intent**：說明模組不需知道全部內部細節，但必須依靠合作契約。
- **Slide Type**：`framework`
- **Spine Beat**：B1
- **Evidence／素材需求**：沿用 PR #13 案例的 Controller／Service／DAO／Drizzle／transport 路徑與第二章分鏡的 Responsibility、Interface、Dependency、Encapsulation 聚焦。這是案例中的合理分層，不宣稱層數越多越好。
- **Transition**：將同一套設計問題套用到工作單元。

### Slide 11｜System View 可以切換成 Work View

- **工作標題**：System View 可以切換成 Work View
- **Chapter／來源內容單元**：第二章／05
- **主要訊息／Slide Intent**：從程式模組切換到完成系統的工作單元。
- **Slide Type**：`framework`
- **Spine Beat**：B4
- **Evidence／素材需求**：使用第二章已確認的連續視覺語言：System View 與概念性的 Work View「建立 Table → 實作 API → 開發前端」。需明示 Work View 是工作交接示意，不把節點與 runtime class 一對一對應，也不把 Mock 當成真實建立資料表。
- **Transition**：放大「實作 API」這個工作。

### Slide 12｜一項工作也需要完整工作契約

- **工作標題**：一項工作也需要完整工作契約
- **Chapter／來源內容單元**：第二章／05
- **主要訊息／Slide Intent**：建立 Input、Output、Responsibility、Constraints、Acceptance 五個面向。
- **Slide Type**：`framework`
- **Spine Beat**：B4
- **Evidence／素材需求**：使用 v0.9.3 與第二章分鏡已確認的工作契約欄位及訂單查詢案例對應；這是規劃框架，不需另造技術證據。各欄位的最終 slide copy 待 Step 4。
- **Transition**：說明契約清楚不代表要預先決定所有實作步驟。

### Slide 13｜對外清楚，對內保留實作彈性

- **工作標題**：對外清楚，對內保留實作彈性
- **Chapter／來源內容單元**：第二章／05
- **主要訊息／Slide Intent**：說明封裝的是執行細節，不是必要的風險與協商。
- **Slide Type**：`statement`
- **Spine Beat**：B4
- **Evidence／素材需求**：使用第二章分鏡的「程式模組／工作單元」對外契約、內部可封裝、不能忽略的未知事項對照。需在後續驗收中確認沒有把「可封裝」誤讀成「可忽略契約」。
- **Transition**：進入可重用執行方法與 Skill。

### 第三章｜從 Prompt 到 Skill：封裝工作

### Slide 14｜把工作契約交給 AI

- **工作標題**：把工作契約交給 AI
- **Chapter／來源內容單元**：第二章 → 第三章／05 → 06
- **主要訊息／Slide Intent**：從工作契約切換到 AI 協作介面。
- **Slide Type**：`section-divider`
- **Spine Beat**：B4
- **Evidence／素材需求**：回用 Slide 12–13 的工作契約與 Prompt 入口；不新增案例證據。Divider 是否需要顯示 Prompt／Skill 關鍵詞待 Step 5。
- **Transition**：對照原始 Prompt 與改善後的工作要求。

### Slide 15｜Prompt 可以把隱含契約變成明確資訊

- **工作標題**：Prompt 可以把隱含契約變成明確資訊
- **Chapter／來源內容單元**：第三章／06
- **主要訊息／Slide Intent**：說明有效 Prompt 應補上規範、邊界、驗收與未確認事項。
- **Slide Type**：`framework`
- **Spine Beat**：B4
- **Evidence／素材需求**：以 v0.9.3 的原始／改善 Prompt 為內容來源，並對齊 PR #13 的 message-code、TypeScript 分層與修改邊界。最終 prompt 文字、可公開程度與展示長度待 Step 4。
- **Transition**：分離每次任務的變動內容與可重用方法。

### Slide 16｜每次任務不同，但執行方法可以重用

- **工作標題**：每次任務不同，但執行方法可以重用
- **Chapter／來源內容單元**：第三章／07
- **主要訊息／Slide Intent**：區分任務變動部分與程序、規範、檢查方法等共通部分。
- **Slide Type**：`framework`
- **Spine Beat**：B4
- **Evidence／素材需求**：使用 v0.9.3 已確認的「每次不同／可以重用」對照；不需要複製 Skill 文件。具體 reusable procedure 的名稱與例子待後續選定。
- **Transition**：具體展示可重用程序的形狀。

### Slide 17｜Skill 封裝一類工作的執行程序

- **工作標題**：Skill 封裝一類工作的執行程序
- **Chapter／來源內容單元**：第三章／08
- **主要訊息／Slide Intent**：展示 Skill 如何封裝讀取、確認、實作、測試與回報。
- **Slide Type**：`framework`
- **Spine Beat**：B4
- **Evidence／素材需求**：v0.9.3 提供 Implement Skill 的程序骨架；目前尚未選定可公開展示的具體 Skill、文件摘錄或實際任務。後續須選定素材並確認其不會把 Skill 誤示為固定腳本或完整系統。
- **Transition**：界定 Skill 的能力邊界。

### Slide 18｜Skill 是有邊界的工作單元，不是完整交付系統

- **工作標題**：Skill 是有邊界的工作單元，不是完整交付系統
- **Chapter／來源內容單元**：第三章 → 第四章／08–09
- **主要訊息／Slide Intent**：合併原 Slide 18／20；一次說清楚 Skill 的執行方法邊界與系統交付邊界。
- **Slide Type**：`statement`
- **Spine Beat**：B4 → B5
- **Evidence／素材需求**：使用 v0.9.3 與第二章分鏡的「Skill 封裝單一工作方法」及「需求、設計、驗收、上下游依賴不會自動包含」對照；不新增一個技術案例。合併後的單頁資訊密度待 Step 5 驗證。
- **Transition**：從單一工作單元切換到上下游與整體交付。

### 第四章｜從工作介面到 Whole Picture：SDLC

### Slide 19｜從單一 Skill 拉遠到整體交付

- **工作標題**：從單一 Skill 拉遠到整體交付
- **Chapter／來源內容單元**：第四章／08–09 → 10–12
- **主要訊息／Slide Intent**：標示從局部工作方法切換到系統級依賴。
- **Slide Type**：`section-divider`
- **Spine Beat**：B5
- **Evidence／素材需求**：沿用 Slide 18 的 Work View 與上下游節點，逐步帶出需求／設計／契約到測試／部署／交付；這是敘事轉場，不需新增獨立案例證據。
- **Transition**：追查上游工作如何提供下游 Input。

### Slide 20｜上游工作的 Output，常常就是下游工作的 Input

- **工作標題**：上游工作的 Output，常常就是下游工作的 Input
- **Chapter／來源內容單元**：第四章／10
- **主要訊息／Slide Intent**：說明需求與設計產物如何成為實作前提。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：使用 v0.9.3 的需求分析 → 系統設計 → 程式實作關係，並可回用第二章的 Schema／API 契約交接物。具體交接物與是否採實例或概念圖待 Step 4–5。
- **Transition**：將多個交付活動放入 SDLC 地圖。

### Slide 21｜SDLC 是理解交付活動的地圖

- **工作標題**：SDLC 是理解交付活動的地圖
- **Chapter／來源內容單元**：第四章／11
- **主要訊息／Slide Intent**：展示需求、設計、實作、測試、部署、維運的全貌。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：使用 v0.9.3 的 SDLC 工作節點。需保留「理解活動與交接的地圖，不主張必須線性執行」的限制；圖形、節點粒度與是否重用 Work View 待 Step 5。
- **Transition**：從活動順序轉成依賴與回饋。

### Slide 22｜Whole Picture 不只是記順序，而是理解依賴

- **工作標題**：Whole Picture 不只是記順序，而是理解依賴
- **Chapter／來源內容單元**：第四章／12
- **主要訊息／Slide Intent**：顯示契約跨越 API、實作、前端與測試，且測試可能反向影響設計。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：可回用 PR #13 的 message-code contract 作為跨 API／前端／Consumer／測試的具體依賴；其餘 SDLC 回饋關係仍屬概念示意，須標示抽象程度，不延伸成技術案例全文。
- **Transition**：從「理解依賴」切換到「如何安排工作」。

### Slide 23｜從理解依賴到安排工作

- **工作標題**：從理解依賴到安排工作
- **Chapter／來源內容單元**：第四章 → 第五章／12 → 13
- **主要訊息／Slide Intent**：保留原 Slide 24 的真正轉場功能，但不提前講 Workflow 內容。
- **Slide Type**：`section-divider`
- **Spine Beat**：B5
- **Evidence／素材需求**：只需保留 Slide 22 的依賴圖與轉場問題；不提前放入 Waterfall／Agile／TDD 或 Workflow 內容。純 Divider 的閱讀密度待 Step 5。
- **Transition**：對照不同工作安排方式。

### 第五章｜Workflow：組合、調整與取捨

### Slide 24｜同一組工作，可以有不同安排方式

- **工作標題**：同一組工作，可以有不同安排方式
- **Chapter／來源內容單元**：第五章／13
- **主要訊息／Slide Intent**：用 Waterfall、Agile、TDD 說明粒度、順序與回饋的調整。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：使用 v0.9.3 已確認的同一組工作單元與三種安排方式；需保留它們不是同層級、可直接互換的完整方法比較。最終例子與限制待 Step 4。
- **Transition**：區分 Skill 與 Workflow。

### Slide 25｜Skill 描述「怎麼做」，Workflow 描述「怎麼組合」

- **工作標題**：Skill 描述「怎麼做」，Workflow 描述「怎麼組合」
- **Chapter／來源內容單元**：第五章／14
- **主要訊息／Slide Intent**：清楚區分單一工作方法與多工作協作安排。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：使用 v0.9.3 的 `需求釐清 → Spec → Tickets → Implement → Review / Verify` 骨架；各節點是否用實際可公開產物呈現尚待選定。
- **Transition**：讓交接產物與驗收關係具體化。

### Slide 26｜Workflow 的品質取決於交接與驗收

- **工作標題**：Workflow 的品質取決於交接與驗收
- **Chapter／來源內容單元**：第五章／14
- **主要訊息／Slide Intent**：展示 Spec、Ticket、實作、Review、Verify 如何形成可追溯鏈。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：目前只有 v0.9.3 的流程骨架與規劃層級交接關係；具體 Spec、Ticket、Review／Verify 範例尚未選定，標記為待補素材，不自行創造實例。
- **Transition**：進入工作拆分過多或過少的取捨。

### Slide 27｜能拆分，不代表應該無限拆分

- **工作標題**：能拆分，不代表應該無限拆分
- **Chapter／來源內容單元**：第五章／15
- **主要訊息／Slide Intent**：對照單一 Method、過度拆分與合宜分工，說明協作成本與責任清晰度的取捨。
- **Slide Type**：`framework`
- **Spine Beat**：B5
- **Evidence／素材需求**：使用 v0.9.3 的三種責任分工與 AI 工作安排對照；這是概念框架，不能把「大量層次／介面」寫成未有來源支持的具體數字。需確認投影片仍維持 Cohesion／Coupling／Interface／Composition 的取捨，而非宣稱固定最佳架構。
- **Transition**：回看前面每次視角擴張代表的工程判斷。

### 第六章｜回頭看：AI、認知門檻與工程師成長

### Slide 28｜寫 API → 模組 → 工作契約 → Skill → Workflow

- **工作標題**：寫 API → 模組 → 工作契約 → Skill → Workflow
- **Chapter／來源內容單元**：第六章／16
- **主要訊息／Slide Intent**：合併原 Slide 29／30 的章節入口與回顧功能；呈現視角擴張本身就是成長。
- **Slide Type**：`statement`
- **Spine Beat**：B6
- **Evidence／素材需求**：重用前面已建立的全場圖形與概念節點；不新增證據。圖形如何在同一頁承擔章節入口與 unit 16 回顧，待 Step 5 原型驗證。
- **Transition**：將開場案例重新解讀為認知門檻。

### Slide 29｜AI 降低執行門檻，卻讓認知門檻提前出現

- **工作標題**：AI 降低執行門檻，卻讓認知門檻提前出現
- **Chapter／來源內容單元**：第六章／17
- **主要訊息／Slide Intent**：說明 AI 能產生 Code，但不會自動補足可靠交付所需的工程知識。
- **Slide Type**：`big-statement`
- **Spine Beat**：B6
- **Evidence／素材需求**：回收開場 API、message-code 與既有契約的同一案例；需標示 AI-direct 是人為設計的合成對照，不宣稱真實模型產出或模型評測結果。
- **Transition**：轉向 AI 協助建立理解的可能性。

### Slide 30｜AI 也可以協助跨越認知門檻

- **工作標題**：AI 也可以協助跨越認知門檻
- **Chapter／來源內容單元**：第六章／18
- **主要訊息／Slide Intent**：用 Vue 部署故事說明委派、發現缺口、查證與建立理解的循環。
- **Slide Type**：`framework`
- **Spine Beat**：B6
- **Evidence／素材需求**：Vue 部署故事目前只有 v0.9.3 的敘事描述；可公開性、原始紀錄、Log／Apache 素材與是否能以真實證據呈現均待確認。若無法提供可追溯素材，需在 Step 4–8 另定安全且不虛構的呈現方式。
- **Transition**：進入正式全場 recap。

### Closing

### Slide 31｜Recap：五個視角的推進

- **工作標題**：Recap：五個視角的推進
- **Chapter／來源內容單元**：Closing／第一至第五章回收
- **主要訊息／Slide Intent**：每個核心章節只保留一行主要訊息。
- **Slide Type**：`recap`
- **Spine Beat**：B1 → B5
- **Evidence／素材需求**：回收前五章已確認內容；五行文字固定為：可執行不等於可交付、規格與模組支援工程協作、工作契約可以封裝成 Skill、Skill 必須放在上下游與 SDLC 中理解、Workflow 需要依風險／依賴／成本取捨。無需新增技術證據。
- **Transition**：落到已核准 Ending。

### Slide 32｜Ending：擴大定義、整合與判斷工作的能力

- **工作標題**：Ending：擴大定義、整合與判斷工作的能力
- **Chapter／來源內容單元**：Closing／Step 2 Ending、18
- **主要訊息／Slide Intent**：保留已確認的結尾，不新增結論。
- **Slide Type**：`big-statement`
- **Spine Beat**：B6
- **Evidence／素材需求**：不需要新增證據；必須逐字保留已核准 Ending。Ending 的字級、換行、講者停頓與結束後是否進入 Q&A 待 Step 5–8。
- **Transition**：結束語；是否接 Q&A／討論尚未在 Step 3 定義。

## 六章／18 個內容單元覆蓋對照

| 章節 | 內容單元 | 修訂後頁面 | 覆蓋狀態 |
| --- | --- | --- | --- |
| 第一章｜問題從哪裡開始？ | 01 | 3–4 | 已覆蓋 |
|  | 02 | 5–6 | 已覆蓋 |
|  | 03 | 7 | 已覆蓋 |
| 第二章｜工作拆分如同模組設計 | 04 | 9–10 | 已覆蓋 |
|  | 05 | 11–13 | 已覆蓋 |
| 第三章｜從 Prompt 到 Skill：封裝工作 | 06 | 15 | 已覆蓋 |
|  | 07 | 16 | 已覆蓋 |
|  | 08 | 17–18 | 已覆蓋 |
| 第四章｜從工作介面到 Whole Picture：SDLC | 09 | 18–19 | 已覆蓋 |
|  | 10 | 20 | 已覆蓋 |
|  | 11 | 21 | 已覆蓋 |
|  | 12 | 22–23 | 已覆蓋 |
| 第五章｜Workflow：組合、調整與取捨 | 13 | 24 | 已覆蓋 |
|  | 14 | 25–26 | 已覆蓋 |
|  | 15 | 27 | 已覆蓋 |
| 第六章｜回頭看：AI、認知門檻與工程師成長 | 16 | 28 | 已覆蓋 |
|  | 17 | 29 | 已覆蓋 |
|  | 18 | 30 | 已覆蓋 |

**結果：18／18 個內容單元已覆蓋，無單元遺失。** Opening 的 Slides 1–2 與 Closing 的 Slides 31–32 是全場 framing／回收，不另新增內容單元。

## 第二輪收斂的頁碼變更

| 舊頁碼 | 新頁碼 | 處理 |
| ---: | ---: | --- |
| 1–17 | 1–17 | 保留 |
| 18 | 18 | 與舊 20 合併 |
| 19 | 19 | 保留 |
| 20 | 18 | 合併至新 18 |
| 21–23 | 20–22 | 保留，頁碼前移 |
| 24 | 23 | 保留為純轉場 Divider |
| 25–28 | 24–27 | 保留，頁碼前移 |
| 29 | — | 刪除，功能併入新 28 |
| 30 | 28 | 保留並兼任第六章入口 |
| 31–34 | 29–32 | 保留，頁碼前移 |

**結果：34 頁 → 32 頁。** 本文件沒有再增刪、重排或重新設計任何已確認頁面。

## 時間基準（第二輪結果中的暫定估算）

| 區段 | 頁面 | 時間 |
| --- | ---: | ---: |
| Opening | 1–2 | 約 1–1.5 分鐘 |
| 第一章 | 3–7 | 約 4 分鐘 |
| 第二章 | 8–13 | 約 5 分鐘 |
| 第三章 | 14–18 | 約 6 分鐘 |
| 第四章 | 19–23 | 約 7 分鐘 |
| 第五章 | 24–27 | 約 8 分鐘 |
| 第六章 | 28–30 | 約 6 分鐘 |
| Closing | 31–32 | 約 1.5–2 分鐘 |
| **合計** | **32 頁** | **約 38–40 分鐘** |

這是 Step 3 的講述時間基準，不是 Step 6 的 speaker notes 或排練驗收結果。

## Sources and Git Revisions

### 規劃與敘事來源

| 來源 | 用途 | Revision／狀態 |
| --- | --- | --- |
| Step 3 第二輪人工審查決策 | 32 頁順序、合併／刪除決策、每頁 intent／type／spine／transition、18 單元對照 | 結果已完整保存在本文件；不另推導新頁面 |
| `outline/outline-v0.9-candidate.md` | v0.9.3 內容細綱、六章／18 單元、核心案例與待補素材 | `41248a191ad0a879d037580a3ae6c9e8db4be3f1` |
| `docs/storyboards/ch01.md` | 第一章六個低保真畫面、message-code 案例焦點、Evidence 原則 | `41248a191ad0a879d037580a3ae6c9e8db4be3f1` |
| `docs/storyboards/ch02.md` | 第二章規格／模組／Work View／工作契約的敘事與 Evidence | `41248a191ad0a879d037580a3ae6c9e8db4be3f1` |
| `docs/ch01-ch02-ssot-alignment.md` | 第一、二章的 TypeScript SSOT 邊界、Mock 限制與後續工作 | `41248a191ad0a879d037580a3ae6c9e8db4be3f1`；內容保留歷史對齊狀態 |
| `docs/presentation-design-workflow.md`、`docs/design-round1-convergence.md` | 細綱 → Beat → Evidence → 分鏡的文件角色與第一輪收斂背景 | 依 `origin/docs/storyboard-workflow-ch01` 讀取；不是本次新增或修改的 SSOT |
| `presentation-creator` Skill：`SKILL.md`、`references/story-structure.md`、`references/outline-structure.md` | Step 1–3 的工作邊界、Spine 輸出欄位、Slide Type 與 outline 結構 | `/home/howard/.agents/skills/presentation-creator/`；本次已讀取 |

### 案例來源與 SSOT 邊界

| 來源 | 用途 | Revision／狀態 |
| --- | --- | --- |
| [PR #13｜Order API message-code contract](https://github.com/TsaoHoward/ai-engineering-talk/pull/13) | 第一章 message-code、Consumer、架構與 browser evidence 的案例來源；本文件只引用，不複製技術案例 | PR head `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329`；只讀，未操作 |
| PR #13 的 `examples/order-api/ts-v1/` | Order API 的唯一可執行／可測試合成案例來源；後續應引用同一 Source Revision 的 code／evidence | 以 PR #13 head 為準；`generated/browser-evidence.json` 為測試產物，不在本文件內重建 |
| `outline/outline-v0.9-candidate.md` | 內容細綱 SSOT；不由本文件取代 | 與本文件分工不同 |
| PR #13 | 技術案例 SSOT；不由本文件複製或改寫 | 與本文件分工不同 |
| 本文件 `docs/presentation-plan.md` | 已確認的製作規劃與 Slide Sequence SSOT | 由 Git commit 與 PR #14 追蹤版本 |

「Step 3 第二輪人工審查決策」的結果已完整保存在本文件，包括：

- 32 頁 Slide Sequence
- 34 → 32 頁收斂決策
- 六章／18 個內容單元對照

後續新 Session 不應依賴無法從 Repository 讀取的聊天附件。

### Git 版本追溯

- Planning PR：#14
- Target branch：`integration/ch01-ch02-ts-ssot`
- Initial baseline commit：`a6caa14`
- 後續修改由 Git 歷史追溯。

## 尚未解決的素材與驗收問題

### 案例與 Evidence

- [ ] 以 PR #13 同一 Source Revision 固定第一章的 request、正常結果、錯誤 response、message catalog、Consumer 與測試／browser evidence；避免使用舊的 response-shape 衝突或不同 revision 的資料。
- [ ] 確認 Slide 4 的 Browser MSW／合成執行標籤與可展示的產出，不把它表述成真實後端或資料庫證據。
- [ ] 確認 Slide 5–7 的 response、Consumer、架構與命名片段在 16:9 投影下可讀，並能支持「既有契約」而非技術優劣比較。
- [ ] 確認第二章 `OrderService.search`、型別、Constructor、Consumer、測試與 Work View 的引用皆來自同一案例版本。

### 第三至第六章素材

- [ ] 選定可公開展示的 Skill，呈現從重複規範到可重用指引的拆分；目前只有 Implement Skill 的程序骨架，尚無本簡報專用的實例素材。
- [ ] 選定 Workflow 的具體交接物（Spec、Ticket、Implement、Review／Verify）與可追溯的驗收案例；不得為填欄位自行創造證據。
- [ ] 確認 Waterfall／Agile／TDD 的短例子仍以相同工作單元說明順序、粒度與回饋，不變成獨立方法論教學。
- [ ] 確認 Vue 部署故事的可公開內容、原始紀錄與可引用證據；若無法確認，需在 Step 4–8 調整為明確標示的經驗敘述或移除未支撐細節，但不得在本次任務改動 32 頁。

### 製作與驗收

- [ ] Step 4：逐頁寫 slide copy，維持一頁一個主要敘事任務與既定轉場。
- [ ] Step 5：確認亮室 16:9 的字級、對比、留白、section wayfinding、System View／Work View 圖形重用與 Slide 18／28 的資訊密度。
- [ ] Step 6：補 Traditional Chinese speaker notes、click cues、講述時間與 transition line。
- [ ] Step 7：以 Slidev 實作；不讓實作頁碼或 Click 意外改變本文件的 32 頁基準，若需改動應另行提出決策。
- [ ] Step 8：逐頁進行 3-second test、one-message、spine beat、layout、contrast、播放、投影與整體 35–40 分鐘驗收；目前尚未執行。

## 與原始第二輪結果的差異

- **頁面順序與頁數：無差異。** 仍為 32 頁，保留六章、18 個內容單元；Slide 18／20 合併、原 Slide 29 刪除並由新 Slide 28 承擔入口／回顧功能，均照原始第二輪結果。
- **本文件新增的整理：** 為每頁補上 Evidence／素材需求；補上已確認／暫定／待確認的狀態標記；補上規劃來源、PR #13 的只讀 revision 與 Git 版本追溯。
- **本文件沒有做的事：** 沒有重新設計 Story Spine、改寫 Ending、增刪或重排 32 頁、補造技術證據、進入 Step 4、開始視覺設計，或操作 PR #13。
