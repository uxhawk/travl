# Travl

Design system monorepo for **Travl**, a trip-planning app. Demonstrates a
Figma-first token pipeline: Figma Variables → DTCG JSON → Style Dictionary →
published CSS + Tailwind v4 theme.

## Structure

| Path              | What it is                                               |
| ----------------- | -------------------------------------------------------- |
| `packages/tokens` | `@travl/tokens` — design tokens, the system's foundation   |
| `packages/ui`     | `@travl/ui` — shadcn anatomy bound to semantic tokens      |
| `apps/storybook`  | Component documentation and UX pattern review              |
| `apps/travl`      | The trip-planning app, consuming `@travl/ui`               |
| `scripts/`        | `verify-contrast.py` — the WCAG gate CI runs               |

## Commands

```sh
pnpm install     # install all workspace deps
pnpm build       # turbo builds tokens → ui → apps
pnpm dev         # Storybook at localhost:6006
pnpm app         # the Travl app at localhost:5173
pnpm typecheck   # every package
pnpm contrast    # WCAG 2.2 gate over the built CSS
pnpm changeset   # record a change for release
pnpm release     # build + publish (CI does this automatically)
```

## How the layers fit

`@travl/tokens` publishes ~125 semantic CSS variables. `@travl/ui` never
references a raw token in a component rule — each component declares its own
tier (`--button-bg: var(--color-action-primary)`) and variants re-point those
props, so a variant is a token swap rather than new CSS. The app composes
`@travl/ui` for anything with design meaning and uses Tailwind (fed by the
same tokens) only for layout.

Accessibility is enforced, not aspirational: `verify-contrast.py` reads the
built stylesheets and fails CI if any sanctioned pairing drops below its
threshold. It caught six real failures the first time it ran.

## Token pipeline

1. Variables are edited in the `travl-tokens` Figma file (source of truth).
2. The **Travl Token Export** plugin emits DTCG JSON per collection/mode.
3. JSON lands in `packages/tokens/tokens/` as a reviewable PR diff.
4. CI builds and runs the WCAG AA contrast gate.
5. Changesets versions and publishes `@travl/tokens` to npm.
