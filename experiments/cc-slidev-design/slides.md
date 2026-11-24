---
theme: default
title: Slide 6 — 既有契約也藏在命名與責任分層
layout: default
class: prototype-slide
colorSchema: light
transition: fade
canvasWidth: 1600
aspectRatio: 16/9
---

<script setup>
import ArchitectureLayers from '../../components/ArchitectureLayers.vue'

const sharedRail = [
  { label: 'SHARED', title: 'DbTransport', detail: '共用資料傳輸介面', tone: 'blue' },
  { label: 'BROWSER', title: 'POST /mock/db/query', detail: 'Browser MSW 攔截', tone: 'purple' },
  { label: 'BOUNDED', title: 'SQL evaluator', detail: '只接受案例內查詢形狀', tone: 'amber' },
  { label: 'FIXTURES', title: 'orders.json', detail: '42 筆固定合成資料', tone: 'green' },
]
</script>

<main class="prototype-shell state-0">
  <header class="prototype-heading">
    <div class="prototype-kicker">SLIDE 06 · SYSTEM VIEW / ARCHITECTURE & NAMING</div>
    <h1>既有契約也藏在命名與責任分層</h1>
    <p>同一個訂單查詢，可以走兩條合理的路；差異在於它是否沿用專案既有的協作方式。</p>
  </header>

  <section class="path-stage" aria-label="Two implementation paths">
    <article class="path-panel path-panel--direct">
      <div class="path-title-row">
        <div>
          <span class="path-label">AI-DIRECT</span>
          <h2>直接完成查詢</h2>
        </div>
        <span class="path-mark path-mark--direct">PATH A</span>
      </div>
      <div class="path-stack">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus"><span>Order<br />Repository</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Parameterized<br />SQL</span></div>
      </div>
      <div class="path-foot">查詢責任集中在 Repository</div>
    </article><article class="path-panel path-panel--convention">
      <div class="path-title-row">
        <div>
          <span class="path-label">PROJECT-CONVENTION</span>
          <h2>沿用既有模組責任</h2>
        </div>
        <span class="path-mark path-mark--convention">PATH B</span>
      </div>
      <div class="path-stack path-stack--long">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Order<br />Service</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus">OrderDao</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node">Drizzle ORM</div>
      </div>
      <div class="path-foot">查詢協調與資料存取分開</div>
    </article>
  </section>

  <section class="shared-rail-wrap" aria-label="Shared execution path">
    <div class="shared-rail-reveal">
      <div class="rail-heading"><span>同一個案例執行鐵軌</span><small>兩種路徑都走這裡</small></div>
      <ArchitectureLayers class="prototype-rail" :layers="sharedRail" />
    </div>
  </section>

  <div class="prototype-takeaway">
    <span>交付相容性</span>
    <strong>不只看功能能否跑，也看命名、責任與依賴是否接得上。</strong>
  </div>

  <footer class="prototype-footer">
    <span>合成案例 · Browser MSW · 非外部 API Server／真實資料庫證據</span>
    <span>PR #13 source revision <code>e8ae8ad3</code></span>
  </footer>
</main>

<!--
[State 0] 先讓觀眾看見兩條都能成立的實作路徑：AI-direct 將查詢集中在 Repository；Project-convention 把協調與資料存取分給 Service 與 DAO。
[State 1] 揭示兩者最後共享 DbTransport、Browser MSW、受限 SQL evaluator 與固定 fixtures；這裡不是在宣稱真實資料庫執行。
[State 2] 收束：交付相容性包含既有命名、責任與依賴。轉場到「交辦寫的是功能，驗收依賴的是既有規格」。
-->

<style>
:root {
  --prototype-bg: #f8fbff;
  --prototype-panel: #ffffff;
  --prototype-panel-blue: #eef5ff;
  --prototype-ink: #0f172a;
  --prototype-muted: #475569;
  --prototype-quiet: #64748b;
  --prototype-line: #cbd5e1;
  --prototype-blue: #2563eb;
  --prototype-blue-dark: #1d4ed8;
  --prototype-purple: #6d28d9;
  --prototype-amber: #9a3412;
  --prototype-green: #166534;
}

