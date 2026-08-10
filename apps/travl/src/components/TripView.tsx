import { useState } from 'react';
import {
  ActivityDialog,
  ConfirmDialog,
  DaySchedule,
  Stepper,
  type Activity,
  type SlotId,
  type Trip,
} from '@travl/ui';
import {
  activitiesLostByResize,
  addActivity,
  countTripActivities,
  findSlot,
  removeActivity,
  resizeTrip,
  updateActivity,
} from '../lib/trips';

const MAX_DAYS = 30;

type Composing = { dayNumber: number; slot: SlotId; activity?: Activity };

export function TripView({
  trip,
  onChange,
}: {
  trip: Trip;
  onChange: (trip: Trip) => void;
}) {
  const [composing, setComposing] = useState<Composing | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<
    { activity: Activity; dayNumber: number } | null
  >(null);
  const [pendingResize, setPendingResize] = useState<number | null>(null);

  const totalActivities = countTripActivities(trip);

  const handleSubmit = (incoming: Omit<Activity, 'id'> & { id?: string }) => {
    if (!composing) return;
    const { dayNumber, slot } = composing;
    if (incoming.id) {
      onChange(
        updateActivity(trip, dayNumber, slot, { ...incoming, id: incoming.id } as Activity),
      );
    } else {
      onChange(
        addActivity(trip, dayNumber, slot, {
          ...incoming,
          id: crypto.randomUUID(),
        } as Activity),
      );
    }
  };

  // Shrinking a trip destroys whatever was planned in the removed days, so it
  // goes through the same confirmation gate as deleting an activity.
  const handleResize = (nextCount: number) => {
    const lost = activitiesLostByResize(trip, nextCount);
    if (lost > 0) setPendingResize(nextCount);
    else onChange(resizeTrip(trip, nextCount));
  };

  return (
    <div className="mx-auto grid max-w-3xl gap-8 px-4 py-8">
      <div className="grid gap-4">
        <div>
          <h1 className="tv-text-display-lg text-text-primary">{trip.name}</h1>
          <p className="tv-text-body-md text-text-secondary">
            {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'} ·{' '}
            {totalActivities === 0
              ? 'nothing planned yet'
              : `${totalActivities} ${totalActivities === 1 ? 'activity' : 'activities'}`}
          </p>
        </div>
        <Stepper
          label="Trip length"
          value={trip.days.length}
          onValueChange={handleResize}
          min={1}
          max={MAX_DAYS}
          unitLabel="days"
        />
      </div>

      <div className="grid gap-10">
        {trip.days.map((day) => (
          <DaySchedule
            key={day.number}
            day={day}
            onAddActivity={(slot, dayNumber) => setComposing({ dayNumber, slot })}
            onEditActivity={(activity, dayNumber) => {
              const target = trip.days.find((d) => d.number === dayNumber);
              const slot = target ? findSlot(target, activity.id) : undefined;
              if (slot) setComposing({ dayNumber, slot, activity });
            }}
            onRemoveActivity={(activity, dayNumber) =>
              setPendingRemoval({ activity, dayNumber })
            }
          />
        ))}
      </div>

      {composing ? (
        <ActivityDialog
          open
          onOpenChange={(open) => !open && setComposing(null)}
          slot={composing.slot}
          dayNumber={composing.dayNumber}
          activity={composing.activity}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        title="Remove this activity?"
        description={pendingRemoval?.activity.title}
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingRemoval) {
            onChange(
              removeActivity(trip, pendingRemoval.dayNumber, pendingRemoval.activity.id),
            );
          }
          setPendingRemoval(null);
        }}
      />

      <ConfirmDialog
        open={pendingResize !== null}
        onOpenChange={(open) => !open && setPendingResize(null)}
        title="Shorten this trip?"
        description={
          pendingResize === null
            ? undefined
            : `Removing ${trip.days.length - pendingResize} ${
                trip.days.length - pendingResize === 1 ? 'day' : 'days'
              } will also delete ${activitiesLostByResize(trip, pendingResize)} planned ${
                activitiesLostByResize(trip, pendingResize) === 1 ? 'activity' : 'activities'
              }.`
        }
        confirmLabel="Shorten trip"
        onConfirm={() => {
          if (pendingResize !== null) onChange(resizeTrip(trip, pendingResize));
          setPendingResize(null);
        }}
      />
    </div>
  );
}