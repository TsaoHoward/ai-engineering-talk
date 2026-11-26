---
# Presentation Framing Configuration
# Generated: 2026-11-26

# Core Parameters
duration_minutes: "35-40"
time_per_slide_seconds: "variable; planning average 66-75"
target_slide_count: 32
slide_count_range: [32, 32]

# Audience
audience: "New software engineers"
skill_level: "beginner-to-intermediate"
context: "internal presentation"

# Style
style: "technical"
theme: "TBD"
visuals: "diagrams"

# Timing Details
opening_slides: 3
opening_time_seconds: "variable"
content_slides: 27
content_time_seconds: "variable"
closing_slides: 2
closing_time_seconds: "variable"
backup_slides_recommended: "3-5, optional and not counted"

# Calculation Notes
# The existing 32-slide sequence and 35-40 minute total duration are fixed inputs.
# Average reference: (35 x 60) / 32 = 65.625 seconds per slide.
# Average reference: (40 x 60) / 32 = 75 seconds per slide.
# Average timing is a planning reference only; individual slides follow content and narrative pacing.
# Flexibility: the slide count is fixed at 32 for this framing; no ±20% adjustment is applied.

# Deferred Decisions
# Theme, color palette, and per-slide layout remain TBD.
# These decisions are deferred to the native downstream design workflow.
---

# Presentation Scope

**Working Title**: 從寫 Code 到設計工作

## Duration & Pacing

- **Total time**: 35–40 minutes
- **Time per slide**: Variable; average planning reference is approximately 66–75 seconds per slide
- **Target slides**: 32 slides
- **Acceptable range**: 32 slides (fixed input; not adjusted by general framing recommendations)
- **Pacing rule**: Individual slide timing follows the content and narrative rhythm rather than an average per-slide limit.

## Audience

- **Who**: New software engineers
- **Skill level**: Beginner-to-intermediate; the content introduces engineering concepts through an existing order-query API case.
- **Context**: Internal live talk
- **Venue**: Bright meeting room with a typical projector or television
- **Format**: Slidev, 16:9, speaker-led
- **Expectations**: Understand why executable AI-generated code is not automatically deliverable, and how contracts, modular thinking, Skills, dependencies, Workflows, and acceptance support reliable engineering work.

## Style Preferences

- **Style**: Technical/Developer
- **Tone**: Clean, minimal, professional, and engineering-oriented without adopting a formulaic corporate presentation style.
- **Primary visual language**: System architecture, modules, contracts, dependencies, Skills, and Workflows.
- **Information design**: Prioritize hierarchy, visual focus, whitespace, and progressive disclosure.
- **Code usage**: Show code only when it has narrative or comparison value; do not use code as decoration.
- **Slidev theme**: TBD; intentionally deferred for a later native workflow design decision.
- **Color palette**: TBD; intentionally deferred.
- **Per-slide layout**: TBD; intentionally deferred.
- **Visual richness**: Diagrams only.

## Visual Direction

- Use architecture diagrams, flow diagrams, relationship diagrams, comparison diagrams, and conceptual illustrations as the primary visual elements.
- Abstract graphic compositions, localized code, and progressive disclosure are allowed.
- Visual density should follow each slide's narrative purpose; not every slide must contain a diagram.
- Visual expression is not limited to Mermaid or formulaic flowcharts.
- Do not use decorative photographs.
- Reuse the order-query API case and related visual language across the presentation.
- Use System View and Work View as connected perspectives, showing the shift from local implementation to system structure and work composition.

## Confirmed Content Inputs

- Existing title: 從寫 Code 到設計工作
- Existing content sources:
  - `outline/outline-v0.9-candidate.md`
  - `docs/presentation-plan.md`
  - `docs/slide-copy.md`
- Existing content plan: six chapters and 18 content units.
- Existing slide sequence: 32 confirmed slides.
- Existing case: the synthetic order-query API case; no new synthetic case is introduced by framing.
- Existing narrative method: one requirement, two views, one modular way of thinking.
- Existing core views:
  - **System View**: How the delivered system is composed from responsibilities, interfaces, and dependencies.
  - **Work View**: How the work that creates the system is defined, delegated, handed off, and accepted.
- Existing evidence limitations and case caveats remain in force.

## Structure Guidance

The confirmed slide sequence takes precedence over generic framing distributions:

- **Opening**: Slides 1–3 - Establish the question, the views, and the difference between execution and delivery.
- **Main content**: Slides 4–30 - Six chapters covering the order API case, modular thinking, work contracts, Skills, SDLC dependencies, and Workflow trade-offs.
- **Closing**: Slides 31–32 - Recap the progression and preserve the confirmed ending about expanding the engineer's ability to define, integrate, and judge work.
- **Backup**: 3–5 optional slides may be planned later; they are not part of the fixed 32-slide target.

## Research Basis

- **Timing default**: The native skill provides research-based pacing defaults, but this presentation retains its confirmed 35–40 minute / 32-slide scope and uses variable timing by narrative need.
- **Cognitive load**: Max 6 elements per slide (Miller's Law).
- **One idea per slide**: Single clear message (presentation research).
- **Accessibility**: 18pt+ fonts, 4.5:1 contrast (WCAG AA).
- **Project-specific constraint**: Visual design must preserve the confirmed content sequence, chapter structure, case, and slide copy.

## Deferred Decisions

- Slidev Theme
- Color palette
- Per-slide layout system
- Exact visual treatment for each slide
- Evidence presentation and material cropping
- Click and cross-slide implementation details

These decisions remain open for the native downstream design workflow and must not be inferred from this framing file.

## Next Steps

1. Review this framing configuration.
2. Continue with the native downstream design decision workflow when explicitly requested.
3. If proceeding to outline or generation later, preserve the fixed 32-slide sequence and read this configuration as scope guidance.

This file records framing only. It does not authorize or perform brainstorm, outline, generate, visuals, balance, formal slide edits, Skill changes, tool changes, commits, or pushes.
