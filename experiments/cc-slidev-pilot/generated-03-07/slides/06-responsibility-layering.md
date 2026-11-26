---
layout: default
---

<div class="trial-kicker">Slide 6 · 第一章 · 02 · B2 → B3</div>

# 既有契約也藏在命名與責任分層

<div class="trial-paths">
  <div class="trial-path">
    <span class="trial-path-title">AI-direct</span>
    <span>Controller → OrderRepository → parameterized SQL</span>
  </div>
  <div class="trial-path">
    <span class="trial-path-title">Project-convention</span>
    <span>Controller → OrderService → OrderDao → Drizzle ORM</span>
  </div>
</div>

<div class="trial-shared">
  DbTransport → Browser MSW POST /mock/db/query → 受限 SQL evaluator → fixtures/orders.json
</div>

<!--
PRESENTER NOTES:
Key points:
- 交付相容性也包含既有命名、責任與依賴分層。
- 兩條路徑不是獨立的技術優劣比較，而是既有專案慣例如何影響交付。
- 共同案例路徑使用 Browser MSW 與受限 SQL evaluator。
Evidence: application.ts; worker.ts; README.md from PR #13 revision e8ae8ad3.
Limitation: 這是案例中的合理分層，不表示層數越多越好；不是真實資料庫執行證據。
Transition: 當我們用這些既有約定驗收，才看見交辦與規格之間的落差。
Timing: variable; main talk excludes Q&A.
-->

<!-- TODO: Visual opportunity - HIGH
Type: native CSS responsibility-path comparison
Suggestion: Keep the two responsibility paths parallel and retain the shared bounded transport path as a separate relationship.
Element count: 2 comparison paths + 1 shared path = 3.
-->
