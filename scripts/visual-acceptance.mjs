import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from '@slidev/parser'
import { chromium } from 'playwright'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(args) {
  const options = {
    baseUrl: process.env.VISUAL_BASE_URL || 'http://127.0.0.1:3030/',
    outputDir: process.env.VISUAL_OUTPUT_DIR || path.join(repoRoot, 'artifacts/visual-acceptance'),
    routerMode: 'hash',
    slide: process.env.SLIDE_NUMBER ? Number(process.env.SLIDE_NUMBER) : undefined,
  }

  const positional = []
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--all') {
      options.slide = undefined
    } else if (arg === '--slide') {
      options.slide = Number(args[++index])
    } else if (arg === '--base-url') {
      options.baseUrl = args[++index]
    } else if (arg === '--output-dir') {
      options.outputDir = args[++index]
    } else if (arg === '--router-mode') {
      options.routerMode = args[++index]
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      positional.push(arg)
    }
  }

  // Keep the original shell script's BASE_URL OUTPUT_DIR positional form working.
  if (positional[0]) options.baseUrl = positional[0]
  if (positional[1]) options.outputDir = positional[1]

  return options
}

function slideCountFromMarkdown(markdown) {
  const count = parseSync(markdown).slides.length
  if (count < 1) throw new Error('Slidev parser found no slides in slides.md')
  return count
}

function routeFor(baseUrl, slide, clicks, routerMode) {
  const normalized = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  if (routerMode === 'history') return `${normalized}${slide}?clicks=${clicks}`
  return `${normalized}#/` + `${slide}?clicks=${clicks}`
}

function routeFromPage(page, routerMode) {
  return page.evaluate((mode) => {
    const route = mode === 'hash' ? window.location.hash.slice(1) : window.location.pathname + window.location.search
    const [pathname, query = ''] = route.split('?')
    const match = pathname.match(/\/(\d+)\/?$/)
    return {
      slide: match ? Number(match[1]) : null,
      clicks: Number(new URLSearchParams(query).get('clicks') || 0),
      route,
    }
  }, routerMode)
}

