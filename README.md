# Travl

Design system monorepo for **Travl**, a trip-planning app. Demonstrates a
Figma-first token pipeline: Figma Variables → DTCG JSON → Style Dictionary →
published CSS + Tailwind v4 theme.

## Structure

| Path              | What it is                                          |
| ----------------- | --------------------------------------------------- |
| `packages/tokens` | `@travl/tokens` — design tokens, the system's foundation |
| `packages/ui`     | (planned) shadcn primitives bound to semantic tokens |
| `packages/components` | (planned) Travl component library               |
| `apps/storybook`  | (planned) component documentation                   |

## Commands

```sh
pnpm install     # install all workspace deps
pnpm build       # turbo builds every package
pnpm changeset   # record a change for release
pnpm release     # build + publish (CI does this automatically)
```

## Token pipeline

1. Variables are edited in the `travl-tokens` Figma file (source of truth).
2. The **Travl Token Export** plugin emits DTCG JSON per collection/mode.
3. JSON lands in `packages/tokens/tokens/` as a reviewable PR diff.
4. CI builds and runs the WCAG AA contrast gate.
5. Changesets versions and publishes `@travl/tokens` to npm.
