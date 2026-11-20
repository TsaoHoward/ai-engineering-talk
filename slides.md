---
theme: seriph
title: 從寫 Code 到設計工作｜第一、二章連續原型
layout: default
colorSchema: light
class: ch-integrated
transition: fade
---

<main class="chapter-shell chapter-cover">
  <div class="chapter-meta">AI ENGINEERING TALK <span>CHAPTER 01—02 · INTEGRATED PROTOTYPE</span></div>
  <div class="chapter-cover-center">
    <div class="chapter-rule"></div>
    <p class="cover-strap">從一次看似完成的 API 開發談起</p>
    <h1>從寫 Code<br>到設計工作</h1>
    <p class="cover-subtitle">當 AI 能完成程式，工程師還需要設計什麼？</p>
    <div class="cover-journey"><span>01　交付落差</span><b>→</b><span>02　規格與模組</span><b>→</b><span>工作設計</span></div>
  </div>
  <footer class="chapter-footer"><span>合成 Order API · TypeScript / MSW</span><span>第一、二章 · 連續原型</span></footer>
</main>

<!--
開場約 15 秒。這是第一、二章的連續播放原型，不是全場定稿。
我們先看同一支 API 的交辦與成果，再從它回到工程師平常依賴的規格與模組設計。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · 交辦</span>
    <h1>只交辦一支 API。</h1>
    <p>先看需求本身：它說明了功能，但沒有說明專案裡怎樣才算能交付。</p>
  </header>
  <div class="hero-prompt">
    <div class="hero-prompt-label"><span class="prompt-indicator"></span>REQUEST / SYNTHETIC</div>
    <blockquote>新增訂單查詢 API，支援<span>狀態</span>、<span>日期區間</span>與<span>分頁</span>，並回傳總筆數。</blockquote>
    <div class="hero-prompt-endpoint"><span>GET</span><code>/api/orders</code></div>
  </div>
  <div class="hero-request-foot" v-click>
    <span>收到的資訊</span><strong>要做什麼</strong>
    <span class="hero-divider"></span><span>沒有說明的資訊</span><strong>要符合哪些既有約定</strong>
  </div>
  <footer class="chapter-footer"><span>交辦 → 看成果</span><span>01 / 問題從哪裡開始</span></footer>
</main>

<!--
[初始] 先念出簡短需求：狀態、日期、分頁、總筆數。不要先說 AI 做錯。
[Click 1] 這段話告訴執行者要做什麼，卻沒交代已有 Consumer、回應形狀、責任分層。
轉場：如果真的把查詢實作出來，結果會長什麼樣？
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · 功能成功</span>
    <h1>功能看起來完成了。</h1>
    <p>這不是靜態截圖：下方真的透過 Browser MSW 執行合成 TypeScript API。</p>
  </header>
  <div class="chapter-demo-frame">
    <OrderApiLive mode="single" />
  </div>
  <div class="chapter-note-line" v-click><strong>查詢成功</strong><span>只能證明這條 Mock 執行路徑的功能結果，還不能證明符合整合契約。</span></div>
  <footer class="chapter-footer"><span>同一份 42 筆合成資料 · 受限 SQL Mock</span><span>02 / 從結果開始看</span></footer>
</main>

<!--
[初始] 點選狀態再按查詢，讓觀眾看見 HTTP 200、總筆數與資料列確實改變；這是 TypeScript + MSW 的瀏覽器實測，不是外部真後端或資料庫。
[Click 1] 功能成功不等於所有交付條件都已通過。
轉場：我們從 API 的回應開始，逐層檢查。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · RESPONSE</span>
    <h1>同樣查詢，Response 不一樣。</h1>
    <p>左右資料相同，分頁資訊放的位置卻不同。</p>
  </header>
  <div class="chapter-demo-frame chapter-demo-frame--compare">
    <OrderApiLive mode="compare" />
  </div>
  <div class="chapter-note-line" v-click><strong>差異不是結論</strong><span>要先知道既有系統如何使用它，才能判斷這個差異是否影響交付。</span></div>
  <footer class="chapter-footer"><span>原始碼：aiResponse() / response() · 相同查詢語意</span><span>03 / 從外部契約往內檢查</span></footer>
</main>

