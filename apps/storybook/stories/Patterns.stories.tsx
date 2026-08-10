import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActivityCard,
  Button,
  ConfirmDialog,
  DaySchedule,
  TimeSlot,
  type Activity,
  type Day,
} from '@travl/ui';
import { activities, emptyDayFixture, fullDay, sparseDay } from './fixtures';

const meta: Meta = {
  title: 'Patterns/Day planning',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

const panel = {
  inlineSize: 'min(38rem, 100%)',
  marginInline: 'auto',
} as const;

export const ActivityCards: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One card per category. The left rail echoes the chip, but it is decorative — every card still names its category as text.',
      },
    },
  },
  render: () => (
    <ul
      style={{
        ...panel,
        display: 'grid',
        gap: 'var(--space-2)',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {Object.values(activities).map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onEdit={() => {}}
          onRemove={() => {}}
        />
      ))}
    </ul>
  ),
};

export const ActivityCardReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With no `onEdit`/`onRemove`, the card renders no actions at all — a read-only itinerary shares the same component.',
      },
    },
  },
  render: () => (
    <ul style={{ ...panel, listStyle: 'none', margin: 0, padding: 0 }}>
      <ActivityCard activity={activities.lunch!} />
    </ul>
  ),
};

export const TimeSlotEmptyAndFilled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The empty slot offers the add action instead of only reporting emptiness. Once filled, the invitation moves to a quieter "Add" in the header so it stops competing with the content.',
      },
    },
  },
  render: () => (
    <div style={{ ...panel, display: 'grid', gap: 'var(--space-8)' }}>
      <TimeSlot slot="morning" activities={[]} onAddActivity={() => {}} />
      <TimeSlot
        slot="afternoon"
        activities={[activities.lunch!, activities.records!]}
        onAddActivity={() => {}}
        onRemoveActivity={() => {}}
      />
    </div>
  ),
};

export const DayEmpty: Story = {
  render: () => (
    <div style={panel}>
      <DaySchedule day={emptyDayFixture} onAddActivity={() => {}} />
    </div>
  ),
};

export const DaySparse: Story = {
  render: () => (
    <div style={panel}>
      <DaySchedule day={sparseDay} onAddActivity={() => {}} onRemoveActivity={() => {}} />
    </div>
  ),
};

export const DayFull: Story = {
  render: () => (
    <div style={panel}>
      <DaySchedule
        day={fullDay}
        onAddActivity={() => {}}
        onEditActivity={() => {}}
        onRemoveActivity={() => {}}
      />
    </div>
  ),
};

/**
 * The governance pairing end to end: ActivityCard exposes removal but refuses
 * to confirm it, so the screen owning the data routes removal through
 * ConfirmDialog. Remove an activity and watch where the decision is made.
 */
export const RemovalIsConfirmed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ActivityCard never confirms its own destructive action. The owning screen does — this is the pattern reviewers should look for.',
      },
    },
  },
  render: () => {
    const [day, setDay] = useState<Day>(fullDay);
    const [pending, setPending] = useState<Activity | null>(null);

    const remove = (activity: Activity) => {
      setDay((current) => ({
        ...current,
        slots: {
          morning: current.slots.morning.filter((a) => a.id !== activity.id),
          afternoon: current.slots.afternoon.filter((a) => a.id !== activity.id),
          evening: current.slots.evening.filter((a) => a.id !== activity.id),
        },
      }));
    };

    return (
      <div style={{ ...panel, display: 'grid', gap: 'var(--space-4)' }}>
        <DaySchedule
          day={day}
          onRemoveActivity={(activity) => setPending(activity)}
          action={
            <Button size="sm" variant="ghost" onClick={() => setDay(fullDay)}>
              Reset
            </Button>
          }
        />
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(open) => !open && setPending(null)}
          title="Remove this activity?"
          description={pending?.title}
          confirmLabel="Remove"
          onConfirm={() => {
            if (pending) remove(pending);
            setPending(null);
          }}
        />
      </div>
    );
  },
};