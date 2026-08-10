---
'@travl/tokens': minor
---

Add a semantic type scale, and fix two defects surfaced by building the first
consumers of these tokens.

**New: `text/*` type roles (55 variables).** Eleven roles — `display-lg|md|sm`,
`body-lg|md|sm`, `label-lg|md|sm`, `data-md|sm` — each carrying `family`,
`size`, `leading`, `weight` and `tracking`. Previously only the three font
families shipped, so every consumer had to invent its own sizes; a component
can now pick a role and get a sanctioned pairing. Backed by new
`type-size` / `type-leading` / `type-weight` / `type-tracking` primitive ramps,
which stay internal.

**Fix: the Tailwind theme emitted invalid CSS for breakpoints.** `--breakpoint-*`
was mapped through `@theme inline`, so Tailwind expanded it to
`@media (width >= var(--breakpoint-lg))`. A media query cannot dereference a
custom property; this hard-failed any build that validates CSS (it broke
`vite build` with lightningcss). Breakpoints now ship in a separate non-inline
`@theme` block with literal values. They are mode-invariant, so nothing is lost.

**Fix: six semantic pairings failed WCAG 2.2.** Found by the new
`scripts/verify-contrast.py` gate, which now runs in CI. Corrected by
re-pointing semantic aliases within the existing stone ramp — no new values:

| Theme | Token            | Was        | Now        | Contrast      |
| ----- | ---------------- | ---------- | ---------- | ------------- |
| light | `border-default` | stone.300  | stone.500  | 1.61 → 3.37:1 |
| light | `border-strong`  | stone.500  | stone.600  | 3.37 → 4.68:1 |
| dark  | `border-default` | stone.700  | stone.400  | 2.35 → 6.47:1 |
| dark  | `border-strong`  | stone.500  | stone.300  | 4.47 → 9.33:1 |
| dark  | `text-secondary` | stone.300  | stone.200  | 5.43 → 6.74:1 |
| dark  | `text-muted`     | stone.400  | stone.300  | 3.76 → 5.43:1 |

Input borders are visibly firmer in light mode and lighter in dark mode. This
is a value change, not a rename — nothing is removed and no consumer breaks.