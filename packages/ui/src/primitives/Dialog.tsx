import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../lib/cn';
import { Button } from './Button';
import './dialog.css';

/**
 * Dialog — modal surface built on Radix Dialog (focus trap, scroll lock,
 * Escape handling, and aria-modal wiring come from the primitive).
 *
 * @figma component Dialog
 * @figma prop size = md | lg
 *
 * Accessibility: DialogTitle is REQUIRED by Radix — a dialog without an
 * accessible name is a review failure, so the type makes it non-optional in
 * ConfirmDialog and Radix warns for the composed form.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogPrimitive.Overlay className="tv-dialog__overlay" />
      <DialogPrimitive.Content
        className={cn('tv-dialog__content', className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label="Close"
              className="tv-dialog__close"
            >
              <CloseIcon />
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
DialogContent.displayName = 'DialogContent';

export function DialogHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tv-dialog__header', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('tv-dialog__title tv-text-display-sm', className)}
      {...props}
    />
  );
}
DialogTitle.displayName = 'DialogTitle';

export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('tv-dialog__description tv-text-body-md', className)}
      {...props}
    />
  );
}
DialogDescription.displayName = 'DialogDescription';

export function DialogFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tv-dialog__footer', className)} {...props} />;
}
DialogFooter.displayName = 'DialogFooter';

/**
 * ConfirmDialog — the governed pairing for destructive actions.
 *
 * Button documents that it styles but never confirms a destructive action;
 * this is the component that discharges that obligation. The confirm button
 * is `destructive` and the cancel is `secondary`, with cancel first in the
 * DOM so the safe path is the first thing keyboard users reach.
 *
 * @figma component ConfirmDialog
 * @figma prop tone = destructive | neutral
 */
export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'destructive' | 'neutral';
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'destructive',
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="tv-dialog__content--confirm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{cancelLabel}</Button>
          </DialogClose>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'primary'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
ConfirmDialog.displayName = 'ConfirmDialog';

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}