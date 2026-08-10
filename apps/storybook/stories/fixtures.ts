import type { Activity, Day } from '@travl/ui';

/** Shared sample data so every story shows the same trip. */
export const activities: Record<string, Activity> = {
  coffee: {
    id: 'a1',
    title: 'Get coffee at Blue Bottle',
    category: 'coffee',
    note: 'Mint Plaza — opens at 7am',
  },
  museum: {
    id: 'a2',
    title: 'SFMOMA, second floor',
    category: 'museums',
  },
  lunch: {
    id: 'a3',
    title: 'Lunch at Zuni Café',
    category: 'dining',
    note: 'Booked for 4 under Ren',
  },
  park: {
    id: 'a4',
    title: 'Watch the sunset from Bernal Heights',
    category: 'outdoors',
  },
  records: {
    id: 'a5',
    title: 'Amoeba Records',
    category: 'shopping',
  },
  show: {
    id: 'a6',
    title: 'Show at The Independent',
    category: 'concerts',
    note: 'Doors 8pm',
  },
};

export const fullDay: Day = {
  number: 2,
  slots: {
    morning: [activities.coffee!, activities.museum!],
    afternoon: [activities.lunch!, activities.records!],
    evening: [activities.park!, activities.show!],
  },
};

export const sparseDay: Day = {
  number: 1,
  slots: {
    morning: [activities.coffee!],
    afternoon: [],
    evening: [],
  },
};

export const emptyDayFixture: Day = {
  number: 3,
  slots: { morning: [], afternoon: [], evening: [] },
};