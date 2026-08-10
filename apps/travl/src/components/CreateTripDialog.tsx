import { useEffect, useState } from 'react';
import type { FormEventHandler } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Stepper,
  TextField,
} from '@travl/ui';

const MAX_DAYS = 30;

/**
 * Create a trip: a name and a number of days. Deliberately two fields — the
 * MVP's job is to get someone to a day plan, not to collect a travel profile.
 */
export function CreateTripDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, days: number) => void;
}) {
  const [name, setName] = useState('');
  const [days, setDays] = useState(3);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    setName('');
    setDays(3);
    setError(undefined);
  }, [open]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (name.trim() === '') {
      setError('Give your trip a name so you can find it later.');
      return;
    }
    onCreate(name.trim(), days);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>New trip</DialogTitle>
            <DialogDescription>
              You can add and remove days later.
            </DialogDescription>
          </DialogHeader>

          <TextField
            label="Where are you going?"
            placeholder="Barcelona with Sam"
            value={name}
            error={error}
            autoFocus
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(undefined);
            }}
          />

          <Stepper
            label="How many days?"
            value={days}
            onValueChange={setDays}
            min={1}
            max={MAX_DAYS}
            unitLabel="days"
            hint={`Up to ${MAX_DAYS} days.`}
          />

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}