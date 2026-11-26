# cc-slidev Codex Port

This project-local package is sourced from `rhuss/cc-slidev` at
`99fdefe12c835f85907e801f5f0167c138971cd5`.

Codex discovers the port through `.agents/skills/`:

- The eight `cc-slidev-*` directories expose the upstream Skills.
- The nineteen `cc-slidev-command-*` directories expose each upstream Command
  as a Codex Skill. Invoke one explicitly with `Use the cc-slidev-command-<name>
  skill ...`.
- The three `.codex/agents/*.toml` files expose the upstream Agents as
  project-scoped Codex custom agents. Their full procedures live in
  `agents/*.md` in this runtime directory.

The runtime directory contains the upstream Scripts, References, `default.json`,
adapted command/agent procedure copies, the exact upstream plugin manifest as
`UPSTREAM-PLUGIN-MANIFEST.json`, and the MIT license.

## Codex compatibility boundary

The original Claude command namespace, Claude tool names, `${CLAUDE_PLUGIN_ROOT}`
path, and Claude-only frontmatter have been replaced with Codex Skill
invocation, current-chat interactive questions, Codex subagent delegation, and
the project path `.agents/skills/cc-slidev-runtime`. The command and agent
procedures remain otherwise upstream-derived.

The existing Slidev check and preview scripts additionally accept the
project-local `node_modules/.bin/slidev`, so this port does not require a
global Slidev CLI when the deck already declares `@slidev/cli`.

Codex does not provide a project-defined slash-command namespace equivalent to
`/slidev:*`; the `cc-slidev-command-*` Skills are the explicit entrypoints.
Codex custom-agent files do not support Claude's `color` field or an exact
per-agent `tools: [...]` allowlist, so those presentation metadata and exact
tool restrictions are not claimed as equivalent. Agents inherit the parent
Codex session's available tools and permissions.

## Known upstream gap

At the fixed upstream revision, `commands/visuals.md` refers to
`generate-from-plantuml.sh`, but the upstream `slidev/scripts/` directory does
not contain that file. The port records the PlantUML-primary branch as
unsupported and does not add a replacement script. Mermaid-primary generation
and standalone PlantUML rendering use the shipped upstream scripts.

The fixed upstream outline text also names `/slidev:slides`, although no such
upstream command exists; the port maps that instruction to the existing
`cc-slidev-command-generate` entrypoint.

## C1 compatibility corrections

At C1, the ported procedures were checked against the Codex CLI session API
and corrected without changing the upstream workflow stages or presentation
content:

- **F1 — subagents:** Balance now uses
  `multi_agent_v1__spawn_agent({agent_type: "visual-reviewer", message: ...})`
  once per flagged slide, in parallel where independent, and waits using
  `multi_agent_v1__wait_agent({targets: [agent_id, ...]})`. The legacy Claude
  delegation contract is no longer referenced. The three
  `.codex/agents/*.toml` wrappers remain the named agent definitions used by
  the `agent_type` values.
- **F2 — executable paths:** Shell examples in the Excalidraw, LaTeX
  handout, and slide-management Skills (including the Excalidraw README) now
  resolve scripts from `.agents/skills/cc-slidev-runtime/...` when run from
  the project root. Non-executable reference text was not changed by a blind
  replacement.
- **F3 — command jumps:** The remaining `/slides:*` references in the
  ported `continue` and `redraw-diagrams` procedures now point to existing
  `cc-slidev-command-*` Skills, preserving the original order and resume
  decisions. `cc-slidev-command-init` is the replacement for the upstream
  create entrypoint, which is not a standalone Skill.
- **F4 — handout dependency check:**
  `scripts/check-handout-deps.sh` no longer calls the unsupported
  `playwright list-devices` command or scans cache directories with a glob.
  It resolves the project-local Playwright installation, asks its Chromium
  API for `chromium.executablePath()`, verifies that executable, and performs
  a headless launch/close smoke test. `pdflatex` remains a required blocker
  and is still reported as exit code 1. No dependency was installed during
  C1.

## C2 dependency and installation record

This C2 pass installed or verified the core runtime inputs without modifying
the project's `package.json`, `package-lock.json`, formal presentation files,
or the upstream checkout.

### Installed dependencies

