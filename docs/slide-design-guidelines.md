# Slide design guidelines

Chapter 1 establishes a light `palette-crystal` visual language for technical
story slides. Reuse these rules for later chapters when the content benefits
from the same scan-first, staged-reveal approach.

## Visual tokens

- Background: `#f8fbff`; panels: `#ffffff` and `#eef5ff`.
- Text: `#0f172a`; secondary text: `#475569`; quiet labels: `#64748b`.
- Lines: `#cbd5e1`; emphasis: blue `#2563eb`, green `#16a34a`, amber
  `#d97706`, purple `#7c3aed`, cyan `#0891b2`.
- Use system sans fonts for Chinese and interface text. Use a system monospace
  stack for API names, types, and code; no remote font is required.
- Keep the 16:9 canvas airy: content slides use about 3rem horizontal and
  1.8rem vertical padding, compact headings, and consistent 8px card corners.

## Composition and motion

- Give each slide one narrative job and one dominant visual comparison or
  structure. Use cards and borders to group related information, not as
  decoration.
- Keep labels short and align repeated rows or columns. Reserve the bottom
  edge for a single takeaway with a clear safe margin.
- Use `ComparisonTable` for side-by-side implementation choices,
  `ArchitectureLayers` for responsibility boundaries, and `CalloutStack` for
  grouped contract decisions. These are local reusable components.
- Use one `v-click` per meaningful disclosure. Reveal context in speaking
  order; hidden items retain their space and become visible by opacity so the
  layout does not jump. The reusable components use Slidev 53's built-in
  `v-motion` directive for short, low-distance entrances.
- Keep Traditional Chinese speaker notes in HTML comments, mark each click
  cue, and end with a sentence that bridges to the next slide.

## Scope and maintenance

- Put content pages under `.slidev-layout.ai-engineering-talk`; keep every
  chapter visual rule under that class so the cover and other slides are not
  affected.
- Define deck tokens on that layout class instead of importing a workspace
  wide theme stylesheet. Add only variables and component rules the deck uses.
- Preserve meaning and examples from `outline/outline-v0.8.md` and
  `examples/order-api/` when expanding the chapter.

The reused Builder components and adapted layout rules retain their MIT notice in `licenses/slides-builder.MIT`.
