import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WIDTH = 1600
const HEIGHT = 900
const OUT_DIR = path.dirname(fileURLToPath(import.meta.url))

const C = {
  bg: '#f8fbff',
  ink: '#0f172a',
  secondary: '#475569',
  quiet: '#475569',
  line: '#cbd5e1',
  panel: '#eef5ff',
  accent: '#2563eb',
  amber: '#d97706',
  green: '#16a34a',
}

const FONT = 'Noto Sans TC, Microsoft JhengHei, PingFang TC, system-ui, sans-serif'
const MONO = 'JetBrains Mono, SFMono-Regular, Consolas, monospace'

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function textBlock(x, y, lines, options = {}) {
  const {
    size = 20,
    fill = C.ink,
    weight = 400,
    family = FONT,
    anchor = 'start',
    lineHeight = Math.round(size * 1.3),
    letterSpacing = 0,
  } = options
  const tspans = lines.map((line, index) =>
    `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
  ).join('')
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}px">${tspans}</text>`
}

function rect(x, y, width, height, options = {}) {
  const {
    fill = 'none',
    stroke = 'none',
    strokeWidth = 0,
    radius = 0,
  } = options
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
}

function line(x1, y1, x2, y2, options = {}) {
  const { stroke = C.line, strokeWidth = 2, arrow = false } = options
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"${arrow ? ' marker-end="url(#arrow)"' : ''}/>`
}

function header() {
  return [
    textBlock(88, 70, ['message 不是自由文字，', '而是既有 UI 契約'], {
      size: 44,
      weight: 500,
      lineHeight: 48,
      letterSpacing: -0.7,
    }),
    textBlock(1512, 58, ['PR #13  ·  e8ae8ad3'], {
      size: 13,
      weight: 500,
      fill: C.quiet,
      anchor: 'end',
      letterSpacing: 0.8,
    }),
  ].join('')
}

function sharedCondition() {
  return [
    rect(88, 168, 1424, 112, { fill: C.panel, radius: 12 }),
    rect(88, 168, 6, 112, { fill: C.accent, radius: 3 }),
    textBlock(120, 204, ['錯誤輸入'], { size: 16, weight: 700, fill: C.quiet }),
    textBlock(120, 244, ['?fromDate=2026-01-01  （缺少 toDate）'], {
      size: 22,
      family: MONO,
    }),
    textBlock(816, 204, ['共同 HTTP response'], { size: 16, weight: 700, fill: C.quiet }),
    textBlock(816, 244, ['HTTP 400  ·  code: "INVALID_QUERY"  ·  data: null'], {
      size: 18,
      family: MONO,
    }),
  ].join('')
}

function laneHeaders() {
  return [
    textBlock(112, 334, ['AI-direct'], { size: 27, weight: 600 }),
    textBlock(896, 334, ['Project-convention'], { size: 27, weight: 600 }),
    line(112, 351, 704, 351, { stroke: C.accent, strokeWidth: 3 }),
    line(896, 351, 1488, 351, { stroke: C.accent, strokeWidth: 3 }),
  ].join('')
}

function messageValue(x, kind) {
  const isCode = kind === 'code'
  const value = isCode
    ? [textBlock(x + 28, 464, ['"m0001"'], { size: 30, family: MONO, weight: 600 })]
    : [
      textBlock(x + 28, 450, ['"fromDate and toDate must', 'be supplied together"'], {
        size: 22,
        family: MONO,
        lineHeight: 31,
      }),
    ]
  return [
    line(x, 388, x, 530, { stroke: C.accent, strokeWidth: 4 }),
    textBlock(x + 24, 412, ['message'], { size: 16, weight: 700, fill: C.quiet }),
    ...value,
    textBlock(x + 28, 510, [isCode ? 'code · existing message key' : 'detail · raw string'], {
      size: 14,
      fill: C.quiet,
    }),
  ].join('')
}

function sharedConsumer() {
  return [
    rect(88, 566, 1424, 94, { fill: C.panel, radius: 12 }),
    rect(88, 566, 6, 94, { fill: C.accent, radius: 3 }),
    textBlock(800, 600, ['共用 Consumer'], { size: 17, weight: 700, anchor: 'middle' }),
    textBlock(800, 632, ['依 message 查詢既有代碼表'], {
      size: 22,
      weight: 500,
      anchor: 'middle',
    }),
    textBlock(800, 652, ['message-catalog  ·  resolveMessageCode(message)'], {
      size: 15,
      family: MONO,
      fill: C.quiet,
      anchor: 'middle',
    }),
  ].join('')
}

function resultArea() {
  return [
    textBlock(112, 716, ['Consumer result'], { size: 15, weight: 700, fill: C.quiet }),
    textBlock(112, 754, ['查無對應代碼'], { size: 26, weight: 600, fill: C.amber }),
    textBlock(112, 786, ['例外前綴 · Unknown message code: …'], {
      size: 15,
      family: MONO,
      fill: C.quiet,
    }),
    textBlock(896, 716, ['Consumer result'], { size: 15, weight: 700, fill: C.quiet }),
    textBlock(896, 754, ['查詢條件不合法'], { size: 26, weight: 600, fill: C.green }),
    textBlock(896, 786, ['解析成功 · m0001 → message-catalog'], {
      size: 15,
      family: MONO,
      fill: C.quiet,
    }),
  ].join('')
}

function footer() {
  return [
    line(88, 838, 1512, 838, { stroke: C.line, strokeWidth: 1 }),
    textBlock(88, 870, [
      'Evidence limit · synthetic case · Chromium / Browser MSW · bounded SQL evaluator · fixed fixtures · not external API Server or real database evidence',
    ], { size: 13, fill: C.quiet }),
  ].join('')
}

function connectors() {
  return [
    line(408, 530, 408, 566, { stroke: C.secondary, strokeWidth: 2, arrow: true }),
    line(1192, 530, 1192, 566, { stroke: C.secondary, strokeWidth: 2, arrow: true }),
    line(408, 660, 408, 700, { stroke: C.secondary, strokeWidth: 2, arrow: true }),
    line(1192, 660, 1192, 700, { stroke: C.secondary, strokeWidth: 2, arrow: true }),
  ].join('')
}

function svg(body) {
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${C.bg}; }
  svg { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; }
</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.secondary}"/>
    </marker>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.bg}"/>
  ${body}
</svg></body></html>`
}

function base() {
  return [header(), sharedCondition(), laneHeaders()]
}

function state1() {
  return [...base(), footer()].join('')
}

function state2() {
  return [
    ...base(),
    messageValue(112, 'detail'),
    messageValue(896, 'code'),
    footer(),
  ].join('')
}

function state3() {
  return [
    ...base(),
    messageValue(112, 'detail'),
    messageValue(896, 'code'),
    connectors(),
    sharedConsumer(),
    resultArea(),
    footer(),
  ].join('')
}

async function render(name, body) {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    })
    await page.setContent(svg(body), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(50)
    await page.screenshot({ path: path.join(OUT_DIR, name), type: 'png' })
    await page.close()
  } finally {
    await browser.close()
  }
}

await mkdir(OUT_DIR, { recursive: true })
await render('state-1.png', state1())
await render('state-2.png', state2())
await render('state-3.png', state3())
