import type { ButtonHTMLAttributes, Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import './button.css';

/**
 * Button
 *
 * Figma contract — names are 1:1 with code so the mapping is derivable
 * without a hand-written Code Connect file:
 *
 * @figma component Button
 * @figma prop variant  = primary | secondary | ghost | accent | destructive
 * @figma prop size     = sm | md | lg
 * @figma prop iconOnly = true | false
 * @figma prop fullWidth = true | false
 * @figma prop disabled = true | false
 *
 * Governance: `variant="destructive"` styles an irreversible action but does
 * NOT confirm it. Confirmation is the caller's responsibility — the system
 * refuses to guess which destructive actions deserve a dialog. Pair it with
 * `ConfirmDialog` for anything that destroys user data.
 *
 * Accessibility: `iconOnly` requires `aria-label` at the type level.
 */
const button = cva('tv-button', {
  variants: {
    variant: {
      primary: 'tv-button--primary',
      secondary: 'tv-button--secondary',
      ghost: 'tv-button--ghost',
      accent: 'tv-button--accent',
      destructive: 'tv-button--destructive',
    },
    size: {
      sm: 'tv-button--sm tv-text-label-sm',
      md: 'tv-button--md tv-text-label-md',
      lg: 'tv-button--lg tv-text-label-lg',
    },
    fullWidth: {
      true: 'tv-button--full-width',
      false: '',
    },
    iconOnly: {
      true: 'tv-button--icon-only',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    iconOnly: false,
  },
});

type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> &
  Omit<VariantProps<typeof button>, 'iconOnly'> & {
    /** Render the child element instead of a <button>, keeping Button's styling. */
    asChild?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

/** An icon-only button has no text node, so the label must come from ARIA. */
type IconOnly = { iconOnly: true; 'aria-label': string };
type WithLabel = { iconOnly?: false };

export type ButtonProps = ButtonBaseProps & (IconOnly | WithLabel);

export function Button({
  className,
  variant,
  size,
  fullWidth,
  iconOnly,
  asChild = false,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      className={cn(button({ variant, size, fullWidth, iconOnly }), className)}
      {...props}
    />
  );
}

Button.displayName = 'Button';