---
theme: seriph
title: 從寫 Code 到設計工作
---

# 從寫 Code 到設計工作

用模組化思維理解 AI 協作、軟體工程與工程師成長

---
layout: default
class: ai-engineering-talk palette-crystal
transition: slide-left
---

<span class="kicker">從寫 Code 到設計工作　/　M1a・合成案例</span>

<h1>同一支 API，兩種實作</h1>

<div class="order-api-request" aria-label="共同需求：GET /api/orders，依狀態與日期區間查詢並支援分頁">
  <code>GET /api/orders</code>
  <span>同一需求：狀態・日期區間・分頁</span>
  <strong>功能需求相同</strong>
</div>

<div class="order-api-comparison-frame">
  <ComparisonTable
    class="order-api-table"
    aria-label="AI 直接實作與符合既有專案慣例的三個面向比較"
    first-column="比較面向"
    :columns="['AI 直接實作', '符合既有專案慣例']"
    :rows="[
      { label: 'Naming', values: ['OrderRepository\nOrderResponse', 'OrderDao\nOrderQueryDto'] },
      { label: '資料存取', values: ['Controller → Repository\nNamedParameterJdbcTemplate → Database', 'Controller → Service → DAO\nMyBatis XML → Database'] },
      { label: 'API 回應', values: ['ApiResponse<List<OrderResponse>>\nroot.totalCount + data[]', 'ApiResponse<OrderPageDto>\ndata: { items, totalCount }'] }
    ]"
  />
  <div class="order-api-focus-layer" aria-hidden="true">
    <span class="order-api-focus" v-click></span>
    <span class="order-api-focus" v-click></span>
    <span class="order-api-focus" v-click></span>
  </div>
</div>

<footer class="order-api-footer">
  <small>Repository / JDBC 本身可行；差異在於是否沿用既有專案慣例。</small>
  <div class="order-api-takeaway" v-click>
    <strong>功能完成 ≠ 符合既有專案契約</strong>
  </div>
</footer>

<!--
先請觀眾看共同需求：兩邊的查詢功能其實相同。
依序聚焦 Naming。[click]
接著看資料存取邊界。[click]
最後看 API 回應契約。[click]
Repository / JDBC 本身並沒有錯；重點是成果是否沿用這個合成專案已經存在的選擇。[click]
轉場：我知道這些規範，卻沒有寫進交辦內容。下一頁拆開看 AI 看不到的專案脈絡。
-->
---
layout: default
class: ai-engineering-talk palette-crystal
transition: slide-left
---

<main class="story-slide story-slide--context">
  <header class="story-heading">
    <span class="kicker">第一章・02　/　隱含脈絡</span>
    <h1>我知道，卻沒有交代給 AI</h1>
    <p>需求說了要做什麼，沒說這個專案怎麼做。</p>
  </header>
  <div class="context-grid">
    <section class="prompt-card" aria-label="交給 AI 的簡短需求">
      <div class="prompt-card-heading">
        <span>AI 收到的需求</span>
        <small>一句話</small>
      </div>
      <blockquote>新增 <code>GET /api/orders</code>，依狀態與日期區間篩選，支援分頁。</blockquote>
      <div class="prompt-divider"></div>
      <div class="prompt-card-foot">
        <span><b>有說</b> 功能與查詢條件</span>
        <span><b>沒說</b> 專案既有脈絡</span>
      </div>
      <div class="prompt-quote-mark" aria-hidden="true">“</div>
    </section>
    <section class="knowledge-deck" aria-label="需求中沒有交代的專案知識">
      <header class="knowledge-deck-heading">
        <strong>但我知道，專案裡早有答案</strong>
        <span>逐步補上上下文</span>
      </header>
      <article class="knowledge-section knowledge-section--architecture">
        <header class="knowledge-section-heading">
          <strong>01　命名與責任分層</strong>
          <small>專案慣例</small>
        </header>
        <div class="knowledge-section-body">
          <div class="knowledge-reveal" v-click>
            <ArchitectureLayers
              :layers="[
                { label: 'HTTP', title: 'OrderController', detail: '接收查詢、回傳 ApiResponse', tone: 'blue' },
                { label: 'Logic', title: 'OrderService', detail: '驗證條件、編排查詢', tone: 'green' },
                { label: 'Data', title: 'OrderDao', detail: '宣告 count / selectPage', tone: 'purple' },
                { label: 'SQL', title: 'MyBatis XML', detail: '參數綁定、固定排序', tone: 'amber' }
              ]"
            />
          </div>
        </div>
      </article>
      <div class="knowledge-pair">
        <article class="knowledge-section">
          <header class="knowledge-section-heading">
            <strong>02　共用回應契約</strong>
            <small>所有端點共用</small>
          </header>
          <div class="knowledge-section-body">
            <div class="knowledge-reveal" v-click>
              <code class="response-envelope">{ code, message, data }</code>
              <small>分頁資料放在 data：{ items, totalCount }</small>
            </div>
          </div>
        </article>
        <article class="knowledge-section">
          <header class="knowledge-section-heading">
            <strong>03　查詢語意</strong>
            <small>功能邊界</small>
          </header>
          <div class="knowledge-section-body">
            <div class="knowledge-reveal knowledge-reveal--rules" v-click>
              <strong>UTC 含首尾日；from / to 成對</strong>
              <small>page=0・size=20（1–100）・created_at DESC, id DESC</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
  <footer class="context-takeaway" v-click>
    <span>沒交代的不是功能</span>
    <b aria-hidden="true">→</b>
    <strong>是我心裡那份專案背景</strong>
  </footer>
</main>

<!--
讀出這句短需求，停一下：它只描述功能。[click]
揭露 Controller / Service / DAO / XML，說明命名和責任本來已有約定。[click]
再補上共用 ApiResponse 外殼；分頁資料要放在 data 裡。[click]
最後補上 UTC 日期、分頁預設和穩定排序，這些才是需求能被正確驗收的細節。[click]
轉場：把心裡知道的背景寫出來，下一頁整理成一份可以交接和驗收的工作契約。
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
