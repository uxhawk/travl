import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './text-field.css';

/**
 * TextField
 *
 * @figma component TextField
 * @figma prop state    = default | focus | error | disabled
 * @figma prop optional = true | false
 *
 * Accessibility: the label is always rendered — never a placeholder standing
 * in for one. Hint and error text are wired to the input through
 * aria-describedby, and `error` also sets aria-invalid. When both a hint and
 * an error are present the error wins, so screen reader users are not read a
 * stale hint after a failed submit.
 *
 * Governance: fields are required by default. Optional fields are marked in
 * the label, because marking the rare case is less noise than marking the
 * common one.
 */
type FieldShellProps = {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
  hintId: string;
  errorId: string;
};

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
  hintId,
  errorId,
}: FieldShellProps) {
  return (
    <div className={cn('tv-field', className)}>
      <label htmlFor={id} className="tv-field__label tv-text-label-md">
        {label}
        {optional ? (
          <span className="tv-field__optional"> (optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <span id={errorId} role="alert" className="tv-field__error tv-text-body-sm">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="tv-field__hint tv-text-body-sm">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  /** Class for the wrapper; `className` targets the input itself. */
  containerClassName?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({
  label,
  hint,
  error,
  optional,
  className,
  containerClassName,
  id,
  ref,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      className={containerClassName}
      hintId={hintId}
      errorId={errorId}
    >
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn('tv-input tv-text-body-md', className)}
        {...props}
      />
    </FieldShell>
  );
}
TextField.displayName = 'TextField';

export type TextAreaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id'
> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  containerClassName?: string;
  id?: string;
  ref?: Ref<HTMLTextAreaElement>;
};

/**
 * TextAreaField
 *
 * @figma component TextField
 * @figma prop multiline = true
 */
export function TextAreaField({
  label,
  hint,
  error,
  optional,
  className,
  containerClassName,
  id,
  ref,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      className={containerClassName}
      hintId={hintId}
      errorId={errorId}
    >
      <textarea
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn('tv-input tv-input--textarea tv-text-body-md', className)}
        {...props}
      />
    </FieldShell>
  );
}
TextAreaField.displayName = 'TextAreaField';