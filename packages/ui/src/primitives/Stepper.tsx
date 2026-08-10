import { useId } from 'react';
import type { ReactNode, Ref } from 'react';
import { cn } from '../lib/cn';
import './stepper.css';

/**
 * Stepper — bounded numeric input (trip length, guest count, quantity).
 *
 * @figma component Stepper
 * @figma prop size     = md
 * @figma prop disabled = true | false
 *
 * Accessibility: the value is a real <input type="number">, so it stays
 * typeable and announces as a spinbutton. The -/+ buttons carry aria-labels
 * derived from `label`, because "minus" alone tells a screen reader user
 * nothing about what is being decremented.
 *
 * Governance: clamping happens here, not at the call site. `min`/`max` are
 * enforced on every path — buttons, typing, and blur — so the component can
 * never hand its owner an out-of-range value.
 */
export type StepperProps = {
  label: ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Accessible name used for the -/+ buttons. Defaults to `label` when it is a string. */
  unitLabel?: string;
  ref?: Ref<HTMLInputElement>;
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function Stepper({
  label,
  value,
  onValueChange,
  min = 1,
  max = 99,
  step = 1,
  hint,
  disabled = false,
  id,
  className,
  unitLabel,
  ref,
}: StepperProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const name = unitLabel ?? (typeof label === 'string' ? label : 'value');

  const setValue = (next: number) => {
    if (Number.isNaN(next)) return;
    onValueChange(clamp(next, min, max));
  };

  return (
    <div className={cn('tv-stepper', className)}>
      <label htmlFor={fieldId} className="tv-stepper__label tv-text-label-md">
        {label}
      </label>
      <div className="tv-stepper__control">
        <button
          type="button"
          className="tv-stepper__button"
          onClick={() => setValue(value - step)}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${name}`}
        >
          <MinusIcon />
        </button>
        <input
          ref={ref}
          id={fieldId}
          type="number"
          inputMode="numeric"
          className="tv-stepper__value tv-text-data-md"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => {
            // Allow a transiently empty field while typing; commit on blur.
            const raw = event.target.value;
            if (raw === '') return;
            setValue(Number.parseInt(raw, 10));
          }}
          onBlur={(event) => {
            const raw = event.target.value;
            setValue(raw === '' ? min : Number.parseInt(raw, 10));
          }}
        />
        <button
          type="button"
          className="tv-stepper__button"
          onClick={() => setValue(value + step)}
          disabled={disabled || value >= max}
          aria-label={`Increase ${name}`}
        >
          <PlusIcon />
        </button>
      </div>
      {hint ? (
        <span id={hintId} className="tv-stepper__hint tv-text-body-sm">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
Stepper.displayName = 'Stepper';

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3.5v9M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}