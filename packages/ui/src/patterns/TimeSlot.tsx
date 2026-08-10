import { useId } from 'react';
import { cn } from '../lib/cn';
import { Button } from '../primitives/Button';
import { EmptyState } from '../primitives/EmptyState';
import { ActivityCard } from './ActivityCard';
import { SLOT_LABELS, type Activity, type SlotId } from '../types';
import './time-slot.css';

/**
 * TimeSlot — one of the three parts of a Travl day.
 *
 * @figma component TimeSlot
 * @figma prop slot  = morning | afternoon | evening
 * @figma prop state = empty | filled
 *
 * Accessibility: the slot is a <section> labelled by its heading, so screen
 * reader users can jump between Morning / Afternoon / Evening. The activity
 * list is a real <ul> and each card a real <li>, which makes the count
 * announce correctly.
 *
 * Governance: the empty state offers the add action rather than only saying
 * the slot is empty — an empty state is an invitation, not a report.
 */
export type TimeSlotProps = {
  slot: SlotId;
  activities: Activity[];
  onAddActivity?: (slot: SlotId) => void;
  onEditActivity?: (activity: Activity) => void;
  onRemoveActivity?: (activity: Activity) => void;
  className?: string;
};

export function TimeSlot({
  slot,
  activities,
  onAddActivity,
  onEditActivity,
  onRemoveActivity,
  className,
}: TimeSlotProps) {
  const headingId = useId();
  const label = SLOT_LABELS[slot];
  const isEmpty = activities.length === 0;

  return (
    <section
      aria-labelledby={headingId}
      data-slot={slot}
      className={cn('tv-time-slot', className)}
    >
      <div className="tv-time-slot__header">
        <h4 id={headingId} className="tv-time-slot__heading">
          <span className="tv-time-slot__label tv-text-label-sm">{label}</span>
          {!isEmpty ? (
            <span className="tv-time-slot__count tv-text-data-sm">
              {activities.length}
            </span>
          ) : null}
        </h4>
        {onAddActivity && !isEmpty ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddActivity(slot)}
          >
            Add
          </Button>
        ) : null}
      </div>

      {isEmpty ? (
        <EmptyState
          size="compact"
          className="tv-time-slot__empty"
          title={`Nothing planned for ${label.toLowerCase()}`}
          action={
            onAddActivity ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAddActivity(slot)}
              >
                Add an activity
              </Button>
            ) : null
          }
        />
      ) : (
        <ul className="tv-time-slot__list">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={onEditActivity}
              onRemove={onRemoveActivity}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
TimeSlot.displayName = 'TimeSlot';