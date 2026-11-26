# 從寫 Code 到設計工作

**Duration:** 35–40 minutes (existing fixed scope)
**Target Slides:** 32 slides (fixed; no slide-count recalculation)
**Audience:** 新進軟體工程師
**Context:** 公司內部 Live Talk；明亮會議室，一般投影機或電視
**Format:** Slidev, 16:9, speaker-led
**Style:** Technical/Developer
**Visual mode:** Diagrams only; Theme、配色與逐頁版型仍為 TBD
**Status:** Native outline draft; pending manual confirmation

---

## Outline Contract

This outline adapts the existing confirmed content into the native outline
format. It does not create a new story, reorder slides, revise the six
chapters, or replace the existing Slide Copy.

- The confirmed 32-slide order is preserved.
- The six chapters and 18 content units are preserved.
- The existing order-query API case, PR #13 evidence sources, source revision,
  and evidence limitations are preserved.
- The existing slide intent, headline, body anchors, Spine Beat, and
  transition are carried forward for every slide.
- New outline information is limited to section timing, native visual
  guidance, source/evidence pointers, and unresolved design flags.
- The 35–40 minute scope is main-talk time and excludes Q&A. Any Q&A after
  Slide 32 is separate and is not part of the 32-slide or main-talk timing.
- Timing is variable by narrative need. The 66–75 second average implied by
  35–40 minutes / 32 slides is a planning reference, not a per-slide limit.
- The native default of 90 seconds per slide is not used to recalculate this
  already-confirmed 32-slide sequence.

### Existing source roles

- Framing configuration: presentation-config.md in this directory; fixed
  duration, audience, 32-slide scope, style, visual mode, and deferred design
  decisions.
- Confirmed presentation plan: ../../docs/presentation-plan.md; authoritative
  brief, Story Spine, slide order, slide intents, types, transitions, evidence
  boundaries, and timing baseline.
- Confirmed slide copy: ../../docs/slide-copy.md; authoritative per-slide
  headline, body text, evidence links, limitations, main message, and
  transition.
- Content outline: ../../outline/outline-v0.9-candidate.md; authoritative six
  chapters, 18 content units, core thesis, case framing, and pending materials.

### Timing reconciliation

The source timing table labels Slides 1–2 as Opening and starts Chapter 1 at
Slide 3. Slide 3 is also the global question hook in the framing summary.
This outline therefore gives Slide 3 a dual narrative role without moving,
duplicating, or changing the slide:

- Native section allocation: Introduction = Slides 1–2; Chapter 1 = Slides
  3–7.
- Narrative opening: Slides 1–3.
- No content or page-count change is implied.

### Native structure check

The outline follows the native three-act shape while preserving the confirmed
six-chapter structure:

- Act 1 — Setup: Slides 1–7; establish the question and the first delivery gap.
- Act 2 — Confrontation: Slides 8–27; expand from modules to work contracts,
  Skills, SDLC dependencies, and Workflow trade-offs.
- Act 3 — Resolution: Slides 28–32; synthesize the view expansion, explain the
  cognitive threshold, and preserve the confirmed ending.

The six named chapters are retained because they are existing confirmed
content boundaries, not a new outline recommendation.

---

## Introduction (2 slides, approximately 1–1.5 minutes)

### Slide 1: 從寫 Code 到設計工作

- Main point: 工程師要設計的不只是程式，也包括工作。
- Slide intent: 建立全場主題。
- Content anchor: 「當 AI 能完成程式，工程師還需要設計什麼？」
- Existing type / Spine: statement; Opening, connecting B1–B6.
- Visual guidance: 使用簡潔的主題 statement，建立 Code → Work 的抽象視角入口；避免裝飾性照片與無敘事價值的程式碼。
- Evidence: 已確認的標題、主題與核心訊息；不需要外部證據。
- Limitation: 副標、案例標籤與是否顯示時間仍待後續設計決策。
- Transition: 說明觀眾將跟著同一個 Order API 放大視角。

### Slide 2: 今天要放大哪些視角？

