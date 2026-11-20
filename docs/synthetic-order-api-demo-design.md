# 合成 Order API：固定版本素材與 Mock 展示方案 v0.1

> 2026-11-20｜第一輪內容收斂的**後續實作提案**，不是 MSW 技術選型定案；本輪不新增依賴或改動 Slidev。
>
> 相關：[合成案例規格](../examples/order-api/README.md) · [細綱 v0.9 候選](../outline/outline-v0.9-candidate.md) · [第二章分鏡](./storyboards/ch02.md)

> **2026-11-20 後續實作進展：**使用者進一步決定，合成案例應是**可執行、可測試的專案**，Java 只是一種強型別例子，MyBatis 只需保留 DAO 背後的資料存取角色。已建立獨立的 [TypeScript / SQLite / Drizzle 草稿 PR #10](https://github.com/TsaoHoward/ai-engineering-talk/pull/10)：兩種可啟動的 HTTP 實作、固定 42 筆資料、測試及由實際 HTTP 產生的證據；專用 CI 的 Node 22 `npm ci`、`typecheck`、3 個測試群組與 evidence export 已通過。
>
> **版本界線：**下方 Java + snippets + MSW 草案保留第一輪提案脈絡，但**不再是新合成案例的交付方案**。新方案先採可執行 TS 實例，ORM 是實現相同架構責任的工具，不是要重現 MyBatis。原 `outline-v0.9-candidate.md` 仍描述 Java 舊案例，**尚未改寫／採納 TS 設定**；待 PR #10 審查通過後，再統一更新敘事與投影片。

## 為什麼需要

目前同一個 API 案例分別出現在 `examples/order-api/*.md`、細綱、分鏡與 Slidev。獨立複製技術文字容易造成 Response 契約、類別命名和分頁參數逐漸分歧。

**先建立一份版本固定、可引用、可檢查的案例，再決定是否需要互動式 Mock。** 「程式碼與視覺示意共用資料來源」和「真正執行 Java」是不同能力。

## 本階段決定的最小原則

1. `examples/order-api/` 的需求及兩條合成實作，作為當前技術基準：AI 為 `Controller → Repository → NamedParameterJdbcTemplate`，既有專案為 `Controller → Service → OrderDao → MyBatis XML`；共用 `ApiResponse<T> = {code,message,data}`。
2. 第一章的 HTTP 200 與 Response **必須標示「合成／模擬」**，直到有真正執行 Java 的證據。MSW 回應也**不能**證明 Java 程式已正確執行。
3. 若建立後續展示素材，以單一明示版本（例如 `order-api-demo/v1` 或 Git commit SHA）固定：Request、AI Response、預期 Response、固定的資料列及必要的錯誤案例；投影片僅引用／呈現它們。
4. 不為了展示 HTTP 200，立即把合成片段擴充成完整 Spring Boot／DB 應用。是否真的需要可執行驗證，取決於講述需求。
5. 程式碼片段應能從可追溯來源引用；不要讓投影片內維護與合成範例脫鉤的第二份 Java 範例。

## 建議的後續素材結構（尚未建立）

```text
examples/order-api/                 # 現有案例說明及兩份 Markdown 實作
  README.md
  ai-direct.md
  project-convention.md
  demo-v1/                           # 後續增加，明確版本
    fixtures/
      orders.json
      query-success.json
      ai-response.json
      convention-response.json
    snippets/
      OrderRepository.java
      OrderService.java
      OrderDao.java
      ApiResponse.java
    README.md                        # 版本、合成來源與驗收邊界
```

目前 Java 程式寫在 Markdown fenced code 內，不是可以直接 `<<<` 引用的獨立 `.java` 檔案。實作時可將程式片段抽成單一可匯入來源，並由文件引用或生成；**不可只是再複製一份**，否則仍有雙重真相來源。上述檔名是建議結構，不表示已建置或編譯成功。

Slidev 支援外部程式碼片段（例如 `<<< @/snippets/OrderService.java`）及自訂 Vue Component。整合時須依最終 Slidev entry 所在目錄確認路徑解析，不假設實驗分支的入點與正式根目錄相同。

## MSW 是否需要？

**可行但非前置條件。** Slidev 使用 Vue 3／Vite，MSW 可以在瀏覽器攔截 `GET /api/orders`，讓 Vue Component 提供查詢條件與 Mock API 回應；相同的 fixture 可用於靜態 Response 差異圖、互動 Demo 及自動化測試。

分兩種展示模式：

| 模式 | 適合用途 | 維護負擔 |
| --- | --- | --- |
| 靜態 fixture ＋ Code snippet ＋ Vue 展示元件 | API Client 200、Request/Response 對照、程式碼／架構圖；投影片需能離線、可預測播放 | **低，建議先做** |
| 上述資料 ＋ MSW handlers／Service Worker | 要真正操作查詢、讓 fetch 經過 Mock 網路層；測試多組狀態與回應 | 中，只有需要互動時再做 |

## 若日後啟用 MSW 的技術注意事項

- 可以在 Slidev 的 `setup/main.ts` 做 client-side 初始化，或讓獨立 Demo Component 初始化；**需要等 Worker 啟動後才發出第一個模擬 Request**，避免競態。
- GitHub Pages 的 `/ai-engineering-talk/pr-preview/pr-N/` 是非根路徑部署，Service Worker 腳本位置與 scope 必須跟隨 Base URL；不要硬寫網站根目錄 `/mockServiceWorker.js`。不同 PR 的 Worker scope 也不能互相污染。
- MSW 官方 Vite 整合目前預設僅在 Development 啟用，**Production 靜態建置不會自動帶入 Worker**；若需在 GitHub Pages PR Preview 互動，必須明確選擇 Browser worker 的 Production 部署方式或其他方案。
- 瀏覽器 Service Worker、PDF 匯出、無網路、受限制環境可能有不同生命週期；簡報關鍵敘事不應只依賴 Mock 啟動成功才看得到內容。提供靜態 fixture／無互動時的降級顯示。
- MSW 不會啟動 Java Spring Boot，也不會執行 MyBatis SQL。若主張「程式真正跑過」，需另有可執行測試或 E2E 證據。

## 下一輪最小驗證

1. 先把已有 Markdown 合成程式轉成**可追溯、單一版本的示例片段**，不調整案例行為。
2. 產生並固定一份 Request 與兩份 Response fixtures，讓 Slidev 示意圖引用同一份資料。
3. 檢查第一章的合成 API Client 與第二章的 Code 範例是否都一致、並明確標示模擬來源。
4. **只有敘事真的需要操作查詢時**，才在獨立實驗分支試 MSW，確認 GitHub Pages Base Path、各 Click 狀態及人工視覺驗收。
