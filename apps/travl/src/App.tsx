import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog, type Trip } from '@travl/ui';
import { AppHeader } from './components/AppHeader';
import { CreateTripDialog } from './components/CreateTripDialog';
import { TripList } from './components/TripList';
import { TripView } from './components/TripView';
import {
  createTrip,
  loadTheme,
  loadTrips,
  saveTheme,
  saveTrips,
  type Theme,
} from './lib/storage';

/** Which trip is open lives in the URL, so refresh and Back both behave. */
function tripIdFromLocation(): string | null {
  return new URLSearchParams(window.location.search).get('trip');
}

export function App() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [openTripId, setOpenTripId] = useState<string | null>(tripIdFromLocation);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Trip | null>(null);
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  // Browser Back/Forward drives the same state the UI does.
  useEffect(() => {
    const onPopState = () => setOpenTripId(tripIdFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToTrip = useCallback((id: string | null) => {
    setOpenTripId(id);
    const url = id ? `?trip=${encodeURIComponent(id)}` : window.location.pathname;
    if (tripIdFromLocation() !== id) window.history.pushState(null, '', url);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    saveTheme(theme);
  }, [theme]);

  const openTrip = trips.find((t) => t.id === openTripId) ?? null;

  const updateTrip = useCallback((next: Trip) => {
    setTrips((current) => current.map((t) => (t.id === next.id ? next : t)));
  }, []);

  return (
    <>
      <AppHeader
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onBack={openTrip ? () => navigateToTrip(null) : undefined}
      />

      <main>
        {openTrip ? (
          <TripView trip={openTrip} onChange={updateTrip} />
        ) : (
          <TripList
            trips={trips}
            onOpen={(trip) => navigateToTrip(trip.id)}
            onCreate={() => setCreating(true)}
            onDelete={(trip) => setPendingDelete(trip)}
          />
        )}
      </main>

      <CreateTripDialog
        open={creating}
        onOpenChange={setCreating}
        onCreate={(name, days) => {
          const trip = createTrip(name, days);
          setTrips((current) => [...current, trip]);
          navigateToTrip(trip.id);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this trip?"
        description={
          pendingDelete
            ? `${pendingDelete.name} and everything planned in it. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete trip"
        onConfirm={() => {
          if (pendingDelete) {
            setTrips((current) => current.filter((t) => t.id !== pendingDelete.id));
            if (openTripId === pendingDelete.id) navigateToTrip(null);
          }
          setPendingDelete(null);
        }}
      />
    </>
  );
}