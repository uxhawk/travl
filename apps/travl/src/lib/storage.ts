import { emptyDay, type Trip } from '@travl/ui';

const TRIPS_KEY = 'travl.trips';
const THEME_KEY = 'travl.theme';

export type Theme = 'light' | 'dark';

/**
 * Persistence is deliberately dumb: one JSON blob in localStorage. The MVP
 * has no account and no server, and pretending otherwise would add a data
 * layer nothing yet needs.
 *
 * Every read is defensive — a user's storage can hold anything, including a
 * blob written by an older version of this app.
 */
export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTrip);
  } catch {
    // Corrupt or unavailable storage should not take the app down.
    return [];
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch {
    // Quota or private-mode failures are non-fatal; the session still works.
  }
}

export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* fall through to the system preference */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* non-fatal */
  }
}

function isTrip(value: unknown): value is Trip {
  if (typeof value !== 'object' || value === null) return false;
  const trip = value as Partial<Trip>;
  return (
    typeof trip.id === 'string' &&
    typeof trip.name === 'string' &&
    Array.isArray(trip.days) &&
    trip.days.every(
      (day) =>
        typeof day?.number === 'number' &&
        typeof day?.slots === 'object' &&
        day.slots !== null &&
        Array.isArray(day.slots.morning) &&
        Array.isArray(day.slots.afternoon) &&
        Array.isArray(day.slots.evening),
    )
  );
}

export function createTrip(name: string, dayCount: number): Trip {
  return {
    id: crypto.randomUUID(),
    name,
    days: Array.from({ length: dayCount }, (_, index) => emptyDay(index + 1)),
  };
}