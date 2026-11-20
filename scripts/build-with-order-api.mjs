// Reuse the real TypeScript application in Slidev; do not duplicate its HTTP or DB code.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { prepareSlidevMsw } from './prepare-slidev-msw.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
await prepareSlidevMsw()

const args = ['exec', '--', 'slidev', 'build', ...process.argv.slice(2)]
const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: process.env })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status || 1)