- Main point: 故事由功能、模組、工作契約、Skill、SDLC 推進到 Workflow。
- Slide intent: 預告全場的視角路徑。
- Content anchor: System View 與 Work View 的連續推進。
- Existing type / Spine: goals; B3 → B4 → B5.
- Visual guidance: 使用由局部到整體的概念路徑或視角縮放示意；不預先決定 Theme、配色或逐頁版型。
- Evidence: 已確認的六章概念路徑；不新增技術案例。
- Limitation: 三個 takeaways 的最終投影片字數待既有 Step 4 確認。
- Transition: 提出「可執行是否等於可交付」的張力。

---

## Section 1: 第一章｜問題從哪裡開始？ (5 slides, approximately 4 minutes)

### Slide 3: 能執行，是否就代表能交付？

- Main point: 能執行不代表能可靠交付。
- Slide intent: 建立全場核心問題；同時作為第一章 unit 01 的入口。
- Content anchor: 訂單查詢 API 需求與「功能看起來可用」的起點。
- Existing type / Spine: question; B3.
- Visual guidance: 使用問題 statement 搭配最小化的 API request/result 對照入口，作為第一個案例焦點。
- Evidence: 第一章 01 的訂單查詢 API 需求；request/response 須與 PR #13 source revision 一致。
- Limitation: 不將合成案例描述成真實後端執行。
- Transition: 進入實際 API 交辦與執行結果。

### Slide 4: 交辦一支訂單查詢 API，功能確實能跑

- Main point: 需求交辦後，API 可以產生可執行的正常結果。
- Slide intent: 建立「功能已能運作」的起點。
- Content anchor: 新增訂單查詢 API，支援狀態、UTC 日期區間、分頁與總筆數。
- Existing type / Spine: code / data; B3.
- Visual guidance: 以最小、可讀的 request/result 或 code/data 對照呈現正常執行，只顯示具有敘事價值的局部程式碼。
- Evidence: PR #13 head e8ae8ad3d419cf51927d69b598ea4e00ad6cf329 的合成 Order API 與 browser evidence。
- Limitation: 必須標示 Browser MSW／合成案例限制；不可描述為真實 API Server 或資料庫執行。
- Transition: 從正常結果轉向錯誤回應與整合契約。

### Slide 5: message 不是自由文字，而是既有 UI 契約

- Main point: ApiResponse.message 的語意是前端可識別的訊息代碼，不是任意人類可讀文字。
- Slide intent: 顯示 AI-direct 與既有 Consumer 在 message 上的不相容。
- Content anchor: AI-direct 錯誤文字、既有 message catalog、Consumer 解析與相容性測試。
- Existing type / Spine: framework; B2 → B3.
- Visual guidance: 使用 response → message catalog → Consumer 的關係圖，必要時呈現可讀的錯誤 response、代碼表與 Consumer 片段。
- Evidence: PR #13 message-code source、前端 catalog、既有 Consumer、相容性測試。
- Limitation: 只使用同一案例來源；不把差異描述成獨立技術優劣比較。
- Transition: 從對外 Response 擴展到內部架構與命名。

### Slide 6: 既有契約也藏在命名與責任分層

- Main point: 交付相容性也包含專案既有的命名、責任與依賴分層。
- Slide intent: 對照 AI-direct 與 project-convention 的路徑差異。
- Content anchor: Controller → OrderRepository → parameterized SQL 對照 Controller → OrderService → OrderDao → Drizzle。
- Existing type / Spine: framework; B2 → B3.
- Visual guidance: 以兩條責任／依賴路徑作比較圖；僅選取最小必要 code 或 path label。
- Evidence: PR #13 同一 source revision 的 application.ts 與相關架構來源。
- Limitation: 這是案例中的合理分層，不宣稱層數越多越好，也不改寫成獨立技術優劣比較。
- Transition: 收回技術細節，對照交辦與驗收。

### Slide 7: 交辦寫的是功能，驗收依賴的是既有規格

