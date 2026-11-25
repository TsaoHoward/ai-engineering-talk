---
theme: default
title: Slide 6 — 既有契約也藏在命名與責任分層
layout: default
class: integration-slide
colorSchema: light
canvasWidth: 1600
aspectRatio: 16/9
---

<div class="integration-stage">
  <header class="integration-header">
    <div class="integration-kicker">SLIDE 06 · SYSTEM VIEW</div>
    <h1>既有契約也藏在命名與責任分層</h1>
    <p>兩種實作都能完成查詢；可交付性取決於是否接上既有協作方式。</p>
  </header>
  <main class="integration-diagram" aria-label="Slide 6 implementation comparison and shared runtime">
    <section class="variant-grid" aria-label="Variant-specific implementation paths">
      <article class="variant-card variant-card--direct">
        <div class="variant-card__header">
          <div>
            <span class="variant-card__eyebrow">AI-DIRECT</span>
            <h2>責任集中在查詢 Repository</h2>
          </div>
          <span class="variant-card__tag">PATH A</span>
        </div>
        <div class="variant-flow">
          <div class="flow-node flow-node--controller">
            <small>variant-specific instance</small>
            <strong>Controller</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true">→</span>
          <div class="flow-node flow-node--focus">
            <strong>Order<br />Repository</strong>
            <small>query responsibility</small>
          </div>
          <span class="flow-arrow" aria-hidden="true">→</span>
          <div class="flow-node">
            <strong>Parameterized<br />SQL</strong>
          </div>
        </div>
      </article>
      <article class="variant-card variant-card--convention">
        <div class="variant-card__header">
          <div>
            <span class="variant-card__eyebrow">PROJECT-CONVENTION</span>
            <h2>協調與資料存取分層</h2>
          </div>
          <span class="variant-card__tag">PATH B</span>
        </div>
        <div class="variant-flow variant-flow--long">
          <div class="flow-node flow-node--controller">
            <small>variant-specific instance</small>
            <strong>Controller</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true">→</span>
          <div class="flow-node flow-node--focus">
            <strong>Order<br />Service</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true">→</span>
          <div class="flow-node">
            <strong>OrderDao</strong>
          </div>
          <span class="flow-arrow" aria-hidden="true">→</span>
          <div class="flow-node">
            <strong>Drizzle<br />ORM</strong>
            <small>(sqlite-proxy)</small>
          </div>
        </div>
      </article>
    </section>
    <div class="convergence" aria-hidden="true">
      <span class="convergence-arrow">↓</span>
      <span class="convergence-label">兩個 variant 都進入同一條合成執行基礎</span>
      <span class="convergence-arrow">↓</span>
    </div>
    <section class="shared-runtime" aria-label="Shared synthetic runtime, bounded mock">
      <div class="shared-runtime__header">
        <div>
          <span class="shared-runtime__eyebrow">SHARED SYNTHETIC RUNTIME</span>
          <h2>共同案例執行路徑</h2>
        </div>
        <span class="shared-runtime__badge">BOUNDED MOCK · NOT A REAL DATABASE</span>
      </div>
      <div class="runtime-flow">
        <div class="runtime-node runtime-node--blue">
          <span>TRANSPORT</span>
          <strong>DbTransport</strong>
        </div>
        <span class="runtime-arrow" aria-hidden="true">→</span>
        <div class="runtime-node runtime-node--purple">
          <span>BROWSER MSW</span>
          <strong>POST /mock/db/query</strong>
        </div>
        <span class="runtime-arrow" aria-hidden="true">→</span>
        <div class="runtime-node runtime-node--slate">
          <span>BOUNDED</span>
          <strong>SQL evaluator</strong>
        </div>
        <span class="runtime-arrow" aria-hidden="true">→</span>
        <div class="runtime-node runtime-node--green">
          <span>FIXTURES</span>
          <strong>fixtures/orders.json</strong>
          <small>42 synthetic orders</small>
        </div>
      </div>
    </section>
  </main>
  <footer class="integration-footer">
    <span>功能相同 ≠ 交付相容</span>
    <span>合成案例 · Browser MSW · bounded SQL evaluator</span>
  </footer>
</div>
<!--
  C2 static State. The layout is recreated from diagram/slide-6-candidate-d.excalidraw
  and diagram/slide-6-candidate-d.svg; the SVG is the relationship reference, not a
  slide image dependency. The two Controller nodes are intentionally variant-specific.
-->
<style>
@import './styles/index.css';
</style>
