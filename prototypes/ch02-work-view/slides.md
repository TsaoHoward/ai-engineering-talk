---
theme: seriph
title: 第二章／工作模組的設計（視覺實驗）
layout: default
class: ch02-lab
colorSchema: light
transition: fade
---

<main class="lab-shell">
  <header class="lab-header">
    <div class="lab-eyebrow"><span class="lab-index">02 / BEAT 08</span><span>DESIGN THE WORK · 01</span></div>
    <h1>同一個目標，換一種設計視角。</h1>
    <p>從交付後的系統，轉向完成系統所需的工作。</p>
  </header>
  <v-switch class="lab-stage-frame" aria-label="程式模組到工作模組的三段視角轉換">
    <template #0>
      <div class="lab-stage">
        <div class="lab-stage-label"><span class="lab-dot"></span> SYSTEM VIEW <span class="lab-label-detail">交付後的系統</span></div>
        <div class="lab-system-flow">
          <div class="lab-node lab-system-node"><strong>Controller</strong><small>HTTP / 回應</small></div>
          <div class="lab-link"><div class="lab-link-line"></div><small>呼叫</small></div>
          <div class="lab-node lab-system-node"><strong>Service</strong><small>查詢邏輯</small></div>
          <div class="lab-link"><div class="lab-link-line"></div><small>呼叫</small></div>
          <div class="lab-node lab-system-node"><strong>DAO</strong><small>資料存取</small></div>
        </div>
        <div class="lab-stage-note">不同程式模組，透過介面與依賴合作。</div>
      </div>
    </template>
    <template #1>
      <div class="lab-stage">
        <div class="lab-stage-label"><span class="lab-dot"></span> SHARED QUESTIONS <span class="lab-label-detail">抽出共同的設計問題</span></div>
        <div class="lab-principles">
          <div class="lab-principle"><span>01</span><strong>誰負責？</strong><small>Responsibility</small></div>
          <div class="lab-principle"><span>02</span><strong>怎麼合作？</strong><small>Interface</small></div>
          <div class="lab-principle"><span>03</span><strong>依賴什麼？</strong><small>Dependency</small></div>
        </div>
        <div class="lab-stage-note">換了設計對象，這三個問題仍然存在。</div>
      </div>
    </template>
    <template #2>
      <div class="lab-stage">
        <div class="lab-stage-label"><span class="lab-dot"></span> WORK VIEW <span class="lab-label-detail">完成系統的工作</span></div>
        <div class="lab-work-flow">
          <div class="lab-node lab-work-node"><small>WORK 01</small><strong>建立 Table</strong></div>
          <div class="lab-work-link"><span>Schema</span><div class="lab-link-line"></div></div>
          <div class="lab-node lab-work-node lab-work-node--focus"><small>WORK 02</small><strong>實作 API</strong></div>
          <div class="lab-work-link"><span>API 契約</span><div class="lab-link-line"></div></div>
          <div class="lab-node lab-work-node"><small>WORK 03</small><strong>開發前端</strong></div>
        </div>
        <div class="lab-stage-note">箭頭表示交接與依賴，不代表工作只能依序執行。</div>
      </div>
    </template>
  </v-switch>
  <footer class="lab-footer"><span>同一支訂單查詢 API · 合成示意</span><span>01 — 視角切換</span></footer>
</main>

<!--
[初始] 從上一頁的 Controller、Service、DAO 接過來。這是交付後的系統。
[Click 1] 我們其實一直在回答三個設計問題：責任、介面、依賴。
[Click 2] 如果改看完成這個系統需要做的工作？建立 Table、實作 API、開發前端，也透過 Schema、API 契約合作。箭頭不是固定時序。
轉場：把中間的「實作 API」放大，看看一個工作單元對外承諾什麼。
-->

---
layout: default
class: ch02-lab
transition: fade
---