1. **yq:** mikefarah/yq **v4.54.3**, Linux amd64 binary, installed at the
   user-level location `${HOME}/.local/bin/yq`. The binary came from the
   official release asset:
   `https://github.com/mikefarah/yq/releases/download/v4.54.3/yq_linux_amd64`.
   Its SHA-256 was checked against the official `checksums` asset and the
   accompanying hash-column declaration
   (`https://github.com/mikefarah/yq/releases/download/v4.54.3/checksums` and
   `https://github.com/mikefarah/yq/releases/download/v4.54.3/checksums_hashes_order`):
   `129534601871538efe0ba4c5e62a34fb1d5f469bcb975c4fddeb467d82974973`.
   `${HOME}/.local/bin` was already on the Codex Session `PATH`; no shell
   startup file and no sudo-managed path were changed.
2. **Balance renderer:** the existing native procedure was run from the
   project-local port:
   `bash .agents/skills/cc-slidev-runtime/scripts/balance/render-slides.sh ensure`.
   It copied the pinned manifest and ran `npm install --no-audit --no-fund` in
   `${XDG_CACHE_HOME:-$HOME/.cache}/cc-slidev/render`, installing
   `playwright-core` **1.64.1** there. It then used the same cache's
   `browsers.json` and `npx --prefix <cache> playwright-core install chromium`.
   The selected Chromium revision is **1248**, installed in the shared cache at
   `${XDG_CACHE_HOME:-$HOME/.cache}/ms-playwright/chromium-1248`; the native
   Playwright install also fetched the matching
   `chromium_headless_shell-1248`. No separate dependency manager was added.
3. **Project dependencies preserved:** the existing local Slidev CLI remains
   **53.1.0**, and the repository's existing `playwright` remains **1.59.0**.
   No project browser install or project package-manager command was run.
   The Balance cache is independent of the project's Playwright package.

### Core dependency inventory

| Dependency | Result |
| --- | --- |
| Node.js | 22.22.0 |
| npm / npx | 10.9.4 / 10.9.4 |
| jq | 1.7 |
| curl | 8.5.0 |
| Python | 3.12.3 |
| Git | 2.43.0 |
| Local Slidev CLI | 53.1.0 |
| Project Playwright | 1.59.0, unchanged |
| Balance `playwright-core` | 1.64.1 in the isolated cache |

### Installation and rebuild procedure

- Ensure yq is the mikefarah binary v4 and that `${HOME}/.local/bin` is on
  `PATH`; verify with `yq --version`. The release asset and SHA-256 above are
  the reproducible source record for this installation.
- For Balance, rerun
  `bash .agents/skills/cc-slidev-runtime/scripts/balance/render-slides.sh ensure`.
  The script is idempotent: it repairs the cache manifest/package when the
  pinned version differs and downloads only a missing matching Chromium build.
- The canonical cache locations are expressed through
  `${XDG_CACHE_HOME:-$HOME/.cache}`; do not copy the observed host's expanded
  home directory into another machine's configuration.

### Minimal execution validation

- `yq --front-matter=extract` successfully read a temporary YAML front matter
  title and boolean value.
- `render-slides.sh ensure --check` returned
  `RENDER_READY ${XDG_CACHE_HOME:-$HOME/.cache}/cc-slidev/render`.
- The isolated cache reported `playwright-core` 1.64.1 and Chromium revision
  1248. Playwright launched the matching Chromium headlessly using
  `channel: 'chromium'`, reported browser version **156.0.8078.4**, and closed
  cleanly.
- A minimal temporary deck used the native `server start` / HTTP status /
  `server stop` flow. With the host's non-observing `lsof` hidden from the test
  `PATH`, the native Node TCP fallback selected port 3032; the server returned
  HTTP 200 with the temporary deck title, stop cleared the registry, and the
  owned port returned HTTP status 000. No render, measure, reviewer, auto-fix,
  or report loop was run.
- The local Slidev CLI still reported 53.1.0 after installation, and the
  project Playwright still reported 1.59.0.

### Deferred optional/non-core dependencies

The following were intentionally not installed in C2: the LaTeX toolchain
(`pdflatex`, `texlive-latex-base`, `texlive-latex-extra`), Mermaid CLI,
Excalidraw CLI, PlantUML, ImageMagick, and optional `magick`/`codex`/`gemini`
routes. `excalidraw-brute-export-cli` has no pinned version at the fixed
upstream revision, so no version or global installation location is claimed.

