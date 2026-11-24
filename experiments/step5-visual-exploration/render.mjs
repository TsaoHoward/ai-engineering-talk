import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WIDTH = 1600
const HEIGHT = 900
const OUT_DIR = path.dirname(fileURLToPath(import.meta.url))

const C = {
  bg: '#ffffff',
  ink: '#111111',
  soft: '#5f6368',
  line: '#aeb4ba',
  pale: '#f1f3f4',
  white: '#ffffff',
}

const FONT = 'Noto Sans TC, Microsoft JhengHei, PingFang TC, sans-serif'
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
    lineHeight = Math.round(size * 1.35),
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
    stroke = C.ink,
    strokeWidth = 2,
    radius = 0,
    dash = '',
  } = options
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
}

function circle(cx, cy, radius, options = {}) {
  const { fill = 'none', stroke = C.ink, strokeWidth = 2 } = options
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`
}

function line(x1, y1, x2, y2, options = {}) {
  const { stroke = C.ink, strokeWidth = 2, dash = '', arrow = false } = options
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`
}

function header(option, subtitle) {
  return [
    textBlock(88, 68, ['SLIDE 5  /  VISUAL EXPLORATION'], {
      size: 16, weight: 700, fill: C.soft, letterSpacing: 3,
    }),
    textBlock(88, 132, ['message 不是自由文字，', '而是既有 UI 契約'], {
      size: 48, weight: 500, lineHeight: 54,
    }),
    textBlock(1512, 68, [option], {
      size: 16, weight: 700, fill: C.soft, letterSpacing: 2, anchor: 'end',
    }),
    textBlock(1512, 164, [subtitle], {
      size: 18, fill: C.soft, anchor: 'end',
    }),
    line(88, 205, 1512, 205, { stroke: C.line, strokeWidth: 2 }),
  ].join('')
}

function footer() {
  return [
    line(88, 832, 1512, 832, { stroke: C.line, strokeWidth: 1 }),
    textBlock(88, 866, ['案例限制：Browser MSW / Chromium 合成回應；不是外部 API Server 或真實資料庫執行證據'], {
      size: 14, fill: C.soft,
    }),
  ].join('')
}

