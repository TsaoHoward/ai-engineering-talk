---
theme: seriph
highlighter: shiki
lineNumbers: true
transition: fade
aspectRatio: 16/9
title: 從寫 Code 到設計工作｜Slides 3–7 試用
---

<style>
h1 { font-size: 3rem; line-height: 1.15; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
p, li { font-size: 1.25rem; }
body { font-family: Arial, Helvetica, sans-serif; }

.trial-kicker {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.65;
}
.trial-stack, .trial-compare, .trial-paths {
  display: grid;
  gap: 0.7rem;
}
.trial-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 2rem;
  align-items: start;
  margin-top: 1.1rem;
}
.trial-column {
  min-width: 0;
}
.trial-flow-column {
  display: flex;
  min-height: 13rem;
  flex-direction: column;
  justify-content: center;
}
.trial-row {
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 0.75rem;
  align-items: baseline;
  border-bottom: 1px solid currentColor;
  padding: 0.35rem 0;
}
.trial-label { font-weight: 700; opacity: 0.7; }
.trial-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.92em;
}
.trial-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}
.trial-node {
  border: 1px solid currentColor;
  border-radius: 0.45rem;
  padding: 0.75rem 0.9rem;
  text-align: center;
}
.trial-arrow { opacity: 0.55; font-size: 1.4rem; }
.trial-path {
  display: grid;
  grid-template-columns: 14rem 1fr;
  gap: 1rem;
  align-items: center;
  border: 1px solid currentColor;
  border-radius: 0.45rem;
  padding: 0.8rem 1rem;
}
.trial-paths .trial-path {
  grid-template-columns: 14rem minmax(0, 1fr);
}
.trial-path-title { font-weight: 700; }
.trial-shared {
  margin-top: 1.3rem;
  padding-top: 0.8rem;
  border-top: 1px solid currentColor;
  opacity: 0.75;
}
.trial-takeaway {
  margin-top: 1.5rem;
  font-size: 1.35rem;
  font-weight: 700;
}
.trial-small { font-size: 0.95rem; opacity: 0.72; }
</style>

---
src: ./slides/03-execution-vs-delivery.md
---
<!-- Slide 3: 能執行，是否就代表能交付？ -->

---
src: ./slides/04-order-api-runs.md
---
<!-- Slide 4: 交辦一支訂單查詢 API，功能確實能跑 -->

---
src: ./slides/05-message-contract.md
---
<!-- Slide 5: message 不是自由文字，而是既有 UI 契約 -->

---
src: ./slides/06-responsibility-layering.md
---
<!-- Slide 6: 既有契約也藏在命名與責任分層 -->

---
src: ./slides/07-implicit-specification.md
---
<!-- Slide 7: 交辦寫的是功能，驗收依賴的是既有規格 -->
