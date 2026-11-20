# Chapter 2 · Work View / Encapsulation visual prototype

Isolated **three-slide Slidev low-fidelity prototype** based on `docs/storyboards/ch02.md` (Beat 08–09). The production `slides.md`, `components/`, and root `styles/index.css` remain unchanged.

## Preview from the repository root

```bash
npm ci
npm run dev:hash -- prototypes/ch02-work-view/slides.md
```

Open the local Slidev address printed by the CLI. Build command:

```bash
npm run build -- prototypes/ch02-work-view/slides.md
```

Slidev accepts an explicit Markdown entry file. The prototype's own `styles/index.css` is scoped to `.slidev-layout.ch02-lab` so it does not affect the main deck.

## Story / clicks

| Slide | Initial state | Click 1 | Click 2 |
| --- | --- | --- | --- |
| 1 | System View (Controller → Service → DAO) | Three shared design questions | Work View: Table → API → Frontend, with Schema / API contract handoffs |
| 2 | Input / Responsibility / Output of API work | Constraints | Acceptance |
| 3 | Expanded work unit | Encapsulated work unit | Bridge to reusable implementation methods / Skill |

Use the synthetic order-query API case. Work View arrows denote **handoff/dependency, not mandatory execution order**. System View and Work View nodes are **not** a one-to-one mapping.

## Visual review focus

1. Does the System → shared questions → Work transition communicate the analogy without implying one-to-one correspondence?
2. Are Schema and API contract labels readable at 16:9 / 1600×900?
3. Does the second slide feel like zooming into the same API work unit?
4. Does Encapsulation mean external commitments remain visible while internal implementation is flexible?
5. Are the Click boundaries and speaker notes comfortable at actual presentation speed?

All text and visuals are original/synthetic, using only local CSS and system fonts.

**Validation status:** HTML/CSS layout and all nine intended click states have been approximated in headless Chromium at 1600×900; an initial content overlap on slide 2 was corrected. This is **not** a real Slidev runtime, build, or click E2E test; run the commands above in an environment with installed dependencies before merging or integrating.