- Main point: 可交付的判斷依賴訊息代碼、Consumer、責任分層、命名、修改邊界與測試等既有規格。
- Slide intent: 將前面案例細節統整為隱含背景。
- Content anchor: 交辦的功能描述 vs. 既有規格與驗收依據。
- Existing type / Spine: statement; B2 → B3.
- Visual guidance: 回收 Slides 4–6 已出現的元素，使用「功能描述 → 規格／驗收」的收束關係。
- Evidence: 只回收 Slides 4–6 已選材料，並追溯至 PR #13 或既有分鏡。
- Limitation: 不新增未展示或不可追溯的規格。
- Transition: 將這些背景命名為工程師日常使用的規格。

---

## Section 2: 第二章｜工作拆分如同模組設計 (6 slides, approximately 5 minutes)

### Slide 8: 從交付落差到規格與模組

- Main point: 從「結果是否可交付」切換到「工程師如何合作」。
- Slide intent: 完成第一章到第二章的視角轉換。
- Content anchor: 使用前章留下的契約／架構元素作轉場。
- Existing type / Spine: section-divider; B1 → B2.
- Visual guidance: 以同一案例元素作 divider，顯示從 delivery gap 聚焦到規格與模組；不新增證據。
- Evidence: 前章已建立的契約／架構元素。
- Limitation: Divider 文字與前後視覺承接仍待後續設計驗證。
- Transition: 先看規格實際存在於哪些載體。

### Slide 9: 規格不只存在於規格書

- Main point: 型別、方法簽章、Constructor、既有 Consumer 與測試都是規格線索。
- Slide intent: 展示規格如何分散在程式與驗收材料中。
- Content anchor: async search(query: OrderQuery): Promise<OrderPage> 與相關型別／Consumer／測試。
- Existing type / Spine: code; B1.
- Visual guidance: 以局部 TypeScript code 作核心，向外連到型別、Consumer、測試等規格線索。
- Evidence: PR #13 同一 source revision 的 OrderService.search、相關型別、Consumer 與測試。
- Limitation: 不由 method signature 單獨推論完整 UTC、排序或分頁規則。
- Transition: 從局部簽章拉遠到模組合作。

### Slide 10: 模組靠責任、介面與依賴合作

- Main point: 模組透過 Responsibility、Interface、Dependency、Encapsulation 合作。
- Slide intent: 沿著實際呼叫鏈，說明模組不需知道全部內部細節，但必須依靠合作契約。
- Content anchor: createController → OrderService → OrderDao → Drizzle → DbTransport。
- Existing type / Spine: framework; B1.
- Visual guidance: 使用責任／介面／依賴路徑圖，依敘事需要聚焦某一段。
- Evidence: PR #13 的 Controller／Service／DAO／Drizzle／transport 路徑與第二章分鏡。
- Limitation: Browser MSW 與受限 SQL evaluator 是 Mock；不宣稱分層越多越好。
- Transition: 將同一套設計問題套用到工作單元。

### Slide 11: System View 可以切換成 Work View

- Main point: 程式模組的合作視角可以切換成完成系統的工作交接視角。
- Slide intent: 從 System View 切換到 Work View。
- Content anchor: System View：createController → OrderService → OrderDao；Work View：建立 Table → 實作 API → 開發前端。
- Existing type / Spine: framework; B4.
- Visual guidance: 使用同一組圖形的鏡頭切換、聚焦或縮放；區分 runtime class 與工作節點。
- Evidence: 第二章分鏡、v0.9.3 細綱、已確認 Slide Sequence 與 PR #13 案例邊界。
- Limitation: Work View 是概念性的工作交接示意，不代表固定時間順序；PR #13 沒有實際建立資料庫 Table。
- Transition: 放大「實作 API」這個工作。

### Slide 12: 一項工作也需要完整工作契約

- Main point: 工作需要清楚約定 Input、Output、Responsibility、Constraints、Acceptance。
- Slide intent: 建立工作契約的五個面向。
- Content anchor: 訂單查詢 API 工作契約表。
- Existing type / Spine: framework; B4.
- Visual guidance: 使用五面向的關係／契約示意，可保留表格語意但不決定最終版型。
- Evidence: v0.9.3、第二章分鏡與既有訂單查詢案例對應。
- Limitation: 這是規劃框架，不另造技術證據；最終 slide copy 沿用既有內容來源。
- Transition: 說明契約清楚不代表要預先決定所有實作步驟。

