# Step 5 Visual Exploration — Slide 5

本輪只探索 Slide 5 的低保真構圖，不選定最終方案，也不進入 Wireframe、動畫或正式視覺設計。三張 PNG 都是 1600×900，使用同一組案例資料：`?fromDate=2026-01-01` 缺少 `toDate`、`HTTP 400`、`code: "INVALID_QUERY"`、`data: null`；差異是資訊組織與閱讀路徑。

重現命令：`node experiments/step5-visual-exploration/render.mjs`

## 核心主張與證據

> `message` 不是自由文字，而是既有 UI 契約。

- AI-direct：`"fromDate and toDate must be supplied together"` → `Unknown message code`
- Project-convention：`"m0001"` → `查詢條件不合法`
- 證據限制：這是 Browser MSW 的 Chromium 合成案例，驗證案例中的回應與 Consumer 解析路徑；不是外部 API Server 或真實資料庫執行證據。
- 完整來源 revision：[`e8ae8ad3d419cf51927d69b598ea4e00ad6cf329`](https://github.com/TsaoHoward/ai-engineering-talk/tree/e8ae8ad3d419cf51927d69b598ea4e00ad6cf329)，包含 `application.ts`、`domain.ts`、`existing-consumer.ts`、`message-catalog.ts` 與 `browser.test.mjs`。

## 三個方案

### Option A — Parallel Comparison

1. 視覺概念：上方先固定同一個輸入與 HTTP response，下面以垂直分界並列 AI-direct 與 Project-convention。
2. 預期閱讀路徑：共同證據 → 左右兩條 `message` 路徑 → 各自的 Consumer 結果 → 底部差異句。
3. 如何支持核心主張：讓觀眾在同一視線高度直接比較兩個相同欄位的不同語意，差異落在 `message` 而非 HTTP 狀態。
4. 主要優勢與代價：比較最直觀、證據對齊清楚；代價是左右兩欄各自需要讀取，核心因果關係較弱。

### Option B — Causal Flow

1. 視覺概念：把案例畫成一條由輸入到 Consumer 的因果管線，在 `message` 契約處向上、下分岔。
2. 預期閱讀路徑：錯誤輸入 → 共同 response envelope → `message` 必須是 key → 查表成功／失敗 → 使用者看到的結果。
3. 如何支持核心主張：把「欄位值如何造成 Consumer 結果」變成可追蹤的因果鏈，直接呈現 raw sentence 與 `m0001` 的不同後果。
4. 主要優勢與代價：因果和流程最強、適合講解；代價是橫向資訊較密，兩個方案的平行比較不如 Option A 即時。

### Option C — Contract Center

1. 視覺概念：以中央的 `message / 既有 UI 契約` 為唯一焦點，四周連接共用 response、兩種實作與 Consumer。
2. 預期閱讀路徑：中央契約 → 向上回看共同錯誤 → 向左／右比較輸入值 → 向下看 Consumer 能否使用。
3. 如何支持核心主張：把 `m0001 → 查詢條件不合法` 放在中心，將「既有 key」升格為組織整張圖的規則，而非某一條路徑的附帶結果。
4. 主要優勢與代價：層級與主張最集中、可建立契約中心的記憶點；代價是閱讀方向不是單一路徑，觀眾需要接受中心向外回看的空間關係。

## 比較

| 方案 | Contrast | Whitespace | Hierarchy | Unity | Flow |
| --- | --- | --- | --- | --- | --- |
| A 並列比較 | 兩欄黑白對照強 | 中等，垂直分界保留呼吸 | 共同證據與兩欄等重 | 共享 envelope 統一兩側 | 先共同、後並列比較 |
| B 因果流程 | 流程節點與分岔清楚 | 較緊，受水平管線限制 | `message` 分岔是主節點 | 單一管線串起所有證據 | 左 → 右因果最明確 |
| C 契約中心 | 中央黑色焦點最強 | 最大，中心向外留白 | 中央契約壓倒周邊資訊 | 所有證據回到同一 hub | 中心 → 外圍，非線性回看 |

本輪保留三個方向供人工設計審查；不以自動化檢查替代人工判斷，不自行選擇方案。

## Step 5B｜Wireframe / Visual Storyboard

本輪依已確認的 Option A 構圖建立 Slide 5 的三個可觀看 state；保留 AI-direct
在左、Project-convention 在右，不修改 Slide Copy、正式 Slidev、案例 SSOT 或
其他探索方案。PNG 畫布只放實際投影片內容，不放 Option 名稱、State 編號、設計
意圖或審查提示。

### 產物與重現

- `wireframe/state-1.png`：共同錯誤輸入與共同 HTTP response 條件。
- `wireframe/state-2.png`：揭露兩個實作各自的 `message` 值，完整保留
  `"fromDate and toDate must be supplied together"` 原文，換行只在同一組引號內。
- `wireframe/state-3.png`：顯示共同 `message-catalog`／`resolveMessageCode(message)`
  規則與兩個獨立 Consumer 結果；兩條 response 沒有合併成一條資料流。
- `wireframe/preview.html`：畫布外提供 Previous／Next 與鍵盤左右鍵切換。
- 重現：`node experiments/step5-visual-exploration/wireframe/render.mjs`

### 設計決策

1. 先以 State 3 的完整空間決定共同 response strip、左右 lane、message box、
   shared Consumer band 與兩個結果區的位置；State 1／2 只控制可見性，不因揭露
   message 或結果而重排已出現元素。
2. State 1 只建立同一個錯誤輸入與 `HTTP 400`／`INVALID_QUERY`／`data: null` 的
   比較背景；不提前顯示任何相容性結論。
3. State 2 只揭露 `message` 分歧；Consumer 區域仍不顯示，讓觀眾先看到 detail
   文字與 code 的差異。
4. State 3 讓兩個 message 各自連入同一個解析規則，再各自連到結果；shared
   Consumer 表達共用規則，不代表兩個 response 被合併。
5. 維持黑、白、灰與簡單線條；不使用 Crystal 配色、陰影、漸層或裝飾性卡片。
   Synthetic／Browser MSW／bounded SQL evaluator／fixed fixtures 的 evidence
   limit 固定保留在 footer。

### Review record（待人工審查）

- 主要閱讀任務：三個 state 依序是「固定共同條件」→「看見 message 值」→
  「理解同一查表規則下的兩個結果」。
- 正確性核對：資料流依據 PR #13 固定 revision
  `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329` 的 `errorResponse`、
  `readExistingErrorConsumer`、`resolveMessageCode` 與 `MESSAGE_CATALOG`；AI-direct
  的 detail 解析失敗，Project-convention 的 `m0001` 解析為「查詢條件不合法」。
- 本輪只完成可觀看 wireframe 與自動化溢位／尺寸檢查；視覺層級、揭露節奏與
  是否通過仍交由人工審查，不在此自行宣告通過。

## 方法參考

- [Assertion–Evidence Approach](https://www.assertion-evidence.com/)
- [polished-presentations Skill](https://github.com/simonmesmith/agent-skills/blob/main/skills/polished-presentations/SKILL.md)
- Repository `presentation-creator` Skill 的 `references/visual-design.md`

以上僅取其「先理解資訊關係、以主張搭配視覺證據、先做低保真構圖」的設計原則；未採用完整工作流程或其輸出技術。