<!--
[初始] 左側 AI-direct：data 是陣列，totalCount 在根層；右側 convention：data 裡有 items、totalCount。
程式使用兩種回應工廠，沒有真的修改同一個共用 ApiResponse 型別；不能將額外欄位本身視為所有 Consumer 都會失敗。
[Click 1] 真正問題在於既有整合依賴。下一頁直接呼叫 Consumer 檢查。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · CONSUMER CONTRACT</span>
    <h1>差異碰到了既有 Consumer。</h1>
    <p>既有前端讀取的是 <code>data.items</code> 和 <code>data.totalCount</code>。</p>
  </header>
  <div class="chapter-demo-frame chapter-demo-frame--consumer">
    <OrderApiLive mode="consumer" />
  </div>
  <div class="chapter-note-line chapter-note-line--strong" v-click><strong>整合不相容</strong><span>不是因為 JSON 多了一個欄位，而是既有 Consumer 無法取得所需資料路徑。</span></div>
  <footer class="chapter-footer"><span>Consumer：src/existing-consumer.ts · 真實執行</span><span>04 / 契約才是判斷依據</span></footer>
</main>

<!--
[初始] 同一組資料。左側的 Response 雖然 HTTP 200，但 Consumer 讀不到 data.items；右側可以正常讀取。
強調這是合成專案的既有契約，不是在評論其他 API 設計普遍優劣。
[Click 1] 具體相容性證據出現後，才能說「功能成功，但沒有符合交付契約」。
轉場：再看內部責任如何安排。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · ARCHITECTURE & NAMING</span>
    <h1>另一個差異，在責任分層。</h1>
    <p>不是誰的層數比較多，而是是否沿用這個合成專案既有的協作方式。</p>
  </header>
  <div class="arch-compare">
    <section class="arch-column">
      <div class="arch-title"><span>AI-direct</span><small>直接完成查詢</small></div>
      <div class="arch-path"><div>Controller</div><i>↓</i><div class="arch-focus">OrderRepository</div><i>↓</i><div>Parameterized SQL</div></div>
      <div class="arch-bottom">資料庫呼叫經由共用 DbTransport</div>
    </section>
    <section class="arch-column arch-column--expected" v-click>
      <div class="arch-title"><span>Project-convention</span><small>沿用既有模組責任</small></div>
      <div class="arch-path"><div>Controller</div><i>↓</i><div>OrderService</div><i>↓</i><div class="arch-focus">OrderDao</div><i>↓</i><div>Drizzle ORM</div></div>
      <div class="arch-bottom">兩者最後都走 MSW DB 的有限 SQL 模擬</div>
    </section>
  </div>
  <div class="chapter-note-line" v-click><strong>不是 Repository 錯</strong><span>而是既有團隊已對命名、責任、Consumer 契約形成共同期待。</span></div>
  <footer class="chapter-footer"><span>真正的 TypeScript 函式與類別名稱 · 無 Java／MyBatis</span><span>05 / 從結果深入內部</span></footer>
</main>

<!--
[初始] AI-direct 的 Repository 做出查詢，本身可以成立。
[Click 1] 合成專案的既有設計使用 Service 和 DAO，DAO 透過 Drizzle 產生 SQL。
兩邊最後都透過同一個 MSW DB Handler，這裡沒有實際 SQL Server。
[Click 2] 不是分層數量多就比較好，而是工程師能否掌握既有架構與契約。
轉場：那麼這些期待，我一開始有交代嗎？
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">01 / CHAPTER ONE · 回到交辦</span>
    <h1>我交辦了功能，卻用另一套標準驗收。</h1>
    <p>差異不只存在於程式碼，而在那些沒有提供或確認的背景。</p>
  </header>
  <div class="reflect-grid">
    <section class="reflect-prompt"><span>一開始的交辦</span><blockquote>新增訂單查詢，支援篩選與分頁。</blockquote><small>描述了目標功能</small></section>
    <div class="reflect-divider">VS</div>
    <section class="reflect-expectations">
      <span>實際用來判斷能否交付</span>
      <div v-click>既有 Consumer：<strong>data.items / data.totalCount</strong></div>
      <div v-click>模組慣例：<strong>Service → DAO</strong></div>
      <div v-click>驗收語意：<strong>UTC、排序、分頁與測試</strong></div>
    </section>
  </div>
  <div class="chapter-takeaway" v-click>我沒有明確交代的，正是我依賴的既有規格。</div>
  <footer class="chapter-footer"><span>人類工程師若不了解既有系統，也可能遇到一樣的問題</span><span>06 / 第一章收束</span></footer>
</main>