### Slide 13: 對外清楚，對內保留實作彈性

- Main point: 契約界定交付邊界，同時保留執行者安排內部細節的空間。
- Slide intent: 說明封裝的是執行細節，不是必要的風險與協商。
- Content anchor: 程式模組／工作單元的對外契約、內部可封裝與不可忽略的未知事項。
- Existing type / Spine: statement; B4.
- Visual guidance: 使用「清楚的外部介面／可封裝的內部／需查證的未知」三層概念示意。
- Evidence: 第二章分鏡與既有工作契約內容。
- Limitation: 不把「可封裝」誤讀成「可忽略契約」。
- Transition: 進入可重用執行方法與 Skill。

---

## Section 3: 第三章｜從 Prompt 到 Skill：封裝工作 (5 slides, approximately 6 minutes)

### Slide 14: 把工作契約交給 AI

- Main point: 從工作契約切換到 AI 協作介面。
- Slide intent: 連接工作契約與 Prompt／Skill。
- Content anchor: 回用 Slides 12–13 的工作契約與 Prompt 入口。
- Existing type / Spine: section-divider; B4.
- Visual guidance: 使用工作契約元素轉換成 AI 協作介面的抽象入口；不新增案例證據。
- Evidence: Slides 12–13 的既有內容。
- Limitation: Divider 是否顯示 Prompt／Skill 關鍵詞待後續設計決策。
- Transition: 對照原始 Prompt 與改善後的工作要求。

### Slide 15: Prompt 可以把隱含契約變成明確資訊

- Main point: Prompt 可把規範、邊界、驗收與未確認事項變成可使用、可查證的資訊。
- Slide intent: 對照原始 Prompt 與改善後的工作要求。
- Content anchor: 原始交辦與包含 TypeScript 分層、message-code、修改邊界、測試與未確認事項的改善要求。
- Existing type / Spine: framework; B4.
- Visual guidance: 使用 before/after 比較圖；只保留敘事所需 prompt 片段。
- Evidence: v0.9.3、PR #13 message-code／TypeScript 分層／修改邊界。
- Limitation: 最終 prompt 文字、可公開程度與展示長度沿用既有 Step 4 待確認事項。
- Transition: 分離每次任務的變動內容與可重用方法。

### Slide 16: 每次任務不同，但執行方法可以重用

- Main point: 每次任務提供變動需求；共通規範、程序、檢查方法與產出格式可以重用。
- Slide intent: 區分 task-specific input 與 reusable method。
- Content anchor: 「每次不同」／「可以重用」對照，以及 Abstraction、Encapsulation、Reuse。
- Existing type / Spine: framework; B4.
- Visual guidance: 使用變動部分與共通部分的分離／封裝示意；不複製完整 Skill 文件。
- Evidence: v0.9.3 第三章與既有 Slide Copy。
- Limitation: 具體 reusable procedure 名稱與例子仍待後續選定。
- Transition: 具體展示可重用程序的形狀。

### Slide 17: Skill 封裝一類工作的執行程序

- Main point: Skill 將一類工作的執行程序整理成可重用指引。
- Slide intent: 展示讀取、確認、實作、測試與回報的概念骨架。
- Content anchor: Matt Pocock Implement Skill 的公開程序與本簡報的概念抽象。
- Existing type / Spine: framework; B4.
- Visual guidance: 使用可逐步揭露的程序／狀態流；文件摘錄只取具有證據價值的片段。
- Evidence: Implement Skill fixed revision 6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394、Source Commit 與 MIT License。
- Limitation: 「讀取 → 確認 → 實作 → 測試 → 回報證據及限制」是概念抽象，不是公開 Skill 的原始承諾；不宣稱本簡報已執行該 Skill。
- Transition: 界定 Skill 的能力邊界。

### Slide 18: Skill 是有邊界的工作單元，不是完整交付系統

