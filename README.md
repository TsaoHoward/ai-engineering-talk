# 從寫 Code 到設計工作

以 Slidev 製作的簡報，主題是 AI 協作、軟體工程與工程師成長。

正式簡報：[從寫 Code 到設計工作](https://tsaohoward.github.io/ai-engineering-talk/)

## 本機 Quick Start

建議使用 Node.js 22 與 npm（CI 使用 Node.js 22）。安裝依賴並啟動即時預覽：

```bash
npm ci
npm run dev
```

開啟 <http://localhost:3030/>。編輯投影片時，瀏覽器會即時更新。

## 主要目錄與檔案

| 路徑 | 責任 |
| --- | --- |
| `package.json` | 專案依賴與 `dev`、`build`、`visual:acceptance` 等 npm 指令。 |
| `slides.md` | Slidev 簡報內容、頁面順序與 Click 動畫；是實際簡報的主要來源。 |
| `components/` | 投影片使用的共用 Vue 元件，例如 `ComparisonTable`、`ArchitectureLayers`、`CalloutStack`。 |
| `styles/index.css` | 簡報的視覺樣式、色彩與元件版面。 |
| `outline/outline-v0.8.md` | 章節與內容脈絡的規劃，供整理投影片敘事時對照。 |
| `docs/slide-design-guidelines.md` | 視覺 token、構圖與動態效果的設計指引。 |
| `scripts/visual-acceptance.mjs` | 本機全簡報或單頁的視覺驗收，輸出截圖與報告。 |
| `.github/workflows/pages.yml` | 正式網站部署、同 Repository PR 預覽與關閉清理。 |
| `.github/workflows/pr-visual-qa.yml` | PR 建置、全簡報視覺驗收與截圖 Artifact。 |

`slides.md` 組合投影片內容與 `components/` 的 Vue 元件，`styles/index.css` 負責呈現樣式；`outline/` 和設計指引分別協助維持內容脈絡與視覺一致性。

## 日常投影片開發

1. 在 `slides.md` 編輯文字、頁面結構與 `v-click` 動畫。
2. 將可重用的視覺結構放在 `components/`，並在 `styles/index.css` 維護簡報樣式。
3. 需要調整章節脈絡時對照 Outline；調整視覺時參考設計指引。

使用 `npm run dev` 保持本機即時預覽。

## 本機視覺驗收

先安裝 Playwright 使用的 Chromium，並以 hash router 啟動簡報伺服器：

```bash
npx playwright install chromium
npm run dev:hash
```

在另一個終端機執行全簡報驗收，或只檢查單頁及其可到達的 Click 狀態：

```bash
npm run visual:acceptance -- --all
npm run visual:acceptance -- --slide 3
```

腳本會檢查投影片畫布外的元素與被容器裁切的內容，並將截圖及 `report.json` 寫入 `artifacts/visual-acceptance/`。該目錄已加入 `.gitignore`。

## GitHub PR Preview 與 Visual QA

兩個 Workflow 分工執行：

- `.github/workflows/pages.yml` 負責正式網站與 PR Preview 的 Build／發布。PR 開啟、重開或更新時會建立或更新預覽；關閉時會清理該預覽路徑。預覽完成部署後，Workflow 會在 PR 留下連結，網址格式為 `https://tsaohoward.github.io/ai-engineering-talk/pr-preview/pr-<PR 編號>/`。
- `.github/workflows/pr-visual-qa.yml` 在 PR 開啟、重開或更新時獨立執行 Build 與 Visual QA：安裝 Chromium、檢查所有投影片及可到達的 Click 狀態，並上傳截圖與報告 Artifact。

PR Preview 只需 Pages Build／部署完成即可發布，不必等待 Visual QA。合併 `main` 仍受 `protect-main` Ruleset 保護：必須透過 PR，且 `build-and-visual-qa` Required Check 通過。

部署流程的安全邊界：

- `pull_request_target` 只為同 Repository PR 啟動轉送工作；該工作不 checkout、不執行 PR 程式碼，只透過 `repository_dispatch` 傳送 PR 編號與事件類型。
- 可信任的 Pages Workflow 會再向 GitHub 確認 PR 狀態與目前 head，Build 使用唯讀 `contents: read` 權限；部署工作只發布建置產物。
- Fork PR 可由唯讀的 `pull_request` Workflow 執行 Build／Visual QA，但不會進入 PR Preview 部署流程。

## 正式部署與必要權限

合併至 `main` 後，Pages Workflow 會自動建置並部署正式網站。GitHub Pages 的 **Source** 必須設為 **GitHub Actions**。`pages-state` 分支保存正式網站與 PR 預覽的完整檔案，供 Workflow 組成完整 Pages Artifact；它不是 Pages Source。

Workflow 已按工作設定權限，Repository 的 Actions 預設權限可維持唯讀。執行時需允許各工作取得其宣告的最小權限：Build 使用 `contents: read`；派送事件或更新 `pages-state` 使用 `contents: write`；PR 狀態解析與留言使用對應的 `pull-requests: read`／`write`；Pages Artifact 部署使用 `pages: write` 與 `id-token: write`。若組織政策限制這些工作層級權限，需由 Repository 管理者允許。
