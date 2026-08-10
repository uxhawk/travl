# @travl/ui

Travl's component library. shadcn's anatomy — Radix primitives for behavior,
CVA for the variant API, a `cn()` helper — with the styling expressed as a
**component token tier** rather than Tailwind utility strings.

## Usage

```tsx
import '@travl/tokens/css';
import '@travl/ui/styles.css';
import { Button, DaySchedule } from '@travl/ui';
```

Apps load the webfonts (Bricolage Grotesque, Instrument Sans, Spline Sans
Mono). The library names families and ships fallback stacks; it never
`@import`s a third-party font on a consumer's behalf.

## The component tier

Every component declares scoped custom properties bound to semantic tokens.
Variants re-point those properties instead of redeclaring CSS:

```css
.tv-button {
  --button-bg: var(--color-action-primary);
  --button-fg: var(--color-text-on-primary);
  background-color: var(--button-bg);
  color: var(--button-fg);
}
.tv-button--destructive {
  --button-bg: var(--color-action-destructive);
}
```

No hex, no px, no primitive references anywhere in a component rule. A new
variant is a token swap.

## Type

Never set `font-size`. Pick a role:

```tsx
<p className="tv-text-body-md">…</p>
<span className="tv-text-data-sm">12</span>   // tabular figures, mono
```

Eleven roles, each bundling family, size, leading, weight and tracking, so a
caller cannot assemble a pairing the system did not sanction.

## Cascade layers

Everything ships inside `@layer travl.base` / `travl.components`, so any
**unlayered** rule in your app overrides it without a specificity fight.

If your app also uses Tailwind, declare the order yourself before any import:

```css
@layer theme, base, travl.base, travl.components, components, utilities;
```

Preflight must reset before components; utilities must come after, or
`<Button className="w-full" />` is silently ignored.

## Governance built into the API

These are enforced by types and structure, not by review:

- `iconOnly` on `Button` **requires** `aria-label` — omitting it is a type error.
- `EmptyState` **requires** an `action`. An empty state that only reports
  emptiness is a dead end.
- `Button variant="destructive"` styles but never confirms. Pair it with
  `ConfirmDialog`; the caller decides what deserves a gate.
- `CategoryPicker` renders a real radiogroup, and selection is carried by
  background, border **and** dot — never hue alone.
- `Stepper` clamps to `min`/`max` on every path, so it cannot hand its owner
  an out-of-range value.
- `TextField` wires hint/error to `aria-describedby`; when both exist the
  error wins, so nobody hears a stale hint after a failed submit.
- `prefers-reduced-motion` is honoured by every component that animates.

## Figma parity

Each component's JSDoc declares its Figma contract with matching names:

```
@figma component Button
@figma prop variant = primary | secondary | ghost | accent | destructive
```

Values are identical strings in both places, which is what makes the mapping
derivable without a hand-written Code Connect file.