- Main point: Skill 封裝一段可重用工作方法，但不自動提供需求、設計、驗收或上下游依賴。
- Slide intent: 合併既有 Slide 18／20 的邊界說明，銜接到 SDLC。
- Content anchor: Skill 的方法邊界 vs. 完整交付系統的上下游需求。
- Existing type / Spine: statement; B4 → B5.
- Visual guidance: 使用單一 Skill 節點向外標示缺少的需求、設計、驗收與依賴；控制資訊密度。
- Evidence: v0.9.3、第二章分鏡與既有 Slide Sequence。
- Limitation: 不新增技術案例；合併後的單頁資訊密度需在後續視覺階段驗證。
- Transition: 從單一工作單元切換到上下游與整體交付。

---

## Section 4: 第四章｜從工作介面到 Whole Picture：SDLC (5 slides, approximately 7 minutes)

### Slide 19: 從單一 Skill 拉遠到整體交付

- Main point: 從單一 Skill 的能力邊界切換到完整交付中的上下游工作。
- Slide intent: 進入 SDLC 與 Whole Picture。
- Content anchor: 保留 Implement Skill，向上延伸需求／設計／契約，向下延伸測試／部署／交付。
- Existing type / Spine: section-divider; B5.
- Visual guidance: 使用 Work View 的鏡頭拉遠或上下游延伸；不新增獨立案例證據。
- Evidence: Slide 18 的 Work View、第四章細綱與既有 Slide Sequence。
- Limitation: 這是敘事轉場，不表示 PR #13 已執行完整交付鏈。
- Transition: 追查上游工作如何提供下游 Input。

### Slide 20: 上游工作的 Output，常常就是下游工作的 Input

- Main point: 需求分析與系統設計產物會成為程式實作的前提。
- Slide intent: 說明工作之間透過交接物互相依賴。
- Content anchor: 需求分析 → 系統設計 → 程式實作；查詢條件、分頁規則、API 契約、Schema／資料規則、責任分層。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用 Output → Input 的交接圖，突出交接物而非固定時間順序。
- Evidence: v0.9.3、第二章分鏡、PR #13 的 domain.ts、application.ts、schema.ts、browser.test.mjs 等既有來源。
- Limitation: 箭頭表示工作依賴，不表示固定時間順序；不證明 PR #13 執行過完整 SDLC。
- Transition: 將多個交付活動放入 SDLC 地圖。

### Slide 21: SDLC 是理解交付活動的地圖

- Main point: 需求、設計、實作、測試、部署、維運是理解交付活動的地圖。
- Slide intent: 展示整個軟體交付範圍。
- Content anchor: 需求 → 設計 → 實作 → 測試 → 部署 → 維運。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用可擴展的六節點地圖；保留 Work View 的連續視覺語言，但不做成固定線性流程。
- Evidence: v0.9.3 SDLC 工作節點與 Order API README。
- Limitation: 不主張所有專案必須依固定線性流程執行；PR #13 不提供真實部署或維運證據。
- Transition: 從活動順序轉成依賴與回饋。

### Slide 22: Whole Picture 不只是記順序，而是理解依賴

- Main point: 同一項契約會跨越 API 設計、實作、前端 Consumer 與測試，測試也可能反向影響設計。
- Slide intent: 顯示契約跨工作與回饋依賴。
- Content anchor: ApiResponse.message 不是自由文字，而是前端可識別的訊息代碼。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用跨節點關係圖與回饋箭頭；以 message-code 作具體焦點，其餘回饋保持概念示意。
- Evidence: PR #13 的 domain.ts、application.ts、message-catalog.ts、existing-consumer.ts、browser.test.mjs。
- Limitation: PR #13 支持 message-code、Consumer 與測試相容性；跨工作回饋箭頭不是實際 SDLC 歷程證據。
- Transition: 從理解依賴切換到如何安排工作。

### Slide 23: 從理解依賴到安排工作

- Main point: 將焦點交給工作如何安排、組合與取捨。
- Slide intent: 進入 Workflow 章。
- Content anchor: 第五章｜Workflow：組合、調整與取捨。
- Existing type / Spine: section-divider; B5.
- Visual guidance: 回收 Slide 22 的依賴圖與轉場問題；不提前放入 Waterfall、Agile、TDD 或 Workflow 內容。
- Evidence: 既有 Slide Sequence、第五章細綱與 Slide Copy。
- Limitation: 純 Divider 的閱讀密度與最終視覺承接待後續設計。
- Transition: 對照不同工作安排方式。