<!--
[初始] 左邊一句話是最初的要求；右邊才是審查時倚靠的現有約定。
[Click 1-3] 依次帶出 Consumer、責任分層、查詢／測試；不能一口氣說成只要 Prompt 寫得更長。
[Click 4] 第一章收束：功能交辦與可交付之間有既有規格的落差。
轉場：這些東西，其實就是工程師每天在用的規格。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">02 / CHAPTER TWO · SPECIFICATION</span>
    <h1>其實，這些都是規格。</h1>
    <p>工程師不是每次都從完整需求書開始，而是在程式、型別、介面與測試中讀取線索。</p>
  </header>
  <div class="method-layout">
    <section class="method-main">
      <div class="method-overline">既有的 TypeScript Method · 從 SSOT 原始碼直接讀取</div>
      <OrderSourceExcerpt region="service-search" />
    </section>
    <div class="method-side">
      <div class="method-chip" v-click><strong>Method / Types</strong><span>OrderQuery → OrderPage</span></div>
      <div class="method-chip" v-click><strong>Constructor / Dependency</strong><span>OrderService(new OrderDao(...))</span></div>
      <div class="method-chip" v-click><strong>Consumer / Tests</strong><span>data.items · UTC · totalCount</span></div>
    </div>
  </div>
  <div class="chapter-note-line" v-click><strong>簽章不是全部</strong><span>它描述局部輸入與輸出；完整行為仍需要查閱其他契約及測試。</span></div>
  <footer class="chapter-footer"><span>第二章：規格 → 模組 → 工作單元</span><span>07 / 從每天的開發經驗出發</span></footer>
</main>

<!--
[初始] 直接看 OrderService 的真實 search 方法；它明示參數與回傳型別，也告訴我們依賴 DAO。
[Click 1-3] 再把規格的不同載體補上：型別、建構子依賴、Consumer 與測試。
[Click 4] 簽章不能保證所有查詢語意，還需要契約、程式與實際查證。
轉場：在有限資訊下，為何不同模組仍能合作？
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">02 / CHAPTER TWO · SYSTEM VIEW</span>
    <h1>模組靠介面合作，不靠彼此知道全部細節。</h1>
    <p>把上一章的架構重新看一次，這次我們關注合作本身。</p>
  </header>
  <div class="system-flow">
    <article><span>HTTP</span><strong>Controller</strong><small>接收與回傳</small></article>
    <i>→</i>
    <article><span>LOGIC</span><strong>OrderService</strong><small>協調查詢</small></article>
    <i>→</i>
    <article><span>DATA</span><strong>OrderDao</strong><small>宣告資料查詢</small></article>
    <i>→</i>
    <article><span>SQL</span><strong>Drizzle / MSW DB</strong><small>產生 SQL / Mock 執行</small></article>
  </div>
  <div class="principle-grid">
    <div v-click><small>01 · RESPONSIBILITY</small><strong>誰負責？</strong></div>
    <div v-click><small>02 · INTERFACE</small><strong>怎麼合作？</strong></div>
    <div v-click><small>03 · DEPENDENCY</small><strong>依賴什麼？</strong></div>
  </div>
  <footer class="chapter-footer"><span>System View：交付後的程式如何合作</span><span>08 / 設計系統的問題</span></footer>
</main>

<!--
[初始] 重用第一章的圖，但不再拿來證明 AI 與慣例不同。
[Click 1-3] 責任、介面和依賴是合作時真正要回答的設計問題。
並不需要使用方知道對方全部演算法細節，也不能因此忽略契約的未知限制。
轉場：如果我們設計的不是最後交付的程式，而是完成它們的工作？
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">02 / CHAPTER TWO · FROM SYSTEM TO WORK</span>
    <h1>同一個目標，換一種設計視角。</h1>
    <p>不把程式模組對應成工作，而是把相同的設計問題用到另一個對象。</p>
  </header>
  <v-switch class="view-stage">
    <template #0>
      <div class="view-stage-label">SYSTEM VIEW <small>交付後的程式</small></div>
      <div class="view-nodes"><div>Controller</div><b>→</b><div>Service</div><b>→</b><div>DAO</div></div>
      <div class="view-caption">問的是：模組在執行時如何合作？</div>
    </template>
    <template #1>
      <div class="view-stage-label">SHARED DESIGN QUESTIONS <small>抽出共同原則</small></div>
      <div class="view-principles"><div>誰負責？</div><div>怎麼合作？</div><div>依賴什麼？</div></div>
      <div class="view-caption">設計的對象可以改變，問題仍然成立。</div>
    </template>
    <template #2>
      <div class="view-stage-label">WORK VIEW <small>完成系統的工作</small></div>
      <div class="view-nodes view-nodes--work"><div><small>WORK 01</small>設計 Schema</div><b><small>Schema</small>→</b><div class="view-highlight"><small>WORK 02</small>實作 API</div><b><small>API 契約</small>→</b><div><small>WORK 03</small>開發前端</div></div>
      <div class="view-caption">箭頭表示交接與依賴，不是強制的時間順序；此處是工作概念圖，Mock 案例沒有建立真實 Table。</div>
    </template>
  </v-switch>
  <footer class="chapter-footer"><span>從「設計系統」轉成「設計完成它的工作」</span><span>09 / 視角切換</span></footer>