function envelope(x, y, width = 440) {
  return [
    rect(x, y, width, 94, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(x + 24, y + 30, ['HTTP 400'], { size: 18, weight: 700 }),
    textBlock(x + 150, y + 30, ['code: "INVALID_QUERY"'], { size: 17, family: MONO }),
    textBlock(x + 24, y + 68, ['message'], { size: 17, fill: C.soft }),
    textBlock(x + 150, y + 68, ['data: null'], { size: 17, family: MONO }),
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
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${C.ink}"/>
    </marker>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.bg}"/>
  ${body}
</svg></body></html>`
}

function optionA() {
  return [
    header('OPTION A  /  PARALLEL COMPARISON', '共同輸入 → 分成兩條 Consumer 路徑'),
    rect(88, 244, 1424, 82, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(116, 276, ['錯誤輸入'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(116, 306, ['?fromDate=2026-01-01  （缺少 toDate）'], { size: 22, family: MONO }),
    textBlock(790, 276, ['同一個回應外殼'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(790, 306, ['HTTP 400   ·   code: "INVALID_QUERY"   ·   data: null'], { size: 18, family: MONO }),
    line(800, 350, 800, 788, { stroke: C.line, strokeWidth: 2 }),
    textBlock(128, 378, ['AI-direct'], { size: 26, weight: 600 }),
    textBlock(128, 408, ['message 填入可讀句子'], { size: 16, fill: C.soft }),
    textBlock(928, 378, ['Project-convention'], { size: 26, weight: 600 }),
    textBlock(928, 408, ['message 遵守既有代碼'], { size: 16, fill: C.soft }),
    rect(112, 438, 592, 150, { stroke: C.ink, strokeWidth: 2 }),
    textBlock(140, 474, ['message'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(140, 514, ['"fromDate and toDate"', '"must be supplied together"'], { size: 23, family: MONO, lineHeight: 34 }),
    rect(896, 438, 592, 150, { stroke: C.ink, strokeWidth: 2 }),
    textBlock(924, 474, ['message'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(924, 520, ['"m0001"'], { size: 30, family: MONO, weight: 700 }),
    textBlock(924, 560, ['message-catalog：m0001 → 查詢條件不合法'], { size: 17, fill: C.soft }),
    line(408, 588, 408, 642, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(1192, 588, 1192, 642, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    textBlock(128, 684, ['既有 Consumer'], { size: 17, fill: C.soft }),
    textBlock(128, 728, ['Unknown message code'], { size: 28, weight: 500 }),
    textBlock(928, 684, ['既有 Consumer'], { size: 17, fill: C.soft }),
    textBlock(928, 728, ['查詢條件不合法'], { size: 28, weight: 500 }),
    line(128, 760, 704, 760, { stroke: C.ink, strokeWidth: 3 }),
    line(928, 760, 1488, 760, { stroke: C.ink, strokeWidth: 3 }),
    textBlock(800, 801, ['同一欄位名稱，不代表同一個 UI 語意'], { size: 20, weight: 600, anchor: 'middle' }),
    footer(),
  ].join('')
}

function optionB() {
  return [
    textBlock(88, 68, ['SLIDE 5  /  VISUAL EXPLORATION'], {
      size: 16, weight: 700, fill: C.soft, letterSpacing: 3,
    }),
    textBlock(88, 132, ['message 不是自由文字，', '而是既有 UI 契約'], {
      size: 48, weight: 500, lineHeight: 54,
    }),
    textBlock(1512, 68, ['OPTION B  /  CAUSAL FLOW'], {
      size: 16, weight: 700, fill: C.soft, letterSpacing: 2, anchor: 'end',
    }),
    textBlock(1512, 164, ['同一個錯誤如何在 Consumer 端分岔'], {
      size: 18, fill: C.soft, anchor: 'end',
    }),
    line(88, 205, 1512, 205, { stroke: C.line, strokeWidth: 2 }),
    textBlock(120, 284, ['錯誤輸入'], { size: 17, weight: 700, fill: C.soft }),
    textBlock(120, 324, ['?fromDate=2026-01-01'], { size: 22, family: MONO }),
    textBlock(120, 359, ['缺少 toDate'], { size: 17, fill: C.soft }),
    line(270, 338, 388, 338, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    envelope(410, 285, 440),
    line(850, 338, 936, 338, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    rect(960, 265, 284, 146, { fill: C.pale, stroke: C.ink, strokeWidth: 2 }),
    textBlock(1102, 304, ['message'], { size: 18, weight: 700, anchor: 'middle' }),
    textBlock(1102, 342, ['既有訊息表', '需要 key'], { size: 25, weight: 500, lineHeight: 31, anchor: 'middle' }),
    line(1244, 320, 1320, 260, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(1244, 356, 1320, 500, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    textBlock(1328, 246, ['AI-direct'], { size: 18, weight: 700 }),
    textBlock(1328, 278, ['"fromDate and"', '"toDate must be"', '"supplied together"'], {
      size: 13, family: MONO, lineHeight: 17,
    }),
    textBlock(1328, 347, ['查表失敗'], { size: 21, weight: 600 }),
    textBlock(1328, 384, ['Unknown message code'], { size: 20 }),
    textBlock(1328, 486, ['Project-convention'], { size: 18, weight: 700 }),
    textBlock(1328, 518, ['m0001'], { size: 22, family: MONO, weight: 700 }),
    textBlock(1328, 553, ['查表成功'], { size: 21, weight: 600 }),
    textBlock(1328, 590, ['查詢條件不合法'], { size: 22 }),
    line(1328, 418, 1510, 418, { stroke: C.line, strokeWidth: 1 }),
    line(1328, 612, 1510, 612, { stroke: C.line, strokeWidth: 1 }),
    textBlock(120, 612, ['共享證據'], { size: 17, weight: 700, fill: C.soft }),
    textBlock(120, 652, ['HTTP 400 · INVALID_QUERY · data: null'], { size: 20, family: MONO }),
    textBlock(120, 714, ['分岔點不是 HTTP 狀態，而是 message 的語意契約'], { size: 26, weight: 500 }),
    line(120, 760, 1244, 760, { stroke: C.ink, strokeWidth: 3 }),
    footer(),
  ].join('')
}

function optionC() {
  return [
    header('OPTION C  /  CONTRACT CENTER', '以既有 UI 契約為中心，回看輸入與輸出'),
    rect(606, 232, 388, 66, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(800, 258, ['同一個錯誤輸入'], { size: 17, weight: 700, anchor: 'middle' }),
    textBlock(800, 284, ['?fromDate=2026-01-01  （缺少 toDate）'], { size: 17, family: MONO, anchor: 'middle' }),
    textBlock(1040, 258, ['HTTP 400'], { size: 18, weight: 700 }),
    textBlock(1040, 284, ['code: "INVALID_QUERY" · data: null'], { size: 16, family: MONO }),
    line(800, 298, 800, 322, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(620, 500, 512, 500, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(980, 500, 1088, 500, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(800, 648, 800, 726, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    circle(800, 500, 178, { fill: C.ink, stroke: C.ink, strokeWidth: 2 }),
    textBlock(800, 438, ['message'], { size: 28, fill: C.white, weight: 500, anchor: 'middle' }),
    textBlock(800, 480, ['既有 UI 契約'], { size: 31, fill: C.white, weight: 600, anchor: 'middle' }),
    textBlock(800, 536, ['m0001'], { size: 34, fill: C.white, family: MONO, weight: 700, anchor: 'middle' }),
    textBlock(800, 574, ['→ 查詢條件不合法'], { size: 21, fill: C.white, anchor: 'middle' }),
    rect(112, 420, 400, 160, { stroke: C.ink, strokeWidth: 2 }),
    textBlock(140, 456, ['AI-direct'], { size: 21, weight: 700 }),
    textBlock(140, 488, ['"fromDate and toDate"', '"must be supplied together"'], {
      size: 14, family: MONO, lineHeight: 21,
    }),
    textBlock(140, 548, ['不是 catalog key'], { size: 21, weight: 600 }),
    rect(1088, 420, 400, 160, { stroke: C.ink, strokeWidth: 2 }),
    textBlock(1116, 456, ['Project-convention'], { size: 21, weight: 700 }),
    textBlock(1116, 494, ['message = "m0001"'], { size: 20, family: MONO }),
    textBlock(1116, 532, ['catalog 可解析'], { size: 21, weight: 600 }),
    rect(574, 726, 452, 70, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(800, 754, ['既有 Consumer'], { size: 17, fill: C.soft, anchor: 'middle' }),
    textBlock(800, 782, ['看到可用的 UI 訊息'], { size: 20, weight: 600, anchor: 'middle' }),
    textBlock(800, 829, ['契約的中心不是句子，而是已存在的 key'], { size: 20, weight: 600, anchor: 'middle' }),
    footer(),
  ].join('')
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  try {
    for (const [name, body] of [['option-a.png', optionA()], ['option-b.png', optionB()], ['option-c.png', optionC()]]) {
      const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
      await page.setContent(svg(body), { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(50)
      await page.screenshot({ path: path.join(OUT_DIR, name), type: 'png' })
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

await main()
