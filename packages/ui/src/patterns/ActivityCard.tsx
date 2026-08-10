import { cn } from '../lib/cn';
import { Button } from '../primitives/Button';
import { Chip } from '../primitives/Chip';
import type { Activity } from '../types';
import './activity-card.css';

/**
 * ActivityCard — one planned activity inside a TimeSlot.
 *
 * @figma component ActivityCard
 * @figma prop category = dining | coffee | outdoors | shopping | museums | concerts
 * @figma prop hasNote  = true | false
 * @figma prop editable = true | false
 *
 * Governance: `onRemove` is destructive and this component does NOT confirm
 * it — see Button. DaySchedule's consumer is expected to route removal
 * through ConfirmDialog. The category rail is decorative; the chip carries
 * the same information as text, so nothing is lost without color.
 */
export type ActivityCardProps = {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
  onRemove?: (activity: Activity) => void;
  className?: string;
};

export function ActivityCard({
  activity,
  onEdit,
  onRemove,
  className,
}: ActivityCardProps) {
  return (
    <li
      className={cn(
        'tv-activity-card',
        `tv-activity-card--${activity.category}`,
        className,
      )}
      data-category={activity.category}
    >
      <div className="tv-activity-card__body">
        <p className="tv-activity-card__title tv-text-body-md">{activity.title}</p>
        {activity.note ? (
          <p className="tv-activity-card__note tv-text-body-sm">{activity.note}</p>
        ) : null}
        <div className="tv-activity-card__meta">
          <Chip category={activity.category} size="sm" />
        </div>
      </div>
      {onEdit || onRemove ? (
        <div className="tv-activity-card__actions">
          {onEdit ? (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Edit ${activity.title}`}
              onClick={() => onEdit(activity)}
            >
              <PencilIcon />
            </Button>
          ) : null}
          {onRemove ? (
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Remove ${activity.title}`}
              onClick={() => onRemove(activity)}
            >
              <TrashIcon />
            </Button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
ActivityCard.displayName = 'ActivityCard';

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.2 2.8a1.7 1.7 0 0 1 2.4 2.4L5.9 12.9l-3.2.8.8-3.2 7.7-7.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3.2c0-.4.3-.7.7-.7h1.6c.4 0 .7.3.7.7v1.3M4.5 4.5l.6 8c0 .5.4.9.9.9h4c.5 0 .9-.4.9-.9l.6-8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}