### Known fixed-revision limitations

- `commands/visuals.md` still refers to the missing upstream
  `generate-from-plantuml.sh`; this C2 pass did not add a replacement.
- On this WSL2 host, `lsof` was present but could not see the existing local
  Slidev listeners on ports 3030/3031. The fixed upstream script prefers
  `lsof` when available and therefore can misidentify an occupied port in that
  environment. The migrated wrapper now treats `lsof` as advisory, confirms
  non-matches with a Node TCP probe, and fails closed when that probe is
  inconclusive. The upstream checkout remains unchanged.
- The upstream design intentionally uses a shared browser cache while keeping
  the Balance Node package in its own cache. Each Playwright version must use
  the revision selected by its own manifest; C2 did not replace the project's
  1.59.0 installation.

## C1 findings after C2

- The balance-only `playwright-core` 1.64.1 install and matching Chromium
  revision 1248 are resolved for C2.
- yq is resolved as mikefarah/yq v4.54.3. LaTeX and other system/optional
  dependencies remain intentionally deferred by scope.
- The upstream `generate-from-plantuml.sh` gap remains; no replacement was
  added.
- Full render/measure/reviewer/auto-fix/report-loop acceptance remains for D;
  C2 intentionally ran only the minimal execution checks above.

## D1c corrections and final Finding status

### F1 — server isolation and port conflicts: resolved in the migrated runtime

At the fixed upstream revision, `render-slides.sh` used `lsof` whenever it was
installed and only used its Node TCP fallback when `lsof` was absent. On this
WSL2/Codex sandbox, `lsof` can return no matching listener even when a local
Slidev process is listening, so the wrapper could select an occupied port.
The original fallback also had no distinct inconclusive result.

The migrated wrapper keeps the upstream registry, port range, process-group
lifecycle and owned/unowned cleanup, with these compatibility corrections:

- `lsof` is an advisory first probe; every non-match or error is checked by a
  Node TCP probe on both loopback families.
- The TCP probe distinguishes occupied, refused/free, and inconclusive
  results. Inconclusive is treated as occupied, never available.
- Server identity is checked through Slidev's `slidev:entry` metadata against
  the requested absolute entry path, with the deck title checked when present.
  This check is required for registered-server reuse and after startup; an
  unverified server is not used for rendering.
- Cleanup still stops only the registry entry marked `owned: true`; an
  unowned server is released, not stopped. The upstream repository and other
  deck servers are not modified.

Regression coverage used two temporary decks with distinct titles and source
markers, the host's known WSL2 `lsof` blind spot on port 3031, a controlled
listener on a candidate port, and native `server start`/render/stop commands.
It verified free-port startup, occupied-port avoidance, the lsof fallback, no
cross-deck reuse, same-deck reuse, and cleanup preserving unowned listeners.
The native render smoke also verified the requested entry metadata and
deck-specific screenshot/metrics results, not only HTTP 200.

### F2 — thresholds ESM import path: resolved in migrated procedures

The migrated `cc-slidev-command-balance` Skill and runtime `balance` command
procedure had copied the upstream path without the leading relative `./`:
`import ... from '.agents/...'`. Node therefore treated it as a bare package
specifier and raised `ERR_INVALID_MODULE_SPECIFIER`. Both procedures now use
`./.agents/skills/cc-slidev-runtime/scripts/balance/flag.mjs`, preserving the
native thresholds loader without a user-home path. A repository-wide search
found no other executable threshold-import snippets with the same defect.

The corrected command was run directly from the project root and loaded the
temporary deck thresholds without manual path rewriting.

### F3 — theme font size: observation only

F3 remains an environment observation from D1. No formal theme, CSS, native
threshold, or quality rule was changed.

### D1c validation record

- Shell syntax: `bash -n` passed for `render-slides.sh`.
- Node syntax/import checks passed for the modified runtime modules and the
  corrected thresholds loader.
- F1 controlled-listener and two-deck isolation checks passed; the original
  D1 pre-existing listeners on 3030/3031 were preserved.
- F2 direct thresholds-loader and isolated native render/measure/report smoke
  passed without either D1 workaround.
- Final status: F1 resolved in the migrated runtime; F2 resolved; F3 remains
  recorded only; no P0 finding.
