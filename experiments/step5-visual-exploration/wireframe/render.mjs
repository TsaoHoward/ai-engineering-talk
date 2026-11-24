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
    opacity = 1,
  } = options
  const tspans = lines.map((line, index) =>
    `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
  ).join('')
  return `<text x="${x}" y="${y}" fill="${fill}" fill-opacity="${opacity}" font-family="${family}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}px">${tspans}</text>`
}

function rect(x, y, width, height, options = {}) {
  const {
    fill = 'none',
    stroke = C.ink,
    strokeWidth = 2,
    radius = 0,
    dash = '',
    opacity = 1,
  } = options
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
}

function line(x1, y1, x2, y2, options = {}) {
  const { stroke = C.ink, strokeWidth = 2, dash = '', arrow = false, opacity = 1 } = options
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="${strokeWidth}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`
}

function header() {
  return [
    textBlock(88, 74, ['message 不是自由文字，', '而是既有 UI 契約'], {
      size: 46, weight: 500, lineHeight: 52,
    }),
    textBlock(1512, 68, ['PR #13  ·  e8ae8ad3'], {
      size: 16, weight: 700, fill: C.soft, letterSpacing: 1.5, anchor: 'end',
    }),
    line(88, 190, 1512, 190, { stroke: C.line, strokeWidth: 2 }),
  ].join('')
}

function sharedContext() {
  return [
    rect(88, 224, 1424, 108, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(116, 258, ['錯誤輸入'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(116, 296, ['?fromDate=2026-01-01  （缺少 toDate）'], {
      size: 23, family: MONO,
    }),
    line(748, 244, 748, 312, { stroke: C.line, strokeWidth: 1 }),
    textBlock(790, 258, ['共同 HTTP response'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(790, 296, ['HTTP 400  ·  code: "INVALID_QUERY"  ·  data: null'], {
      size: 19, family: MONO,
    }),
  ].join('')
}

function lanes() {
  return [
    line(800, 362, 800, 810, { stroke: C.line, strokeWidth: 2 }),
    textBlock(128, 378, ['AI-direct'], { size: 27, weight: 600 }),
    textBlock(928, 378, ['Project-convention'], { size: 27, weight: 600 }),
  ].join('')
}

function messageSlot(x, content, options = {}) {
  const { empty = false } = options
  const body = empty
    ? textBlock(x + 28, 472, ['message'], { size: 17, weight: 700, fill: C.soft })
    : [
      textBlock(x + 28, 464, ['message'], { size: 16, weight: 700, fill: C.soft }),
      ...content,
    ].join('')
  return rect(x, 430, 592, 146, {
    fill: empty ? C.white : C.white,
    stroke: empty ? C.line : C.ink,
    strokeWidth: empty ? 1 : 2,
    dash: empty ? '8 8' : '',
  }) + body
}

function revealedMessages() {
  return [
    messageSlot(112, [
      textBlock(140, 514, ['"fromDate and toDate', 'must be supplied together"'], {
        size: 23, family: MONO, lineHeight: 32,
      }),
      textBlock(140, 562, ['detail'], { size: 15, fill: C.soft }),
    ]),
    messageSlot(896, [
      textBlock(924, 520, ['"m0001"'], { size: 31, family: MONO, weight: 700 }),
      textBlock(924, 562, ['code'], { size: 15, fill: C.soft }),
    ]),
  ].join('')
}

function sharedConsumerAndResults() {
  return [
    line(408, 576, 408, 612, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(1192, 576, 1192, 612, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    rect(112, 612, 1376, 76, { fill: C.pale, stroke: C.line, strokeWidth: 1 }),
    textBlock(800, 640, ['既有 Consumer  ·  message-catalog'], {
      size: 19, weight: 600, anchor: 'middle',
    }),
    textBlock(800, 670, ['各自使用同一解析規則：resolveMessageCode(message)'], {
      size: 17, family: MONO, fill: C.soft, anchor: 'middle',
    }),
    line(408, 688, 408, 730, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    line(1192, 688, 1192, 730, { stroke: C.ink, strokeWidth: 2, arrow: true }),
    textBlock(128, 754, ['解析結果'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(128, 796, ['Unknown message code'], { size: 28, weight: 500 }),
    textBlock(928, 754, ['解析結果'], { size: 16, weight: 700, fill: C.soft }),
    textBlock(928, 796, ['查詢條件不合法'], { size: 28, weight: 500 }),
    line(128, 812, 704, 812, { stroke: C.ink, strokeWidth: 3 }),
    line(928, 812, 1488, 812, { stroke: C.ink, strokeWidth: 3 }),
  ].join('')
}

function footer() {
  return [
    line(88, 836, 1512, 836, { stroke: C.line, strokeWidth: 1 }),
    textBlock(88, 868, ['證據限制：Chromium / Browser MSW / bounded SQL evaluator / fixed fixtures；不是外部 API Server 或真實資料庫執行證據'], {
      size: 14, fill: C.soft,
    }),
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

function state1() {
  return [
    header(),
    sharedContext(),
    lanes(),
    messageSlot(112, [], { empty: true }),
    messageSlot(896, [], { empty: true }),
    footer(),
  ].join('')
}

function state2() {
  return [
    header(),
    sharedContext(),
    lanes(),
    revealedMessages(),
    footer(),
  ].join('')
}

function state3() {
  return [
    header(),
    sharedContext(),
    lanes(),
    revealedMessages(),
    sharedConsumerAndResults(),
    footer(),
  ].join('')
}

async function render(name, body) {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
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
