// Compile the deck with the one canonical browser MSW worker.
import { copyFile, mkdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const caseDir = path.join(root, 'examples/order-api/ts-v1')
const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(args, cwd = root) {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', env: process.env })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error('Command failed: ' + cmd + ' ' + args.join(' ') + ' (' + result.status + ')')
  }
}

export async function prepareSlidevMsw() {
  run(['ci', '--no-audit', '--no-fund'], caseDir)
  run(['run', 'worker:init'], caseDir)
  const target = path.join(root, 'public')
  await mkdir(target, { recursive: true })
  await copyFile(path.join(caseDir, 'public/mockServiceWorker.js'),
    path.join(target, 'mockServiceWorker.js'))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareSlidevMsw()
}
