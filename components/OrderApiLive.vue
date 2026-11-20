<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { readExistingOrdersConsumer } from '../examples/order-api/ts-v1/src/existing-consumer'

type ViewMode = 'single' | 'compare' | 'consumer'
type Variant = 'ai-direct' | 'project-convention'
type OrderItem = { id: number; customerId: number; status: string; createdAt: string }
type ViewRecord = {
  variant: Variant
  status: number
  items: OrderItem[]
  totalCount: number
  body: unknown
  compatible: boolean
  consumerExplanation: string
}
const props = withDefaults(defineProps<{ mode?: ViewMode }>(), {
  mode: 'compare',
})
const statusFilter = ref('')
const pageSize = ref('3')
const loading = ref(true)
const error = ref('')
const results = ref<ViewRecord[]>([])
const executed = ref(false)

let runtime: Promise<typeof import('../examples/order-api/ts-v1/src/worker')> | undefined
function ensureRuntime() {
  runtime ??= import('../examples/order-api/ts-v1/src/worker')
    .then(async module => {
      await module.startMock()
      return module
    })
  return runtime
}

async function run() {
  loading.value = true
  error.value = ''
  try {
    const api = await ensureRuntime()
    const query = new URLSearchParams({ pageSize: pageSize.value })
    if (statusFilter.value) query.set('status', statusFilter.value)
    const variants: Variant[] = props.mode === 'single'
      ? ['ai-direct'] : ['ai-direct', 'project-convention']
    const records: ViewRecord[] = []
    for (const variant of variants) {
      const response = await fetch(api.apiUrl(variant) + '?' + query)
      const body: any = await response.json()
      if (!response.ok) throw new Error(variant + ': HTTP ' + response.status)
      const data = variant === 'ai-direct'
        ? { items: body.data, totalCount: body.totalCount }
        : body.data
      let compatible = false
      let consumerExplanation = ''
      try {
        readExistingOrdersConsumer(body)
        compatible = true
        consumerExplanation = '可讀取 data.items / data.totalCount'
      } catch {
        consumerExplanation = '無法讀取 data.items / data.totalCount'
      }
      records.push({
        variant, status: response.status, body,
        items: data.items, totalCount: data.totalCount,
        compatible, consumerExplanation,
      })
    }
    results.value = records
    executed.value = true
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    loading.value = false
  }
}
onMounted(() => { void run() })

function titleFor(variant: Variant) {
  return variant === 'ai-direct' ? 'AI-direct' : 'Project-convention'
}
function responseJson(record: ViewRecord) {
  // Project the first returned row from the ACTUAL HTTP response; no duplicate
  // fixture or second response contract is maintained for the presentation.
  const body = record.body as { code: string; message: string; data: any; totalCount?: number }
  const projected = record.variant === 'ai-direct'
    ? { ...body, data: Array.isArray(body.data) ? body.data.slice(0, 1) : body.data }
    : { ...body, data: { ...body.data, items: body.data.items.slice(0, 1) } }
  return JSON.stringify(projected, null, 2)
}
</script>

<template>
  <section class="live-api" :class="'live-api--' + mode" aria-label="Live synthetic API with MSW" data-testid="slide-live-api">
    <div class="live-toolbar">
      <div class="live-endpoint">
        <span class="live-method">GET</span>
        <code>/api/orders</code>
        <span class="live-mock-tag">BROWSER MSW · SYNTHETIC</span>
      </div>
      <div class="live-controls">
        <label>狀態
          <select v-model="statusFilter" aria-label="Order status" data-testid="demo-status">
            <option value="">全部</option>
            <option value="PAID">PAID</option>
            <option value="NEW">NEW</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>
        <label>筆數
          <select v-model="pageSize" aria-label="Page size">
            <option value="1">1</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </label>
        <button type="button" @click="run" :disabled="loading" data-testid="demo-run">送出查詢</button>
      </div>
    </div>

    <p v-if="error" class="live-error" data-testid="demo-error">Mock API 無法啟動：{{ error }}</p>
    <div v-else-if="loading" class="live-loading" role="status">正在執行 TypeScript API → MSW DB…</div>
    <div v-else-if="executed" class="live-results" :class="{ 'live-results--single': mode === 'single' }">
      <article v-for="record in results" :key="record.variant" class="live-result"
        :data-testid="'demo-' + record.variant">
        <header class="live-result-head">
          <strong>{{ titleFor(record.variant) }}</strong>
          <span class="live-status" :data-testid="'status-' + record.variant">{{ record.status }} OK</span>
        </header>
        <template v-if="mode === 'single'">
          <div class="live-stats"><strong>{{ record.totalCount }}</strong><span>筆符合條件</span><small>本頁 {{ record.items.length }} 筆</small></div>
          <table class="live-table">
            <thead><tr><th>ORDER ID</th><th>STATUS</th><th>CREATED AT (UTC)</th></tr></thead>
            <tbody><tr v-for="row in record.items" :key="row.id">
              <td>#{{ row.id }}</td><td>{{ row.status }}</td><td>{{ row.createdAt.slice(0, 10) }}</td>
            </tr></tbody>
          </table>
        </template>
        <template v-else>
          <pre class="live-json">{{ responseJson(record) }}</pre>
          <small class="live-json-caption">顯示第一筆 · 實際回傳 {{ record.items.length }} 筆</small>
        </template>
        <div v-if="mode === 'consumer'" class="live-consumer"
          :class="record.compatible ? 'live-consumer--ok' : 'live-consumer--bad'"
          :data-testid="'consumer-' + record.variant">
          <strong>{{ record.compatible ? 'Consumer 相容' : 'Consumer 不相容' }}</strong>
          <small>{{ record.consumerExplanation }}</small>
        </div>
      </article>
    </div>
    <footer class="live-provenance">實際執行：Browser MSW API → TypeScript → SQL / Drizzle → MSW DB（42 筆合成資料，非真實資料庫）</footer>
  </section>
</template>
