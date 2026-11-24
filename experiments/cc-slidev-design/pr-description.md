## Summary

這是 cc-slidev 的獨立相容性與視覺設計實驗，只處理 Slide 6，不修改正式簡報、Slide Copy、案例 SSOT、PR #16 或 PR #17。

## Preview

![Slide 6 State 0](https://raw.githubusercontent.com/TsaoHoward/ai-engineering-talk/experiment/cc-slidev-design/experiments/cc-slidev-design/exports/slide-6-state-0.png)

![Slide 6 State 1](https://raw.githubusercontent.com/TsaoHoward/ai-engineering-talk/experiment/cc-slidev-design/experiments/cc-slidev-design/exports/slide-6-state-1.png)

![Slide 6 State 2](https://raw.githubusercontent.com/TsaoHoward/ai-engineering-talk/experiment/cc-slidev-design/experiments/cc-slidev-design/exports/slide-6-state-2.png)

## Installed Skills

- `cc-slidev-diagram-design`
- `cc-slidev-visual-design`
- `cc-slidev-slide-quality`
- `cc-slidev-slidev-mastery`

Source revision: `99fdefe12c835f85907e801f5f0167c138971cd5` from [rhuss/cc-slidev](https://github.com/rhuss/cc-slidev). The project-local install preserves the upstream README and MIT license, adds Agent Skills frontmatter, namespaces the four Skill names, and rewrites Claude-only reference paths to project-relative paths.

## Design record

- [Prototype source](https://github.com/TsaoHoward/ai-engineering-talk/blob/experiment/cc-slidev-design/experiments/cc-slidev-design/slides.md)
- [Reproduction and preview](https://github.com/TsaoHoward/ai-engineering-talk/blob/experiment/cc-slidev-design/experiments/cc-slidev-design/README.md)
- [Review record](https://github.com/TsaoHoward/ai-engineering-talk/blob/experiment/cc-slidev-design/experiments/cc-slidev-design/review.md)

## Validation

- Slidev build succeeded.
- Three PNGs are 1600×900.
- Playwright checks found no console errors or viewport overflow.
- `slidev export --format png` remains unavailable without the project's absent `playwright-chromium`; no new dependency was installed, and the existing Playwright runtime was used instead.

Please keep this PR in Draft for independent manual visual review. Do not merge or promote this experiment into the formal deck or Skills yet.
