# 從寫 Code 到設計工作

以 Slidev 製作的簡報，主題是 AI 協作、軟體工程與工程師成長。

## 本機開發

```bash
npm ci
npm run dev
```

開啟 <http://localhost:3030>，編輯 `slides.md` 與 `styles/index.css`。

## 視覺驗收

視覺驗收需要 Chromium。用 hash router 啟動本機簡報伺服器：

```bash
npx playwright install chromium
npm run dev:hash
```

在另一個終端機執行全簡報驗收，或指定單頁：

```bash
npm run visual:acceptance -- --all
npm run visual:acceptance -- --slide 3
```

腳本會逐頁前進，擷取每個可到達的 Click 狀態，並檢查畫面元素是否超出投影片畫布或被有裁切行為的容器截斷。截圖與 `report.json` 預設寫入 `artifacts/visual-acceptance/`，此目錄已加入 `.gitignore`。

驗收已建置的 GitHub Pages 靜態版本時，先建置並啟動預覽伺服器：

```bash
npm run build -- --base /ai-engineering-talk/ --router-mode hash --out dist
npm run preview -- --base /ai-engineering-talk/ --host 127.0.0.1 --port 4173
```

在另一個終端機針對靜態版本執行驗收：

```bash
npm run visual:acceptance -- --all \
  --base-url http://127.0.0.1:4173/ai-engineering-talk/ \
  --router-mode hash
```

## GitHub Pages 與 PR 預覽

`.github/workflows/pr-visual-qa.yml` 在 PR 開啟、更新時執行 Build 與全簡報視覺驗收，截圖和報告保存為 Actions Artifact。`.github/workflows/pages.yml` 是可信任的部署流程：`pull_request_target` 工作只讀取 PR 編號和事件類型，再以 `GITHUB_TOKEN` 發出 `repository_dispatch`；它不 checkout 或執行 PR 程式碼。受信任的部署流程會重新讀取 PR 最新 head，先在唯讀工作中建置與驗收，之後才由獨立寫入工作更新預覽。

同 Repository PR 預覽位於 `/ai-engineering-talk/pr-preview/pr-<編號>/`，更新後會在 PR 留下可播放連結；關閉後移除該 PR 目錄。Fork PR 只跑唯讀 Build／QA，不會發出部署事件。`main` 更新部署至 `/ai-engineering-talk/`。

**發布架構：** GitHub Pages 的 Source 設為 **GitHub Actions**。`pages-state` 分支只保存完整網站檔案，不是 Pages 的 publishing source。正式版和各 PR 預覽分別更新該分支的根目錄與 `pr-preview/pr-<編號>/`；正式更新會保留預覽目錄，PR 更新或清理只碰自己的目錄。每次 Pages 部署都從 `pages-state` 重新打包完整網站，再以官方 Pages Artifact Deployment 發布，因此不會只部署單一 PR 的檔案而刪掉其他預覽。分支更新採非 force push；state 更新按目標序列化，Pages 發布共用互斥鎖。

