import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import './chip.css';

/**
 * The six activity categories. Each maps 1:1 onto a category token family,
 * so adding a category is a token change plus one entry here — never a
 * change to component logic.
 *
 * Order is the display order in every picker; it is part of the contract.
 */
export const CATEGORIES = [
  { id: 'dining', label: 'Dining', tokenFamily: 'tomato' },
  { id: 'coffee', label: 'Coffee', tokenFamily: 'caramel' },
  { id: 'outdoors', label: 'Outdoors', tokenFamily: 'meadow' },
  { id: 'shopping', label: 'Shopping', tokenFamily: 'magenta' },
  { id: 'museums', label: 'Museums', tokenFamily: 'cobalt' },
  { id: 'concerts', label: 'Concerts', tokenFamily: 'cyan' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
) as Record<Category, string>;

/**
 * Chip
 *
 * @figma component Chip
 * @figma prop category   = dining | coffee | outdoors | shopping | museums | concerts
 * @figma prop size       = sm | md
 * @figma prop selectable = true | false
 * @figma prop selected   = true | false
 *
 * Accessibility: selection is signalled by background, border AND the dot —
 * never by hue alone, so it survives grayscale and color-vision differences.
 * Selectable chips render a real <button> with aria-pressed.
 */
const chip = cva('tv-chip', {
  variants: {
    category: {
      dining: 'tv-chip--dining',
      coffee: 'tv-chip--coffee',
      outdoors: 'tv-chip--outdoors',
      shopping: 'tv-chip--shopping',
      museums: 'tv-chip--museums',
      concerts: 'tv-chip--concerts',
    },
    size: {
      sm: 'tv-chip--sm tv-text-label-sm',
      md: 'tv-chip--md tv-text-label-md',
    },
  },
  defaultVariants: { size: 'md' },
});

type ChipVariants = VariantProps<typeof chip>;

export type ChipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'color'> &
  ChipVariants & {
    /** Show the category dot. Defaults to true when a category is set. */
    showDot?: boolean;
    children?: ReactNode;
    ref?: Ref<HTMLSpanElement>;
  };

export function Chip({
  className,
  category,
  size,
  showDot,
  children,
  ref,
  ...props
}: ChipProps) {
  const withDot = showDot ?? Boolean(category);
  return (
    <span
      ref={ref}
      data-category={category}
      className={cn(chip({ category, size }), className)}
      {...props}
    >
      {withDot ? <span className="tv-chip__dot" aria-hidden="true" /> : null}
      {children ?? (category ? CATEGORY_LABELS[category] : null)}
    </span>
  );
}

Chip.displayName = 'Chip';

export type CategoryChipButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'onChange' | 'value'
> &
  Pick<ChipVariants, 'size'> & {
    category: Category;
    selected: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * CategoryChipButton — the selectable form of Chip, used by CategoryPicker.
 *
 * @figma component Chip
 * @figma prop selectable = true
 */
export function CategoryChipButton({
  className,
  category,
  selected,
  size,
  ref,
  ...props
}: CategoryChipButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      data-category={category}
      className={cn(chip({ category, size }), 'tv-chip--selectable', className)}
      {...props}
    >
      <span className="tv-chip__dot" aria-hidden="true" />
      {CATEGORY_LABELS[category]}
    </button>
  );
}

CategoryChipButton.displayName = 'CategoryChipButton';