# @travl/tokens

Design tokens for the Travl design system, exported from Figma Variables as
DTCG JSON and built with Style Dictionary.

## Install

```sh
pnpm add @travl/tokens
```

## Usage

**Plain CSS** — import both themes; dark activates under
`<html data-theme="dark">`:

```css
@import "@travl/tokens/css";
```

Or import a single theme: `@travl/tokens/css/light`, `@travl/tokens/css/dark`.

**Tailwind v4** — import the runtime variables, then the theme mapping:

```css
@import "@travl/tokens/css";
@import "@travl/tokens/tailwind";
```

This registers utilities like `bg-bg-surface`, `text-text-primary`,
`border-border-subtle`, `p-4` (from `--spacing-*`), and `rounded-md` —
all resolving through the runtime variables, so dark mode needs no
Tailwind configuration.

**Raw tokens** — the DTCG source is shipped for tool integration:
`@travl/tokens/tokens/semantic.light.json`, etc.

## Architecture

Three tiers: **primitive → semantic → component**. Primitives (raw ramps and
scales) are inputs to the build but are never published as CSS variables —
only the ~70 semantic tokens are public API. This is the same enforcement as
the Figma file, where primitives are hidden from every picker.

Token names match Figma's WEB code syntax exactly: the variable
`color/action/primary` is `var(--color-action-primary)` in both design
specs and shipped CSS.