此設計直接處理 GitHub 的 GITHUB_TOKEN 限制：Actions 的 `GITHUB_TOKEN` 推送不會觸發 branch-based Pages build，所以不再把分支更新當成發布事件；state 更新完成後，可信任的 main Workflow 明確上傳完整 Pages artifact 並呼叫 `deploy-pages`。[GitHub 官方說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 也指出這項限制，並要求 artifact 部署使用 `pages: write` 和 `id-token: write` 權限。[Artifact deployment 權限](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

PR 預覽採用 `repository_dispatch`，因為 GitHub 明確允許 `GITHUB_TOKEN` 觸發這類事件；payload 僅包含 PR 編號和事件類型，受信任 Workflow 再向 GitHub API 取得目前 head、來源 repository 與開關狀態。[GITHUB_TOKEN 事件限制](https://docs.github.com/en/actions/concepts/security/github_token) `repository_dispatch` 工作流必須先存在於 default branch，因此 PR #2 裡新增的 Workflow 在合併前不會處理自己的 PR 事件。[事件觸發規則](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)

### 首次啟用與 Bootstrap

1. 管理者先在 **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。這是官方 Artifact Deployment 的正確 Source 設定；不要選 `Deploy from a branch`。
2. 因為 `.github/workflows/pages.yml` 必須先存在於 `main`，先用一個最小、可信任的 Bootstrap PR/commit 將 Pages 部署 Workflow 放進 `main`。Bootstrap 只需在 `push main` 和 `workflow_dispatch` 時建置正式版，使用 `actions/upload-pages-artifact` 加 `actions/deploy-pages` 發布，並有 `pages: write`、`id-token: write` 權限。**不要假設 PR #2 的 Workflow 已能觸發 `repository_dispatch`。**
3. 等待 Bootstrap PR/commit 更新 `main` 後自動觸發的首次部署；若沒有自動 run，再從 `main` 手動執行 Bootstrap Workflow。確認 GitHub Pages 的 `github-pages` Environment 有成功部署且 `/ai-engineering-talk/` 能播放。完整 M1c Workflow 接手後移除 Bootstrap Workflow，避免兩個 Workflow 同時發布。
4. 將完整 M1c Workflow 放入 `main` 後，`push main` 會建立 `pages-state` 並發布完整正式網站。若需手動初始化或重發正式版，在 Actions 選 `Trusted GitHub Pages deployment`，選 `main` 分支和 `operation=main`。
5. 用新的同 Repository 測試 PR 驗收預覽：確認 `PR build and visual acceptance` 通過，等待 `pages.yml` 部署後查看 PR 留言連結，驗證 hash 導覽、靜態資源與 Click 狀態。
6. 關閉測試 PR，等待 Pages artifact 部署完成後，確認該預覽路徑回傳 404；同時確認其他開啟中的 PR 預覽仍可播放。再推送一次 `main`，確認正式版更新且預覽仍保留。

[rossjrw/pr-preview-action](https://github.com/rossjrw/pr-preview-action) 的 URL、PR 留言與關閉清理行為作為參考。它目前要求 Pages 使用 branch source，並要求 Actions 有 repository 寫入權限；這和本專案採用的 GitHub Actions artifact source 不相容，而 GITHUB_TOKEN 寫入 publishing branch 也不會觸發 branch-based Pages build。上游文件目前亦列出 Fork PR 不支援。因此這裡保留相同的路徑與生命週期，但使用 GitHub Pages Artifact Deployment。所有 Actions 都鎖定完整 commit SHA，也不需要 PAT 或 SSH 私鑰。

#### Workflow 權限邊界

| 工作 | GITHUB_TOKEN 權限 |
| --- | --- |
| PR 事件轉送 | `contents: write`，只用來發出 `repository_dispatch` |
| Main／PR Build 與視覺 QA | `contents: read` |
| PR 狀態解析 | `contents: read`、`pull-requests: read` |
| Pages state 更新 | `contents: write`、`pull-requests: read`；先確認 PR head／狀態仍符合建置版本 |
| Pages Artifact Deployment | `contents: read`、`pages: write`、`id-token: write` |
| PR 預覽留言 | `pull-requests: write` |

Repository 的 **Settings → Actions → General → Workflow permissions** 預設可維持唯讀；Workflow 只在必要的 job 宣告寫入權限。若組織或 Enterprise 政策限制 job 權限，需由管理者允許上述精確權限，不必改成全域 Read and write。

`pull_request_target` 只轉送 PR 編號與事件類型，不 checkout 或執行 PR 程式碼。可信任工作流的 Build／QA 會執行 PR 的 npm scripts，但該 job 只有唯讀 token，checkout 不保留憑證；部署 job 只接收靜態產物，不執行 PR 程式碼。PR 預覽本身仍會在瀏覽器執行 PR 建置出的 JavaScript；正式版和預覽位於同一 GitHub Pages origin，因此只為可信任的同 Repository PR 發布，開啟預覽時也應把它視為該 PR 的程式碼。

本機可先驗證 Build 和視覺 QA；Workflow 靜態語法可用 `actionlint` 驗證。Pages 尚未啟用且沒有實際部署，因此目前不能宣稱 PR Preview 已上線。線上 URL、Pages Source、OIDC／Environment 權限和部署後的預覽清理，只能在完成 Bootstrap 與首次 GitHub Actions 部署後驗證。
