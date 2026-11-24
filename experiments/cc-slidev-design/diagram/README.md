# Slide 6 Candidate D Diagram

## Selection decision

This is the selected Candidate D from the independent Visual Suggestion experiment:

- Spatial comparison of `AI-direct` and `Project-convention`.
- Separate responsibility layers for each implementation.
- One shared synthetic execution rail: `DbTransport` → Browser MSW `POST /mock/db/query` → bounded SQL evaluator → `fixtures/orders.json`.
- Each variant has its own `Controller` instance. The diagram intentionally does not show one Controller branching into both implementations.
- The shared rail is labeled as a bounded Mock, not a real database.

The diagram is an independent artifact. It is not embedded into the formal Slidev deck and does not modify the existing Slide 6 prototype.

## Files

- [`slide-6-candidate-d.excalidraw`](./slide-6-candidate-d.excalidraw): editable Excalidraw JSON source.
- `slide-6-candidate-d.svg`: not generated; the renderer reached the SVG export action but did not emit a download event. See the rendering limitation below.

## Source validation

The source was checked locally for:

- Excalidraw JSON type/version.
- 35 elements grouped into three logical units.
- 24 visible text words.
- Valid bound-text container IDs.
- Valid start/end arrow bindings.
- No negative element dimensions after the final geometry adjustment.

## Reproduction

The upstream renderer uses `excalidraw-brute-export-cli` with the following options:

```bash
npx --yes --package=excalidraw-brute-export-cli -- \
  excalidraw-brute-export-cli \
  -i experiments/cc-slidev-design/diagram/slide-6-candidate-d.excalidraw \
  --background 1 \
  --embed-scene 0 \
  --dark-mode 0 \
  --scale 1 \
  --format svg \
  -o experiments/cc-slidev-design/diagram/slide-6-candidate-d.svg
```

When the upstream `render-excalidraw.sh` is available, use it instead:

```bash
render-excalidraw.sh \
  experiments/cc-slidev-design/diagram/slide-6-candidate-d.excalidraw \
  experiments/cc-slidev-design/diagram/slide-6-candidate-d.svg
```

## Rendering attempt and limitation in this session

The CLI dependency was inspected before installation:

- `excalidraw-brute-export-cli`: `0.4.0`
- nested `playwright`: `1.65.1`
- required Firefox revision: `1572` (Firefox `159.0`)

The matching browser was installed with the normal Playwright mechanism:

```bash
npx --yes --cache /tmp/cc-slidev-playwright-cache \
  --package=playwright@1.65.1 -- playwright install firefox
```

The existing Firefox revision `1509` was retained. No project dependency or CLI source was changed.

The renderer then launched Firefox 1572, detected Excalidraw `0.17.0`, loaded the source file, opened the export menu and clicked the SVG button. It did not complete the final download event or create an output file. The process was stopped after remaining silent at that stage.

```text
info: excalidrawVersion: 0.17.0
info: File is chosen!
info: Pressing SVG button!
<no download event or output file>
```

Therefore `slide-6-candidate-d.svg` is intentionally absent. Further changes to the renderer, browser automation, or an alternative export framework are outside this experiment's scope.