.slidev-layout.prototype-slide {
  background: var(--prototype-bg);
  color: var(--prototype-ink);
  font-family: Inter, "Noto Sans CJK TC", "PingFang TC", "Microsoft JhengHei", system-ui, sans-serif;
  padding: 48px 64px 40px;
  overflow: hidden;
}

.slidev-layout.prototype-slide *,
.slidev-layout.prototype-slide *::before,
.slidev-layout.prototype-slide *::after {
  box-sizing: border-box;
}

.prototype-shell {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  min-height: 0;
}

.prototype-shell.state-0 .shared-rail-wrap,
.prototype-shell.state-0 .prototype-takeaway,
.prototype-shell.state-1 .prototype-takeaway {
  display: none;
}

.prototype-heading {
  flex: 0 0 auto;
}

.prototype-kicker,
.path-label,
.rail-heading span,
.prototype-takeaway span {
  color: var(--prototype-blue);
  font-size: 24px;
  font-weight: 800;
  letter-spacing: .08em;
}

.prototype-heading h1 {
  color: var(--prototype-ink);
  font-size: 58px;
  font-weight: 800;
  letter-spacing: -.045em;
  line-height: 1.04;
  margin: 10px 0 12px;
}

.prototype-heading p {
  color: var(--prototype-muted);
  font-size: 20px;
  line-height: 1.35;
  margin: 0;
}

.path-stage {
  display: grid;
  flex: 1 1 auto;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-height: 0;
}

.path-panel {
  background: var(--prototype-panel);
  border: 2px solid var(--prototype-line);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 24px 28px 20px;
}