---

## Section 5: 第五章｜Workflow：組合、調整與取捨 (4 slides, approximately 8 minutes)

### Slide 24: 同一組工作，可以有不同安排方式

- Main point: 同一組 Work View 可以依順序、交付粒度與回饋方式採取不同安排。
- Slide intent: 用 Waterfall、Agile、TDD 作概念對照。
- Content anchor: 建立 Table → 實作 API → 開發前端；Waterfall／Agile／TDD。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用同一組工作單元的三種編排／粒度／內部循環比較；不製作成三套獨立方法論教學。
- Evidence: v0.9.3、第二章分鏡、PR #13 README 與既有 Slide Copy。
- Limitation: 三者是安排方式的概念對照，不是同層級可互換的完整 Workflow。
- Transition: 區分 Skill 與 Workflow。

### Slide 25: Skill 描述「怎麼做」，Workflow 描述「怎麼組合」

- Main point: Skill 描述單一工作的執行方法；Workflow 描述多項工作如何排序、交接、組合與驗收。
- Slide intent: 清楚區分兩種抽象層次。
- Content anchor: 需求釐清 → Spec → Tickets → Implement → Review / Verify。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用單一 Skill 與多工作 Workflow 的層級／組合關係圖；不重複 Slide 17 詳細程序。
- Evidence: 既有 Slide Sequence、第五章細綱與 Slide 17 的 Implement Skill。
- Limitation: 這是可調整的工作骨架，不是只能線性執行的固定腳本。
- Transition: 讓交接產物與驗收關係具體化。

### Slide 26: Workflow 的品質取決於交接與驗收

- Main point: 工作產出應能供下游使用，並且可以查證與驗收。
- Slide intent: 展示 Spec、Ticket、Implement、Review／Verify 的可追溯鏈。
- Content anchor: Spec、Tickets、Implement、Review／Verify 的交接內容。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用交接物沿流程傳遞的關係圖，突出可使用／可查證／可驗收。
- Evidence: 既有流程骨架、PR #13 的 application.ts、existing-consumer.ts、browser.test.mjs。
- Limitation: 不宣稱 PR #13 實際執行完整 Workflow，也不捏造 Spec、Ticket、Review、Verify 的真實紀錄。
- Transition: 工作可以拆開，但拆分本身也需要取捨。

### Slide 27: 能拆分，不代表應該無限拆分

- Main point: 系統分工與 AI 工作安排都要在責任清晰、介面、組合方式與協作成本之間取捨。
- Slide intent: 對照拆分不足、過度拆分與合宜分工。
- Content anchor: 單一 Method／單一 Prompt；大量層次與 Skill；適當的 Controller／Service／DAO 與工作驗收安排。
- Existing type / Spine: framework; B5.
- Visual guidance: 使用三欄比較圖或連續尺度，讓系統分工與 AI 工作安排互相對照。
- Evidence: v0.9.3、PR #13 application.ts 與既有 Slide Copy。
- Limitation: Controller／Service／DAO 是案例中的合理設計示例，不是唯一最佳解；不宣稱固定最佳層數或介面數量。
- Transition: 寫 API → 模組 → 工作契約 → Skill → Workflow。

---

## Section 6: 第六章｜回頭看：AI、認知門檻與工程師成長 (3 slides, approximately 6 minutes)

### Slide 28: 寫 API → 模組 → 工作契約 → Skill → Workflow

- Main point: 每次放大視角，都代表開始承擔更大範圍的工程判斷。
- Slide intent: 回收前面全場圖形，同時作為第六章入口。
- Content anchor: System View：Controller → Service → DAO；Work View：工作契約 → Skill → 上下游依賴 → Workflow。
- Existing type / Spine: statement; B6.
- Visual guidance: 重用全場圖形，使用視角縮放／節點累積呈現成長；不將「寫 API」誤認成 System View 的模組節點。
- Evidence: 前面已建立的圖形與既有 Slide Copy。
- Limitation: 不新增其他工程概念；章節入口與 unit 16 回顧的同頁密度待原型驗證。
- Transition: 從視角擴張回看 AI 如何改變執行與認知門檻。

