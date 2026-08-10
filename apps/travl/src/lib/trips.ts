import { emptyDay, type Activity, type Day, type SlotId, type Trip } from '@travl/ui';

/**
 * Pure trip transformations. Keeping these out of components means the rules
 * — day renumbering, where a new activity lands — are testable and stated
 * once.
 */

export function addActivity(
  trip: Trip,
  dayNumber: number,
  slot: SlotId,
  activity: Activity,
): Trip {
  return mapDay(trip, dayNumber, (day) => ({
    ...day,
    slots: { ...day.slots, [slot]: [...day.slots[slot], activity] },
  }));
}

export function updateActivity(
  trip: Trip,
  dayNumber: number,
  slot: SlotId,
  activity: Activity,
): Trip {
  return mapDay(trip, dayNumber, (day) => ({
    ...day,
    slots: {
      ...day.slots,
      [slot]: day.slots[slot].map((a) => (a.id === activity.id ? activity : a)),
    },
  }));
}

export function removeActivity(
  trip: Trip,
  dayNumber: number,
  activityId: string,
): Trip {
  return mapDay(trip, dayNumber, (day) => ({
    ...day,
    slots: {
      morning: day.slots.morning.filter((a) => a.id !== activityId),
      afternoon: day.slots.afternoon.filter((a) => a.id !== activityId),
      evening: day.slots.evening.filter((a) => a.id !== activityId),
    },
  }));
}

/**
 * Changing trip length keeps every day that survives. Shrinking a trip
 * discards the tail days and everything planned in them — the caller is
 * expected to confirm that, which is why this returns the count of
 * activities that would be lost alongside the new trip.
 */
export function resizeTrip(trip: Trip, dayCount: number): Trip {
  if (dayCount === trip.days.length) return trip;
  if (dayCount < trip.days.length) {
    return { ...trip, days: trip.days.slice(0, dayCount) };
  }
  const added = Array.from({ length: dayCount - trip.days.length }, (_, i) =>
    emptyDay(trip.days.length + i + 1),
  );
  return { ...trip, days: [...trip.days, ...added] };
}

export function activitiesLostByResize(trip: Trip, dayCount: number): number {
  if (dayCount >= trip.days.length) return 0;
  return trip.days
    .slice(dayCount)
    .reduce((sum, day) => sum + countActivities(day), 0);
}

export function countActivities(day: Day): number {
  return day.slots.morning.length + day.slots.afternoon.length + day.slots.evening.length;
}

export function countTripActivities(trip: Trip): number {
  return trip.days.reduce((sum, day) => sum + countActivities(day), 0);
}

/** Which slot an activity currently sits in, for edit flows. */
export function findSlot(day: Day, activityId: string): SlotId | undefined {
  if (day.slots.morning.some((a) => a.id === activityId)) return 'morning';
  if (day.slots.afternoon.some((a) => a.id === activityId)) return 'afternoon';
  if (day.slots.evening.some((a) => a.id === activityId)) return 'evening';
  return undefined;
}

function mapDay(trip: Trip, dayNumber: number, fn: (day: Day) => Day): Trip {
  return {
    ...trip,
    days: trip.days.map((day) => (day.number === dayNumber ? fn(day) : day)),
  };
}