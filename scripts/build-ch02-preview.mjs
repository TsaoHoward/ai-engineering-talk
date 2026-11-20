import { spawnSync } from 'node:child_process'
import { cp, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/* Experiment-only wrapper: Slidev resolves --out relative to the Markdown entry.
 * GitHub Pages and the existing visual-acceptance workflow expect <repo>/dist.
 * Preserve forwarded --base/--router-mode flags and copy the built prototype
 * to the repository-level dist directory after a successful build. */
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const entry = 'prototypes/ch02-work-view/slides.md'
const prototypeDist = path.join(repoRoot, 'prototypes/ch02-work-view/dist')
const rootDist = path.join(repoRoot, 'dist')
const forwarded = process.argv.slice(2)

const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const child = spawnSync(command, ['exec', '--', 'slidev', 'build', entry, ...forwarded], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (child.error) throw child.error
if (child.status !== 0) process.exit(child.status ?? 1)

const built = await stat(path.join(prototypeDist, 'index.html')).catch(() => null)
if (!built?.isFile()) {
  throw new Error(`Prototype build output missing: ${prototypeDist}/index.html`)
}
await rm(rootDist, { recursive: true, force: true })
await cp(prototypeDist, rootDist, { recursive: true })
process.stdout.write(`Copied prototype build into ${rootDist} for GitHub Pages preview.\n`)