<main class="lab-shell">
  <header class="lab-header">
    <div class="lab-eyebrow"><span class="lab-index">02 / BEAT 08</span><span>DESIGN THE WORK · 02</span></div>
    <h1>放大一項工作：實作 API。</h1>
    <p>它要接收什麼、交付什麼，又需要遵守哪些約定？</p>
  </header>
  <div class="lab-mini-flow" aria-label="前後工作的脈絡">
    <span>建立 Table</span><span class="lab-mini-arrow">→ Schema →</span><strong>實作 API</strong><span class="lab-mini-arrow">→ API 契約 →</span><span>開發前端</span>
  </div>
  <div class="lab-contract">
    <div class="lab-contract-top">
      <section class="lab-contract-side"><div class="lab-field-label">INPUT</div><strong>需求與既有環境</strong><p>訂單查詢需求<br>資料表 Schema<br>專案與 API 規範</p></section>
      <section class="lab-contract-core"><div class="lab-field-label">WORK UNIT / 02</div><strong>實作訂單查詢 API</strong><p>Responsibility</p><div class="lab-core-line">完成指定查詢功能</div></section>
      <section class="lab-contract-side"><div class="lab-field-label">OUTPUT</div><strong>可交接的成果</strong><p>API 程式變更<br>必要測試<br>交付說明</p></section>
    </div>
    <div class="lab-contract-bottom">
      <div class="lab-contract-detail" v-click="1"><span>CONSTRAINTS</span><strong>沿用既有分層、命名與 Response 契約</strong></div>
      <div class="lab-contract-detail" v-click="2"><span>ACCEPTANCE</span><strong>功能可用、整合契約符合、測試有證據</strong></div>
    </div>
  </div>
  <footer class="lab-footer"><span>工作契約不是多寫幾句 Prompt，而是定義可合作的邊界</span><span>02 — 工作契約</span></footer>
</main>

<!--
[初始] 保留建立 Table、開發前端作上下游脈絡，中間放大這項工作。先說明 Input、Output 和它負責的功能。
[Click 1] 還需要知道不可以隨意違反哪些既有專案限制。
[Click 2] 最後需要說清楚如何確認交付可接受。
轉場：難道這樣就必須先規劃每一步實作？不是；重點是契約與內部執行的分界。
-->

---
layout: default
class: ch02-lab
transition: fade
---

<main class="lab-shell">
  <header class="lab-header">
    <div class="lab-eyebrow"><span class="lab-index">02 / BEAT 09</span><span>DESIGN THE WORK · 03</span></div>
    <h1>封裝：對外清楚，對內保留彈性。</h1>
    <p>定義一項工作，不代表預先決定每個實作步驟。</p>
  </header>
  <v-switch class="lab-encap-frame" aria-label="工作契約從展開到封裝的畫面變化">
    <template #0>
      <div class="lab-encap-state">
        <div class="lab-external"><span>EXTERNAL CONTRACT</span><strong>目標 · 輸入輸出 · 邊界 · 驗收</strong></div>
        <div class="lab-interior">
          <div class="lab-interior-heading"><span>IMPLEMENTATION</span><strong>實作 API</strong></div>
          <div class="lab-internal-steps"><div>探索既有程式</div><div>選擇實作方式</div><div>測試與調整</div></div>
        </div>
        <div class="lab-encap-caption">契約是外部可依賴的部分；執行過程不必事先固定。</div>
      </div>
    </template>
    <template #1>
      <div class="lab-encap-state">
        <div class="lab-capsule"><span>WORK UNIT / IMPLEMENT API</span><div class="lab-capsule-core">實作 API</div><div class="lab-capsule-contract">對外承諾：目標 · 介面 · 限制 · 驗收</div></div>
        <div class="lab-encap-caption lab-encap-caption--prominent">封裝的是內部細節，不是把未知風險藏起來。</div>
      </div>
    </template>
    <template #2>
      <div class="lab-encap-state">
        <div class="lab-capsule"><span>WORK UNIT / IMPLEMENT API</span><div class="lab-capsule-core">實作 API</div><div class="lab-capsule-contract">對外承諾：目標 · 介面 · 限制 · 驗收</div></div>
        <div class="lab-encap-caption lab-encap-caption--prominent">封裝的是內部細節，不是把未知風險藏起來。</div>
        <div class="lab-next"><span>NEXT → PROMPT / SKILL</span><strong>如果執行方法可以重用，能不能再封裝一次？</strong></div>
      </div>
    </template>
  </v-switch>
  <footer class="lab-footer"><span>影響契約或驗收的未知事項，仍須查證與協商</span><span>03 — 封裝</span></footer>
</main>

<!--
[初始] 對外承諾與內部實作並存。可以先確定契約，但內部可以探索、測試與選擇方案。
[Click 1] 把內部細節收進「實作 API」；其他工作只需要依靠外部契約，但影響交付的未知事項仍需要回報。
[Click 2] 下一章的問題：如果每次實作 API 都有可重用的調查、實作與檢查方法，是否能封裝成 Skill？
-->