.path-panel--convention {
  background: linear-gradient(135deg, #ffffff 0%, var(--prototype-panel-blue) 100%);
  border-color: #9fb9ec;
}

.path-title-row {
  align-items: flex-start;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  padding-bottom: 14px;
}

.path-title-row h2 {
  color: var(--prototype-ink);
  font-size: 32px;
  font-weight: 760;
  line-height: 1.15;
  margin: 6px 0 0;
}

.path-label {
  color: var(--prototype-quiet);
  font-size: 22px;
}

.path-mark {
  border: 2px solid currentColor;
  border-radius: 999px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: .04em;
  padding: 7px 13px;
  white-space: nowrap;
}

.path-mark--direct { color: var(--prototype-amber); }
.path-mark--convention { color: var(--prototype-blue-dark); }

.path-stack {
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  gap: 12px;
  justify-content: center;
  margin: 12px 0;
  min-height: 0;
}

.path-node {
  align-items: center;
  background: #f8fafc;
  border: 2px solid #d7e0eb;
  border-radius: 10px;
  color: var(--prototype-ink);
  display: flex;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 28px;
  font-weight: 700;
  justify-content: center;
  min-height: 96px;
  padding: 10px 12px;
  text-align: center;
  width: 0;
  flex: 1 1 0;
  white-space: nowrap;
}

.path-node span { white-space: nowrap; }

.path-stack--long .path-node { font-size: 22px; }

.path-node--focus {
  background: #e7efff;
  border-color: #7da4ed;
  color: var(--prototype-blue-dark);
}

.path-connector {
  align-items: center;
  color: #7890b0;
  display: flex;
  font-size: 30px;
  font-weight: 900;
  height: auto;
  justify-content: center;
  line-height: 1;
  width: 26px;
}

.path-foot {
  border-top: 2px solid #e2e8f0;
  color: var(--prototype-muted);
  font-size: 24px;
  line-height: 1.25;
  padding-top: 14px;
  text-align: center;
}

.shared-rail-wrap {
  flex: 0 0 142px;
  min-height: 142px;
}

.shared-rail-reveal {
  border: 2px solid #bfd1ee;
  border-radius: 14px;
  min-height: 142px;
  padding: 14px 18px 16px;
}

.rail-heading {
  align-items: baseline;
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
}

.rail-heading span {
  font-size: 24px;
  letter-spacing: .02em;
}

.rail-heading small {
  color: var(--prototype-muted);
  font-size: 24px;
}

.prototype-rail.architecture-layers {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.prototype-rail.architecture-layers article {
  background: #ffffff;
  border: 2px solid #d7e0eb;
  border-left: 6px solid var(--rail-tone, var(--prototype-blue));
  border-radius: 10px;
  display: grid;
  gap: 2px 10px;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 74px;
  padding: 9px 12px;
}

.prototype-rail.architecture-layers article.blue { --rail-tone: var(--prototype-blue); }
.prototype-rail.architecture-layers article.purple { --rail-tone: var(--prototype-purple); }
.prototype-rail.architecture-layers article.amber { --rail-tone: var(--prototype-amber); }
.prototype-rail.architecture-layers article.green { --rail-tone: var(--prototype-green); }

.prototype-rail.architecture-layers article span {
  color: var(--rail-tone);
  font-size: 20px;
  font-weight: 800;
  grid-row: span 2;
  letter-spacing: .04em;
  padding-top: 3px;
}

.prototype-rail.architecture-layers article strong {
  color: var(--prototype-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 24px;
  line-height: 1.1;
}

.prototype-rail.architecture-layers article small {
  color: var(--prototype-muted);
  font-size: 19px;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.prototype-rail.architecture-layers article {
  opacity: 1 !important;
  transform: none !important;
}

.prototype-takeaway {
  align-items: center;
  background: #eaf1ff;
  border: 2px solid #a8c3f3;
  border-radius: 12px;
  display: flex;
  flex: 0 0 64px;
  gap: 24px;
  padding: 10px 20px;
}

.prototype-takeaway span {
  color: var(--prototype-blue-dark);
  font-size: 24px;
  letter-spacing: .02em;
  white-space: nowrap;
}

.prototype-takeaway strong {
  color: var(--prototype-ink);
  font-size: 28px;
  line-height: 1.2;
}

.prototype-footer {
  align-items: center;
  border-top: 2px solid var(--prototype-line);
  color: var(--prototype-muted);
  display: flex;
  flex: 0 0 30px;
  font-size: 22px;
  justify-content: space-between;
  line-height: 1.1;
  padding-top: 10px;
}

.prototype-footer code {
  color: var(--prototype-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .95em;
}
</style>

---

<script setup>
import ArchitectureLayers from '../../components/ArchitectureLayers.vue'

const sharedRail = [
  { label: 'SHARED', title: 'DbTransport', detail: '共用資料傳輸介面', tone: 'blue' },
  { label: 'BROWSER', title: 'POST /mock/db/query', detail: 'Browser MSW 攔截', tone: 'purple' },
  { label: 'BOUNDED', title: 'SQL evaluator', detail: '只接受案例內查詢形狀', tone: 'amber' },
  { label: 'FIXTURES', title: 'orders.json', detail: '42 筆固定合成資料', tone: 'green' },
]
</script>

<main class="prototype-shell state-1">
  <header class="prototype-heading">
    <div class="prototype-kicker">SLIDE 06 · SYSTEM VIEW / ARCHITECTURE & NAMING</div>
    <h1>既有契約也藏在命名與責任分層</h1>
    <p>同一個訂單查詢，可以走兩條合理的路；差異在於它是否沿用專案既有的協作方式。</p>
  </header>

  <section class="path-stage" aria-label="Two implementation paths">
    <article class="path-panel path-panel--direct">
      <div class="path-title-row">
        <div>
          <span class="path-label">AI-DIRECT</span>
          <h2>直接完成查詢</h2>
        </div>
        <span class="path-mark path-mark--direct">PATH A</span>
      </div>
      <div class="path-stack">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus"><span>Order<br />Repository</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Parameterized<br />SQL</span></div>
      </div>
      <div class="path-foot">查詢責任集中在 Repository</div>
    </article><article class="path-panel path-panel--convention">
      <div class="path-title-row">
        <div>
          <span class="path-label">PROJECT-CONVENTION</span>
          <h2>沿用既有模組責任</h2>
        </div>
        <span class="path-mark path-mark--convention">PATH B</span>
      </div>
      <div class="path-stack path-stack--long">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Order<br />Service</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus">OrderDao</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node">Drizzle ORM</div>
      </div>
      <div class="path-foot">查詢協調與資料存取分開</div>
    </article>
  </section>

  <section class="shared-rail-wrap" aria-label="Shared execution path">
    <div class="shared-rail-reveal">
      <div class="rail-heading"><span>同一個案例執行鐵軌</span><small>兩種路徑都走這裡</small></div>
      <ArchitectureLayers class="prototype-rail" :layers="sharedRail" />
    </div>
  </section>

  <div class="prototype-takeaway">
    <span>交付相容性</span>
    <strong>不只看功能能否跑，也看命名、責任與依賴是否接得上。</strong>
  </div>

  <footer class="prototype-footer">
    <span>合成案例 · Browser MSW · 非外部 API Server／真實資料庫證據</span>
    <span>PR #13 source revision <code>e8ae8ad3</code></span>
  </footer>
</main>

<!-- State 1: reveal the shared Browser MSW execution rail. -->

---

<script setup>
import ArchitectureLayers from '../../components/ArchitectureLayers.vue'

const sharedRail = [
  { label: 'SHARED', title: 'DbTransport', detail: '共用資料傳輸介面', tone: 'blue' },
  { label: 'BROWSER', title: 'POST /mock/db/query', detail: 'Browser MSW 攔截', tone: 'purple' },
  { label: 'BOUNDED', title: 'SQL evaluator', detail: '只接受案例內查詢形狀', tone: 'amber' },
  { label: 'FIXTURES', title: 'orders.json', detail: '42 筆固定合成資料', tone: 'green' },
]
</script>

<main class="prototype-shell state-2">
  <header class="prototype-heading">
    <div class="prototype-kicker">SLIDE 06 · SYSTEM VIEW / ARCHITECTURE & NAMING</div>
    <h1>既有契約也藏在命名與責任分層</h1>
    <p>同一個訂單查詢，可以走兩條合理的路；差異在於它是否沿用專案既有的協作方式。</p>
  </header>

  <section class="path-stage" aria-label="Two implementation paths">
    <article class="path-panel path-panel--direct">
      <div class="path-title-row">
        <div>
          <span class="path-label">AI-DIRECT</span>
          <h2>直接完成查詢</h2>
        </div>
        <span class="path-mark path-mark--direct">PATH A</span>
      </div>
      <div class="path-stack">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus"><span>Order<br />Repository</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Parameterized<br />SQL</span></div>
      </div>
      <div class="path-foot">查詢責任集中在 Repository</div>
    </article><article class="path-panel path-panel--convention">
      <div class="path-title-row">
        <div>
          <span class="path-label">PROJECT-CONVENTION</span>
          <h2>沿用既有模組責任</h2>
        </div>
        <span class="path-mark path-mark--convention">PATH B</span>
      </div>
      <div class="path-stack path-stack--long">
        <div class="path-node">Controller</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node"><span>Order<br />Service</span></div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node path-node--focus">OrderDao</div>
        <div class="path-connector" aria-hidden="true">→</div>
        <div class="path-node">Drizzle ORM</div>
      </div>
      <div class="path-foot">查詢協調與資料存取分開</div>
    </article>
  </section>

  <section class="shared-rail-wrap" aria-label="Shared execution path">
    <div class="shared-rail-reveal">
      <div class="rail-heading"><span>同一個案例執行鐵軌</span><small>兩種路徑都走這裡</small></div>
      <ArchitectureLayers class="prototype-rail" :layers="sharedRail" />
    </div>
  </section>

  <div class="prototype-takeaway">
    <span>交付相容性</span>
    <strong>不只看功能能否跑，也看命名、責任與依賴是否接得上。</strong>
  </div>

  <footer class="prototype-footer">
    <span>合成案例 · Browser MSW · 非外部 API Server／真實資料庫證據</span>
    <span>PR #13 source revision <code>e8ae8ad3</code></span>
  </footer>
</main>

<!-- State 2: close with the contract takeaway. -->
