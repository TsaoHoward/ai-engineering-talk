---
theme: seriph
title: 從寫 Code 到設計工作
---

# 從寫 Code 到設計工作

用模組化思維理解 AI 協作、軟體工程與工程師成長

---
layout: default
class: ai-engineering-talk editorial-prototype
transition: slide-left
---

<main class="editorial-slide editorial-slide--comparison">
  <header class="editorial-heading">
  <span class="editorial-kicker">01　/　同一需求・合成案例</span>
  <h1>同一支 API，兩種實作</h1>
  <p>功能都能完成；能否交付，還要看是否符合既有專案契約。</p>
  </header>

  <div class="editorial-request" aria-label="共同需求">
  <span>共同需求</span>
  <code>GET /api/orders</code>
  <span>依狀態、日期區間查詢並分頁</span>
  <strong>功能相同</strong>
  </div>

  <section class="editorial-comparison" aria-label="兩種實作的三個差異">
  <div class="editorial-column-headings" aria-hidden="true">
  <span>比較面向</span>
  <strong>AI 直接實作</strong>
  <strong>既有專案慣例</strong>
  </div>

  <v-switch class="editorial-stage-stack">
  <template #0>
  <article class="editorial-stage">
  <div class="editorial-stage-topic">
  <span>01</span>
  <h2>Naming</h2>
  </div>
  <div class="editorial-implementation">
  <code>OrderRepository</code>
  <code>OrderResponse</code>
  </div>
  <div class="editorial-implementation editorial-implementation--convention">
  <code>OrderDao</code>
  <code>OrderQueryDto</code>
  </div>
  </article>
  </template>
  <template #1>
  <article class="editorial-stage">
  <div class="editorial-stage-topic">
  <span>02</span>
  <h2>資料存取</h2>
  </div>
  <div class="editorial-implementation">
  <code>Controller → Repository</code>
  <code>NamedParameterJdbcTemplate → Database</code>
  </div>
  <div class="editorial-implementation editorial-implementation--convention">
  <code>Controller → Service → OrderDao</code>
  <code>MyBatis XML → Database</code>
  </div>
  </article>
  </template>
  <template #2>
  <article class="editorial-stage">
  <div class="editorial-stage-topic">
  <span>03</span>
  <h2>API 回應契約</h2>
  </div>
  <div class="editorial-implementation">
  <code>ApiResponse&lt;List&lt;OrderResponse&gt;&gt;</code>
  <code>data: [...], totalCount: 42</code>
  <small>為這個端點擴充共用外殼</small>
  </div>
  <div class="editorial-implementation editorial-implementation--convention">
  <code>ApiResponse&lt;OrderPageDto&gt;</code>
  <code>data: { items, totalCount }</code>
  <small>共用外殼維持 { code, message, data }</small>
  </div>
  </article>
  </template>
  </v-switch>
  </section>

  <footer class="editorial-takeaway" v-click>
  <span>交付判斷</span>
  <strong>功能完成 ≠ 符合既有專案契約</strong>
  </footer>
</main>

<!--
共同需求先固定：兩份實作都能查詢狀態、日期並分頁。
先看命名。OrderRepository / OrderResponse 和專案慣用的 OrderDao / OrderQueryDto 不同。
揭露資料存取：AI 版本由 Repository 直接操作 JDBC；這個專案則經過 Service、DAO 與 MyBatis XML。[click]
揭露回應契約：AI 版本把 totalCount 加到共用 ApiResponse；既有做法把分頁資料包在 data，外殼維持不變。[click]
提醒：Repository 或 JDBC 本身並沒有錯；問題是這份交付沒有沿用案例專案的選擇。[click]
收束：功能完成，不代表符合專案契約。
轉場：我原本知道這些背景，卻沒有交代給 AI。下一頁看看漏掉了哪些脈絡。
-->
---
layout: default
class: ai-engineering-talk editorial-prototype
transition: slide-left
---

