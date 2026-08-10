// Base layer first: it declares the cascade layer order that every
// component stylesheet below relies on.
import './styles/base.css';

export { Button, type ButtonProps } from './primitives/Button';
export {
  Chip,
  CategoryChipButton,
  CATEGORIES,
  CATEGORY_LABELS,
  type ChipProps,
  type CategoryChipButtonProps,
  type Category,
} from './primitives/Chip';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  type CardProps,
} from './primitives/Card';
export {
  TextField,
  TextAreaField,
  type TextFieldProps,
  type TextAreaFieldProps,
} from './primitives/TextField';
export { Stepper, type StepperProps } from './primitives/Stepper';
export { CategoryPicker, type CategoryPickerProps } from './primitives/CategoryPicker';
export { EmptyState, type EmptyStateProps } from './primitives/EmptyState';
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ConfirmDialog,
  type ConfirmDialogProps,
} from './primitives/Dialog';

export { ActivityCard, type ActivityCardProps } from './patterns/ActivityCard';
export { ActivityDialog, type ActivityDialogProps } from './patterns/ActivityDialog';
export { TimeSlot, type TimeSlotProps } from './patterns/TimeSlot';
export { DaySchedule, type DayScheduleProps } from './patterns/DaySchedule';

export {
  SLOTS,
  SLOT_LABELS,
  emptyDay,
  type SlotId,
  type Activity,
  type Day,
  type Trip,
} from './types';

export { cn } from './lib/cn';