import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  type Trip,
} from '@travl/ui';
import { countTripActivities } from '../lib/trips';

export function TripList({
  trips,
  onOpen,
  onCreate,
  onDelete,
}: {
  trips: Trip[];
  onOpen: (trip: Trip) => void;
  onCreate: () => void;
  onDelete: (trip: Trip) => void;
}) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="tv-text-display-md text-text-primary">Your trips</h1>
        {trips.length > 0 ? <Button onClick={onCreate}>New trip</Button> : null}
      </div>

      {trips.length === 0 ? (
        <Card variant="outline">
          <EmptyState
            title="No trips yet"
            description="Plan a trip day by day — morning, afternoon and evening — and it'll show up here."
            action={<Button onClick={onCreate}>Create your first trip</Button>}
          />
        </Card>
      ) : (
        <ul className="grid gap-3 list-none m-0 p-0">
          {trips.map((trip) => {
            const activities = countTripActivities(trip);
            return (
              <li key={trip.id} className="flex items-stretch gap-2">
                <Card interactive asChild className="flex-1">
                  <button type="button" onClick={() => onOpen(trip)}>
                    <CardHeader>
                      <CardTitle>{trip.name}</CardTitle>
                    </CardHeader>
                    <CardDescription>
                      {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'} ·{' '}
                      {activities === 0
                        ? 'nothing planned yet'
                        : `${activities} ${activities === 1 ? 'activity' : 'activities'}`}
                    </CardDescription>
                  </button>
                </Card>
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label={`Delete ${trip.name}`}
                  onClick={() => onDelete(trip)}
                  className="self-center"
                >
                  <TrashIcon />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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