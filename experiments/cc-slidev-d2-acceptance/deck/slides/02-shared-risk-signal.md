---
layout: default
---

# Reviewers need one shared risk signal

- Same diff, different assumptions
- Late risk discovery

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#3b82f6', 'secondaryColor':'#f97316', 'lineColor':'#6b7280', 'textColor':'#1f2937', 'background':'#ffffff'}}}%%
flowchart LR
  A[Reviewer A assumptions] --> S[Shared risk signal]
  B[Reviewer B assumptions] --> S
  S --> Q[Discussable risk question]

  classDef orange fill:#f97316,stroke:#ea580c,color:#ffffff;
  classDef blue fill:#3b82f6,stroke:#2563eb,color:#ffffff;
  class A,B orange;
  class S,Q blue;
```

<!--
PRESENTER NOTES:
Opening: "A diff can be technically correct and still produce different merge decisions."
Key points:
- Reviewers need an explicit risk signal.
- Naming the uncertainty makes it discussable.
Transition: "The next slide turns that signal into a repeatable loop."
Timing: 60 seconds
Word count: ~12 words excluding title
-->
