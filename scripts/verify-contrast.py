#!/usr/bin/env python3
"""WCAG 2.2 contrast gate for @travl/tokens.

Accessibility as a build-time contract: this reads the BUILT stylesheets —
the same bytes consumers install — and fails the build if any sanctioned
foreground/background pairing drops below its threshold. Checking the built
CSS rather than the DTCG source means an alias that silently re-points to a
different ramp is caught here, not in review.

Run from the repo root:

    python3 scripts/verify-contrast.py

Zero pip dependencies, by design: a gate that needs an install step is a gate
someone eventually skips.

Exit codes: 0 all pass, 1 one or more failures, 2 the tokens are not built.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "packages" / "tokens" / "dist" / "css"

# --- The contract ----------------------------------------------------------
# (foreground, background, label). Every pairing here is one a component
# actually renders; adding a component that invents a new pairing means adding
# a line here.
#
# `AA_NORMAL` is the floor for body text. Pairings only ever used at display
# sizes could take the 3:1 large-text allowance, but Travl does not claim it —
# a token pairing does not know what size it will be rendered at.
AA_NORMAL = 4.5
AA_LARGE = 3.0
AA_NON_TEXT = 3.0

TEXT_PAIRINGS = [
    ("text-primary", "bg-base", "Body text on the page"),
    ("text-primary", "bg-surface", "Body text on a surface"),
    ("text-primary", "bg-surface-raised", "Body text on a card"),
    ("text-primary", "bg-inset", "Body text on an inset well"),
    ("text-secondary", "bg-base", "Secondary text on the page"),
    ("text-secondary", "bg-surface", "Secondary text on a surface"),
    ("text-secondary", "bg-surface-raised", "Secondary text on a card"),
    ("text-muted", "bg-base", "Muted text on the page"),
    # `text-muted` on `bg-surface` is NOT sanctioned: it lands at 4.49:1, and
    # rather than darken the light text ramp to buy 0.01 the system declines
    # the pairing. bg-surface is chrome (the app header), which carries
    # primary and secondary text only. If a component ever needs muted text
    # on a surface, the ramp has to move — not this list.
    ("text-muted", "bg-surface-raised", "Muted text on a card"),
    ("text-link", "bg-base", "Link on the page"),
    ("text-link", "bg-surface", "Link on a surface"),
    ("text-on-primary", "action-primary", "Primary button label"),
    ("text-on-primary", "action-primary-hover", "Primary button label, hover"),
    ("text-on-primary", "action-primary-active", "Primary button label, active"),
    ("text-on-accent", "action-accent", "Accent button label"),
    ("text-on-destructive", "action-destructive", "Destructive button label"),
    (
        "text-on-destructive",
        "action-destructive-hover",
        "Destructive button label, hover",
    ),
    ("status-success-fg", "status-success-soft", "Success message"),
    ("status-warning-fg", "status-warning-soft", "Warning message"),
    ("status-danger-fg", "status-danger-soft", "Error message / field error"),
]

# Chip and ActivityCard render on-soft over soft for all six categories.
CATEGORIES = ["dining", "coffee", "outdoors", "shopping", "museums", "concerts"]
TEXT_PAIRINGS += [
    (
        f"category-{c}-on-soft",
        f"category-{c}-soft",
        f"{c.capitalize()} chip label",
    )
    for c in CATEGORIES
]

# Non-text contrast (WCAG 2.2 SC 1.4.11): UI component boundaries and focus
# indicators must reach 3:1 against what sits behind them.
NON_TEXT_PAIRINGS = [
    ("border-default", "bg-base", "Input border on the page"),
    ("border-default", "bg-surface-raised", "Input border on a card"),
    ("border-focus", "bg-base", "Focus ring on the page"),
    ("border-focus", "bg-surface-raised", "Focus ring on a card"),
    ("border-strong", "bg-base", "Emphasised border on the page"),
    ("action-primary", "bg-base", "Filled control against the page"),
]

# Disabled states are WCAG-exempt (SC 1.4.3 explicitly excludes inactive
# controls) and Travl leans on that deliberately: meeting contrast on an inert
# control makes it read as available. Listed so the omission is a decision on
# the record rather than an oversight.
EXEMPT = [
    ("action-disabled-fg", "action-disabled-bg", "Disabled control — exempt by design"),
]


# --- CSS parsing -----------------------------------------------------------

VAR_RE = re.compile(r"--([a-z0-9-]+)\s*:\s*([^;]+);", re.IGNORECASE)


def parse_vars(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    return {name: value.strip() for name, value in VAR_RE.findall(text)}


def parse_color(value: str) -> tuple[float, float, float] | None:
    """Return linear-ready 0-255 RGB, or None if the value is not opaque RGB."""
    value = value.strip()

    if value.startswith("#"):
        hex_digits = value[1:]
        if len(hex_digits) == 3:
            hex_digits = "".join(ch * 2 for ch in hex_digits)
        if len(hex_digits) == 8:
            # 8-digit hex carries alpha; contrast against an unknown backdrop
            # is undefined, so treat it as un-checkable.
            return None
        if len(hex_digits) != 6:
            return None
        return tuple(int(hex_digits[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]

    match = re.match(r"rgba?\(([^)]+)\)", value, re.IGNORECASE)
    if match:
        parts = [p.strip() for p in re.split(r"[,\s/]+", match.group(1)) if p.strip()]
        if len(parts) >= 4:
            return None  # translucent
        if len(parts) == 3:
            try:
                return tuple(float(p) for p in parts)  # type: ignore[return-value]
            except ValueError:
                return None
    return None


# --- WCAG maths ------------------------------------------------------------


def channel_luminance(channel_0_255: float) -> float:
    c = channel_0_255 / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def relative_luminance(rgb: tuple[float, float, float]) -> float:
    r, g, b = (channel_luminance(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(fg: tuple[float, float, float], bg: tuple[float, float, float]) -> float:
    l1, l2 = relative_luminance(fg), relative_luminance(bg)
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


# --- Runner ----------------------------------------------------------------


class Result:
    __slots__ = ("theme", "fg", "bg", "label", "ratio", "threshold", "status")

    def __init__(self, theme, fg, bg, label, ratio, threshold, status):
        self.theme = theme
        self.fg = fg
        self.bg = bg
        self.label = label
        self.ratio = ratio
        self.threshold = threshold
        self.status = status


def check(theme: str, variables: dict[str, str], pairings, threshold: float) -> list[Result]:
    results: list[Result] = []
    for fg_name, bg_name, label in pairings:
        fg_raw = variables.get(f"color-{fg_name}")
        bg_raw = variables.get(f"color-{bg_name}")

        if fg_raw is None or bg_raw is None:
            missing = fg_name if fg_raw is None else bg_name
            results.append(
                Result(theme, fg_name, bg_name, f"{label} (missing --color-{missing})",
                       0.0, threshold, "MISSING")
            )
            continue

        fg, bg = parse_color(fg_raw), parse_color(bg_raw)
        if fg is None or bg is None:
            results.append(
                Result(theme, fg_name, bg_name, f"{label} (non-opaque)", 0.0, threshold, "SKIP")
            )
            continue

        ratio = contrast_ratio(fg, bg)
        status = "PASS" if ratio >= threshold else "FAIL"
        results.append(Result(theme, fg_name, bg_name, label, ratio, threshold, status))
    return results


def main() -> int:
    light_css, dark_css = DIST / "light.css", DIST / "dark.css"
    if not light_css.exists() or not dark_css.exists():
        print("✗ Tokens are not built. Run `pnpm build` first.", file=sys.stderr)
        return 2

    themes = {"light": parse_vars(light_css), "dark": parse_vars(dark_css)}

    results: list[Result] = []
    for theme, variables in themes.items():
        results += check(theme, variables, TEXT_PAIRINGS, AA_NORMAL)
        results += check(theme, variables, NON_TEXT_PAIRINGS, AA_NON_TEXT)

    failures = [r for r in results if r.status in ("FAIL", "MISSING")]
    skipped = [r for r in results if r.status == "SKIP"]

    width = max(len(f"{r.fg} on {r.bg}") for r in results)
    for theme in themes:
        print(f"\n  {theme.upper()}")
        for r in (r for r in results if r.theme == theme):
            pair = f"{r.fg} on {r.bg}".ljust(width)
            mark = {"PASS": "✓", "FAIL": "✗", "SKIP": "–", "MISSING": "?"}[r.status]
            ratio = f"{r.ratio:5.2f}:1" if r.status in ("PASS", "FAIL") else "   —   "
            print(f"    {mark} {pair}  {ratio}  (needs {r.threshold}:1)  {r.label}")

    print(f"\n  EXEMPT (WCAG 1.4.3 excludes inactive controls)")
    for fg, bg, label in EXEMPT:
        print(f"    · {fg} on {bg} — {label}")

    checked = len(results) - len(skipped)
    print(
        f"\n  {checked} checks across {len(themes)} themes: "
        f"{checked - len(failures)} passed, {len(failures)} failed"
        + (f", {len(skipped)} skipped" if skipped else "")
    )

    if failures:
        print("\n  Contrast gate FAILED:", file=sys.stderr)
        for r in failures:
            print(
                f"    {r.theme}: --color-{r.fg} on --color-{r.bg} "
                f"= {r.ratio:.2f}:1, needs {r.threshold}:1 ({r.label})",
                file=sys.stderr,
            )
        return 1

    print("  ✓ Contrast gate passed.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())