<script setup lang="ts">
import { computed } from 'vue'
import applicationSource from '../examples/order-api/ts-v1/src/application.ts?raw'

const props = withDefaults(defineProps<{ region?: string }>(), {
  region: 'service-search',
})

const excerpt = computed(() => {
  const opening = '// #region ' + props.region
  const ending = '// #endregion ' + props.region
  const from = applicationSource.indexOf(opening)
  const to = applicationSource.indexOf(ending, from + opening.length)
  if (from < 0 || to < 0) return 'Source region unavailable: ' + props.region
  return applicationSource.slice(from + opening.length, to)
    .replace(/^\s*\n/, '')
    .replace(/\n\s*$/, '')
    .split('\n').map(line => line.replace(/^  /, '')).join('\n')
})
</script>

<template>
  <div class="story-source" aria-label="Source excerpt imported from canonical Order API">
    <div class="story-source-caption">
      <span>SSOT / src/application.ts</span>
      <span>read-only source import</span>
    </div>
    <pre><code>{{ excerpt }}</code></pre>
  </div>
</template>
