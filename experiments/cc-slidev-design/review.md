# cc-slidev Slide 6 實驗紀錄

## 範圍

本實驗只設計 Slide 6，沒有修改正式 Slidev 入口、Slide Copy、案例 SSOT、`presentation-creator`、PR #16 或 PR #17。原型引用 PR #13 固定 revision `e8ae8ad3d419cf51927d69b598ea4e00ad6cf329` 的合成案例，並重用既有 `components/ArchitectureLayers.vue`；該元件沒有被修改。

## Skill 相容性

- 上游來源：[`rhuss/cc-slidev`](https://github.com/rhuss/cc-slidev)，revision `99fdefe12c835f85907e801f5f0167c138971cd5`。
- 安裝的四個專案層級 Skill：`cc-slidev-diagram-design`、`cc-slidev-visual-design`、`cc-slidev-slide-quality`、`cc-slidev-slidev-mastery`。
- 必要 reference：`cc-slidev-shared-references/design-constraints.md` 與 `cc-slidev-shared-references/presentation-best-practices.md`。
- 保留上游 `README.md`、MIT `LICENSE` 與 `UPSTREAM-COMMIT.txt`；上游 Claude Code commands、hooks、agents 與無關 Skill 沒有安裝。
- 相容性調整：補齊 Agent Skills YAML frontmatter，將 Skill 名稱加上 `cc-slidev-` 避免與既有名稱衝突，並把 `${CLAUDE_PLUGIN_ROOT}/references/...` 改為專案內可解析的相對路徑。設計方法與指引內容沒有自行改寫。
- 尚未支援：目前 Codex Session 的 Skill catalog 不會在同一 Session 即時熱載入新目錄，可能需要重新開啟 Session 才能以名稱自動發現；本次已確認檔案結構與相對 reference 可讀取。Slidev 內建 `slidev export --format png` 需要 `playwright-chromium`，專案現有的是 `playwright`，因此沒有新增依賴，而是使用現有 Playwright Chromium 擷取 PNG。

## 設計過程

實際使用了既有 `presentation-creator` 的視覺系統與輸出限制，並使用四個 cc-slidev Skill 作為設計檢查框架：

- `diagram-design`：把 Slide 6 判斷為「兩條實作路徑共享一條執行鐵軌」的架構／關係圖；因此沒有硬套 Mermaid 或 PlantUML，而是用現有元件與自訂路徑卡片表達責任邊界。
- `visual-design`：要求一個 assertion title、明確視覺層級、可讀字級、對比與不依賴單一色彩傳遞語意。原型沿用專案的 crystal-light 藍色系，色彩只作為路徑與 rail 的輔助，文字和位置仍承擔主要語意。
- `slide-quality`：以一個核心訊息、有限視覺群組、閱讀順序、留白、對比與可揭露性檢查三個 State；特別檢查了 1600×900 截圖、溢出與瀏覽器錯誤。
- `slidev-mastery`：使用 Slidev Markdown、`canvasWidth: 1600`、專案既有 Vue 元件與專案現有 Playwright；沒有引入新的大型框架。

仍由 Agent 自行推導的決策包括：

- 核心訊息是「功能相同不代表交付相容；命名、責任與依賴分層也是契約」。
- 以左右兩個 path panel 對比 `AI-direct` 與 `Project-convention`，再以水平 shared rail 把兩者接回真實合成案例的 Browser MSW、受限 evaluator 與 fixtures。
- 使用三個獨立 Slidev page 作為 State，而不是依賴 `v-click`。這讓每個 State 都能獨立輸出、依序預覽與人工比較；它們仍只屬於實驗原型，不會進入正式簡報。
- 重用 `ArchitectureLayers.vue` 作為 shared rail 的資料驅動卡片；原型的 CSS 只負責本實驗的排列、字級與視覺主題。

## 設計結果

視覺表達選擇「雙路徑 + 共用執行鐵軌」：先讓觀眾比較兩種責任分層，再揭示它們其實共享同一個合成執行環境，最後收束到交付相容性的判斷。這比逐段列出程式碼更能保留案例中的責任邊界，也避免把 Browser MSW 誤讀成真實外部資料庫。

閱讀順序是：

1. Assertion title 與副標說明比較問題。
2. 左右 path panel 說明責任分層差異，藍色 focus node 標記主要差異。
3. Shared rail 說明兩條路徑共用的執行限制與證據邊界。
4. Takeaway 將架構觀察轉成驗收原則。

優勢是資訊取捨明確、可逐步揭露、保留真實案例的資料流語意，並且直接重用既有 component。限制是為了在一張 16:9 投影片內容納完整命名，部分 path node 仍偏密；四張 shared rail card 也需要觀眾先理解 label，再讀 detail。這是本實驗刻意保留給人工視覺審查的取捨。

## `slide-quality` 人工審查

以 State 2（完整揭露）為主檢查，State 0/1 也逐一檢查：

- 通過：單一核心訊息、assertion title、兩條路徑的語意順序、共享 rail 的視覺分組、1600×900 畫布、正常文字對比、非色彩單獨傳遞語意、無水平／垂直溢出。
- 通過：State 0 → State 1 → State 2 的揭露順序；每個 State 都能獨立閱讀，沒有必須依靠動畫才能理解的關鍵內容。
- 注意：完整 State 的資訊密度接近上限，`POST /mock/db/query`、`SQL evaluator` 等技術命名需要投影片講者口頭補充。
- 注意：此評估是人工視覺判斷，不以自動化檢查結果取代；PNG 與瀏覽器檢查只作為技術驗收證據。

## 技術驗收

- `../../node_modules/.bin/slidev build slides.md --out preview --without-notes`：成功。
- Playwright 使用專案既有 Chromium 擷取 `exports/slide-6-state-{0,1,2}.png`：三張均為 1600×900。
- 三個 State：無 console/page error，`scrollWidth` 與 `clientWidth` 相同，`scrollHeight` 與 `clientHeight` 相同。
- 沒有執行正式簡報入口或其他投影片的修改；工作樹中的正式 tracked 檔案沒有變更。

## Diagram Creation — Candidate D

本輪承接上一輪 Visual Suggestion 選定的候選 D（Excalidraw 空間草圖），只製作獨立圖解，不修改既有 Slide 6 原型、正式 Slidev、標題／Footer 或 Reveal。

### 選案決策

- 使用左右兩個 variant-specific path frame：`AI-direct` 與 `Project-convention`。
- 每個 frame 都有自己的 `Controller`，修正「同一個 Controller 分流至兩種實作」的錯誤語意。
- 使用下方 shared runtime frame 表達共同的合成執行基礎：`DbTransport` → Browser MSW `POST /mock/db/query` → bounded SQL evaluator → `fixtures/orders.json`。
- 以空間分組、框線、節點與箭頭傳遞責任與依賴；不把 bounded evaluator 表現成真實資料庫。

### 產物

- 編輯來源：[`diagram/slide-6-candidate-d.excalidraw`](./diagram/slide-6-candidate-d.excalidraw)
- Canonical SVG：[`diagram/slide-6-candidate-d.svg`](./diagram/slide-6-candidate-d.svg)
- 原始手動匯出：[`diagram/無標題-2026-11-25-1004.svg`](./diagram/無標題-2026-11-25-1004.svg)
- 重現與限制：[`diagram/README.md`](./diagram/README.md)

來源通過本地 JSON 結構檢查：35 個元素、3 個邏輯群組、24 個可見文字詞，bound text 與箭頭綁定均有效。

### 渲染狀態

本輪先確認 `excalidraw-brute-export-cli@0.4.0` 實際使用 nested `playwright@1.65.1`，其 `browsers.json` 要求 Firefox revision `1572`（Firefox `159.0`）。已使用 `npx --package=playwright@1.65.1 -- playwright install firefox` 安裝到 Playwright cache，並保留既有 Firefox `1509`；沒有修改專案依賴或 CLI。

重試上游同等渲染命令後，Firefox 1572 可以啟動；CLI 偵測到 Excalidraw `0.17.0`、成功載入 `.excalidraw`、開啟 Export menu 並按下 SVG 按鈕。但程序一直等待 Playwright `download` event，沒有產生輸出檔；這是自動化路徑的具體環境／renderer 相容性限制。沒有修改 renderer、改用替代框架或進入 Slide Integration。

之後使用者從同一份 `slide-6-candidate-d.excalidraw` 手動匯出 `無標題-2026-11-25-1004.svg`。已將該原始手動匯出保留在 diagram 目錄，並以 byte-for-byte copy 建立 canonical `slide-6-candidate-d.svg`；沒有修改 Excalidraw 構圖或來源。使用現有 Playwright Chromium 開啟 canonical SVG 並縮放至完整 viewBox 預覽，確認三個 frame（`AI-direct`、`Project-convention`、`Shared synthetic runtime (bounded Mock)`）均可觀看，SVG root、viewBox 與頁面尺寸均正常。

## C2 — Slide Integration

本輪使用 `cc-slidev-visual-design` 與 `cc-slidev-slidev-mastery`，只建立獨立的完整揭露靜態 State，不修改上一輪原型、Excalidraw source、正式 Slidev、Slide Copy 或 Skill。

### 整合決策

- 使用核准 headline：`既有契約也藏在命名與責任分層`。
- 以 `diagram/slide-6-candidate-d.excalidraw` 與對應 SVG 作為空間關係及技術命名來源；沒有把原始 SVG 當作投影片圖片依賴，而是以 HTML/CSS 重建以提高 1600×900 下的可讀性。
- 上方保留兩個 variant-specific frame：`AI-direct` 與 `Project-convention`；每個 frame 各自有一個 `Controller` instance，沒有畫成單一 Controller 分流。
- 下方保留共同合成執行基礎：`DbTransport` → `Browser MSW POST /mock/db/query` → `bounded SQL evaluator` → `fixtures/orders.json`，並明確標示 `BOUNDED MOCK` 而非真實資料庫。
- 沿用 Crystal Light 的淺色底、藍色主色、橙色／紫色輔助與深色文字；長技術名稱只在語意邊界換行，不在 token 中間斷行。

### 產物

- 獨立原型：[integration/slides.md](./integration/slides.md) 與 [integration/styles/index.css](./integration/styles/index.css)
- 重現說明：[integration/README.md](./integration/README.md)
- 1600×900 PNG：[integration/exports/slide-6-c2-static.png](./integration/exports/slide-6-c2-static.png)

### 基本驗證

- `node_modules/.bin/slidev build experiments/cc-slidev-design/integration/slides.md --out /tmp/cc-slidev-c2-build --without-notes`：成功。
- 使用專案既有 `playwright` Chromium 擷取 PNG：`1600 × 900`。
- 瀏覽器檢查：Slidev canvas `1600 × 900`；document `scrollWidth`／`scrollHeight` 均為 `1600 × 900`；標題、2 個 variant card、4 個 runtime node 均存在。
- 畫面檢查：兩條責任鏈、兩個獨立 Controller、shared bounded mock rail 均完整可見；技術名稱沒有字元中間斷行。
- Slidev 內建 `export --format png` 仍要求專案未安裝的 `playwright-chromium`；本輪沒有新增依賴，改用既有 Playwright 擷取 PNG。
