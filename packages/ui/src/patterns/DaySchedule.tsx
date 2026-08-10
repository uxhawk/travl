import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { TimeSlot } from './TimeSlot';
import { SLOTS, type Activity, type Day, type SlotId } from '../types';
import './day-schedule.css';

/**
 * DaySchedule — one day of a trip: a heading plus the three time slots.
 *
 * @figma component DaySchedule
 * @figma prop state = empty | filled
 *
 * Accessibility: renders one <h3> per day above three <h4> slot headings, so
 * the document outline matches the visual hierarchy a sighted user sees.
 *
 * Composition note: this pattern owns layout and delegates every decision
 * about what an activity looks like to TimeSlot → ActivityCard. It takes no
 * styling props on purpose — a day should not be individually themeable.
 */
export type DayScheduleProps = {
  day: Day;
  onAddActivity?: (slot: SlotId, dayNumber: number) => void;
  onEditActivity?: (activity: Activity, dayNumber: number) => void;
  onRemoveActivity?: (activity: Activity, dayNumber: number) => void;
  /** Right-hand slot in the header, e.g. a day-level menu. */
  action?: ReactNode;
  className?: string;
};

export function DaySchedule({
  day,
  onAddActivity,
  onEditActivity,
  onRemoveActivity,
  action,
  className,
}: DayScheduleProps) {
  const headingId = useId();
  const total = SLOTS.reduce((sum, slot) => sum + day.slots[slot.id].length, 0);

  return (
    <section
      aria-labelledby={headingId}
      data-day={day.number}
      className={cn('tv-day-schedule', className)}
    >
      <div className="tv-day-schedule__header">
        <div className="tv-day-schedule__heading">
          <h3 id={headingId} className="tv-day-schedule__title tv-text-display-sm">
            Day {day.number}
          </h3>
          <span className="tv-day-schedule__summary tv-text-body-sm">
            {total === 0
              ? 'Nothing planned'
              : `${total} ${total === 1 ? 'activity' : 'activities'}`}
          </span>
        </div>
        {action}
      </div>

      <div className="tv-day-schedule__slots">
        {SLOTS.map((slot) => (
          <TimeSlot
            key={slot.id}
            slot={slot.id}
            activities={day.slots[slot.id]}
            onAddActivity={
              onAddActivity ? (slotId) => onAddActivity(slotId, day.number) : undefined
            }
            onEditActivity={
              onEditActivity
                ? (activity) => onEditActivity(activity, day.number)
                : undefined
            }
            onRemoveActivity={
              onRemoveActivity
                ? (activity) => onRemoveActivity(activity, day.number)
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
DaySchedule.displayName = 'DaySchedule';