### Slide 29: AI 降低執行門檻，卻讓認知門檻提前出現

- Main point: AI 能產生 Code，但不會自動補足可靠交付所需的工程知識。
- Slide intent: 回到開場 API 與 message-code 契約，說明能執行不等於能交付。
- Content anchor: AI-direct 人類可讀錯誤文字導致 Unknown message code；Project-convention 使用 m0001。
- Existing type / Spine: big-statement; B6.
- Visual guidance: 使用極簡的「能執行 ≠ 能交付」statement，搭配 response／Consumer 契約對照。
- Evidence: PR #13 application.ts、existing-consumer.ts、message-catalog.ts 與既有案例。
- Limitation: AI-direct／Project-convention 是人為設計的合成對照，不是真實 AI 模型評測；案例執行於 Browser MSW 與受限 SQL evaluator。
- Transition: AI 降低執行門檻，也可以協助工程師發現並跨越認知缺口。

### Slide 30: AI 也可以協助跨越認知門檻

- Main point: AI 可透過提問與查證，協助工程師發現認知缺口並建立理解。
- Slide intent: 以 Vue 部署故事說明委派 → 發現缺口 → 探索 → 理解 → 擴大工作範圍。
- Content anchor: Vue 專案部署後無法連線；AI 追問部署方式；共同查建置／部署 Log 與 Web Server 設定。
- Existing type / Spine: framework; B6.
- Visual guidance: 使用五步驟循環／探索路徑；不使用不可公開的內部畫面、Log、設定檔或具體系統名稱。
- Evidence: v0.9.3 第六章 unit 18。
- Limitation: 這是匿名化個人經驗敘事，目前沒有可公開查證的內部技術紀錄；不新增未確認的故障原因、命令或可重現技術結論。
- Transition: 回收前五章的五個視角，落到最後的 Ending。

---

## Conclusion (2 slides, approximately 1.5–2 minutes)

### Slide 31: Recap：五個視角的推進

- Main point: 回收前五章各自的一個核心結論。
- Slide intent: 將全場視角推進壓縮成五個 takeaways。
- Content anchor: 可執行不等於可交付；規格與模組支援協作；工作契約可封裝成 Skill；Skill 要放在上下游與 SDLC 中理解；Workflow 需依風險／依賴／成本取捨。
- Existing type / Spine: recap; B1 → B5.
- Visual guidance: 使用五個節點的 recap 路徑，重用前面圖形；控制每個 takeaway 的文字密度。
- Evidence: 前五章已確認內容；不新增技術證據。
- Limitation: 不增加第二組結論。
- Transition: 落到已核准 Ending。

### Slide 32: Ending：擴大定義、整合與判斷工作的能力

- Main point: 要充分利用 AI，工程師需要擴大定義、整合與判斷工作的能力；AI 也可以成為學習這些能力的工具。
- Slide intent: 保留已確認的結尾，不新增第二個結論或 Q&A 頁。
- Content anchor: 必須逐字保留已核准 Ending。
- Existing type / Spine: big-statement; B6.
- Visual guidance: 使用單一收束 statement 與足夠留白；不預先決定字級、配色、Theme 或 Q&A 版型。
- Evidence: 核准的 Step 2 Ending，詳見 ../../docs/presentation-plan.md。
- Limitation: Ending 的字級、換行、講者停頓與結束後是否進入 Q&A 待後續階段；本 outline 不新增 Q&A 頁。
- Transition: 結束。

---

## Notes

### Transition Points

- Introduction → Section 1: 從「工程師還需要設計什麼」進入「可執行是否等於可交付」。
- Section 1 → Section 2: 從 API 交付落差回收出既有規格，再切到模組合作。
- Section 2 → Section 3: 從工作契約切到 AI 協作介面，將隱含契約寫入 Prompt。
- Section 3 → Section 4: 從 Skill 的工作方法邊界拉遠到完整交付與上下游依賴。
- Section 4 → Section 5: 從理解依賴轉向工作如何安排、組合與取捨。
- Section 5 → Section 6: 從 Workflow 的拆分取捨回看視角擴張與工程師成長。
- Section 6 → Conclusion: 從 AI 認知門檻與學習循環回收五個視角，落到確認的 Ending。

