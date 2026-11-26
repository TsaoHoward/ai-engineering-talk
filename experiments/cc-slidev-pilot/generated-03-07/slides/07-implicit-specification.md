---
layout: default
---

<div class="trial-kicker">Slide 7 · 第一章 · 03 · B2 → B3</div>

# 交辦寫的是功能，驗收依賴的是既有規格

<div class="trial-columns">
  <div class="trial-column trial-stack">
    <div class="trial-label">交辦</div>
    <div>查詢功能 · 狀態 · UTC 日期區間 · 分頁 · 總筆數</div>
  </div>

  <div class="trial-column trial-stack">
    <div class="trial-label">既有規格</div>
    <div>m0000／m0001 · data.items／data.totalCount</div>
    <div>Controller → Service → DAO</div>
    <div>UTC · 排序 · 分頁測試</div>
  </div>
</div>

<div class="trial-takeaway">沒有明確交代的，正是我依賴的既有規格。</div>

<!--
PRESENTER NOTES:
Key points:
- 交辦時描述的是功能。
- 交付時依賴既有訊息代碼、Consumer shape、責任分層與測試規則。
- 這些判斷依據就是工程師日常工作使用的規格。
Evidence: Reuse Slides 4–6 materials and the PR #13 case sources.
Limitation: 不新增獨立證據，只回收前頁已展示且可追溯的內容。
Transition: 接下來把這些既有約定命名為工程師日常工作使用的規格，回到模組合作。
Timing: variable; main talk excludes Q&A.
-->

<!-- TODO: Visual opportunity - HIGH
Type: native CSS brief-versus-acceptance comparison
Suggestion: Keep the final statement as the visual anchor; avoid adding new evidence or a second conclusion.
Element count: 2 comparison groups + 1 takeaway = 3.
-->
