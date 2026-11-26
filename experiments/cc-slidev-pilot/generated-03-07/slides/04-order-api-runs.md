---
layout: default
---

<div class="trial-kicker">Slide 4 · 第一章 · 01 · B3</div>

# 交辦一支訂單查詢 API，功能確實能跑

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial, Helvetica, sans-serif", "primaryTextColor": "#1f2937", "lineColor": "#4b5563"}}}%%
flowchart LR
  R["Request<br/>?pageSize=3"]:::system
  A["Order API<br/>狀態 · UTC 日期區間<br/>分頁 · 總筆數"]:::system
  O["HTTP 200<br/>code: OK · message: m0000"]:::system
  D["Result<br/>IDs [42, 35, 28]<br/>totalCount: 42"]:::system
  R --> A --> O --> D
  classDef system fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1f2937;
```

<div class="trial-legend">
  <span class="trial-legend-item">系統／契約路徑</span>
  <span class="trial-legend-item--boundary">案例邊界</span>
</div>

<div class="trial-reveal-stack">
  <div class="trial-reveal-note" v-click="1">共同結果：AI-direct 與 Project-convention 都回傳這組成功資料。</div>
  <div class="trial-reveal-note trial-reveal-note--boundary" v-click="2">Evidence boundary：Browser MSW · 受限 SQL evaluator · 固定 fixtures</div>
</div>

<!--
PRESENTER NOTES:
Key points:
- 交辦支援狀態、UTC 日期區間、分頁與總筆數。
- 這一頁只建立「功能路徑可以成功」的起點。
- 不把結果描述成真實 API Server 或真實資料庫執行證據。
Evidence: PR #13 head e8ae8ad3d419cf51927d69b598ea4e00ad6cf329; application.ts; browser.test.mjs.
Limitation: Chromium Browser MSW、受限 SQL evaluator、固定 fixtures。
Transition: 從正常結果轉向錯誤回應與既有 Consumer 的整合契約。
Timing: variable; main talk excludes Q&A.
-->

<!-- TODO: Visual opportunity - HIGH · implemented in Visuals
Type: Mermaid flow diagram with semantic triad and v-click annotations.
Suggestion: The diagram replaces the repeated data rows; reveal the shared result before the evidence boundary.
Element count: 4 system nodes + 2 narrative annotations = 6.
-->
