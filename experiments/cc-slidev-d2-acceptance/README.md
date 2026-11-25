# D2 cc-slidev native workflow acceptance evidence

This directory contains the isolated D2 acceptance deck and the evidence prepared for human visual review. It is a display artifact only; it does not modify the formal presentation, outline, Slide Copy, case SSOT, or cc-slidev migration implementation.

## Contents

- `deck/slides.md`: native Slidev entry source.
- `deck/slides/`: native per-slide source used by the generated deck.
- `deck/diagrams/reviewers-need-one-shared.mmd`: Mermaid source used for Slide 2.
- `acceptance-report.md`: the completed D2 acceptance report, including command results, findings, and formal-project integration analysis.
- `screenshots/`: final Slide 1–4 renders plus the three Slide 2 comparison states.

## Rendering evidence

The final deck was rendered with the existing local Slidev runtime and Playwright at a 1280×720 viewport. Final route checks covered slides 1–4; Slide 2 reported a visible Mermaid diagram (`svg=2`, `mermaid=1`). The temporary preview servers on ports 3032 and 3033 were stopped after capture.

The existing GitHub Pages preview workflow builds the repository-root `slides.md` only. It does not discover or build this nested experiment directory, so this isolated deck has no directly operable Pages preview URL without a workflow change. No workflow change is included here.

No `node_modules`, cache, export, or build directories are included in this evidence directory.
