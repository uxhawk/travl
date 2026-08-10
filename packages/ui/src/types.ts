import type { Category } from './primitives/Chip';

/**
 * Domain shapes the pattern tier renders. These live in @travl/ui because
 * the patterns are opinionated about them — a TimeSlot is not a generic list,
 * it is the morning/afternoon/evening structure of a Travl day.
 */

export const SLOTS = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
] as const;

export type SlotId = (typeof SLOTS)[number]['id'];

export const SLOT_LABELS = Object.fromEntries(
  SLOTS.map((s) => [s.id, s.label]),
) as Record<SlotId, string>;

export type Activity = {
  id: string;
  /** What you'll do — "Get coffee at Starbucks". */
  title: string;
  category: Category;
  /** Free-text detail: address, booking reference, who's coming. */
  note?: string;
};

export type Day = {
  /** 1-based; "Day 1" is what the traveller sees. */
  number: number;
  slots: Record<SlotId, Activity[]>;
};

export type Trip = {
  id: string;
  name: string;
  days: Day[];
};

/** An empty day with all three slots present, so callers never index undefined. */
export function emptyDay(number: number): Day {
  return { number, slots: { morning: [], afternoon: [], evening: [] } };
}