### Visual Opportunities

- Slides 1–2: 建立 Code → Work 與 System View → Work View 的抽象入口。
- Slides 3–7: API request/result、message catalog、Consumer 與責任分層比較。
- Slides 8–13: 規格線索、模組合作、System View／Work View、工作契約。
- Slides 14–18: Prompt、可重用方法、Skill 邊界與逐步揭露程序。
- Slides 19–23: 上游 Output／下游 Input、SDLC 地圖、跨節點依賴與回饋。
- Slides 24–27: 同一組工作的不同安排、Skill／Workflow 關係、交接驗收與拆分取捨。
- Slides 28–32: 全場圖形回收、認知門檻、學習循環、五個視角 recap 與 Ending。

These are outline-level visual roles, not final visual design decisions. They
do not select a Theme, color palette, per-slide layout, or diagram notation.

### Evidence and Source Constraints

- The Order API is an original/synthetic case. Browser MSW, browser tests, and
  the restricted SQL evaluator are not evidence of a real external API Server
  or production database.
- PR #13 head e8ae8ad3d419cf51927d69b598ea4e00ad6cf329 is the case source
  revision to preserve for message-code, Consumer, architecture, and browser
  evidence.
- AI-direct and Project-convention are human-designed comparisons, not an
  evaluation of a real AI model.
- Work View, SDLC arrows, feedback loops, and Workflow examples are conceptual
  work-composition diagrams unless an existing source explicitly provides
  evidence.
- The Implement Skill source is the fixed public revision
  6d6a5b9072f47ee7ba1d972d8ce0ee98b7ed4394; its public promises must not be
  expanded into claims about this presentation's execution.
- The Vue deployment story is an anonymized personal experience with no public
  technical record currently attached.

### Time Allocation

- Introduction (Slides 1–2): approximately 1–1.5 minutes
- Section 1 (Slides 3–7): approximately 4 minutes
- Section 2 (Slides 8–13): approximately 5 minutes
- Section 3 (Slides 14–18): approximately 6 minutes
- Section 4 (Slides 19–23): approximately 7 minutes
- Section 5 (Slides 24–27): approximately 8 minutes
- Section 6 (Slides 28–30): approximately 6 minutes
- Conclusion (Slides 31–32): approximately 1.5–2 minutes
- Total: approximately 38–40 minutes within the fixed 35–40 minute scope

### Unresolved Design and Material Decisions

- Slidev Theme
- Color palette
- Per-slide layout system
- Exact visual treatment and diagram notation for each slide
- Subtitle, case label, and time display on Slide 1
- Final wording and density of Slide 2 takeaways
- Same-revision request/result, error response, message catalog, Consumer, and
  browser evidence assets for Slides 3–7
- Publicly presentable Skill material for Slide 17
- Concrete, traceable Spec／Ticket／Implement／Review／Verify handoff examples
  for Slides 25–26
- Final Waterfall／Agile／TDD short examples for Slide 24
- Publicly supportable material for the Vue deployment story on Slide 30
- Evidence cropping, code size, and projection readability
- Click cues and cross-slide implementation
- Speaker notes, rehearsal timing, projection QA, and Q&A format/duration after
  the main talk

No unresolved item above changes the confirmed 32-slide order or content
sequence in this outline.

## Native Outline Validation Status

This draft is ready for the required outline-validator review. The validator
must check structure, completeness, flow, timing feasibility, preserved slide
count, and the explicit evidence/design limitations before manual approval.

## Next Stage

After this outline is manually confirmed, the native workflow may proceed to
cc-slidev-command-generate. Generation will require this outline, the framing
configuration, the confirmed Slide Copy, the confirmed presentation plan, and
the same-revision evidence/material decisions listed above. This outline does
not start generation, visuals, balance, or Slidev implementation.
