import { useEffect, useState } from 'react';
import type { FormEventHandler } from 'react';
import { Button } from '../primitives/Button';
import { CategoryPicker } from '../primitives/CategoryPicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/Dialog';
import { TextAreaField, TextField } from '../primitives/TextField';
import type { Category } from '../primitives/Chip';
import { SLOT_LABELS, type Activity, type SlotId } from '../types';

/**
 * ActivityDialog — add or edit one activity.
 *
 * @figma component ActivityDialog
 * @figma prop mode = add | edit
 *
 * Governance: validation lives here, not at the call site. The dialog will
 * not emit an activity without a title and a category, so no screen can
 * accidentally create a half-formed one. Errors appear on submit rather than
 * on every keystroke — validating as someone types tells them they are wrong
 * before they have finished being right.
 *
 * Accessibility: the error is rendered by TextField, which wires it to
 * aria-describedby and sets aria-invalid; focus returns to the trigger on
 * close via Radix.
 */
export type ActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which slot the activity belongs to; shown in the dialog description. */
  slot: SlotId;
  dayNumber: number;
  /** Present in edit mode; absent in add mode. */
  activity?: Activity;
  onSubmit: (activity: Omit<Activity, 'id'> & { id?: string }) => void;
};

export function ActivityDialog({
  open,
  onOpenChange,
  slot,
  dayNumber,
  activity,
  onSubmit,
}: ActivityDialogProps) {
  const mode = activity ? 'edit' : 'add';
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [errors, setErrors] = useState<{ title?: string; category?: string }>({});

  // Reset to the incoming activity every time the dialog opens, so a
  // cancelled edit never leaks into the next one.
  useEffect(() => {
    if (!open) return;
    setTitle(activity?.title ?? '');
    setNote(activity?.note ?? '');
    setCategory(activity?.category);
    setErrors({});
  }, [open, activity]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (title.trim() === '') nextErrors.title = 'Give the activity a name.';
    if (!category) nextErrors.category = 'Pick a category.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...(activity ? { id: activity.id } : {}),
      title: title.trim(),
      category: category!,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'add' ? 'Add an activity' : 'Edit activity'}
            </DialogTitle>
            <DialogDescription>
              {SLOT_LABELS[slot]} of day {dayNumber}
            </DialogDescription>
          </DialogHeader>

          <TextField
            label="What are you doing?"
            placeholder="Get coffee at Blue Bottle"
            value={title}
            error={errors.title}
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
          />

          <div>
            <CategoryPicker
              label="Category"
              value={category}
              onValueChange={(next) => {
                setCategory(next);
                setErrors((e) => ({ ...e, category: undefined }));
              }}
            />
            {errors.category ? (
              <p
                role="alert"
                className="tv-text-body-sm"
                style={{
                  color: 'var(--color-status-danger-fg)',
                  marginBlockStart: 'var(--space-1)',
                }}
              >
                {errors.category}
              </p>
            ) : null}
          </div>

          <TextAreaField
            label="Note"
            optional
            placeholder="Address, booking reference, who's coming…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add activity' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
ActivityDialog.displayName = 'ActivityDialog';