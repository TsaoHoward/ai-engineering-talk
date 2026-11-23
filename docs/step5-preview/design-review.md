# Step 5 Visual Design Review｜Slide 3–5

本輪是人工審查用的靜態草圖，不是正式 Slidev 元件或可交付簡報。三頁固定使用 1600×900 畫布；視覺採用本專案適配的 Crystal Light 與藍色 accent，並保留明亮會議室／一般投影設備下的閱讀餘裕。

## Slide 3｜Question

- **視覺焦點**：置中的「能執行，是否就代表能交付？」；沒有 API、response 或結論提示。
- **閱讀順序**：先讀核心問題，再以極小的 `Question` 類別標記確認頁面角色。
- **內容取捨**：只保留已核准 Headline；`Opening · Question` 與頁碼是定位訊息，不承擔新的主張。
- **待確認事項**：人工確認投影距離下的問題字級、換行與置中位置是否符合現場講者停頓。

## Slide 4｜Code / Data

- **視覺焦點**：右側靜態 Evidence Panel 的成功 response；左側只提供交辦與 `?pageSize=3` 的最小輸入上下文。
- **閱讀順序**：交辦 → query → `HTTP 200`／`m0000` → `items` 與 `totalCount` → AI-direct／Project-convention 都得到同一結果。
- **內容取捨**：沒有放入完整 SQL、資料表或執行細節；固定顯示 `BROWSER MSW · SYNTHETIC`，並在面板底部明示這不是外部 API Server 或真實資料庫執行證據。
- **待確認事項**：人工確認右側 response 面板在投影上仍能先被辨識為主焦點，且 `items`、`totalCount` 的數值不會被左側交辦搶走注意力。

## Slide 5｜Framework

- **視覺焦點**：底部放大的「既有 Consumer 的解析結果」；上方兩張卡片只用來建立 `message` 的差異。
- **閱讀順序**：共同錯誤輸入 → `HTTP 400`／`INVALID_QUERY` → AI-direct 與 Project-convention 的 `message` → Consumer 的不相容／相容結果。
- **內容取捨**：沒有展開完整程式碼或 message catalog；只保留核准 copy 的錯誤輸入、response envelope、兩種 message、既有 Consumer 結果與 `PR #13 · e8ae8ad3` provenance。
- **待確認事項**：人工確認 amber（不相容）與 green（相容）只被讀成語意提示，不會被誤解為額外的產品狀態；並確認長英文錯誤文字在投影距離下可讀。

## 共通檢查

- 三頁均為靜態 HTML/CSS，沒有動畫、click reveal、互動 Demo 或正式 Slidev 元件。
- 所有案例事實來自 `docs/slide-copy.md` 與 PR #13 指定 revision `e8ae8ad3`；沒有新增合成案例內容，也沒有將 Browser MSW 描述成真實後端或資料庫。
- 未修改原 Repo；此預覽目錄位於 `/home/howard/workspace/ai-engineering-talk-step5-preview/`。
- 對比抽查：主要文字 `#0f172a`／`#f8fbff` 為 `17.20:1`，quiet label `#64748b`／`#f8fbff` 為 `4.59:1`，amber／green outcome label 各為 `4.75:1`。
