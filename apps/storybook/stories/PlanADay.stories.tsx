import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActivityDialog,
  Button,
  ConfirmDialog,
  DaySchedule,
  emptyDay,
  type Activity,
  type Day,
  type SlotId,
} from '@travl/ui';
import { fullDay } from './fixtures';

/**
 * The composed flow, for reviewing the pattern rather than the parts: start
 * from an empty day, add activities, edit one, remove one. Everything here is
 * @travl/ui — the story owns state and nothing else.
 */
const meta: Meta = {
  title: 'Flows/Plan a day',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

function Planner({ initial }: { initial: Day }) {
  const [day, setDay] = useState<Day>(initial);
  const [composing, setComposing] = useState<{
    slot: SlotId;
    activity?: Activity;
  } | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<Activity | null>(null);

  const upsert = (slot: SlotId, incoming: Omit<Activity, 'id'> & { id?: string }) => {
    setDay((current) => {
      const existingId = incoming.id;
      const next = { ...current, slots: { ...current.slots } };
      if (existingId) {
        next.slots[slot] = current.slots[slot].map((a) =>
          a.id === existingId ? ({ ...incoming, id: existingId } as Activity) : a,
        );
      } else {
        next.slots[slot] = [
          ...current.slots[slot],
          { ...incoming, id: crypto.randomUUID() } as Activity,
        ];
      }
      return next;
    });
  };

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

  const slotOf = (activity: Activity): SlotId => {
    if (day.slots.morning.some((a) => a.id === activity.id)) return 'morning';
    if (day.slots.afternoon.some((a) => a.id === activity.id)) return 'afternoon';
    return 'evening';
  };

  return (
    <div
      style={{
        inlineSize: 'min(40rem, 100%)',
        marginInline: 'auto',
        display: 'grid',
        gap: 'var(--space-4)',
      }}
    >
      <DaySchedule
        day={day}
        onAddActivity={(slot) => setComposing({ slot })}
        onEditActivity={(activity) =>
          setComposing({ slot: slotOf(activity), activity })
        }
        onRemoveActivity={(activity) => setPendingRemoval(activity)}
        action={
          <Button size="sm" variant="ghost" onClick={() => setDay(initial)}>
            Reset
          </Button>
        }
      />

      {composing ? (
        <ActivityDialog
          open
          onOpenChange={(open) => !open && setComposing(null)}
          slot={composing.slot}
          dayNumber={day.number}
          activity={composing.activity}
          onSubmit={(activity) => upsert(composing.slot, activity)}
        />
      ) : null}

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        title="Remove this activity?"
        description={pendingRemoval?.title}
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingRemoval) remove(pendingRemoval);
          setPendingRemoval(null);
        }}
      />
    </div>
  );
}

export const FromEmpty: Story = {
  name: 'From an empty day',
  parameters: {
    docs: {
      description: {
        story:
          'Every slot opens with an invitation. Submitting without a name or a category surfaces errors on submit, not on every keystroke.',
      },
    },
  },
  render: () => <Planner initial={emptyDay(1)} />,
};

export const FromAFullDay: Story = {
  name: 'From a full day',
  render: () => <Planner initial={fullDay} />,
};