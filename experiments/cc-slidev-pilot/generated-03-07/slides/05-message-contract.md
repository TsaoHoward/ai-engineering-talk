---
layout: default
---

<div class="trial-kicker">Slide 5 · 第一章 · 02 · B2 → B3</div>

# message 不是自由文字，而是既有 UI 契約

<div class="trial-columns">
  <div class="trial-column trial-stack">
    <div class="trial-row"><span class="trial-label">錯誤輸入</span><span class="trial-mono">?fromDate=2026-01-01</span></div>
    <div class="trial-row"><span class="trial-label">回應</span><span class="trial-mono">HTTP 400 · INVALID_QUERY · data: null</span></div>
  </div>

  <div class="trial-column trial-compare">
    <div class="trial-path">
      <span class="trial-path-title">AI-direct</span>
      <span>人類可讀文字 → Unknown message code</span>
    </div>
    <div class="trial-path">
      <span class="trial-path-title">Project-convention</span>
      <span><span class="trial-mono">m0001</span> → 查詢條件不合法</span>
    </div>
  </div>
</div>

<!--
PRESENTER NOTES:
Opening: fromDate without toDate creates the invalid-query case.
Key points:
- message 不是自由文字，而是既有 Consumer 可識別的訊息代碼。
- AI-direct 的人類可讀文字無法被既有 Consumer 解析。
- Project-convention 的 m0001 可以被既有 Consumer 解析。
Evidence: application.ts; domain.ts; existing-consumer.ts; message-catalog.ts; browser.test.mjs, all from PR #13 revision e8ae8ad3.
Limitation: Browser MSW 的 Chromium 合成案例；不是外部 API Server 或真實資料庫執行證據。
Transition: 從對外 Response 的契約，擴展到內部架構與命名的責任分層。
Timing: variable; main talk excludes Q&A.
-->

<!-- TODO: Visual opportunity - HIGH
Type: native CSS comparison diagram
Suggestion: Keep the two paths visually parallel; use labels as well as any future color so meaning does not rely on color alone.
Element count: 2 response rows + 2 comparison paths = 4.
-->
