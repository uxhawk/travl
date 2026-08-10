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
`border-border-subtle`, `p-4` (from `--spacing-*`), `rounded-md`, and
`text-body-md` — all resolving through the runtime variables, so dark mode
needs no Tailwind configuration.

Breakpoints are the one exception: they ship in a separate non-inline
`@theme` block with literal values, because Tailwind expands them into
`@media (width >= …)` and a media query cannot dereference a custom
property. They are mode-invariant, so nothing is lost.

## Type roles

Typography ships as eleven roles — `display-lg|md|sm`, `body-lg|md|sm`,
`label-lg|md|sm`, `data-md|sm` — each carrying five leaves:

```css
--text-body-md-family    /* 'Instrument Sans' */
--text-body-md-size      /* 16px */
--text-body-md-leading   /* 1.5  */
--text-body-md-weight    /* 400  */
--text-body-md-tracking  /* 0em  */
```

Consumers pick a role, never a size. That is what stops a 15px semibold from
appearing in the wild. Loading the webfonts is the app's job.

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