<main class="editorial-slide editorial-slide--context">
  <header class="editorial-heading">
  <span class="editorial-kicker">02　/　隱含脈絡</span>
  <h1>我知道，卻沒有交代給 AI</h1>
  <p>需求說了要做什麼，沒說這個專案怎麼做。</p>
  </header>

  <section class="editorial-prompt" aria-label="交給 AI 的簡短需求">
  <span>交給 AI 的需求</span>
  <blockquote>新增 <code>GET /api/orders</code>，依狀態與日期區間篩選，支援分頁。</blockquote>
  </section>

  <section class="editorial-context" aria-label="需求沒有交代的專案脈絡">
  <header class="editorial-context-heading">
  <h2>專案裡早已有三個答案</h2>
  <span>逐步補上背景</span>
  </header>

  <div class="editorial-context-list">
  <article class="editorial-context-row">
  <header class="editorial-context-label">
  <span>01</span>
  <h3>命名與責任分層</h3>
  </header>
  <div class="editorial-context-detail" v-click>
  <code>OrderController → OrderService → OrderDao → MyBatis XML</code>
  <small>HTTP 輸入與輸出 → 驗證、編排 → 查詢介面 → SQL 映射</small>
  </div>
  </article>

  <article class="editorial-context-row">
  <header class="editorial-context-label">
  <span>02</span>
  <h3>共用回應契約</h3>
  </header>
  <div class="editorial-context-detail" v-click>
  <code>ApiResponse&lt;T&gt; = { code, message, data }</code>
  <small><code>data = { items, totalCount }</code>　分頁資訊留在端點資料，不改共用外殼</small>
  </div>
  </article>

  <article class="editorial-context-row">
  <header class="editorial-context-label">
  <span>03</span>
  <h3>查詢語意</h3>
  </header>
  <div class="editorial-context-detail editorial-context-detail--query" v-click>
  <code>fromDate / toDate 必須成對；UTC 日曆日含首尾</code>
  <small><code>created_at ≥ fromDate 00:00 UTC</code> 且 <code>&lt; toDate + 1 day 00:00 UTC</code></small>
  <small><code>page=0, size=20（1–100）</code>　穩定排序：<code>created_at DESC, id DESC</code></small>
  </div>
  </article>
  </div>
  </section>

  <footer class="editorial-takeaway editorial-takeaway--context" v-click>
  <span>交辦不只要說明要做什麼</span>
  <strong>還要交代專案裡怎麼才算做對</strong>
  </footer>
</main>

<!--
先念出交給 AI 的一句話，停一下：它說了功能，沒有說專案怎麼做。
揭露分層。Controller 接 HTTP，Service 驗證並編排，DAO 宣告查詢，MyBatis XML 承載 SQL。[click]
揭露共用回應外殼。ApiResponse 維持 code、message、data；分頁結果 items 與 totalCount 留在 data。[click]
揭露查詢語意。fromDate 與 toDate 必須成對；UTC 日曆日含首尾，實作以次日零點作排除上界；分頁預設與穩定排序也要明確。[click]
收束：需求沒有交代的，是專案裡怎麼才算做對。[click]
轉場：把這些心裡知道的背景寫成可交接、可驗收的工作契約。
-->

---
layout: default
class: ai-engineering-talk palette-crystal
transition: slide-left
---

<main class="story-slide story-slide--contract">
  <header class="story-heading">
    <span class="kicker">第一章・03　/　把背景變成約定</span>
    <h1>工作契約</h1>
    <p>讓 AI 知道目標、可改範圍、專案規範，以及怎樣才算完成。</p>
  </header>
  <div class="contract-identity">
    <code>GET /api/orders</code>
    <span>可交接、可檢查的工作單位</span>
  </div>
  <div class="work-contract-board">
    <section class="work-contract-settled" aria-label="已定義的目標、邊界與規範">
      <header class="contract-column-heading">
        <strong>已定義</strong>
        <span>工作要做什麼、遵守什麼</span>
      </header>
      <div class="contract-stack-reveal" v-click>
        <CalloutStack
          class="work-contract-stack"
          :items="[
            { label: '目標', title: '新增訂單查詢', detail: 'GET /api/orders；依狀態、日期篩選並分頁', tone: 'blue' },
            { label: '邊界', title: '只改 Order API', detail: '保留共用 ApiResponse，不動無關端點', tone: 'amber' },
            { label: '規範', title: '延續命名與分層', detail: 'OrderQueryDto / OrderDao / MyBatis XML；分頁放在 data', tone: 'green' }
          ]"
        />
      </div>
    </section>
    <div class="work-contract-open">
      <article class="contract-question" aria-label="尚待確認的環境假設">
        <header class="contract-column-heading">
          <strong>未決事項</strong>
          <span>先確認環境假設</span>
        </header>
        <div class="contract-detail contract-detail--open" v-click>
          <strong>資料庫時區是否符合 UTC 假設？</strong>
          <small>核對 created_at 欄位與連線時區，再決定是否需要明確轉換。</small>
        </div>
      </article>
      <article class="contract-acceptance" aria-label="可驗收條件">
        <header class="contract-column-heading">
          <strong>驗收條件</strong>
          <span>交付前逐項確認</span>
        </header>
        <div class="contract-detail contract-detail--acceptance" v-click>
          <strong>日期或分頁越界回 400；排序穩定。</strong>
          <small>totalCount 為篩選後總數；外層回應不變；測試通過。</small>
        </div>
      </article>
    </div>
  </div>
  <footer class="contract-takeaway" v-click>
    工作契約 = <strong>目標 + 邊界 + 規範 + 未決 + 可驗收</strong>
  </footer>
</main>

<!--
先交代目標、修改邊界與既有架構；這三項可以直接寫進任務。[click]
UTC 是案例前提，真實環境仍要核對資料庫欄位與連線時區。[click]
接著把 HTTP 400、穩定排序、totalCount、回應外殼與測試列為驗收條件。[click]
用最後一句收束：工作契約讓交辦有依據，但未決事項仍需要查證。[click]
轉場：下一頁把新增 API 看成一個有輸入、輸出、責任和驗收的工作模組。
-->
