import { useId } from 'react';
import type { ReactNode } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn } from '../lib/cn';
import { CATEGORIES, CATEGORY_LABELS, type Category } from './Chip';
import './category-picker.css';

/**
 * CategoryPicker — single-select over the six activity categories.
 *
 * @figma component CategoryPicker
 * @figma prop size = sm | md
 *
 * Accessibility: a real radiogroup (Radix), so arrow keys move between
 * options and only the selected chip is a tab stop. Chips are radios rather
 * than toggle buttons because exactly one category applies to an activity —
 * the semantics should say so.
 *
 * Governance: options come from the CATEGORIES const, never from a caller-
 * supplied list. A new category ships by adding tokens plus one entry there,
 * which keeps Figma, CSS and code from drifting apart.
 */
export type CategoryPickerProps = {
  label: ReactNode;
  value: Category | undefined;
  onValueChange: (value: Category) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean;
};

export function CategoryPicker({
  label,
  value,
  onValueChange,
  size = 'md',
  disabled = false,
  className,
  hideLabel = false,
}: CategoryPickerProps) {
  const labelId = useId();

  return (
    <div className={cn('tv-category-picker', className)}>
      <span
        id={labelId}
        className={cn(
          'tv-category-picker__label tv-text-label-md',
          hideLabel && 'tv-visually-hidden',
        )}
      >
        {label}
      </span>
      <RadioGroup.Root
        aria-labelledby={labelId}
        value={value ?? ''}
        onValueChange={(next) => onValueChange(next as Category)}
        disabled={disabled}
        orientation="horizontal"
        loop
        className="tv-category-picker__options"
      >
        {CATEGORIES.map((category) => (
          <RadioGroup.Item
            key={category.id}
            value={category.id}
            data-category={category.id}
            className={cn(
              'tv-chip',
              'tv-chip--selectable',
              `tv-chip--${category.id}`,
              size === 'sm' ? 'tv-chip--sm tv-text-label-sm' : 'tv-chip--md tv-text-label-md',
            )}
          >
            <span className="tv-chip__dot" aria-hidden="true" />
            {CATEGORY_LABELS[category.id]}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
CategoryPicker.displayName = 'CategoryPicker';