</main>

<!--
[初始] System View 是交付後程式的合作關係。
[Click 1] 抽出三個共同的設計問題，畫面短促停留，不講概念列表課。
[Click 2] Work View 是完成它所需的工作，以 Schema、API 契約為交接物，不做 Controller = 建立 Table 的一對一映射。
轉場：把實作 API 這項工作放大。
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">02 / CHAPTER TWO · WORK CONTRACT</span>
    <h1>放大一項工作：實作 API。</h1>
    <p>定義工作的可交付邊界，不是先規劃好內部每一步。</p>
  </header>
  <div class="mini-work-flow"><span>設計 Schema</span><b>→ Schema →</b><strong>實作 API</strong><b>→ API 契約 →</b><span>開發前端</span></div>
  <div class="contract-board">
    <section><small>INPUT</small><strong>需求與既有環境</strong><p>訂單查詢需求<br>Schema／既有 Consumer<br>專案規範</p></section>
    <section class="contract-center"><small>RESPONSIBILITY</small><strong>完成訂單查詢 API</strong><p>查詢、篩選、排序、分頁</p></section>
    <section><small>OUTPUT</small><strong>可交接的成果</strong><p>TypeScript 變更<br>必要測試<br>交付與限制說明</p></section>
  </div>
  <div class="contract-lower">
    <div v-click><small>CONSTRAINTS</small><strong>既有 Service／DAO、Response 契約與修改邊界</strong></div>
    <div v-click><small>ACCEPTANCE</small><strong>相容的 Consumer、正確功能、可追溯測試</strong></div>
  </div>
  <footer class="chapter-footer"><span>Work View：工作之間如何交付與驗收</span><span>10 / 把工作契約外顯</span></footer>
</main>

<!--
[初始] 保留上下游，放大中間的 API 實作工作。Input、Responsibility、Output 都是對外說明。
[Click 1] 補上既有架構、Response 契約與修改限制。
[Click 2] 補上如何判斷能否交付；目前 Mock 測試不能宣稱真資料庫正確性。
轉場：這樣是否表示要替執行者預先決定每個實作步驟？
-->

---
layout: default
class: ch-integrated
transition: fade
---

<main class="chapter-shell">
  <header class="chapter-heading">
    <span class="chapter-kicker">02 / CHAPTER TWO · ENCAPSULATION</span>
    <h1>對外清楚，對內保留彈性。</h1>
    <p>好的封裝讓合作可以依靠契約，但不是把影響交付的未知事項藏起來。</p>
  </header>
  <v-switch class="encap-stage">
    <template #0>
      <div class="encap-contract"><small>EXTERNAL CONTRACT</small><strong>目標 · 輸入輸出 · 邊界 · 驗收</strong></div>
      <div class="encap-internal">
        <span>INTERNAL IMPLEMENTATION / 實作 API</span>
        <div><strong>探索既有程式</strong><strong>選擇做法</strong><strong>測試與調整</strong></div>
      </div>
      <p>外部可依賴的是約定；內部實作方法允許調整。</p>
    </template>
    <template #1>
      <div class="encap-capsule"><small>WORK UNIT / IMPLEMENT API</small><strong>實作 API</strong><span>對外承諾：目標 · 介面 · 限制 · 驗收</span></div>
      <p>封裝的是執行細節，<b>不是未知風險與必要的協商。</b></p>
    </template>
    <template #2>
      <div class="encap-capsule"><small>WORK UNIT / IMPLEMENT API</small><strong>實作 API</strong><span>對外承諾：目標 · 介面 · 限制 · 驗收</span></div>
      <div class="encap-next"><small>NEXT / PROMPT → SKILL</small><strong>如果執行方法能重用，能不能再封裝一次？</strong></div>
    </template>
  </v-switch>
  <footer class="chapter-footer"><span>第一、二章結束 · 接續 Prompt / Skill</span><span>11 / 封裝與下一步</span></footer>
</main>

<!--
[初始] Contract 是對外可依靠的部分；探索、實作和驗證的方法不必預先全寫死。
[Click 1] 收起內部細節。會影響介面、限制與驗收的未知風險不能藏起來。
[Click 2] 轉到第三章：若重複開發 API 都有類似的探索、實作與檢查步驟，能否封裝成 Skill？
-->