async function auditSlide(page, slide) {
  return page.evaluate((slideNo) => {
    const canvas = document.querySelector(`.slidev-page[data-slidev-no="${slideNo}"]`)
    if (!canvas) return { error: 'Slidev canvas (.slidev-page) was not found' }

    const bounds = canvas.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) {
      return { error: `Slide ${slideNo} has a zero-sized canvas` }
    }
    const visible = (element) => {
      const style = getComputedStyle(element)
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0
    }
    const outsideCanvas = []
    const clippedContent = []

    for (const element of canvas.querySelectorAll('*')) {
      if (!visible(element)) continue

      const rect = element.getBoundingClientRect()
      const outside = rect.left < bounds.left - 2 || rect.top < bounds.top - 2
        || rect.right > bounds.right + 2 || rect.bottom > bounds.bottom + 2
      const parentOutside = element.parentElement && element.parentElement !== canvas
        && outsideCanvas.some((entry) => entry.element === element.parentElement)

      if (outside && !parentOutside) {
        outsideCanvas.push({
          element,
          description: `${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replaceAll(/\s+/g, '.')}` : ''}`,
          bounds: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom),
          },
        })
      }

      const style = getComputedStyle(element)
      const clipsX = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)
      const clipsY = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY)
      const overflowX = clipsX && element.scrollWidth > element.clientWidth + 2
      const overflowY = clipsY && element.scrollHeight > element.clientHeight + 2
      if (overflowX || overflowY) {
        clippedContent.push({
          element: `${element.tagName.toLowerCase()}${element.className && typeof element.className === 'string' ? `.${element.className.trim().replaceAll(/\s+/g, '.')}` : ''}`,
          horizontal: overflowX,
          vertical: overflowY,
          scroll: { width: element.scrollWidth, height: element.scrollHeight },
          client: { width: element.clientWidth, height: element.clientHeight },
        })
      }
    }

    return {
      canvas: { width: Math.round(bounds.width), height: Math.round(bounds.height) },
      outsideCanvas: outsideCanvas.map(({ description, bounds: rect }) => ({ element: description, bounds: rect })),
      clippedContent,
    }
  }, slide)
}

function help() {
  process.stdout.write(`Usage: npm run visual:acceptance -- [options]\n\nOptions:\n  --all                     Inspect every slide (the default)\n  --slide NUMBER            Inspect one slide and every reachable Click state\n  --base-url URL            Base URL of the running Slidev server or static preview\n  --router-mode hash|history  Router mode used by that server (default: hash)\n  --output-dir PATH         Screenshot and report directory\n`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) return help()
  if (options.slide !== undefined && (!Number.isInteger(options.slide) || options.slide < 1)) {
    throw new Error(`--slide must be a positive integer; got ${options.slide}`)
  }
  if (!['hash', 'history'].includes(options.routerMode)) {
    throw new Error(`--router-mode must be hash or history; got ${options.routerMode}`)
  }

  const markdown = await readFile(path.join(repoRoot, 'slides.md'), 'utf8')
  const totalSlides = slideCountFromMarkdown(markdown)
  const slides = options.slide === undefined
    ? Array.from({ length: totalSlides }, (_, index) => index + 1)
    : [options.slide]
  if (slides.some((slide) => slide > totalSlides)) {
    throw new Error(`Requested slide ${options.slide}, but slides.md contains ${totalSlides} slides`)
  }

  const outputDir = path.resolve(options.outputDir)
  await mkdir(outputDir, { recursive: true })
  const report = {
    baseUrl: options.baseUrl,
    routerMode: options.routerMode,
    viewport: { width: 1600, height: 900 },
    totalSlides,
    inspectedSlides: slides,
    slides: [],
    resourceErrors: [],
    resourceWarnings: [],
    errors: [],
    warnings: [],
    passed: false,
  }

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}),
    args: ['--no-sandbox'],
  })

  try {
    const page = await browser.newPage({ viewport: report.viewport, deviceScaleFactor: 1 })
    page.on('response', (response) => {
      if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
        const entry = { status: response.status(), url: response.url() }
        if (new URL(response.url()).origin === new URL(options.baseUrl).origin) report.resourceErrors.push(entry)
        else report.resourceWarnings.push(entry)
      }
    })
    page.on('requestfailed', (request) => {
      if (request.failure()?.errorText !== 'net::ERR_ABORTED') {
        const entry = { error: request.failure()?.errorText, url: request.url() }
        if (new URL(request.url()).origin === new URL(options.baseUrl).origin) report.resourceErrors.push(entry)
        else report.resourceWarnings.push(entry)
      }
    })
    page.on('pageerror', (error) => {
      if (error.message.includes('Wake Lock permission request denied')) report.warnings.push(error.message)
      else report.errors.push(error.message)
    })

    for (const slide of slides) {
      const slideReport = { slide, states: [] }
      let clicks = 0
      let reachedNextSlide = false

      for (let state = 0; state < 51; state += 1) {
        const url = routeFor(options.baseUrl, slide, clicks, options.routerMode)
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
          await page.locator(`.slidev-page[data-slidev-no="${slide}"]`).waitFor({ state: 'visible', timeout: 15000 })
          await page.evaluate(() => document.fonts.ready)
          await page.waitForTimeout(500)

          const route = await routeFromPage(page, options.routerMode)
          if (route.slide !== slide || route.clicks !== clicks) {
            throw new Error(`Expected slide ${slide}, clicks ${clicks}; loaded route ${route.route}`)
          }

          const screenshotName = `slide-${String(slide).padStart(3, '0')}-click-${String(clicks).padStart(2, '0')}.png`
          const screenshotPath = path.join(outputDir, screenshotName)
          await page.screenshot({ path: screenshotPath, animations: 'disabled' })
          const overflow = await auditSlide(page, slide)
          slideReport.states.push({ clicks, screenshot: screenshotName, overflow })
          if (overflow.error) report.errors.push(`Slide ${slide}, clicks ${clicks}: ${overflow.error}`)

          const before = await page.evaluate(() => window.location.href)
          await page.keyboard.press('ArrowRight')
          await page.waitForFunction((previous) => window.location.href !== previous, before, { timeout: 1500 }).catch(() => {})
          const after = await routeFromPage(page, options.routerMode)

          if (after.slide !== slide) {
            reachedNextSlide = true
            break
          }
          if (after.clicks <= clicks) break
          clicks = after.clicks
        } catch (error) {
          report.errors.push(`Slide ${slide}, clicks ${clicks}: ${error.message}`)
          break
        }
      }

      if (!reachedNextSlide && slide < totalSlides && slideReport.states.length === 0) {
        report.errors.push(`Slide ${slide} could not be inspected`)
      }
      if (slideReport.states.length >= 51) {
        report.errors.push(`Slide ${slide} exceeded the 50-click safety limit`)
      }
      report.slides.push(slideReport)
    }
  } finally {
    await browser.close()
  }

  report.passed = report.errors.length === 0
    && report.resourceErrors.length === 0
    && report.slides.every((slide) => slide.states.length > 0
      && slide.states.every((state) => !state.overflow.error
        && state.overflow.outsideCanvas?.length === 0
        && state.overflow.clippedContent?.length === 0))
  const reportPath = path.join(outputDir, 'report.json')
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  const stateCount = report.slides.reduce((total, slide) => total + slide.states.length, 0)
  const overflowCount = report.slides.reduce((total, slide) => total + slide.states.reduce((count, state) => (
    count + (state.overflow.outsideCanvas?.length || 0) + (state.overflow.clippedContent?.length || 0)
  ), 0), 0)
  process.stdout.write(`${report.passed ? 'PASS' : 'FAIL'}: inspected ${report.slides.length} slide(s), ${stateCount} Click state(s); ${overflowCount} overflow finding(s).\n`)
  process.stdout.write(`Report: ${reportPath}\n`)
  if (report.errors.length || report.resourceErrors.length || report.warnings.length || report.resourceWarnings.length) {
    process.stderr.write(`${JSON.stringify({ errors: report.errors, resourceErrors: report.resourceErrors, warnings: report.warnings, resourceWarnings: report.resourceWarnings }, null, 2)}\n`)
  }
  if (!report.passed) process.exitCode = 1
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`)
  process.exitCode = 1
})
