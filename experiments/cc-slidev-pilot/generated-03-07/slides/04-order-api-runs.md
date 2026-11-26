---
layout: default
---

<div class="trial-kicker">Slide 4 · 第一章 · 01 · B3</div>

# 交辦一支訂單查詢 API，功能確實能跑

<div class="trial-columns">
  <div class="trial-column trial-stack">
    <div class="trial-row"><span class="trial-label">交辦</span><span>狀態 · UTC 日期區間 · 分頁 · 總筆數</span></div>
    <div class="trial-row"><span class="trial-label">請求</span><span class="trial-mono">?pageSize=3</span></div>
    <div class="trial-row"><span class="trial-label">回應</span><span class="trial-mono">HTTP 200 · code: OK · message: m0000</span></div>
    <div class="trial-row"><span class="trial-label">結果</span><span class="trial-mono">IDs [42, 35, 28] · totalCount: 42</span></div>
  </div>

  <div class="trial-column trial-flow-column">
    <div class="trial-flow">
      <div class="trial-node">Request</div>
      <div class="trial-arrow">→</div>
      <div class="trial-node">Order API</div>
      <div class="trial-arrow">→</div>
      <div class="trial-node">HTTP 200</div>
    </div>
    <p class="trial-small">AI-direct 與 Project-convention 都回傳這組成功資料。</p>
  </div>
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

<!-- TODO: Visual opportunity - HIGH
Type: native CSS flow diagram
Suggestion: Preserve the request → API → response relationship; replace only if a later visual stage selects a different diagram treatment.
Element count: 4 data rows + 1 flow = 5.
-->
